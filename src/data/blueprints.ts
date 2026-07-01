import type { Blueprint } from "../shared/types";

export const blueprints: Blueprint[] = [
  {
    id: "electronics-export",
    name: "电子数码外贸站",
    description: "适合 3C 数码、电子配件、智能设备出口企业",
    category: "electronics",
    template: "landing-tech",
    pages: [
      { slug: "index", title: "首页", type: "custom" },
      { slug: "products", title: "Products", type: "product-list" },
      { slug: "about", title: "About Us", type: "custom" },
      { slug: "contact", title: "Contact", type: "contact" },
    ],
    defaultContent: {
      logo_text: "TechBrand",
      hero_title: "Professional Electronics Manufacturer",
      hero_desc: "10+ years experience in consumer electronics. OEM/ODM welcome.",
      cta_text: "View Products",
      about_title: "About Us",
      about_text: "We are a leading manufacturer of consumer electronics, serving clients in 50+ countries. Our factory covers 10,000 sqm with ISO 9001 certification.",
      contact_email: "sales@example.com",
      contact_phone: "+86 755 1234 5678",
      contact_address: "Shenzhen, Guangdong, China",
      footer_text: "© 2024 TechBrand. All rights reserved.",
    },
    components: ["inquiry-form", "whatsapp-btn"],
    colors: { primary: "#2563eb", secondary: "#7c3aed", accent: "#10b981", background: "#ffffff", text: "#1f2937" },
    font: "Inter",
  },
  {
    id: "fashion-export",
    name: "服装服饰外贸站",
    description: "适合服装、鞋帽、箱包、配饰出口企业",
    category: "fashion",
    template: "product-showcase",
    pages: [
      { slug: "index", title: "首页", type: "custom" },
      { slug: "products", title: "Collections", type: "product-list" },
      { slug: "about", title: "Our Story", type: "custom" },
      { slug: "contact", title: "Contact", type: "contact" },
    ],
    defaultContent: {
      logo_text: "FashionCo",
      hero_title: "Premium Fashion Manufacturer",
      hero_desc: "Custom clothing manufacturing for global brands. MOQ from 100 pcs.",
      cta_text: "Browse Collections",
      about_title: "Our Story",
      about_text: "With 15 years of experience in garment manufacturing, we provide high-quality OEM/ODM services for fashion brands worldwide.",
      contact_email: "orders@example.com",
      contact_phone: "+86 571 8765 4321",
      contact_address: "Hangzhou, Zhejiang, China",
      footer_text: "© 2024 FashionCo. All rights reserved.",
    },
    components: ["inquiry-form", "whatsapp-btn"],
    colors: { primary: "#ea580c", secondary: "#db2777", accent: "#f59e0b", background: "#fffbeb", text: "#1f2937" },
    font: "Noto Sans SC",
  },
  {
    id: "home-furniture",
    name: "家居家具外贸站",
    description: "适合家具、家居用品、装饰品出口企业",
    category: "home",
    template: "brand-elegant",
    pages: [
      { slug: "index", title: "首页", type: "custom" },
      { slug: "products", title: "Products", type: "product-list" },
      { slug: "about", title: "About", type: "custom" },
      { slug: "contact", title: "Contact", type: "contact" },
    ],
    defaultContent: {
      logo_text: "HOME STYLE",
      hero_title: "Crafting Beautiful Spaces",
      hero_desc: "Premium furniture and home decor manufacturer since 2005",
      cta_text: "Explore Collection",
      about_title: "Our Craft",
      about_text: "We combine traditional craftsmanship with modern design to create furniture pieces that transform spaces. Serving 30+ countries with quality and elegance.",
      contact_email: "wholesale@example.com",
      contact_phone: "+86 512 3456 7890",
      contact_address: "Suzhou, Jiangsu, China",
      footer_text: "© 2024 HOME STYLE. All rights reserved.",
    },
    components: ["inquiry-form", "whatsapp-btn"],
    colors: { primary: "#d4d4d8", secondary: "#a1a1aa", accent: "#fbbf24", background: "#18181b", text: "#fafafa" },
    font: "Playfair Display",
  },
  {
    id: "beauty-skincare",
    name: "美妆护肤外贸站",
    description: "适合化妆品、护肤品、美容工具出口企业",
    category: "beauty",
    template: "landing-app",
    pages: [
      { slug: "index", title: "首页", type: "custom" },
      { slug: "products", title: "Products", type: "product-list" },
      { slug: "about", title: "About", type: "custom" },
      { slug: "contact", title: "Contact", type: "contact" },
    ],
    defaultContent: {
      logo_text: "BeautyLab",
      hero_title: "Natural Beauty, Global Reach",
      hero_desc: "Certified cosmetics manufacturer. FDA/CE approved products.",
      cta_text: "View Products",
      about_title: "About BeautyLab",
      about_text: "We specialize in natural cosmetics manufacturing with GMP-certified facilities. Serving beauty brands across 40+ countries.",
      contact_email: "info@example.com",
      contact_phone: "+86 20 9876 5432",
      contact_address: "Guangzhou, Guangdong, China",
      footer_text: "© 2024 BeautyLab. All rights reserved.",
    },
    components: ["inquiry-form", "whatsapp-btn"],
    colors: { primary: "#9333ea", secondary: "#ec4899", accent: "#06b6d4", background: "#faf5ff", text: "#1f2937" },
    font: "Noto Sans SC",
  },
  {
    id: "machinery-industrial",
    name: "机械工业外贸站",
    description: "适合机械设备、工业配件、五金工具出口企业",
    category: "industrial",
    template: "brand-minimal",
    pages: [
      { slug: "index", title: "首页", type: "custom" },
      { slug: "products", title: "Products", type: "product-list" },
      { slug: "about", title: "About", type: "custom" },
      { slug: "contact", title: "Contact Us", type: "contact" },
    ],
    defaultContent: {
      logo_text: "InduTech",
      hero_title: "Reliable Industrial Solutions",
      hero_desc: "Professional machinery manufacturer with 20+ years experience. ISO 9001 & CE certified.",
      cta_text: "Our Products",
      about_title: "About InduTech",
      about_text: "We are a leading manufacturer of industrial machinery and equipment, serving clients in 60+ countries with reliable and efficient solutions.",
      contact_email: "sales@example.com",
      contact_phone: "+86 532 1111 2222",
      contact_address: "Qingdao, Shandong, China",
      footer_text: "© 2024 InduTech. All rights reserved.",
    },
    components: ["inquiry-form", "whatsapp-btn"],
    colors: { primary: "#1e40af", secondary: "#374151", accent: "#dc2626", background: "#ffffff", text: "#1f2937" },
    font: "Inter",
  },
];

// 获取 Blueprint 列表
export function getBlueprints(): Blueprint[] {
  return blueprints;
}

// 按分类获取
export function getBlueprintsByCategory(category: string): Blueprint[] {
  if (category === "all") return blueprints;
  return blueprints.filter((b) => b.category === category);
}

// 获取分类列表
export function getBlueprintCategories(): { id: string; name: string }[] {
  return [
    { id: "all", name: "全部" },
    { id: "electronics", name: "电子数码" },
    { id: "fashion", name: "服装服饰" },
    { id: "home", name: "家居家具" },
    { id: "beauty", name: "美妆护肤" },
    { id: "industrial", name: "机械工业" },
  ];
}
