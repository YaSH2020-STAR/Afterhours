"use server";

import { auth } from "@/auth";
import { combineLocalDateTime } from "@/lib/meetup-datetime";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createGroupSchema = z.object({
  title: z.string().min(2).max(80),
  category: z.string().min(1).max(40),
  city: z.string().min(2).max(120),
  date: z.string(),
  time: z.string(),
  endTime: z.string().optional(),
  locationLabel: z.string().min(2).max(120),
  address: z.string().max(200).optional(),
  neighborhood: z.string().max(80).optional(),
  vibe: z.string().min(1).max(40),
  intensity: z.enum(["low-key", "casual", "social", "active", "high-energy"]),
  minPeople: z.coerce.number().int().min(2).max(20),
  maxPeople: z.coerce.number().int().min(2).max(30),
  description: z.string().max(500).optional(),
  isPublic: z.boolean(),
  chatEnabled: z.boolean(),
});

function resolveStartAndEnd(
  dateStr: string,
  timeStr: string,
  endTimeStr: string | undefined,
): { startsAt: Date; endsAt: Date | null } | null {
  const startsAt = combineLocalDateTime(dateStr, timeStr);
  if (!startsAt) return null;
  const et = endTimeStr?.trim();
  if (!et) return { startsAt, endsAt: null };
  const endsAt = combineLocalDateTime(dateStr, et);
  if (!endsAt || endsAt <= startsAt) return { startsAt, endsAt: null };
  return { startsAt, endsAt };
}

export async function reserveVenueSeat(venueId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false as const, error: "Sign in required." };

  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.venueRSVP.findUnique({
        where: { userId_venueId: { userId, venueId } },
      });
      if (existing?.status === "CHECKED_IN") return;
      if (existing?.status === "RESERVED" || existing?.status === "HEADING") return;

      const venue = await tx.openTableVenue.findUnique({ where: { id: venueId } });
      if (!venue) throw new Error("Venue not found.");
      const used = venue.reservedCount + venue.checkedInCount;
      if (used >= venue.seatTotal) throw new Error("No seats left.");

      await tx.venueRSVP.create({
        data: { userId, venueId, status: "RESERVED" },
      });
      await tx.openTableVenue.update({
        where: { id: venueId },
        data: { reservedCount: { increment: 1 } },
      });
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not reserve.";
    return { ok: false as const, error: msg };
  }

  revalidatePath("/dashboard");
  revalidatePath("/open-tables");
  return { ok: true as const };
}

export async function setVenueHeading(venueId: string) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Sign in required." };

  const existing = await prisma.venueRSVP.findUnique({
    where: { userId_venueId: { userId: session.user.id, venueId } },
  });
  if (!existing || existing.status !== "RESERVED") {
    return { ok: false as const, error: "Reserve a seat first." };
  }

  await prisma.venueRSVP.update({
    where: { id: existing.id },
    data: { status: "HEADING" },
  });

  revalidatePath("/dashboard");
  revalidatePath("/open-tables");
  return { ok: true as const };
}

export async function checkInVenue(venueId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false as const, error: "Sign in required." };

  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.venueRSVP.findUnique({
        where: { userId_venueId: { userId, venueId } },
      });

      if (existing?.status === "CHECKED_IN") return;

      const venue = await tx.openTableVenue.findUnique({ where: { id: venueId } });
      if (!venue) throw new Error("Venue not found.");

      if (existing && (existing.status === "RESERVED" || existing.status === "HEADING")) {
        await tx.venueRSVP.update({
          where: { id: existing.id },
          data: { status: "CHECKED_IN" },
        });
        await tx.openTableVenue.update({
          where: { id: venueId },
          data: {
            reservedCount: { decrement: 1 },
            checkedInCount: { increment: 1 },
          },
        });
        return;
      }

      const used = venue.reservedCount + venue.checkedInCount;
      if (used >= venue.seatTotal) throw new Error("At capacity.");

      await tx.venueRSVP.create({
        data: { userId, venueId, status: "CHECKED_IN" },
      });
      await tx.openTableVenue.update({
        where: { id: venueId },
        data: { checkedInCount: { increment: 1 } },
      });
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Check-in failed.";
    return { ok: false as const, error: msg };
  }

  revalidatePath("/dashboard");
  revalidatePath("/open-tables");
  return { ok: true as const };
}

export async function joinInterestGroup(groupId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false as const, error: "Sign in required." };

  try {
    await prisma.$transaction(async (tx) => {
      const g = await tx.interestGroup.findUnique({ where: { id: groupId } });
      if (!g) throw new Error("Group not found.");
      if (g.groupStatus === "cancelled" || g.groupStatus === "completed") {
        throw new Error("This plan is no longer available.");
      }
      if (g.startsAt < new Date()) {
        throw new Error("This plan has already started.");
      }

      const existing = await tx.groupJoin.findUnique({
        where: { userId_groupId: { userId, groupId } },
      });
      if (existing?.status === "JOINED" || existing?.status === "CHECKED_IN" || existing?.status === "HEADING") {
        return;
      }
      if (existing?.status === "WAITLIST") return;

      if (existing?.status === "INTERESTED") {
        if (g.joinedCount < g.maxPeople) {
          await tx.groupJoin.update({
            where: { id: existing.id },
            data: { status: "JOINED" },
          });
          const nextJoined = g.joinedCount + 1;
          await tx.interestGroup.update({
            where: { id: groupId },
            data: {
              joinedCount: { increment: 1 },
              groupStatus: nextJoined >= g.maxPeople ? "full" : "open",
            },
          });
        } else {
          await tx.groupJoin.update({
            where: { id: existing.id },
            data: { status: "WAITLIST" },
          });
          await tx.interestGroup.update({
            where: { id: groupId },
            data: { waitlistCount: { increment: 1 } },
          });
        }
        return;
      }

      if (g.joinedCount < g.maxPeople) {
        await tx.groupJoin.create({
          data: { userId, groupId, status: "JOINED" },
        });
        const nextJoined = g.joinedCount + 1;
        await tx.interestGroup.update({
          where: { id: groupId },
          data: {
            joinedCount: { increment: 1 },
            groupStatus: nextJoined >= g.maxPeople ? "full" : "open",
          },
        });
      } else {
        await tx.groupJoin.create({
          data: { userId, groupId, status: "WAITLIST" },
        });
        await tx.interestGroup.update({
          where: { id: groupId },
          data: { waitlistCount: { increment: 1 } },
        });
      }
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not join.";
    return { ok: false as const, error: msg };
  }

  revalidatePath("/dashboard");
  revalidatePath("/groups");
  revalidatePath("/plans");
  revalidatePath(`/group/${groupId}`);
  return { ok: true as const };
}

export async function setGroupInterested(groupId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false as const, error: "Sign in required." };

  try {
    await prisma.$transaction(async (tx) => {
      const g = await tx.interestGroup.findUnique({ where: { id: groupId } });
      if (!g) throw new Error("Group not found.");
      if (g.groupStatus === "cancelled" || g.groupStatus === "completed") {
        throw new Error("This plan is no longer available.");
      }
      if (g.startsAt < new Date()) {
        throw new Error("This plan has already started.");
      }

      const existing = await tx.groupJoin.findUnique({
        where: { userId_groupId: { userId, groupId } },
      });
      if (existing) return;

      await tx.groupJoin.create({
        data: { userId, groupId, status: "INTERESTED" },
      });
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not save.";
    return { ok: false as const, error: msg };
  }

  revalidatePath("/dashboard");
  revalidatePath("/groups");
  revalidatePath("/plans");
  revalidatePath(`/group/${groupId}`);
  return { ok: true as const };
}

export async function leaveInterestGroup(groupId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false as const, error: "Sign in required." };

  try {
    await prisma.$transaction(async (tx) => {
      const join = await tx.groupJoin.findUnique({
        where: { userId_groupId: { userId, groupId } },
      });
      if (!join) return;

      const g = await tx.interestGroup.findUnique({ where: { id: groupId } });
      if (!g) throw new Error("Group not found.");

      if (g.creatorUserId === userId) {
        throw new Error("Hosts can cancel the plan instead of leaving.");
      }

      if (join.status === "WAITLIST") {
        await tx.groupJoin.delete({ where: { id: join.id } });
        await tx.interestGroup.update({
          where: { id: groupId },
          data: { waitlistCount: { decrement: 1 } },
        });
        return;
      }

      if (join.status === "INTERESTED") {
        await tx.groupJoin.delete({ where: { id: join.id } });
        return;
      }

      if (join.status === "JOINED" || join.status === "HEADING" || join.status === "CHECKED_IN") {
        await tx.groupJoin.delete({ where: { id: join.id } });
        let joinedCount = Math.max(0, g.joinedCount - 1);
        let waitlistCount = g.waitlistCount;

        if (joinedCount < g.maxPeople && waitlistCount > 0) {
          const nextWl = await tx.groupJoin.findFirst({
            where: { groupId, status: "WAITLIST" },
            orderBy: { joinedAt: "asc" },
          });
          if (nextWl) {
            await tx.groupJoin.update({
              where: { id: nextWl.id },
              data: { status: "JOINED" },
            });
            joinedCount += 1;
            waitlistCount -= 1;
          }
        }

        const groupStatus =
          g.groupStatus === "cancelled" || g.groupStatus === "completed"
            ? g.groupStatus
            : joinedCount >= g.maxPeople
              ? "full"
              : "open";

        await tx.interestGroup.update({
          where: { id: groupId },
          data: { joinedCount, waitlistCount, groupStatus },
        });
      }
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not leave.";
    return { ok: false as const, error: msg };
  }

  revalidatePath("/dashboard");
  revalidatePath("/groups");
  revalidatePath("/plans");
  revalidatePath(`/group/${groupId}`);
  return { ok: true as const };
}

export async function cancelInterestGroup(groupId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false as const, error: "Sign in required." };

  const g = await prisma.interestGroup.findUnique({ where: { id: groupId } });
  if (!g || g.creatorUserId !== userId) {
    return { ok: false as const, error: "Only the host can cancel this plan." };
  }

  await prisma.interestGroup.update({
    where: { id: groupId },
    data: { groupStatus: "cancelled" },
  });

  revalidatePath("/dashboard");
  revalidatePath("/groups");
  revalidatePath("/plans");
  revalidatePath(`/group/${groupId}`);
  return { ok: true as const };
}

/** Hard-delete a meetup only when no other user has a join row (interest, waitlist, or going). */
export async function deleteInterestGroup(groupId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false as const, error: "Sign in required." };

  const g = await prisma.interestGroup.findUnique({ where: { id: groupId } });
  if (!g || g.creatorUserId !== userId) {
    return { ok: false as const, error: "Only the host can delete this plan." };
  }

  const otherJoins = await prisma.groupJoin.count({
    where: { groupId, userId: { not: userId } },
  });
  if (otherJoins > 0) {
    return {
      ok: false as const,
      error: "You can delete only when no one else has joined or shown interest—cancel the plan instead.",
    };
  }

  await prisma.interestGroup.delete({ where: { id: groupId } });

  revalidatePath("/dashboard");
  revalidatePath("/groups");
  revalidatePath("/plans");
  revalidatePath(`/group/${groupId}`);
  return { ok: true as const };
}

const updateGroupSchema = z.object({
  groupId: z.string().min(1),
  title: z.string().min(2).max(80).optional(),
  category: z.string().min(1).max(40).optional(),
  description: z.string().max(500).optional().nullable(),
  date: z.string().optional(),
  time: z.string().optional(),
  endTime: z.string().optional(),
  locationLabel: z.string().min(2).max(120).optional(),
  address: z.string().max(200).optional().nullable(),
  neighborhood: z.string().max(80).optional().nullable(),
  minPeople: z.coerce.number().int().min(2).max(20).optional(),
  maxPeople: z.coerce.number().int().min(2).max(30).optional(),
  vibe: z.string().min(1).max(40).optional(),
  intensity: z.enum(["low-key", "casual", "social", "active", "high-energy"]).optional(),
  isPublic: z.boolean().optional(),
  chatEnabled: z.boolean().optional(),
});

export async function updateInterestGroup(raw: z.infer<typeof updateGroupSchema>) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false as const, error: "Sign in required." };

  const parsed = updateGroupSchema.safeParse(raw);
  if (!parsed.success) return { ok: false as const, error: "Check the form and try again." };

  const { groupId, ...rest } = parsed.data;
  const g = await prisma.interestGroup.findUnique({ where: { id: groupId } });
  if (!g || g.creatorUserId !== userId) {
    return { ok: false as const, error: "Only the host can edit this plan." };
  }
  if (g.groupStatus === "cancelled" || g.groupStatus === "completed") {
    return { ok: false as const, error: "This plan can't be edited." };
  }

  let startsAt = g.startsAt;
  let endsAt: Date | null = g.endsAt;
  if (rest.date && rest.time) {
    const resolved = resolveStartAndEnd(rest.date, rest.time, rest.endTime);
    if (!resolved) return { ok: false as const, error: "Invalid date or time." };
    startsAt = resolved.startsAt;
    endsAt = resolved.endsAt;
  }

  const minP = rest.minPeople ?? g.minPeople;
  const maxP = rest.maxPeople ?? g.maxPeople;
  if (minP > maxP) return { ok: false as const, error: "Min can't exceed max." };

  const chatOn = rest.chatEnabled !== undefined ? rest.chatEnabled : g.chatEnabled;
  const chatExpiresAt = chatOn ? new Date(startsAt.getTime() + 4 * 60 * 60 * 1000) : null;

  await prisma.interestGroup.update({
    where: { id: groupId },
    data: {
      title: rest.title ?? g.title,
      category: rest.category ?? g.category,
      description: rest.description !== undefined ? rest.description : g.description,
      locationLabel: rest.locationLabel ?? g.locationLabel,
      address: rest.address !== undefined ? rest.address : g.address,
      neighborhood: rest.neighborhood !== undefined ? rest.neighborhood : g.neighborhood,
      startsAt,
      endsAt,
      minPeople: minP,
      maxPeople: maxP,
      vibe: rest.vibe ?? g.vibe,
      intensity: rest.intensity ?? g.intensity,
      isPublic: rest.isPublic !== undefined ? rest.isPublic : g.isPublic,
      chatEnabled: chatOn,
      chatExpiresAt,
      groupStatus: g.joinedCount >= maxP ? "full" : "open",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/groups");
  revalidatePath("/plans");
  revalidatePath(`/group/${groupId}`);
  return { ok: true as const };
}

export async function leaveVenueReservation(venueId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false as const, error: "Sign in required." };

  try {
    await prisma.$transaction(async (tx) => {
      const rsvp = await tx.venueRSVP.findUnique({
        where: { userId_venueId: { userId, venueId } },
      });
      if (!rsvp) return;

      if (rsvp.status === "CHECKED_IN") {
        await tx.venueRSVP.delete({ where: { id: rsvp.id } });
        await tx.openTableVenue.update({
          where: { id: venueId },
          data: { checkedInCount: { decrement: 1 } },
        });
      } else if (rsvp.status === "RESERVED" || rsvp.status === "HEADING") {
        await tx.venueRSVP.delete({ where: { id: rsvp.id } });
        await tx.openTableVenue.update({
          where: { id: venueId },
          data: { reservedCount: { decrement: 1 } },
        });
      }
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not update reservation.";
    return { ok: false as const, error: msg };
  }

  revalidatePath("/dashboard");
  revalidatePath("/open-tables");
  return { ok: true as const };
}

export async function setGroupHeading(groupId: string) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Sign in required." };

  const existing = await prisma.groupJoin.findUnique({
    where: { userId_groupId: { userId: session.user.id, groupId } },
  });
  if (!existing || existing.status === "WAITLIST" || existing.status === "INTERESTED") {
    return { ok: false as const, error: "Join the group first." };
  }
  if (existing.status === "CHECKED_IN") return { ok: true as const };

  await prisma.groupJoin.update({
    where: { id: existing.id },
    data: { status: "HEADING" },
  });

  revalidatePath("/dashboard");
  revalidatePath("/groups");
  revalidatePath(`/group/${groupId}`);
  return { ok: true as const };
}

export async function checkInGroup(groupId: string) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Sign in required." };

  const existing = await prisma.groupJoin.findUnique({
    where: { userId_groupId: { userId: session.user.id, groupId } },
  });
  if (!existing || existing.status === "WAITLIST" || existing.status === "INTERESTED") {
    return { ok: false as const, error: "Join the group first." };
  }
  if (existing.status === "CHECKED_IN") return { ok: true as const };

  await prisma.groupJoin.update({
    where: { id: existing.id },
    data: { status: "CHECKED_IN" },
  });

  revalidatePath("/dashboard");
  revalidatePath("/groups");
  revalidatePath(`/group/${groupId}`);
  return { ok: true as const };
}

export async function sendDiscoveryGroupMessage(groupId: string, body: string) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Sign in required." };

  const trimmed = body.trim();
  if (!trimmed || trimmed.length > 2000) return { ok: false as const, error: "Invalid message." };

  const group = await prisma.interestGroup.findUnique({ where: { id: groupId } });
  if (!group) return { ok: false as const, error: "Group not found." };
  if (group.groupStatus === "cancelled" || group.groupStatus === "completed") {
    return { ok: false as const, error: "This plan is closed." };
  }
  if (!group.chatEnabled) return { ok: false as const, error: "Chat is off for this group." };

  const join = await prisma.groupJoin.findUnique({
    where: { userId_groupId: { userId: session.user.id, groupId } },
  });
  if (!join || join.status === "WAITLIST") {
    return { ok: false as const, error: "Join the group to chat." };
  }

  const now = new Date();
  if (group.chatExpiresAt && group.chatExpiresAt <= now) {
    return { ok: false as const, error: "This chat has ended." };
  }

  await prisma.discoveryGroupMessage.create({
    data: {
      groupId,
      senderId: session.user.id,
      body: trimmed,
    },
  });

  revalidatePath(`/group/${groupId}`);
  return { ok: true as const };
}

export async function createInterestGroup(raw: z.infer<typeof createGroupSchema>) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Sign in required." };

  const parsed = createGroupSchema.safeParse(raw);
  if (!parsed.success) return { ok: false as const, error: "Check the form and try again." };

  const { minPeople, maxPeople, date, time, endTime, chatEnabled, ...rest } = parsed.data;
  if (minPeople > maxPeople) return { ok: false as const, error: "Min can't exceed max." };

  const resolved = resolveStartAndEnd(date, time, endTime);
  if (!resolved) return { ok: false as const, error: "Invalid date or time." };
  const { startsAt, endsAt } = resolved;

  const chatExpiresAt = chatEnabled ? new Date(startsAt.getTime() + 4 * 60 * 60 * 1000) : null;

  const group = await prisma.interestGroup.create({
    data: {
      title: rest.title,
      category: rest.category,
      city: rest.city.trim(),
      neighborhood: rest.neighborhood || null,
      address: rest.address?.trim() || null,
      locationLabel: rest.locationLabel,
      startsAt,
      endsAt,
      minPeople,
      maxPeople,
      joinedCount: 1,
      waitlistCount: 0,
      vibe: rest.vibe,
      intensity: rest.intensity,
      description: rest.description || null,
      isPublic: rest.isPublic,
      chatEnabled,
      chatExpiresAt,
      creatorUserId: session.user.id,
    },
  });

  await prisma.groupJoin.create({
    data: {
      userId: session.user.id,
      groupId: group.id,
      status: "JOINED",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/groups");
  revalidatePath("/create");
  revalidatePath("/plans");

  return { ok: true as const, groupId: group.id };
}
