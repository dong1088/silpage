import { Template } from "../shared/types";

export const templates: Template[] = [
  {
    id: "brand-minimal",
    name: "简约品牌",
    description: "简洁大气的品牌官网，适合科技、设计类公司",
    category: "brand",
    thumbnail: "",
    html: `<div class="min-h-screen">
  <nav class="flex items-center justify-between px-8 py-4 bg-white">
    <div class="text-2xl font-bold text-indigo-600" data-editable="logo_text">BrandName</div>
    <div class="flex gap-6">
      <a href="#about" class="text-gray-600 hover:text-indigo-600" data-editable="nav_about">关于我们</a>
      <a href="#services" class="text-gray-600 hover:text-indigo-600" data-editable="nav_services">服务</a>
      <a href="#contact" class="text-gray-600 hover:text-indigo-600" data-editable="nav_contact">联系</a>
    </div>
  </nav>

  <section class="py-20 px-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center">
    <h1 class="text-5xl font-bold mb-4" data-editable="hero_title">创新科技，引领未来</h1>
    <p class="text-xl mb-8 opacity-90" data-editable="hero_desc">我们致力于为客户提供最优质的技术解决方案</p>
    <button class="px-8 py-4 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition" data-editable="cta_text">了解更多</button>
  </section>

  <section id="services" class="py-16 px-8">
    <h2 class="text-3xl font-bold text-center mb-12" data-editable="service_title">我们的服务</h2>
    <div class="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
      <div class="text-center p-6">
        <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4"><span class="text-2xl">🚀</span></div>
        <h3 class="font-semibold mb-2" data-editable="service_1_title">产品开发</h3>
        <p class="text-gray-600" data-editable="service_1_desc">从概念到产品的完整开发服务</p>
      </div>
      <div class="text-center p-6">
        <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4"><span class="text-2xl">🎨</span></div>
        <h3 class="font-semibold mb-2" data-editable="service_2_title">UI/UX 设计</h3>
        <p class="text-gray-600" data-editable="service_2_desc">用户体验至上的设计理念</p>
      </div>
      <div class="text-center p-6">
        <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4"><span class="text-2xl">📊</span></div>
        <h3 class="font-semibold mb-2" data-editable="service_3_title">数据分析</h3>
        <p class="text-gray-600" data-editable="service_3_desc">数据驱动的决策支持</p>
      </div>
    </div>
  </section>

  <section id="about" class="py-16 px-8 bg-gray-50">
    <div class="max-w-4xl mx-auto flex items-center gap-12">
      <div class="flex-1">
        <h2 class="text-3xl font-bold mb-4" data-editable="about_title">关于我们</h2>
        <p class="text-gray-600 mb-4" data-editable="about_text">我们是一家专注于科技创新的公司，成立于2020年。团队由来自全球的顶尖人才组成。</p>
      </div>
      <div class="flex-1 bg-indigo-100 rounded-lg h-64 flex items-center justify-center">
        <span class="text-6xl">🏢</span>
      </div>
    </div>
  </section>

  <section id="contact" class="py-16 px-8">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-3xl font-bold mb-4" data-editable="contact_title">联系我们</h2>
      <p class="text-gray-600 mb-8" data-editable="contact_desc">有任何问题或合作意向，欢迎随时联系</p>
      <div class="flex justify-center gap-8">
        <div><div class="text-2xl mb-2">📧</div><p class="text-gray-600" data-editable="contact_email">contact@example.com</p></div>
        <div><div class="text-2xl mb-2">📱</div><p class="text-gray-600" data-editable="contact_phone">+86 123 4567 8900</p></div>
        <div><div class="text-2xl mb-2">📍</div><p class="text-gray-600" data-editable="contact_address">上海市浦东新区</p></div>
      </div>
    </div>
  </section>

  <footer class="bg-gray-800 text-white py-8 px-8">
    <div class="max-w-4xl mx-auto flex justify-between items-center">
      <div data-editable="footer_text">&copy; 2024 BrandName. All rights reserved.</div>
    </div>
  </footer>
</div>`,
    css: "",
    defaultColors: {
      primary: "#6366f1",
      secondary: "#8b5cf6",
      accent: "#f59e0b",
      background: "#ffffff",
      text: "#1f2937",
    },
    defaultFont: "Inter",
  },
  {
    id: "product-showcase",
    name: "产品展示",
    description: "适合电商产品目录，突出产品特性",
    category: "product",
    thumbnail: "",
    html: `<div class="min-h-screen bg-gray-50">
  <nav class="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
    <div class="text-2xl font-bold text-orange-600" data-editable="logo_text">ShopName</div>
    <div class="flex gap-6">
      <a href="#" class="text-gray-600 hover:text-orange-600" data-editable="nav_home">首页</a>
      <a href="#products" class="text-gray-600 hover:text-orange-600" data-editable="nav_products">产品</a>
      <a href="#" class="text-gray-600 hover:text-orange-600" data-editable="nav_about">关于</a>
    </div>
  </nav>

  <section class="py-16 px-8 bg-gradient-to-r from-orange-400 to-pink-500 text-white">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-5xl font-bold mb-4" data-editable="hero_title">新品首发</h1>
      <p class="text-xl mb-8 opacity-90" data-editable="hero_desc">探索我们最新的产品系列，限时优惠中</p>
      <button class="px-8 py-4 bg-white text-orange-600 rounded-lg font-medium hover:bg-gray-100 transition" data-editable="cta_text">立即选购</button>
    </div>
  </section>

  <section id="products" class="py-12 px-8">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12" data-editable="product_title">热门产品</h2>
      <div class="grid grid-cols-4 gap-6">
        <div class="bg-white rounded-xl overflow-hidden hover:shadow-lg transition">
          <div class="aspect-square bg-gray-100 flex items-center justify-center"><span class="text-6xl">👔</span></div>
          <div class="p-4">
            <h3 class="font-semibold mb-1" data-editable="product_1_name">经典衬衫</h3>
            <p class="text-gray-500 text-sm mb-2" data-editable="product_1_desc">100%纯棉面料</p>
            <span class="text-orange-600 font-bold" data-editable="product_1_price">¥299</span>
          </div>
        </div>
        <div class="bg-white rounded-xl overflow-hidden hover:shadow-lg transition">
          <div class="aspect-square bg-gray-100 flex items-center justify-center"><span class="text-6xl">👖</span></div>
          <div class="p-4">
            <h3 class="font-semibold mb-1" data-editable="product_2_name">休闲牛仔裤</h3>
            <p class="text-gray-500 text-sm mb-2" data-editable="product_2_desc">弹力舒适面料</p>
            <span class="text-orange-600 font-bold" data-editable="product_2_price">¥399</span>
          </div>
        </div>
        <div class="bg-white rounded-xl overflow-hidden hover:shadow-lg transition">
          <div class="aspect-square bg-gray-100 flex items-center justify-center"><span class="text-6xl">🧥</span></div>
          <div class="p-4">
            <h3 class="font-semibold mb-1" data-editable="product_3_name">时尚外套</h3>
            <p class="text-gray-500 text-sm mb-2" data-editable="product_3_desc">防风保暖设计</p>
            <span class="text-orange-600 font-bold" data-editable="product_3_price">¥599</span>
          </div>
        </div>
        <div class="bg-white rounded-xl overflow-hidden hover:shadow-lg transition">
          <div class="aspect-square bg-gray-100 flex items-center justify-center"><span class="text-6xl">👗</span></div>
          <div class="p-4">
            <h3 class="font-semibold mb-1" data-editable="product_4_name">连衣裙</h3>
            <p class="text-gray-500 text-sm mb-2" data-editable="product_4_desc">优雅气质款</p>
            <span class="text-orange-600 font-bold" data-editable="product_4_price">¥459</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer class="bg-gray-800 text-white py-12 px-8">
    <div class="max-w-6xl mx-auto grid grid-cols-4 gap-8">
      <div>
        <h3 class="font-bold mb-4">关于我们</h3>
        <p class="text-gray-400 text-sm" data-editable="about_text">专注时尚电商，为您提供最优质的服装产品</p>
      </div>
      <div>
        <h3 class="font-bold mb-4">联系方式</h3>
        <p class="text-gray-400 text-sm" data-editable="contact_email">service@shop.com</p>
        <p class="text-gray-400 text-sm" data-editable="contact_phone">400-123-4567</p>
      </div>
    </div>
    <div class="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-gray-400" data-editable="footer_text">&copy; 2024 ShopName. All rights reserved.</div>
  </footer>
</div>`,
    css: "",
    defaultColors: {
      primary: "#ea580c",
      secondary: "#db2777",
      accent: "#f59e0b",
      background: "#f9fafb",
      text: "#1f2937",
    },
    defaultFont: "Noto Sans SC",
  },
  {
    id: "landing-tech",
    name: "科技落地页",
    description: "适合SaaS产品、App推广的营销落地页",
    category: "landing",
    thumbnail: "",
    html: `<div class="min-h-screen">
  <nav class="flex items-center justify-between px-8 py-4">
    <div class="text-2xl font-bold text-blue-600" data-editable="logo_text">TechApp</div>
    <div class="flex gap-4">
      <button class="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" data-editable="nav_login">登录</button>
      <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" data-editable="nav_signup">免费试用</button>
    </div>
  </nav>

  <section class="py-20 px-8 text-center">
    <div class="max-w-3xl mx-auto">
      <div class="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm mb-6" data-editable="hero_badge">🚀 新版本已发布</div>
      <h1 class="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" data-editable="hero_title">让工作更高效</h1>
      <p class="text-xl text-gray-600 mb-8" data-editable="hero_desc">一站式项目管理工具，帮助团队协作、追踪进度、提升效率</p>
      <button class="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-lg" data-editable="cta_text">免费开始</button>
    </div>
  </section>

  <section class="py-16 px-8 bg-gray-50">
    <div class="max-w-5xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12" data-editable="feature_title">为什么选择我们</h2>
      <div class="grid grid-cols-3 gap-8">
        <div class="bg-white p-6 rounded-xl">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4"><span class="text-2xl">⚡</span></div>
          <h3 class="font-semibold mb-2" data-editable="feature_1_title">极速响应</h3>
          <p class="text-gray-600 text-sm" data-editable="feature_1_desc">毫秒级响应速度，让您的工作流程丝滑顺畅</p>
        </div>
        <div class="bg-white p-6 rounded-xl">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4"><span class="text-2xl">🔒</span></div>
          <h3 class="font-semibold mb-2" data-editable="feature_2_title">安全可靠</h3>
          <p class="text-gray-600 text-sm" data-editable="feature_2_desc">企业级数据加密，保障您的信息安全</p>
        </div>
        <div class="bg-white p-6 rounded-xl">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4"><span class="text-2xl">🤝</span></div>
          <h3 class="font-semibold mb-2" data-editable="feature_3_title">团队协作</h3>
          <p class="text-gray-600 text-sm" data-editable="feature_3_desc">实时多人协作，让团队沟通更高效</p>
        </div>
      </div>
    </div>
  </section>

  <section class="py-20 px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
    <h2 class="text-4xl font-bold mb-4" data-editable="cta_title">准备好提升效率了吗？</h2>
    <p class="text-xl mb-8 opacity-90" data-editable="cta_desc">加入全球超过1000万用户的选择</p>
    <button class="px-8 py-4 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition text-lg" data-editable="cta_button">立即免费试用</button>
  </section>

  <footer class="bg-gray-900 text-gray-400 py-12 px-8">
    <div class="max-w-5xl mx-auto flex justify-between items-center">
      <div data-editable="footer_text">&copy; 2024 TechApp. All rights reserved.</div>
    </div>
  </footer>
</div>`,
    css: "",
    defaultColors: {
      primary: "#2563eb",
      secondary: "#7c3aed",
      accent: "#10b981",
      background: "#ffffff",
      text: "#1f2937",
    },
    defaultFont: "Inter",
  },
  {
    id: "brand-elegant",
    name: "优雅品牌",
    description: "高端大气的品牌官网，适合奢侈品、高端服务",
    category: "brand",
    thumbnail: "",
    html: `<div class="min-h-screen bg-gray-900 text-white">
  <nav class="flex items-center justify-between px-12 py-6">
    <div class="text-2xl font-light tracking-widest" data-editable="logo_text">LUXURY</div>
    <div class="flex gap-8">
      <a href="#" class="text-gray-400 hover:text-white tracking-wider text-sm" data-editable="nav_story">品牌故事</a>
      <a href="#" class="text-gray-400 hover:text-white tracking-wider text-sm" data-editable="nav_products">产品系列</a>
      <a href="#" class="text-gray-400 hover:text-white tracking-wider text-sm" data-editable="nav_contact">联系</a>
    </div>
  </nav>

  <section class="py-32 px-12 text-center">
    <h1 class="text-7xl font-light tracking-wider mb-6" data-editable="hero_title">传承经典</h1>
    <p class="text-xl text-gray-400 tracking-widest mb-12" data-editable="hero_desc">始于1990年，匠心独运</p>
    <div class="w-24 h-px bg-white mx-auto"></div>
  </section>

  <section class="py-20 px-12">
    <div class="max-w-5xl mx-auto grid grid-cols-2 gap-16 items-center">
      <div>
        <h2 class="text-3xl font-light tracking-wider mb-6" data-editable="about_title">品牌故事</h2>
        <p class="text-gray-400 leading-relaxed mb-4" data-editable="about_text">三十年来，我们始终坚持将传统工艺与现代设计完美融合。每一件作品都凝聚着匠人的心血与智慧。</p>
      </div>
      <div class="bg-gray-800 h-80 flex items-center justify-center">
        <span class="text-8xl">✨</span>
      </div>
    </div>
  </section>

  <section class="py-20 px-12 bg-gray-800">
    <h2 class="text-3xl font-light tracking-wider text-center mb-16" data-editable="product_title">产品系列</h2>
    <div class="max-w-5xl mx-auto grid grid-cols-3 gap-8">
      <div class="group cursor-pointer">
        <div class="bg-gray-700 h-64 mb-4 flex items-center justify-center group-hover:bg-gray-600 transition"><span class="text-6xl">⌚</span></div>
        <h3 class="text-lg tracking-wider" data-editable="product_1_name">经典系列</h3>
        <p class="text-gray-400 text-sm mt-1" data-editable="product_1_desc">传承百年工艺</p>
      </div>
      <div class="group cursor-pointer">
        <div class="bg-gray-700 h-64 mb-4 flex items-center justify-center group-hover:bg-gray-600 transition"><span class="text-6xl">💍</span></div>
        <h3 class="text-lg tracking-wider" data-editable="product_2_name">臻品系列</h3>
        <p class="text-gray-400 text-sm mt-1" data-editable="product_2_desc">限量珍藏版</p>
      </div>
      <div class="group cursor-pointer">
        <div class="bg-gray-700 h-64 mb-4 flex items-center justify-center group-hover:bg-gray-600 transition"><span class="text-6xl">👜</span></div>
        <h3 class="text-lg tracking-wider" data-editable="product_3_name">新品系列</h3>
        <p class="text-gray-400 text-sm mt-1" data-editable="product_3_desc">当代时尚风向</p>
      </div>
    </div>
  </section>

  <section class="py-20 px-12 text-center">
    <h2 class="text-3xl font-light tracking-wider mb-8" data-editable="cta_title">预约体验</h2>
    <p class="text-gray-400 mb-8" data-editable="cta_desc">欢迎莅临我们的精品店，体验尊贵服务</p>
    <button class="px-12 py-4 border border-white text-white hover:bg-white hover:text-gray-900 transition tracking-wider" data-editable="cta_text">预约</button>
  </section>

  <footer class="bg-black py-12 px-12">
    <div class="max-w-5xl mx-auto flex justify-between items-center">
      <div class="text-gray-500 tracking-wider" data-editable="footer_text">&copy; 2024 LUXURY</div>
    </div>
  </footer>
</div>`,
    css: "",
    defaultColors: {
      primary: "#d4d4d8",
      secondary: "#a1a1aa",
      accent: "#fbbf24",
      background: "#18181b",
      text: "#fafafa",
    },
    defaultFont: "Playfair Display",
  },
  {
    id: "landing-app",
    name: "App推广",
    description: "适合移动应用下载推广的落地页",
    category: "landing",
    thumbnail: "",
    html: `<div class="min-h-screen bg-gradient-to-b from-purple-50 to-white">
  <nav class="flex items-center justify-between px-8 py-4">
    <div class="text-2xl font-bold text-purple-600" data-editable="logo_text">AppName</div>
    <div class="flex gap-4">
      <button class="px-4 py-2 text-purple-600" data-editable="nav_features">功能</button>
      <button class="px-4 py-2 text-purple-600" data-editable="nav_pricing">价格</button>
      <button class="px-4 py-2 bg-purple-600 text-white rounded-lg" data-editable="nav_download">下载 App</button>
    </div>
  </nav>

  <section class="py-20 px-8 text-center">
    <div class="max-w-3xl mx-auto">
      <div class="inline-block px-4 py-1 bg-purple-100 text-purple-600 rounded-full text-sm mb-6" data-editable="hero_badge">📱 iOS & Android</div>
      <h1 class="text-5xl font-bold mb-6" data-editable="hero_title">记录生活每一刻</h1>
      <p class="text-xl text-gray-600 mb-8" data-editable="hero_desc">简洁优雅的日记应用，让回忆永不褪色</p>
    </div>
  </section>

  <section class="py-16 px-8">
    <div class="max-w-4xl mx-auto grid grid-cols-3 gap-8">
      <div class="text-center">
        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"><span class="text-3xl">🎨</span></div>
        <h3 class="font-semibold mb-2" data-editable="feature_1_title">精美界面</h3>
        <p class="text-gray-600 text-sm" data-editable="feature_1_desc">多种主题随心切换</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"><span class="text-3xl">☁️</span></div>
        <h3 class="font-semibold mb-2" data-editable="feature_2_title">云端同步</h3>
        <p class="text-gray-600 text-sm" data-editable="feature_2_desc">多设备无缝同步</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"><span class="text-3xl">🔒</span></div>
        <h3 class="font-semibold mb-2" data-editable="feature_3_title">隐私保护</h3>
        <p class="text-gray-600 text-sm" data-editable="feature_3_desc">端到端加密</p>
      </div>
    </div>
  </section>

  <section class="py-20 px-8 text-center">
    <h2 class="text-4xl font-bold mb-4" data-editable="cta_title">开始记录你的故事</h2>
    <p class="text-xl text-gray-600 mb-8" data-editable="cta_desc">已有超过100万用户的选择</p>
    <button class="px-8 py-4 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition text-lg" data-editable="cta_text">免费下载</button>
  </section>

  <footer class="bg-gray-100 py-8 px-8">
    <div class="max-w-4xl mx-auto flex justify-between items-center text-sm text-gray-500">
      <div data-editable="footer_text">&copy; 2024 AppName</div>
    </div>
  </footer>
</div>`,
    css: "",
    defaultColors: {
      primary: "#9333ea",
      secondary: "#ec4899",
      accent: "#06b6d4",
      background: "#faf5ff",
      text: "#1f2937",
    },
    defaultFont: "Noto Sans SC",
  },
];
