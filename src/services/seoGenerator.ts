import type { SiteProject, Page, ProductInfo } from "../shared/types";
import { escapeAttr } from "../shared/utils/helpers";

// 生成 sitemap.xml
export function generateSitemap(project: SiteProject, baseUrl: string): string {
  const urls = project.pages
    .filter((p) => !p.isGenerated || p.type === "product-list")
    .map((page) => {
      const loc = page.slug === "index" ? baseUrl : `${baseUrl}/${page.slug}`;
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${page.updatedAt.split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.slug === "index" ? "1.0" : "0.8"}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

// 生成 robots.txt
export function generateRobotsTxt(baseUrl: string): string {
  return `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml`;
}

// 生成结构化数据 (JSON-LD)
export function generateStructuredData(
  project: SiteProject,
  page: Page,
  products?: ProductInfo[]
): string {
  // 组织信息
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: project.name,
    url: `https://${project.name.toLowerCase().replace(/\s+/g, "")}.com`,
  };

  // 网页信息
  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: extractMetaDescription(page.html),
    isPartOf: { "@type": "WebSite", name: project.name },
  };

  // 产品信息
  const productSchemas = products?.map((p) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: p.currency,
      availability: "https://schema.org/InStock",
    },
  }));

  const schemas = [orgSchema, webpageSchema, ...(productSchemas || [])];
  return schemas.map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join("\n");
}

// 生成 Google Analytics 代码
export function generateAnalyticsCode(trackingId: string): string {
  if (!trackingId) return "";
  return `<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${trackingId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${trackingId}');
</script>`;
}

// 生成 Open Graph 标签
export function generateOGTags(
  page: Page,
  projectName: string,
  ogImage?: string
): string {
  const description = extractMetaDescription(page.html);
  const title = `${page.title} | ${projectName}`;

  return `<meta property="og:title" content="${escapeAttr(title)}" />
<meta property="og:description" content="${escapeAttr(description)}" />
<meta property="og:type" content="website" />
${ogImage ? `<meta property="og:image" content="${escapeAttr(ogImage)}" />` : ""}
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeAttr(title)}" />
<meta name="twitter:description" content="${escapeAttr(description)}" />
${ogImage ? `<meta name="twitter:image" content="${escapeAttr(ogImage)}" />` : ""}`;
}

// 生成完整页面 HTML（含 SEO 增强）
export function generateFullPageHtml(
  project: SiteProject,
  page: Page,
  options: {
    baseUrl?: string;
    analyticsId?: string;
    ogImage?: string;
    products?: ProductInfo[];
  } = {}
): string {
  const { baseUrl, analyticsId, ogImage, products } = options;

  const structuredData = generateStructuredData(project, page, products);
  const ogTags = generateOGTags(page, project.name, ogImage);
  const analytics = analyticsId ? generateAnalyticsCode(analyticsId) : "";

  // 语言切换链接
  const langLinks = (project.languages || [])
    .map((lang) => `<link rel="alternate" hreflang="${lang}" href="${baseUrl || ""}/${lang}/${page.slug}" />`)
    .join("\n  ");

  return `<!DOCTYPE html>
<html lang="${project.defaultLanguage}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${page.title} | ${project.name}</title>
  <meta name="description" content="${escapeAttr(extractMetaDescription(page.html))}" />
  ${ogTags}
  ${langLinks}
  <link rel="canonical" href="${baseUrl || ""}/${page.slug === "index" ? "" : page.slug}" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>${project.globalStyles}\n${page.css}</style>
  ${structuredData}
  ${analytics}
</head>
<body>
  ${page.html}
</body>
</html>`;
}

// 部署前检查
export interface PreDeployCheck {
  name: string;
  passed: boolean;
  message: string;
}

export function runPreDeployChecks(project: SiteProject): PreDeployCheck[] {
  const checks: PreDeployCheck[] = [];

  // 检查是否有 favicon
  checks.push({
    name: "Favicon",
    passed: false, // 需要检查 assets 中是否有 favicon
    message: "建议添加 favicon.ico 提升品牌识别度",
  });

  // 检查首页是否有 meta description
  const indexPage = project.pages.find((p) => p.slug === "index");
  if (indexPage) {
    const desc = extractMetaDescription(indexPage.html);
    checks.push({
      name: "Meta Description",
      passed: desc.length > 20,
      message: desc.length > 20 ? "首页已有 meta description" : "首页缺少 meta description，会影响 SEO",
    });
  }

  // 检查是否有联系方式
  const contactPage = project.pages.find((p) => p.type === "contact" || p.slug === "contact");
  checks.push({
    name: "联系方式",
    passed: !!contactPage,
    message: contactPage ? "已有联系页面" : "建议添加联系页面，方便客户询盘",
  });

  // 检查是否有产品页面
  const hasProducts = project.pages.some((p) => p.type === "product-list");
  checks.push({
    name: "产品页面",
    passed: hasProducts,
    message: hasProducts ? "已有产品页面" : "建议添加产品展示页面",
  });

  // 检查页面数量
  checks.push({
    name: "页面数量",
    passed: project.pages.length >= 3,
    message: `当前 ${project.pages.length} 个页面，建议至少 3 个页面`,
  });

  return checks;
}

// 辅助函数
function extractMetaDescription(html: string): string {
  // 提取第一个 <p> 标签的内容
  const match = html.match(/<p[^>]*>(.*?)<\/p>/);
  if (match) {
    return match[1].replace(/<[^>]+>/g, "").substring(0, 160);
  }
  return html.replace(/<[^>]+>/g, "").substring(0, 160);
}

// escapeAttr 已移至 shared/utils/helpers.ts
