import { create } from "zustand";
import type { SiteProject, CreateProjectData, Page } from "../types/index";
import * as storage from "../../services/projectStorage";
import { templates } from "../../data/templates";
import { generateProductListPage, generateProductDetailPage } from "../../services/pageGenerator";
import type { ProductInfo } from "../types/index";

interface ProjectStore {
  projects: SiteProject[];
  currentProject: SiteProject | null;
  isLoading: boolean;
  isInitialized: boolean;

  // 初始化（从文件系统加载所有项目）
  init: () => Promise<void>;

  // 项目操作
  createProject: (data: CreateProjectData) => Promise<SiteProject>;
  deleteProject: (id: string) => Promise<void>;
  updateProject: (id: string, data: Partial<SiteProject>) => Promise<void>;
  loadProject: (id: string) => Promise<SiteProject | null>;
  setCurrentProject: (project: SiteProject | null) => void;

  // 页面操作
  addPage: (projectId: string, page: Omit<Page, "id" | "createdAt" | "updatedAt">) => Promise<Page>;
  updatePage: (projectId: string, pageId: string, data: Partial<Page>) => Promise<void>;
  deletePage: (projectId: string, pageId: string) => Promise<void>;
  savePageContent: (projectId: string, pageId: string, html: string, css: string) => Promise<void>;

  // 产品页面自动生成
  regenerateProductPages: (projectId: string, products: ProductInfo[]) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>()((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  isInitialized: false,

  init: async () => {
    if (get().isInitialized) return;
    set({ isLoading: true });
    try {
      console.log("[ProjectStore] Initializing...");
      const projects = await storage.loadAllProjects();
      console.log("[ProjectStore] Loaded projects:", projects.length);
      set({ projects, isInitialized: true, isLoading: false });
    } catch (err) {
      console.error("[ProjectStore] Failed to load projects:", err);
      set({ isLoading: false, isInitialized: true });
    }
  },

  createProject: async (data) => {
    const now = new Date().toISOString();
    const template = templates.find((t: { id: string }) => t.id === data.template);
    const projectId = crypto.randomUUID();

    // 创建默认页面
    const defaultPages: Page[] = [
      {
        id: crypto.randomUUID(),
        slug: "index",
        title: "首页",
        type: "custom",
        html: template?.html || "",
        css: template?.css || "",
        isGenerated: false,
        createdAt: now,
        updatedAt: now,
      },
    ];

    const project: SiteProject = {
      id: projectId,
      name: data.name,
      description: data.description,
      template: data.template,
      status: "draft",
      pages: defaultPages,
      globalStyles: "",
      navigation: defaultPages.map((p) => ({
        label: p.title,
        pageId: p.id,
      })),
      languages: ["zh"],
      defaultLanguage: "zh",
      createdAt: now,
      updatedAt: now,
    };

    try {
      console.log("[ProjectStore] Saving project:", projectId);
      // 保存到文件系统
      await storage.saveProject(project);
      console.log("[ProjectStore] Project saved, saving pages...");
      for (const page of defaultPages) {
        await storage.savePage(projectId, page);
      }
      console.log("[ProjectStore] All saved successfully");
    } catch (err) {
      console.error("[ProjectStore] Failed to save project:", err);
      throw new Error("保存项目失败: " + (err instanceof Error ? err.message : String(err)));
    }

    set((state) => ({ projects: [project, ...state.projects] }));
    return project;
  },

  deleteProject: async (id) => {
    await storage.deleteProject(id);
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    }));
  },

  updateProject: async (id, data) => {
    const project = get().projects.find((p) => p.id === id);
    if (!project) return;

    const updated = { ...project, ...data, updatedAt: new Date().toISOString() };
    await storage.saveProject(updated);

    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? updated : p)),
      currentProject: state.currentProject?.id === id ? updated : state.currentProject,
    }));
  },

  loadProject: async (id) => {
    const project = await storage.loadProject(id);
    if (project) {
      // 也加载页面
      const pages = await storage.loadAllPages(id);
      if (pages.length > 0) {
        project.pages = pages;
      }
      set({ currentProject: project });
    }
    return project;
  },

  setCurrentProject: (project) => {
    set({ currentProject: project });
  },

  addPage: async (projectId, pageData) => {
    const now = new Date().toISOString();
    const page: Page = {
      ...pageData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    await storage.savePage(projectId, page);

    // updateProject 会同时更新 projects 和 currentProject
    const project = get().projects.find((p) => p.id === projectId);
    if (project) {
      const updatedPages = [...project.pages, page];
      const updatedNav = [...project.navigation, { label: page.title, pageId: page.id }];
      await get().updateProject(projectId, { pages: updatedPages, navigation: updatedNav });
    }

    return page;
  },

  updatePage: async (projectId, pageId, data) => {
    const project = get().projects.find((p) => p.id === projectId);
    if (!project) return;

    const page = project.pages.find((p) => p.id === pageId);
    if (!page) return;

    const updatedPage = { ...page, ...data, updatedAt: new Date().toISOString() };
    await storage.savePage(projectId, updatedPage);

    const updatedPages = project.pages.map((p) => (p.id === pageId ? updatedPage : p));
    await get().updateProject(projectId, { pages: updatedPages });
  },

  deletePage: async (projectId, pageId) => {
    await storage.deletePage(projectId, pageId);

    const project = get().projects.find((p) => p.id === projectId);
    if (!project) return;

    const updatedPages = project.pages.filter((p) => p.id !== pageId);
    const updatedNav = project.navigation.filter((n) => n.pageId !== pageId);
    await get().updateProject(projectId, { pages: updatedPages, navigation: updatedNav });
  },

  savePageContent: async (projectId, pageId, html, css) => {
    await get().updatePage(projectId, pageId, { html, css });
  },

  regenerateProductPages: async (projectId, products) => {
    const project = get().projects.find((p) => p.id === projectId);
    if (!project) return;

    // 找到或创建产品列表页
    let listPage = project.pages.find((p) => p.type === "product-list");
    const listHtml = generateProductListPage(products);
    const now = new Date().toISOString();

    if (listPage) {
      listPage = { ...listPage, html: listHtml, updatedAt: now };
      await storage.savePage(projectId, listPage);
    } else {
      listPage = {
        id: crypto.randomUUID(),
        slug: "products",
        title: "产品中心",
        type: "product-list",
        html: listHtml,
        css: "",
        isGenerated: true,
        createdAt: now,
        updatedAt: now,
      };
      await storage.savePage(projectId, listPage);
    }

    // 为每个产品生成详情页
    const detailPages: Page[] = [];
    for (const product of products) {
      const detailHtml = generateProductDetailPage(product);
      const existingPage = project.pages.find(
        (p) => p.type === "product-detail" && p.slug === `product-${product.id}`
      );

      if (existingPage) {
        const updated = { ...existingPage, html: detailHtml, updatedAt: now };
        await storage.savePage(projectId, updated);
        detailPages.push(updated);
      } else {
        const newPage: Page = {
          id: crypto.randomUUID(),
          slug: `product-${product.id}`,
          title: product.name,
          type: "product-detail",
          html: detailHtml,
          css: "",
          isGenerated: true,
          createdAt: now,
          updatedAt: now,
        };
        await storage.savePage(projectId, newPage);
        detailPages.push(newPage);
      }
    }

    // 合并页面列表
    const nonProductPages = project.pages.filter(
      (p) => p.type !== "product-list" && p.type !== "product-detail"
    );
    const allPages = [listPage, ...detailPages, ...nonProductPages];
    const navItems = allPages
      .filter((p) => !p.isGenerated || p.type === "product-list")
      .map((p) => ({ label: p.title, pageId: p.id }));

    await get().updateProject(projectId, { pages: allPages, navigation: navItems });

    const current = get().currentProject;
    if (current?.id === projectId) {
      set({ currentProject: { ...current, pages: allPages, navigation: navItems } });
    }
  },
}));
