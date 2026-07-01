import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ContentItem, ProductInfo } from "../types";

interface ContentStore {
  contents: ContentItem[];
  products: ProductInfo[];

  // 内容操作
  setContent: (siteId: string, key: string, value: string, type?: ContentItem["type"]) => void;
  getContent: (siteId: string, key: string) => string | undefined;
  getSiteContents: (siteId: string) => ContentItem[];
  deleteContent: (siteId: string, key: string) => void;

  // 产品操作
  addProduct: (product: Omit<ProductInfo, "id">) => ProductInfo;
  updateProduct: (id: string, data: Partial<ProductInfo>) => void;
  deleteProduct: (id: string) => void;
  getSiteProducts: (siteId: string) => ProductInfo[];
  getProduct: (id: string) => ProductInfo | undefined;
}

export const useContentStore = create<ContentStore>()(
  persist(
    (set, get) => ({
      contents: [],
      products: [],

      setContent: (siteId, key, value, type = "text") => {
        const now = new Date().toISOString();
        set((state) => {
          const existing = state.contents.find(
            (c) => c.siteId === siteId && c.key === key
          );
          if (existing) {
            return {
              contents: state.contents.map((c) =>
                c.siteId === siteId && c.key === key
                  ? { ...c, value, type, updatedAt: now }
                  : c
              ),
            };
          }
          return {
            contents: [
              ...state.contents,
              { id: crypto.randomUUID(), siteId, type, key, value, updatedAt: now },
            ],
          };
        });
      },

      getContent: (siteId, key) => {
        return get().contents.find(
          (c) => c.siteId === siteId && c.key === key
        )?.value;
      },

      getSiteContents: (siteId) => {
        return get().contents.filter((c) => c.siteId === siteId);
      },

      deleteContent: (siteId, key) => {
        set((state) => ({
          contents: state.contents.filter(
            (c) => !(c.siteId === siteId && c.key === key)
          ),
        }));
      },

      addProduct: (product) => {
        const newProduct: ProductInfo = {
          ...product,
          id: crypto.randomUUID(),
        };
        set((state) => ({ products: [...state.products, newProduct] }));
        return newProduct;
      },

      updateProduct: (id, data) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      getSiteProducts: (siteId) => {
        return get().products.filter((p) => p.siteId === siteId);
      },

      getProduct: (id) => {
        return get().products.find((p) => p.id === id);
      },
    }),
    {
      name: "astro-content-storage",
    }
  )
);
