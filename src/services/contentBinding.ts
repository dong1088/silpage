import { escapeHtml, sanitizeUrl } from "../shared/utils/helpers";

export interface EditableRegion {
  key: string;
  type: "text" | "image" | "link";
  label: string;
  defaultValue: string;
}

// 从 HTML 中解析所有 data-editable 标记
export function parseEditableRegions(html: string): EditableRegion[] {
  const regions: EditableRegion[] = [];
  const seen = new Set<string>();

  // 匹配 data-editable="xxx" 属性
  const regex = /data-editable="([^"]+)"[^>]*>/g;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const key = match[1];
    if (seen.has(key)) continue;
    seen.add(key);

    // 判断类型：根据标签名
    const tagMatch = html.substring(Math.max(0, match.index - 50), match.index).match(/<(\w+)\s*$/);
    const tag = tagMatch?.[1]?.toLowerCase() || "div";

    let type: EditableRegion["type"] = "text";
    if (tag === "img") type = "image";
    else if (tag === "a") type = "link";

    // 提取默认值
    let defaultValue = "";
    if (type === "image") {
      const srcMatch = match[0].match(/src="([^"]+)"/);
      defaultValue = srcMatch?.[1] || "";
    } else {
      // 提取标签内的文本内容
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

// 将 key 转为中文标签
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
    footer_text: "页脚文字",
    copyright: "版权信息",
    product_title: "产品标题",
    product_desc: "产品描述",
    feature_title: "特性标题",
    feature_desc: "特性描述",
    nav_home: "导航-首页",
    nav_products: "导航-产品",
    nav_about: "导航-关于",
    nav_contact: "导航-联系",
  };

  if (labelMap[key]) return labelMap[key];

  // 兜底：下划线转空格，首字母大写
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// 将内容数据应用到 HTML 字符串
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
    result = result.replace(imgRegex, `$1${value}$2`);

    // 替换 a 的 href
    const linkRegex = new RegExp(
      `(<a[^>]*data-editable="${key}"[^>]*href=")[^"]*(")`,
      "g"
    );
    result = result.replace(linkRegex, `$1${value}$2`);

    // 替换文本内容：匹配 data-editable="key">xxx<
    const textRegex = new RegExp(
      `(data-editable="${key}"[^>]*>)([^<]*)(<)`,
      "g"
    );
    result = result.replace(textRegex, `$1${escapeHtml(value)}$3`);
  }

  return result;
}

// 在 GrapeSJS 编辑器中更新内容
export function applyContentToEditor(
  editor: any,
  contents: Record<string, string>
): void {
  if (!editor) return;

  const wrapper = editor.DomComponents.getWrapper();
  if (!wrapper) return;

  // 递归查找所有带 data-editable 的组件
  function updateComponents(component: any) {
    const traits = component.get("traits");
    const editableTrait = traits?.find(
      (t: any) => t.get("name") === "data-editable"
    );

    if (editableTrait) {
      const key = editableTrait.get("value");
      if (key && contents[key] !== undefined) {
        const value = contents[key];
        const tag = component.get("tagName")?.toLowerCase();

        if (tag === "img") {
          const safeUrl = sanitizeUrl(value);
          if (safeUrl) component.set("src", safeUrl);
        } else if (tag === "a") {
          component.set("href", value);
          // 也更新链接文字（如果不是自己有 data-editable）
          if (!component.find(`[data-editable]`).length) {
            component.components(value);
          }
        } else {
          // 文本组件：更新内容
          component.components(value);
        }
      }
    }

    // 递归子组件
    const children = component.components();
    if (children) {
      children.forEach((child: any) => updateComponents(child));
    }
  }

  updateComponents(wrapper);
}

// 在 GrapeSJS 中标记可编辑组件（加 trait）
export function markEditableComponents(editor: any): void {
  if (!editor) return;

  const wrapper = editor.DomComponents.getWrapper();
  if (!wrapper) return;

  function markComponents(component: any) {
    const el = component.getEl();
    if (!el) return;

    const editableKey = el.getAttribute?.("data-editable");
    if (editableKey) {
      // 添加 trait 使 GrapeSJS 识别为可编辑
      const existingTraits = component.get("traits") || [];
      const hasTrait = existingTraits.some(
        (t: any) => t.get("name") === "data-editable"
      );

      if (!hasTrait) {
        component.addTrait({
          name: "data-editable",
          label: "内容标识",
          value: editableKey,
        });
      }
    }

    // 递归子组件
    const children = component.components();
    if (children) {
      children.forEach((child: any) => markComponents(child));
    }
  }

  markComponents(wrapper);
}
