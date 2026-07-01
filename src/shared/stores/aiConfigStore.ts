import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AIConfig } from "../utils/helpers";

interface AIConfigStore {
  config: AIConfig | null;
  setConfig: (config: AIConfig) => void;
  clearConfig: () => void;
  isConfigured: () => boolean;
}

export const useAIConfigStore = create<AIConfigStore>()(
  persist(
    (set, get) => ({
      config: null,

      setConfig: (config) => set({ config }),
      clearConfig: () => set({ config: null }),
      isConfigured: () => !!get().config?.apiKey,
    }),
    {
      name: "astro-ai-config",
      // 不持久化 apiKey
      partialize: (state) => ({
        config: state.config ? { ...state.config, apiKey: "" } : null,
      }),
    }
  )
);
