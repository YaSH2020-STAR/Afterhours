import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { EditGroupForm } from "@/components/discover/EditGroupForm";
import { getGroupDetail } from "@/data/discovery";
import { redirectToSignIn } from "@/lib/auth-redirect";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ groupId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { groupId } = await params;
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { title: "Edit" };
  const data = await getGroupDetail(userId, groupId);
  if (!data) return { title: "Edit" };
  return { title: `Edit · ${data.group.title}` };
}

export default async function EditGroupPage({ params }: Props) {
  const { groupId } = await params;
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirectToSignIn(`/group/${groupId}/edit`);
  const data = await getGroupDetail(userId, groupId);
  if (!data) notFound();

  const { group } = data;
  if (group.creatorUserId !== userId) notFound();
  if (group.groupStatus === "cancelled" || group.groupStatus === "completed") {
    redirect(`/group/${groupId}`);
  }

  const otherJoins = await prisma.groupJoin.count({
    where: { groupId, userId: { not: userId } },
  });
  const canDelete = otherJoins === 0;

  const gUi = {
    id: group.id,
    title: group.title,
    category: group.category,
    city: group.city,
    neighborhood: group.neighborhood,
    address: group.address,
    locationLabel: group.locationLabel,
    startsAt: group.startsAt,
    endsAt: group.endsAt,
    minPeople: group.minPeople,
    maxPeople: group.maxPeople,
    joinedCount: group.joinedCount,
    waitlistCount: group.waitlistCount,
    vibe: group.vibe,
    intensity: group.intensity,
    description: group.description,
    isPublic: group.isPublic,
    chatEnabled: group.chatEnabled,
    chatExpiresAt: group.chatExpiresAt,
    spotsLeft: Math.max(0, group.maxPeople - group.joinedCount),
    userStatus: null,
    creatorUserId: group.creatorUserId,
    groupStatus: group.groupStatus,
  };

  return (
    <div className="space-y-6">
      <Link href={`/group/${groupId}`} className="text-sm font-medium text-ah-muted hover:text-ah-accent">
        ← Back to plan
      </Link>
      <EditGroupForm group={gUi} canDelete={canDelete} />
    </div>
  );
}
