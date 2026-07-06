/**
 * templateProcessor.ts
 * 处理 HTML/CSS → Astro 注入
 * 将 data-editable 标记的内容替换为最终值，并生成 .astro 兼容的组件片段
 */

import { escapeHtml, sanitizeUrl } from "../shared/utils/helpers";

export interface ProcessedTemplate {
  html: string;
  css: string;
  /** 提取到的可编辑区域定义（用于内容绑定） */
  editableRegions: EditableRegionDef[];
}

export interface EditableRegionDef {
  key: string;
  type: "text" | "image" | "link";
  label: string;
  defaultValue: string;
}

/**
 * 将 data-editable 内容替换到 HTML 中（生成时静态替换）
 * 与 contentBinding.ts 中的 applyContentToHtml 功能相同，
 * 但这里是生成时调用，不依赖 DOM
 */
export function applyContentToHtml(
  html: string,
  contents: Record<string, string>
): string {
  let result = html;

  for (const [key, value] of Object.entries(contents)) {
    if (!value) continue;

    // 替换 img 的 src
    const imgRegex = new RegExp(
      `(<img[^>]*data-editable="${key}"[^>]*src=")[^"]*(")`,
      "g"
    );
    result = result.replace(imgRegex, `$1${sanitizeUrl(value)}$2`);

    // 替换 a 的 href
    const linkRegex = new RegExp(
      `(<a[^>]*data-editable="${key}"[^>]*href=")[^"]*(")`,
      "g"
    );
    result = result.replace(linkRegex, `$1${sanitizeUrl(value)}$2`);

    // 替换文本内容
    const textRegex = new RegExp(
      `(data-editable="${key}"[^>]*>)([^<]*)(<)`,
      "g"
    );
    result = result.replace(textRegex, `$1${escapeHtml(value)}$3`);
  }

  return result;
}

/**
 * 提取所有 data-editable 区域定义
 * 用于生成内容管理界面
 */
export function extractEditableRegions(html: string): EditableRegionDef[] {
  const regions: EditableRegionDef[] = [];
  const seen = new Set<string>();

  const regex = /data-editable="([^"]+)"[^>]*>/g;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const key = match[1];
    if (seen.has(key)) continue;
    seen.add(key);

    const tagMatch = html
      .substring(Math.max(0, match.index - 200), match.index)
      .match(/<(\w+)\s*$/);
    const tag = tagMatch?.[1]?.toLowerCase() || "div";

    let type: EditableRegionDef["type"] = "text";
    if (tag === "img") type = "image";
    else if (tag === "a") type = "link";

    let defaultValue = "";
    if (type === "image") {
      const srcMatch = match[0].match(/src="([^"]+)"/);
      defaultValue = srcMatch?.[1] || "";
    } else {
      const afterTag = html.substring(match.index + match[0].length);
      const closeTag = afterTag.match(/^([^<]*)</);
      defaultValue = closeTag?.[1]?.trim() || "";
    }

    regions.push({
      key,
      type,
      label: keyToLabel(key),
      defaultValue,
    });
  }

  return regions;
}

  function keyToLabel(key: string): string {
  const labelMap: Record<string, string> = {
    site_name: "网站名称",
    company_name: "公司名称",
    logo_text: "Logo 文字",
    hero_title: "首屏标题",
    hero_subtitle: "首屏副标题",
    hero_desc: "首屏描述",
    hero_image: "首屏图片",
    cta_text: "按钮文字",
    cta_link: "按钮链接",
    about_title: "关于标题",
    about_text: "关于描述",
    about_image: "关于图片",
    service_title: "服务标题",
    service_1_title: "服务一标题",
    service_1_desc: "服务一描述",
    service_2_title: "服务二标题",
    service_2_desc: "服务二描述",
    service_3_title: "服务三标题",
    service_3_desc: "服务三描述",
    contact_email: "联系邮箱",
    contact_phone: "联系电话",
    contact_address: "联系地址",
    contact_form_title: "联系表单标题",
    footer_text: "页脚文字",
    copyright: "版权信息",
    product_title: "产品标题",
    product_desc: "产品描述",
    product_price: "产品价格",
    product_image: "产品图片",
    feature_title: "特性标题",
    feature_desc: "特性描述",
    nav_home: "导航-首页",
    nav_products: "导航-产品",
    nav_about: "导航-关于",
    nav_contact: "导航-联系",
    team_title: "团队标题",
    team_desc: "团队描述",
    testimonial_title: "评价标题",
    testimonial_text: "评价内容",
    testimonial_author: "评价作者",
    faq_title: "FAQ 标题",
    faq_question: "FAQ 问题",
    faq_answer: "FAQ 答案",
  };

  if (labelMap[key]) return labelMap[key];

  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * 清理 HTML 中的 data-editable 属性（输出时移除标记）
 */
export function stripEditableMarkers(html: string): string {
  return html.replace(/\s*data-editable="[^"]*"/g, "");
}

/**
 * 将页面 CSS 包装为 Astro <style> 块
 */
export function wrapCss(css: string, isGlobal: boolean = true): string {
  if (!css) return "";
  if (isGlobal) {
    return `<style is:global>\n${css}\n</style>`;
  }
  return `<style>\n${css}\n</style>`;
}