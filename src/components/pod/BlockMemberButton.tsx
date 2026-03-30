"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { blockUser } from "@/actions/safety";

export function BlockMemberButton(props: { userId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);

  function onBlock() {
    if (!confirm("Block this member? You won’t see each other’s direct messages.")) return;
    start(async () => {
      await blockUser({ blockedUserId: props.userId });
      setDone(true);
      router.refresh();
    });
  }

  if (done) {
    return <p className="text-xs text-ah-muted">Blocked</p>;
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={onBlock}
      className="text-xs text-ah-muted underline-offset-2 hover:underline disabled:opacity-50"
    >
      Block
    </button>
  );
}
