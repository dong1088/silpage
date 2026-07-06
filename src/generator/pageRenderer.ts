/**
 * pageRenderer.ts
 * 将 Page 数据渲染为 .astro 文件和 React 交互组件
 */

import type { Page, ProductInfo, ContentItem, SiteProject } from "../shared/types";
import {
  applyContentToHtml as replaceContent,
  stripEditableMarkers,
  wrapCss,
} from "./templateProcessor";
import { sanitizeUrl } from "../shared/utils/helpers";

export interface RenderedPage {
  /** 输出的文件路径（相对于 src/） */
  filePath: string;
  /** 文件内容 */
  content: string;
}

/** HTML 转义（防止 Astro 模板语法破坏） */
function escapeAstro(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$/g, "\\$")
    .replace(/"/g, '\\"');
}

/**
 * 渲染所有页面为 .astro 文件
 */
export function renderPages(
  project: SiteProject,
  contents?: ContentItem[],
  products?: ProductInfo[]
): RenderedPage[] {
  const result: RenderedPage[] = [];
  const languages = project.languages.length > 0 ? project.languages : [project.defaultLanguage];

  // 构建内容查找表 (O(1) 查找)
  const contentMap: Record<string, string> = {};
  if (contents) {
    for (const c of contents) {
      contentMap[c.key] = c.value;
    }
  }

  for (const lang of languages) {
    const isDefaultLang = lang === project.defaultLanguage;
    const langPrefix = isDefaultLang ? "" : `/${lang}`;

    for (const page of project.pages) {
      switch (page.type) {
        case "custom":
          result.push(...renderCustomPage(page, langPrefix, contentMap, project, lang));
          break;
        case "product-list":
          result.push(...renderProductListPage(page, langPrefix, products || [], project));
          break;
        case "product-detail":
          result.push(...renderProductDetailPage(page, langPrefix, products || [], project));
          break;
      }
    }
  }

  // 生成交互组件
  result.push(...renderInteractiveComponents());

  return result;
}

/**
 * 渲染自定义页面（用户在编辑器中拖拽的页面）
 */
function renderCustomPage(
  page: Page,
  langPrefix: string,
  contents: Record<string, string>,
  project: SiteProject,
  lang: string
): RenderedPage[] {
  const results: RenderedPage[] = [];

  // 替换内容
  let processedHtml = replaceContent(page.html, contents);
  // 移除 data-editable 标记
  processedHtml = stripEditableMarkers(processedHtml);

  // 安全转义
  const safeHtml = escapeAstro(processedHtml);
  const cssBlock = wrapCss(page.css, false);

  // 页面路径
  const pageDir = page.slug === "index" ? "" : page.slug;
  // 修复多 // 情况
  let fullPath = `${langPrefix}${pageDir ? "/" + pageDir : ""}`;
  fullPath = fullPath.replace(/\/+/g, "/");

  const escapedTitle = escapeAstro(page.title);
  const escapedProjectName = escapeAstro(project.name);

  const astroContent = `---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout
  title="${escapedTitle}${lang !== project.defaultLanguage ? " (${lang})" : ""}"
  description="${escapedTitle} - ${escapedProjectName}"
  lang="${lang}"
  siteName="${escapedProjectName}"
>
  <Fragment set:html={\`${safeHtml}\`} />
  ${cssBlock}
  <InquiryForm client:load />
  <WhatsAppButton client:visible />
</BaseLayout>
`;

  // 确定文件路径
  let filePath: string;
  if (pageDir) {
    filePath = `src/pages${langPrefix}/${pageDir}.astro`;
  } else {
    filePath = `src/pages${langPrefix}/index.astro`;
  }

  results.push({ filePath, content: astroContent });

  return results;
}

/**
 * 渲染产品列表页
 */
function renderProductListPage(
  page: Page,
  langPrefix: string,
  products: ProductInfo[],
  project: SiteProject
): RenderedPage[] {
  const results: RenderedPage[] = [];

  const productsJson = JSON.stringify(products, null, 2);
  const escapedTitle = escapeAstro(page.title);
  const escapedProjectName = escapeAstro(project.name);

  const productsPath = `${langPrefix}/products`.replace(/\/+/g, "/");

  const astroContent = `---
import BaseLayout from "../layouts/BaseLayout.astro";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  tags: string[];
  sku?: string;
  stock?: number;
}

const products: Product[] = ${productsJson};

function formatPrice(price: number, currency: string): string {
  const symbols: Record<string, string> = { CNY: "¥", USD: "$", EUR: "€", GBP: "£" };
  const symbol = symbols[currency] || "$";
  return symbol + price;
}

function sanitizeUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:image/")) return url;
  return "";
}
---

<BaseLayout
  title="${escapedTitle}"
  description="浏览我们的全部产品"
  siteName="${escapedProjectName}"
>
  <div class="min-h-screen bg-gray-50 py-12 px-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-center mb-12 text-gray-900">${escapedTitle}</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <a
            href={\`${productsPath}/\${product.id}\`}
            class="bg-white rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer block"
          >
            <div class="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
              {product.images[0] && sanitizeUrl(product.images[0]) ? (
                <img src={sanitizeUrl(product.images[0])} alt={product.name} class="w-full h-full object-cover" />
              ) : (
                <span class="text-6xl">📦</span>
              )}
            </div>
            <div class="p-4">
              <h3 class="font-semibold mb-1 text-gray-900">{product.name}</h3>
              <p class="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
              <div class="flex justify-between items-center">
                <span class="text-indigo-600 font-bold text-lg">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.category && (
                  <span class="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                    {product.category}
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  </div>
  <InquiryForm client:load />
  <WhatsAppButton client:visible />
</BaseLayout>
`;

  results.push({
    filePath: `src/pages${langPrefix}/products/index.astro`,
    content: astroContent,
  });

  return results;
}

/**
 * 渲染产品详情页
 */
function renderProductDetailPage(
  page: Page,
  langPrefix: string,
  products: ProductInfo[],
  project: SiteProject
): RenderedPage[] {
  const results: RenderedPage[] = [];

  const productsJson = JSON.stringify(products, null, 2);
  const escapedProjectName = escapeAstro(project.name);

  const productsPath = `${langPrefix || ""}/products`.replace(/\/+/g, "/");
  const productsLink = productsPath.startsWith("/") ? productsPath : "/" + productsPath;

  const astroContent = `---
import BaseLayout from "../layouts/BaseLayout.astro";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  tags: string[];
  sku?: string;
  stock?: number;
}

const products: Product[] = ${productsJson};

export function getStaticPaths() {
  return products.map((product) => ({
    params: { slug: product.id },
    props: { product },
  }));
}

const { product } = Astro.props;

function formatPrice(price: number, currency: string): string {
  const symbols: Record<string, string> = { CNY: "¥", USD: "$", EUR: "€", GBP: "£" };
  const symbol = symbols[currency] || "$";
  return symbol + price;
}

function sanitizeUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:image/")) return url;
  return "";
}
---

<BaseLayout
  title={product.name}
  description={product.description.substring(0, 160)}
  siteName="${escapedProjectName}"
  ogImage={product.images[0] ? sanitizeUrl(product.images[0]) : undefined}
>
  <div class="min-h-screen bg-white py-12 px-8">
    <div class="max-w-4xl mx-auto">
      <nav class="mb-8 text-sm text-gray-500">
        <a href="${productsLink}" class="hover:text-indigo-600">产品中心</a>
        <span class="mx-2">›</span>
        <span class="text-gray-900">{product.name}</span>
      </nav>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div class="space-y-4">
          {product.images.length > 0 ? (
            product.images.map((img: string) => (
              <img src={sanitizeUrl(img)} alt={product.name} class="w-full h-auto rounded-lg" />
            ))
          ) : (
            <div class="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <span class="text-8xl">📦</span>
            </div>
          )}
        </div>

        <div>
          {product.category && (
            <span class="text-sm text-indigo-600 font-medium">{product.category}</span>
          )}
          <h1 class="text-3xl font-bold text-gray-900 mt-2 mb-4">{product.name}</h1>
          <div class="text-3xl font-bold text-indigo-600 mb-6">
            {formatPrice(product.price, product.currency)}
          </div>

          <div class="prose prose-gray max-w-none mb-8">
            <p class="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {product.sku && (
            <p class="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>
          )}
          {product.stock !== undefined && (
            <p class="text-sm text-gray-500 mb-4">库存: {product.stock}</p>
          )}

          {product.tags.length > 0 && (
            <div class="flex flex-wrap gap-2 mt-4">
              {product.tags.map((tag: string) => (
                <span class="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm">{tag}</span>
              ))}
            </div>
          )}

          <div class="mt-8 space-y-3">
            <button
              onclick="document.getElementById('inquiry-form').scrollIntoView({behavior:'smooth'})"
              class="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              发送询盘
            </button>
            <a
              href={\`tel:+\${product.sku || ""}\`}
              target="_blank"
              rel="noopener noreferrer"
              class="block w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition text-center"
            >
              WhatsApp 咨询
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <InquiryForm client:load />
  <WhatsAppButton client:visible />
</BaseLayout>
`;

  results.push({
    filePath: `src/pages${langPrefix}/products/[slug].astro`,
    content: astroContent,
  });

  return results;
}

/**
 * 渲染 BaseLayout.astro（全局布局组件）
 */
export function renderBaseLayout(
  project: SiteProject,
  showInquiryForm: boolean = true,
  showWhatsApp: boolean = true
): RenderedPage {
  const navItems = project.navigation || [];
  const navLinks = navItems.map((item) => {
    const page = project.pages.find((p) => p.id === item.pageId);
    const slug = page?.slug || item.pageId;
    const href = page?.slug === "index" ? "/" : `/${slug}`;
    return `{ name: "${item.label}", href: "${href}" }`;
  }).join(",\n    ");

  const globalStyles = project.globalStyles || "";
  const escapedProjectName = escapeAstro(project.name);
  const escapedDescription = escapeAstro(project.description || "专业的外贸建站平台");
  const escapedDefaultLang = project.defaultLanguage;

  const hasInquiryForm = showInquiryForm;
  const hasWhatsApp = showWhatsApp;

  const content = `---
interface Props {
  title?: string;
  description?: string;
  lang?: string;
  siteName?: string;
  ogImage?: string;
}

const {
  title = "${escapedProjectName}",
  description = "${escapedDescription}",
  lang = "${escapedDefaultLang}",
  siteName = "${escapedProjectName}",
  ogImage,
} = Astro.props;

const currentPath = Astro.url.pathname;

const navItems = [
  ${navLinks}
];
---

<!DOCTYPE html>
<html lang={lang}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <!-- Primary Meta -->
    <title>{title} | {siteName}</title>
    <meta name="description" content={description} />

    <!-- Open Graph -->
    <meta property="og:title" content={title + " | " + siteName} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={siteName} />
    {ogImage && <meta property="og:image" content={ogImage} />}

    <!-- Twitter Card -->
    <meta name="twitter:card" content={ogImage ? "summary_large_image" : "summary"} />
    <meta name="twitter:title" content={title + " | " + siteName} />
    <meta name="twitter:description" content={description} />
    {ogImage && <meta name="twitter:image" content={ogImage} />}

    ${globalStyles ? `<style is:global>\n${globalStyles}\n</style>` : ""}
  </head>

  <body>
    <!-- Navigation Bar -->
    <nav class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" class="text-xl font-bold text-gray-900 hover:text-indigo-600 transition">
          {siteName}
        </a>
        <div class="flex gap-6">
          {navItems.map((item) => (
            <a
              href={item.href}
              class={\`text-sm font-medium transition \${
                currentPath === item.href
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              }\`}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-12 px-8 mt-16">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-lg font-bold mb-4">{siteName}</h3>
            <p class="text-gray-400">${escapedDescription}</p>
          </div>
          <div>
            <h3 class="text-lg font-bold mb-4">快速链接</h3>
            <div class="flex flex-col gap-2">
              {navItems.map((item) => (
                <a href={item.href} class="text-gray-400 hover:text-white transition">{item.name}</a>
              ))}
            </div>
          </div>
          <div>
            <h3 class="text-lg font-bold mb-4">联系方式</h3>
            <p class="text-gray-400">通过询盘表单联系我们</p>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  </body>
</html>
`;

  return {
    filePath: "src/layouts/BaseLayout.astro",
    content,
  };
}

/**
 * 渲染交互组件
 */
function renderInteractiveComponents(): RenderedPage[] {
  const components: RenderedPage[] = [];

  // InquiryForm.tsx - React Island
  components.push({
    filePath: "src/components/InquiryForm.tsx",
    content: `import { useState, type FormEvent } from "react";

interface InquiryFormProps {
  /** 询盘提交的目标 URL（可选，默认使用表单自提交） */
  endpoint?: string;
}

export default function InquiryForm({ endpoint }: InquiryFormProps) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);

    if (endpoint) {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          body: JSON.stringify(Object.fromEntries(data)),
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("提交失败");
      } catch (err) {
        setError(err instanceof Error ? err.message : "网络错误");
        setLoading(false);
        return;
      }
    }

    // 模拟提交延时（无 endpoint 时演示用）
    if (!endpoint) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setLoading(false);
    setSent(true);
  };

  return (
    <div id="inquiry-form" className="max-w-xl mx-auto py-16 px-8">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">产品询盘</h2>
      {sent ? (
        <div className="text-center p-8 bg-green-50 rounded-xl">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">询盘已发送！</h3>
          <p className="text-green-600">感谢您的询盘，我们会尽快联系您。</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">邮箱 *</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
            <input
              type="tel"
              name="phone"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="+1 234 567 8900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">留言</label>
            <textarea
              name="message"
              rows={4}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="I would like to inquire about..."
            />
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "提交中..." : "提交询盘"}
          </button>
        </form>
      )}
    </div>
  );
}
`,
  });

  // WhatsAppButton.tsx - React Island
  components.push({
    filePath: "src/components/WhatsAppButton.tsx",
    content: `interface WhatsAppButtonProps {
  /** WhatsApp 国际号码（可选，默认使用交互式聊天） */
  phoneNumber?: string;
}

export default function WhatsAppButton({ phoneNumber }: WhatsAppButtonProps) {
  const waUrl = phoneNumber
    ? \`https://wa.me/\${phoneNumber}\`
    : "https://wa.me/?text=Hello!%20I%27m%20interested%20in%20your%20products";

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition z-50"
      aria-label="Chat on WhatsApp"
    >
      <svg
        className="w-7 h-7 text-white"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}
`,
  });

  return components;
}