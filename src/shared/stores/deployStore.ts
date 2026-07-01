import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DeployConfig, DeployHistory } from "../types";

interface DeployStore {
  configs: Record<string, DeployConfig>;
  history: DeployHistory[];

  setConfig: (siteId: string, config: DeployConfig) => void;
  getConfig: (siteId: string) => DeployConfig | undefined;
  addHistory: (record: DeployHistory) => void;
  getSiteHistory: (siteId: string) => DeployHistory[];
}

export const useDeployStore = create<DeployStore>()(
  persist(
    (set, get) => ({
      configs: {},
      history: [],

      setConfig: (siteId, config) => {
        set((state) => ({
          configs: { ...state.configs, [siteId]: config },
        }));
      },

      getConfig: (siteId) => {
        return get().configs[siteId];
      },

      addHistory: (record) => {
        set((state) => ({
          history: [record, ...state.history],
        }));
      },

      getSiteHistory: (siteId) => {
        return get().history.filter((h) => h.siteId === siteId);
      },
    }),
    {
      name: "astro-deploy-storage",
      // 不持久化 token，只保留项目名、平台、域名等非敏感信息
      partialize: (state) => ({
        configs: Object.fromEntries(
          Object.entries(state.configs).map(([siteId, config]) => [
            siteId,
            { ...config, token: "" },
          ])
        ),
        history: state.history,
      }),
    }
  )
);
