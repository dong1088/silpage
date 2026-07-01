import type { ProductInfo } from "../shared/types";
import { escapeHtml, getCurrencySymbol } from "../shared/utils/helpers";

// 生成产品列表页 HTML
export function generateProductListPage(products: ProductInfo[]): string {
  if (products.length === 0) {
    return `<div class="min-h-screen flex items-center justify-center p-8">
      <div class="text-center text-gray-500">
        <div class="text-6xl mb-4">📦</div>
        <h2 class="text-2xl font-bold mb-2">暂无产品</h2>
        <p>请在"产品管理"中添加产品</p>
      </div>
    </div>`;
  }

  const cards = products
    .map(
      (p) => `
    <div class="bg-white rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer" onclick="window.location.href='product-${p.id}.html'">
      <div class="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
        ${
          p.images[0]
            ? `<img src="${p.images[0]}" alt="${escapeHtml(p.name)}" class="w-full h-full object-cover" />`
            : `<span class="text-6xl">📦</span>`
        }
      </div>
      <div class="p-4">
        <h3 class="font-semibold mb-1 text-gray-900">${escapeHtml(p.name)}</h3>
        <p class="text-gray-500 text-sm mb-2 line-clamp-2">${escapeHtml(p.description)}</p>
        <div class="flex justify-between items-center">
          <span class="text-indigo-600 font-bold text-lg">${getCurrencySymbol(p.currency)}${p.price}</span>
          ${p.category ? `<span class="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">${escapeHtml(p.category)}</span>` : ""}
        </div>
      </div>
    </div>`
    )
    .join("\n");

  return `<div class="min-h-screen bg-gray-50 py-12 px-8">
  <div class="max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold text-center mb-12 text-gray-900">产品中心</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      ${cards}
    </div>
  </div>
</div>`;
}

// 生成单个产品详情页 HTML
export function generateProductDetailPage(product: ProductInfo): string {
  const images = product.images.length > 0
    ? product.images
        .map(
          (img) =>
            `<img src="${img}" alt="${escapeHtml(product.name)}" class="w-full h-auto rounded-lg" />`
        )
        .join("\n")
    : `<div class="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <span class="text-8xl">📦</span>
      </div>`;

  const tags = product.tags.length > 0
    ? `<div class="flex flex-wrap gap-2 mt-4">
        ${product.tags.map((t) => `<span class="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm">${escapeHtml(t)}</span>`).join("")}
      </div>`
    : "";

  return `<div class="min-h-screen bg-white py-12 px-8">
  <div class="max-w-4xl mx-auto">
    <!-- 面包屑 -->
    <nav class="mb-8 text-sm text-gray-500">
      <a href="products.html" class="hover:text-indigo-600">产品中心</a>
      <span class="mx-2">›</span>
      <span class="text-gray-900">${escapeHtml(product.name)}</span>
    </nav>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
      <!-- 图片 -->
      <div class="space-y-4">
        ${images}
      </div>

      <!-- 信息 -->
      <div>
        ${product.category ? `<span class="text-sm text-indigo-600 font-medium">${escapeHtml(product.category)}</span>` : ""}
        <h1 class="text-3xl font-bold text-gray-900 mt-2 mb-4">${escapeHtml(product.name)}</h1>
        <div class="text-3xl font-bold text-indigo-600 mb-6">${getCurrencySymbol(product.currency)}${product.price}</div>

        <div class="prose prose-gray max-w-none mb-8">
          <p class="text-gray-600 leading-relaxed">${escapeHtml(product.description)}</p>
        </div>

        ${product.sku ? `<p class="text-sm text-gray-500 mb-2">SKU: ${escapeHtml(product.sku)}</p>` : ""}
        ${product.stock !== undefined ? `<p class="text-sm text-gray-500 mb-4">库存: ${product.stock}</p>` : ""}
        ${tags}

        <!-- 询盘按钮 -->
        <div class="mt-8 space-y-3">
          <button onclick="document.getElementById('inquiry-form').scrollIntoView({behavior:'smooth'})"
            class="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
            发送询盘
          </button>
          <a href="https://wa.me/?text=I'm interested in ${encodeURIComponent(product.name)}"
            target="_blank"
            class="block w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition text-center">
            WhatsApp 咨询
          </a>
        </div>
      </div>
    </div>

    <!-- 询盘表单 -->
    <div id="inquiry-form" class="mt-16 max-w-xl mx-auto">
      <h2 class="text-2xl font-bold text-center mb-8 text-gray-900">产品询盘</h2>
      <form class="space-y-4" onsubmit="event.preventDefault(); alert('感谢您的询盘，我们会尽快联系您！');">
        <input type="hidden" name="product" value="${escapeHtml(product.name)}" />
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
          <input type="text" name="name" required class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Your Name" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">邮箱 *</label>
          <input type="email" name="email" required class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="your@email.com" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">电话</label>
          <input type="tel" name="phone" class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="+1 234 567 8900" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">留言</label>
          <textarea name="message" rows="4" class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="I would like to inquire about..."></textarea>
        </div>
        <button type="submit" class="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
          提交询盘
        </button>
      </form>
    </div>
  </div>
</div>`;
}

// 辅助函数已移至 shared/utils/helpers.ts
