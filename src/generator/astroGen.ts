/**
 * astroGen.ts
 * Astro 项目生成器主入口
 * 编排所有子模块，将 SiteProject 转换为完整的 Astro 项目
 */

import type {
  SiteProject,
  ContentItem,
  ProductInfo,
  GenerateResult,
  GenerateOptions,
} from "../shared/types";

import {
  generatePackageJson,
  generateAstroConfig,
  generateTsConfig,
  generateTailwindConfig,
  generateEnvDts,
} from "./configWriter";

import {
  renderPages,
  renderBaseLayout,
  type RenderedPage,
} from "./pageRenderer";

import { generateSeoFiles, generateHeadersFile, generate404Page } from "./seoInjector";
import { collectAssets } from "./assetManager";

/**
 * 整个生成流程的主入口
 *
 * @param project - 站点项目数据
 * @param outputDir - 输出目录（绝对路径）
 * @param options - 生成选项
 * @returns 生成结果
 */
export async function generateAstroProject(
  project: SiteProject,
  outputDir: string,
  options?: GenerateOptions
): Promise<GenerateResult> {
  const {
    contents = [],
    products = [],
    baseUrl,
    skipBuild = true,
  } = options || {};

  try {
    console.log("[AstroGen] Starting generation for project:", project.name);
    console.log("[AstroGen] Output directory:", outputDir);

    // 构建输出目录结构
    const dirs = createDirectoryStructure();

    // Phase 1: 生成配置文件
    await writeConfigs(project, outputDir, dirs, baseUrl);

    // Phase 2: 生成页面文件
    await writePages(project, outputDir, contents, products);

    // Phase 3: 生成布局文件
    await writeLayouts(project, outputDir);

    // Phase 4: 生成 SEO 文件
    await writeSeoFiles(project, outputDir, baseUrl);

    // Phase 5: 生成资产文件
    await writeAssetFiles(project, outputDir, contents, products);

    console.log("[AstroGen] Generation completed successfully");

    return {
      success: true,
      outputDir,
    };
  } catch (error) {
    console.error("[AstroGen] Generation failed:", error);
    return {
      success: false,
      outputDir,
      error: error instanceof Error ? error.message : "未知错误",
    };
  }
}

/**
 * 目录结构定义
 */
interface DirectoryStructure {
  /** 相对路径列表 */
  dirs: string[];
}

function createDirectoryStructure(): DirectoryStructure {
  return {
    dirs: [
      "src/pages",
      "src/pages/products",
      "src/layouts",
      "src/components",
      "public/images",
      "public/images/content",
      "public/images/products",
    ],
  };
}

/**
 * Phase 1: 写入配置文件
 */
async function writeConfigs(
  project: SiteProject,
  outputDir: string,
  dirs: DirectoryStructure,
  baseUrl?: string
): Promise<void> {
  const projectName = project.name;

  // package.json - 写入输出目录根
  await writeFile(
    `${outputDir}/package.json`,
    generatePackageJson({ projectName, baseUrl })
  );

  // astro.config.mjs
  await writeFile(
    `${outputDir}/astro.config.mjs`,
    generateAstroConfig({
      projectName,
      baseUrl,
      siteTitle: project.name,
    })
  );

  // tsconfig.json
  await writeFile(`${outputDir}/tsconfig.json`, generateTsConfig());

  // tailwind.config.mjs
  await writeFile(
    `${outputDir}/tailwind.config.mjs`,
    generateTailwindConfig()
  );

  // src/env.d.ts
  await writeFile(`${outputDir}/src/env.d.ts`, generateEnvDts());
}

/**
 * Phase 2: 写入页面文件
 */
async function writePages(
  project: SiteProject,
  outputDir: string,
  contents: ContentItem[],
  products: ProductInfo[]
): Promise<void> {
  // 将 contents 转换为 lookup map
  const contentMap: Record<string, string> = {};
  for (const c of contents) {
    contentMap[c.key] = c.value;
  }

  const pages = renderPages(project, contents, products);

  for (const page of pages) {
    const fullPath = `${outputDir}/${page.filePath}`;

    // 确保父目录存在
    const parentDir = fullPath.substring(0, fullPath.lastIndexOf("/"));
    await ensureDir(parentDir);

    await writeFile(fullPath, page.content);
  }
}

/**
 * Phase 3: 写入布局文件
 */
async function writeLayouts(
  project: SiteProject,
  outputDir: string
): Promise<void> {
  const baseLayout = renderBaseLayout(project);

  const layoutDir = `${outputDir}/src/layouts`;
  await ensureDir(layoutDir);

  await writeFile(`${outputDir}/${baseLayout.filePath}`, baseLayout.content);
}

/**
 * Phase 4: 写入 SEO 文件
 */
async function writeSeoFiles(
  project: SiteProject,
  outputDir: string,
  baseUrl?: string
): Promise<void> {
  const seo = generateSeoFiles(project, baseUrl);

  // sitemap.xml
  await writeFile(`${outputDir}/public/sitemap.xml`, seo.sitemapXml);

  // robots.txt
  await writeFile(`${outputDir}/public/robots.txt`, seo.robotsTxt);

  // favicon.svg
  await writeFile(`${outputDir}/public/favicon.svg`, seo.faviconSvg);

  // _headers
  await writeFile(`${outputDir}/public/_headers`, generateHeadersFile());

  // 404 page
  const pagesDir = `${outputDir}/src/pages`;
  await ensureDir(pagesDir);
  await writeFile(`${pagesDir}/404.astro`, generate404Page(project.name));
}

/**
 * Phase 5: 写入资产文件
 */
async function writeAssetFiles(
  project: SiteProject,
  outputDir: string,
  contents: ContentItem[],
  products: ProductInfo[]
): Promise<void> {
  const assets = collectAssets(project, contents, products);

  for (const asset of assets) {
    const targetDir = `${outputDir}/public/${asset.target.substring(
      0,
      asset.target.lastIndexOf("/")
    )}`;
    await ensureDir(targetDir);
    // TODO: 实际文件复制需要通过 Tauri fs API 完成
    // 这里留空，由调用方通过 buildService 处理
    console.log(
      `[AstroGen] Asset: ${asset.source} → public/${asset.target}`
    );
  }
}

// ========================================
// 文件系统工具（可在浏览器/Tauri 环境中使用不同实现）
// ========================================

let writeFileImpl: (path: string, content: string) => Promise<void> | void =
  defaultWriteFile;

let ensureDirImpl: (path: string) => Promise<void> | void = defaultEnsureDir;

/**
 * 设置自定义文件写入函数（用于 Tauri 环境）
 */
export function setFileWriter(
  writeFile: (path: string, content: string) => Promise<void>,
  ensureDir: (path: string) => Promise<void>
): void {
  writeFileImpl = writeFile;
  ensureDirImpl = ensureDir;
}

async function writeFile(path: string, content: string): Promise<void> {
  return writeFileImpl(path, content);
}

async function ensureDir(path: string): Promise<void> {
  return ensureDirImpl(path);
}

// 默认实现：仅打印日志（浏览器环境不可用）
function defaultWriteFile(path: string, content: string): void {
  console.log(`[AstroGen] Would write: ${path} (${content.length} bytes)`);
}

function defaultEnsureDir(path: string): void {
  console.log(`[AstroGen] Would create dir: ${path}`);
}