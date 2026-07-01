import {
  readTextFile, writeTextFile, exists, mkdir, readDir, remove,
  BaseDirectory,
} from "@tauri-apps/plugin-fs";
import { appDataDir, join } from "@tauri-apps/api/path";
import type { SiteProject, Page, ContentItem, ProductInfo, Inquiry, DeployConfig, DeployHistory } from "../shared/types";

const BASE = { baseDir: BaseDirectory.AppData };

// ===== 路径工具 =====
// mkdir 没有 baseDir 选项，需要用绝对路径

async function getAbsoluteDir(relativePath: string): Promise<string> {
  const dataDir = await appDataDir();
  return join(dataDir, relativePath);
}

async function ensureDir(relativePath: string): Promise<void> {
  console.log("[Storage] ensureDir:", relativePath);
  if (!(await exists(relativePath, BASE))) {
    const absPath = await getAbsoluteDir(relativePath);
    console.log("[Storage] Creating dir:", absPath);
    await mkdir(absPath, { recursive: true });
    console.log("[Storage] Dir created:", relativePath);
  } else {
    console.log("[Storage] Dir exists:", relativePath);
  }
}

async function ensureProjectDir(projectId: string): Promise<void> {
  await ensureDir("projects");
  await ensureDir(`projects/${projectId}`);
}

// ===== JSON 读写工具 =====

async function readJson<T>(relativePath: string, fallback: T): Promise<T> {
  try {
    if (!(await exists(relativePath, BASE))) return fallback;
    const content = await readTextFile(relativePath, BASE);
    return JSON.parse(content) as T;
  } catch (err) {
    console.warn(`Failed to read ${relativePath}:`, err);
    return fallback;
  }
}

async function writeJson(relativePath: string, data: unknown): Promise<void> {
  const content = JSON.stringify(data, null, 2);
  console.log("[Storage] writeJson:", relativePath, `(${content.length} bytes)`);
  await writeTextFile(relativePath, content, BASE);
  console.log("[Storage] writeJson done:", relativePath);
}

// ===== 站点项目操作 =====

export async function loadAllProjects(): Promise<SiteProject[]> {
  await ensureDir("projects");
  try {
    const entries = await readDir("projects", BASE);
    const projects: SiteProject[] = [];

    for (const entry of entries) {
      if (entry.isDirectory) {
        const project = await readJson<SiteProject | null>(`projects/${entry.name}/project.json`, null);
        if (project) projects.push(project);
      }
    }

    return projects.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch (err) {
    console.error("Failed to load projects:", err);
    return [];
  }
}

export async function loadProject(projectId: string): Promise<SiteProject | null> {
  await ensureProjectDir(projectId);
  return readJson<SiteProject | null>(`projects/${projectId}/project.json`, null);
}

export async function saveProject(project: SiteProject): Promise<void> {
  console.log("[Storage] saveProject:", project.id, project.name);
  await ensureProjectDir(project.id);
  await writeJson(`projects/${project.id}/project.json`, project);
  console.log("[Storage] saveProject done");
}

export async function deleteProject(projectId: string): Promise<void> {
  const relPath = `projects/${projectId}`;
  if (await exists(relPath, BASE)) {
    await remove(relPath, { ...BASE, recursive: true });
  }
}

// ===== 页面操作 =====

export async function savePage(projectId: string, page: Page): Promise<void> {
  await ensureDir(`projects/${projectId}/pages`);
  await writeJson(`projects/${projectId}/pages/${page.id}.json`, page);
}

export async function deletePage(projectId: string, pageId: string): Promise<void> {
  const path = `projects/${projectId}/pages/${pageId}.json`;
  if (await exists(path, BASE)) {
    await remove(path, BASE);
  }
}

export async function loadAllPages(projectId: string): Promise<Page[]> {
  const pagesDir = `projects/${projectId}/pages`;
  if (!(await exists(pagesDir, BASE))) return [];

  try {
    const entries = await readDir(pagesDir, BASE);
    const pages: Page[] = [];

    for (const entry of entries) {
      if (entry.name?.endsWith(".json")) {
        const page = await readJson<Page | null>(`${pagesDir}/${entry.name}`, null);
        if (page) pages.push(page);
      }
    }

    return pages.sort((a, b) => a.slug.localeCompare(b.slug));
  } catch {
    return [];
  }
}

// ===== 内容操作 =====

export async function loadContents(projectId: string): Promise<ContentItem[]> {
  return readJson<ContentItem[]>(`projects/${projectId}/contents.json`, []);
}

export async function saveContents(projectId: string, contents: ContentItem[]): Promise<void> {
  await ensureProjectDir(projectId);
  await writeJson(`projects/${projectId}/contents.json`, contents);
}

// ===== 产品操作 =====

export async function loadProducts(projectId: string): Promise<ProductInfo[]> {
  return readJson<ProductInfo[]>(`projects/${projectId}/products.json`, []);
}

export async function saveProducts(projectId: string, products: ProductInfo[]): Promise<void> {
  await ensureProjectDir(projectId);
  await writeJson(`projects/${projectId}/products.json`, products);
}

// ===== 询盘操作 =====

export async function loadInquiries(projectId: string): Promise<Inquiry[]> {
  return readJson<Inquiry[]>(`projects/${projectId}/inquiries.json`, []);
}

export async function saveInquiries(projectId: string, inquiries: Inquiry[]): Promise<void> {
  await ensureProjectDir(projectId);
  await writeJson(`projects/${projectId}/inquiries.json`, inquiries);
}

// ===== 部署配置操作 =====

export async function loadDeployConfig(projectId: string): Promise<DeployConfig | null> {
  return readJson<DeployConfig | null>(`projects/${projectId}/deploy-config.json`, null);
}

export async function saveDeployConfig(projectId: string, config: DeployConfig): Promise<void> {
  await ensureProjectDir(projectId);
  await writeJson(`projects/${projectId}/deploy-config.json`, { ...config, token: "" });
}

export async function loadDeployHistory(projectId: string): Promise<DeployHistory[]> {
  return readJson<DeployHistory[]>(`projects/${projectId}/deploy-history.json`, []);
}

export async function saveDeployHistory(projectId: string, history: DeployHistory[]): Promise<void> {
  await ensureProjectDir(projectId);
  await writeJson(`projects/${projectId}/deploy-history.json`, history);
}

// ===== 多语言操作 =====

export async function loadTranslations(projectId: string, lang: string): Promise<Record<string, string>> {
  return readJson<Record<string, string>>(`projects/${projectId}/i18n/${lang}.json`, {});
}

export async function saveTranslations(projectId: string, lang: string, translations: Record<string, string>): Promise<void> {
  await ensureDir(`projects/${projectId}/i18n`);
  await writeJson(`projects/${projectId}/i18n/${lang}.json`, translations);
}
