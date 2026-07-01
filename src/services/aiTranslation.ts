// AI 翻译服务 — 通过 API 翻译内容
// 支持 OpenAI / Claude / 自定义 API

import { callAI, type AIConfig } from "../shared/utils/helpers";

export type TranslationConfig = AIConfig;

// 语言代码 → 语言名称
export const LANGUAGES: Record<string, string> = {
  zh: "中文",
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  ja: "日本語",
  ko: "한국어",
  ar: "العربية",
  pt: "Português",
  ru: "Русский",
  it: "Italiano",
  th: "ไทย",
  vi: "Tiếng Việt",
  tr: "Türkçe",
  nl: "Nederlands",
};

// 翻译一批内容
export async function translateBatch(
  contents: Record<string, string>,
  fromLang: string,
  toLang: string,
  config: TranslationConfig
): Promise<Record<string, string>> {
  const fromName = LANGUAGES[fromLang] || fromLang;
  const toName = LANGUAGES[toLang] || toLang;

  const entries = Object.entries(contents);
  if (entries.length === 0) return {};

  // 构建翻译 prompt
  const sourceText = entries.map(([key, value]) => `${key}: ${value}`).join("\n");
  const prompt = `Translate the following ${fromName} text to ${toName}.
Keep the format as "key: translated_value", one per line.
Only translate the values, keep the keys unchanged.
Do not add any explanation.

${sourceText}`;

  const result = await callAI(prompt, config);

  // 解析结果
  const translated: Record<string, string> = {};
  for (const line of result.split("\n")) {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      if (entries.some(([k]) => k === key)) {
        translated[key] = value;
      }
    }
  }

  // 填充未翻译的条目
  for (const [key, value] of entries) {
    if (!translated[key]) {
      translated[key] = value;
    }
  }

  return translated;
}

// 翻译单个文本
export async function translateText(
  text: string,
  fromLang: string,
  toLang: string,
  config: TranslationConfig
): Promise<string> {
  const fromName = LANGUAGES[fromLang] || fromLang;
  const toName = LANGUAGES[toLang] || toLang;

  const prompt = `Translate the following ${fromName} text to ${toName}. Only output the translation, no explanation.\n\n${text}`;
  return callAI(prompt, config);
}

// 生成 SEO 元数据
export async function generateSEOMeta(
  title: string,
  content: string,
  keywords: string[],
  config: TranslationConfig
): Promise<{ title: string; description: string; keywords: string[] }> {
  const prompt = `Based on the following website content, generate SEO metadata in the same language.
Return in this exact format:
TITLE: [SEO title, 50-60 chars]
DESCRIPTION: [Meta description, 150-160 chars]
KEYWORDS: [5-8 keywords, comma separated]

Content title: ${title}
Content: ${content.substring(0, 500)}
Keywords: ${keywords.join(", ")}`;

  const result = await callAI(prompt, config);

  const titleMatch = result.match(/TITLE:\s*(.+)/);
  const descMatch = result.match(/DESCRIPTION:\s*(.+)/);
  const kwMatch = result.match(/KEYWORDS:\s*(.+)/);

  return {
    title: titleMatch?.[1]?.trim() || title,
    description: descMatch?.[1]?.trim() || "",
    keywords: kwMatch?.[1]?.split(",").map((k: string) => k.trim()) || keywords,
  };
}

// 生成产品描述
export async function generateProductDescription(
  productName: string,
  category: string,
  features: string[],
  language: string,
  config: TranslationConfig
): Promise<string> {
  const langName = LANGUAGES[language] || language;
  const prompt = `Write a professional product description in ${langName} for:
Product: ${productName}
Category: ${category}
Key features: ${features.join(", ")}

Write 2-3 paragraphs, professional tone, suitable for a B2B e-commerce website. Focus on quality, reliability, and value.`;

  return callAI(prompt, config);
}
