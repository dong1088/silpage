/**
 * seoInjector.ts
 * 为 Astro 项目生成 SEO 相关文件：sitemap.xml, robots.txt, favicon
 */

import type { SiteProject, Page } from "../shared/types";

export interface SeoFiles {
  sitemapXml: string;
  robotsTxt: string;
  faviconSvg: string;
}

/**
 * 生成所有 SEO 文件
 */
export function generateSeoFiles(
  project: SiteProject,
  baseUrl?: string
): SeoFiles {
  const siteUrl = baseUrl || "https://example.com";

  return {
    sitemapXml: generateSitemap(project, siteUrl),
    robotsTxt: generateRobotsTxt(siteUrl),
    faviconSvg: generateFavicon(project.name),
  };
}

/**
 * 生成 sitemap.xml（支持多语言）
 */
function generateSitemap(project: SiteProject, baseUrl: string): string {
  const urls: string[] = [];
  const now = new Date().toISOString().split("T")[0];
  const languages = project.languages.length > 0 ? project.languages : [project.defaultLanguage];

  for (const page of project.pages) {
    if (page.type === "product-detail") continue;

    const priority = page.slug === "index" ? "1.0" : "0.8";

    for (const lang of languages) {
      const isDefault = lang === project.defaultLanguage;
      const loc = isDefault ? "" : `/${lang}`;
      const pagePath = page.slug === "index" ? "" : `/${page.slug}`;

      urls.push(`  <url>
    <loc>${baseUrl}${loc}${pagePath}</loc>
    <lastmod>${now}</lastmod>
    <priority>${priority}</priority>
  </url>`);
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

/**
 * 生成 robots.txt
 */
function generateRobotsTxt(baseUrl: string): string {
  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
}

/**
 * 生成一个简单的 SVG favicon（取站点名首字母）
 */
function generateFavicon(siteName: string): string {
  const letter = siteName.charAt(0).toUpperCase() || "S";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#6366f1"/>
  <text x="50" y="68" font-family="Arial,sans-serif" font-size="60" font-weight="bold" fill="white" text-anchor="middle">${letter}</text>
</svg>`;
}

/**
 * 生成 .htaccess 或 _headers 文件（用于 Cloudflare Pages）
 */
export function generateHeadersFile(): string {
  return `# Security headers
/*:
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
`;
}

/**
 * 生成 404 页面
 */
export function generate404Page(projectName: string): string {
  return `---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="页面未找到" description="您访问的页面不存在">
  <div class="min-h-[60vh] flex items-center justify-center px-8">
    <div class="text-center">
      <div class="text-8xl mb-6">404</div>
      <h1 class="text-3xl font-bold text-gray-900 mb-4">页面未找到</h1>
      <p class="text-gray-500 mb-8 max-w-md mx-auto">
        您访问的页面不存在或已被移除，请检查链接是否正确。
      </p>
      <a
        href="/"
        class="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
      >
        返回首页
      </a>
    </div>
  </div>
</BaseLayout>
`;
}