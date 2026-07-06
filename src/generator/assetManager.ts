/**
 * assetManager.ts
 * 处理图片资源：提取、拷贝、生成 public 目录结构
 */

import type { SiteProject, ContentItem, ProductInfo } from "../shared/types";

export interface AssetCopy {
  /** 源路径（本地文件路径或 URL） */
  source: string;
  /** 目标路径（相对于 public/） */
  target: string;
}

/**
 * 从站点项目中提取所有需要拷贝到 public/ 的图片资源
 */
export function collectAssets(
  project: SiteProject,
  contents?: ContentItem[],
  products?: ProductInfo[]
): AssetCopy[] {
  const assets: AssetCopy[] = [];
  const seen = new Set<string>();

  // 从内容中提取图片
  if (contents) {
    for (const c of contents) {
      if (c.type === "image" && c.value) {
        addIfNotSeen(assets, seen, c.value, `images/content/`);
      }
    }
  }

  // 从产品中提取图片
  if (products) {
    for (const p of products) {
      for (const img of p.images) {
        addIfNotSeen(assets, seen, img, `images/products/${p.id}/`);
      }
    }
  }

  // 从页面 HTML 中提取图片 URL
  for (const page of project.pages) {
    const imgUrls = extractImageUrls(page.html);
    for (const url of imgUrls) {
      addIfNotSeen(assets, seen, url, `images/`);
    }
  }

  return assets;
}

function addIfNotSeen(
  assets: AssetCopy[],
  seen: Set<string>,
  source: string,
  prefix: string
): void {
  if (seen.has(source)) return;
  seen.add(source);

  const fileName = extractFileName(source);
  if (!fileName) return;

  assets.push({
    source,
    target: `${prefix}${fileName}`,
  });
}

/**
 * 从 HTML 字符串中提取所有图片 URL
 */
function extractImageUrls(html: string): string[] {
  const urls: string[] = [];
  const regex = /<img[^>]+src="([^"]+)"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const url = match[1];
    if (url && !url.startsWith("data:")) {
      urls.push(url);
    }
  }
  return urls;
}

/**
 * 从 URL 中提取文件名
 */
function extractFileName(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const parts = pathname.split("/");
    const name = parts[parts.length - 1];
    if (name && name.includes(".")) return name;
  } catch {
    // 不是有效 URL，当作本地路径处理
  }

  // 本地路径
  const parts = url.replace(/\\/g, "/").split("/");
  const name = parts[parts.length - 1];
  return name || "image.png";
}

/**
 * 生成用于图片处理的 Astro 工具代码
 * 注入到 BaseLayout 中用于引用 public/ 下的图片
 */
export function generateImageUtils(): string {
  return `/**
 * Resolve an image URL, supporting both external URLs and local public/ paths
 */
export function getImageUrl(src: string): string {
  // External URLs
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  // Data URLs
  if (src.startsWith("data:")) {
    return src;
  }
  // Local public/ path
  return "/" + src.replace(/^\\/+/, "");
}
`;
}