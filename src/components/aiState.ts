import { create } from "zustand";

type AIState = {
    open: boolean;
    hasPendingSuggestion: boolean;

    openAI: () => void;
    closeAI: () => void;
    setPending: (v: boolean) => void;

    // 👇 đã có
    openPanelAtSelection: (() => void) | null;
    setOpenPanelAtSelection: (fn: () => void) => void;

    // 👇 THÊM MỚI cho Slash
    triggerFromSlash: boolean;
    setTriggerFromSlash: () => void;
    clearTriggerFromSlash: () => void;
};

export const useAIState = create<AIState>((set, get) => ({
    open: false,
    hasPendingSuggestion: false,

    openAI: () => set({ open: true }),

    closeAI: () => {
        if (get().hasPendingSuggestion) return;
        set({ open: false });
    },

    setPending: (v) => set({ hasPendingSuggestion: v }),

    openPanelAtSelection: null,
    setOpenPanelAtSelection: (fn) => set({ openPanelAtSelection: fn }),

    // ✅ Slash trigger
    triggerFromSlash: false,
    setTriggerFromSlash: () => set({ triggerFromSlash: true }),
    clearTriggerFromSlash: () => set({ triggerFromSlash: false }),
}));
