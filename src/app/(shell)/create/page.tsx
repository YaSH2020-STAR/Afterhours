import type { Metadata } from "next";
import { CreateGroupForm } from "@/components/discover/CreateGroupForm";

export const metadata: Metadata = {
  title: "Host",
  description: "Post a small meetup with clear limits and optional chat.",
};

export default function CreateGroupPage() {
  return <CreateGroupForm />;
}
