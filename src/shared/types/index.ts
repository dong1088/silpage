// ===== 页面 =====
export interface Page {
  id: string;
  slug: string;           // "index", "products", "about", "contact"
  title: string;
  type: PageType;
  html: string;
  css: string;
  isGenerated: boolean;   // 产品列表/详情页为自动生成
  createdAt: string;
  updatedAt: string;
}

export type PageType = "custom" | "product-list" | "product-detail" | "contact";

// ===== 站点项目 =====
export interface SiteProject {
  id: string;
  name: string;
  description: string;
  template: string;
  status: "draft" | "deployed";
  deployUrl?: string;
  pages: Page[];
  globalStyles: string;       // 全站共享 CSS
  navigation: NavItem[];      // 导航栏配置
  languages: string[];        // 支持的语言 ["zh", "en"]
  defaultLanguage: string;    // "zh"
  createdAt: string;
  updatedAt: string;
}

export interface NavItem {
  label: string;
  pageId: string;            // 关联的页面 ID
  href?: string;             // 外部链接（优先级高于 pageId）
}

// ===== 创建站点数据 =====
export interface CreateProjectData {
  name: string;
  description: string;
  template: string;
}

// ===== 可编辑区域 =====
export interface EditableRegion {
  key: string;
  type: "text" | "image" | "link";
  label: string;
  defaultValue: string;
}

// ===== Blueprint =====
export interface Blueprint {
  id: string;
  name: string;
  description: string;
  category: string;
  template: string;
  pages: { slug: string; title: string; type: PageType }[];
  defaultContent: Record<string, string>;
  components: string[];
  colors: Record<string, string>;
  font: string;
}

// ===== 多语言 =====
export interface I18nConfig {
  languages: string[];
  defaultLanguage: string;
  translations: Record<string, Record<string, string>>;  // lang -> key -> value
}

// ===== 部署 =====
export type DeployPlatform = "vercel" | "cloudflare" | "netlify" | "github-pages";

export interface DeployConfig {
  platform: DeployPlatform;
  token: string;
  projectName: string;
  domain?: string;
}

export interface DeployResult {
  success: boolean;
  url?: string;
  error?: string;
  deployId?: string;
}

export interface DeployHistory {
  id: string;
  siteId: string;
  platform: DeployPlatform;
  url: string;
  status: "success" | "failed" | "pending";
  deployedAt: string;
}

// ===== 生成器 =====
export interface GenerateResult {
  success: boolean;
  outputDir: string;
  error?: string;
  buildLog?: string[];
}

export interface GenerateOptions {
  contents?: ContentItem[];
  products?: ProductInfo[];
  baseUrl?: string;
  languages?: string[];
  skipBuild?: boolean;
}

// ===== 内容 =====
export interface ContentItem {
  id: string;
  siteId: string;
  pageId?: string;           // 关联的页面（可选）
  type: "text" | "image" | "product";
  key: string;
  value: string;
  metadata?: Record<string, any>;
  updatedAt: string;
}

// ===== 产品 =====
export interface ProductInfo {
  id: string;
  siteId: string;
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

// ===== 询盘 =====
export interface Inquiry {
  id: string;
  siteId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  productName?: string;
  source: string;           // "form" | "whatsapp"
  createdAt: string;
  read: boolean;
}

// ===== 模板 =====
export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  html: string;
  css: string;
  defaultColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  defaultFont: string;
}

export interface TemplateCustomization {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  font: string;
}
