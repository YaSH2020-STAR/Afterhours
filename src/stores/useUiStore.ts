import { create } from "zustand";

/** Lightweight UI state — no server data here. */
type UiState = {
  chatDraftByPod: Record<string, string>;
  setChatDraft: (podId: string, value: string) => void;
};

export const useUiStore = create<UiState>((set) => ({
  chatDraftByPod: {},
  setChatDraft: (podId, value) =>
    set((s) => ({
      chatDraftByPod: { ...s.chatDraftByPod, [podId]: value },
    })),
}));
