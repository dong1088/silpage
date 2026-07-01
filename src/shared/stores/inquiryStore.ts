import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Inquiry } from "../types";

interface InquiryStore {
  inquiries: Inquiry[];
  addInquiry: (inquiry: Omit<Inquiry, "id" | "createdAt" | "read">) => void;
  markAsRead: (id: string) => void;
  deleteInquiry: (id: string) => void;
  getSiteInquiries: (siteId: string) => Inquiry[];
  getUnreadCount: (siteId: string) => number;
}

export const useInquiryStore = create<InquiryStore>()(
  persist(
    (set, get) => ({
      inquiries: [],

      addInquiry: (data) => {
        const inquiry: Inquiry = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          read: false,
        };
        set((state) => ({ inquiries: [inquiry, ...state.inquiries] }));
      },

      markAsRead: (id) => {
        set((state) => ({
          inquiries: state.inquiries.map((i) =>
            i.id === id ? { ...i, read: true } : i
          ),
        }));
      },

      deleteInquiry: (id) => {
        set((state) => ({
          inquiries: state.inquiries.filter((i) => i.id !== id),
        }));
      },

      getSiteInquiries: (siteId) => {
        return get().inquiries.filter((i) => i.siteId === siteId);
      },

      getUnreadCount: (siteId) => {
        return get().inquiries.filter((i) => i.siteId === siteId && !i.read).length;
      },
    }),
    { name: "astro-inquiries-storage" }
  )
);
