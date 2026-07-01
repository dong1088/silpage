// HTML 特殊字符转义
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// HTML 属性值转义
export function escapeAttr(str: string): string {
  return str.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// 货币符号
export function getCurrencySymbol(currency: string): string {
  const map: Record<string, string> = { CNY: "¥", USD: "$", EUR: "€", GBP: "£" };
  return map[currency] || "$";
}

export interface AIConfig {
  provider: "openai" | "claude" | "custom";
  apiKey: string;
  apiUrl?: string;
  model?: string;
}

// 调用 AI API（统一实现）
export async function callAI(prompt: string, config: AIConfig): Promise<string> {
  const { provider, apiKey, apiUrl, model } = config;

  if (provider === "openai" || provider === "custom") {
    const url = apiUrl || "https://api.openai.com/v1/chat/completions";
    const modelName = model || "gpt-4o-mini";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices?.[0]?.message?.content || "";
  }

  if (provider === "claude") {
    const url = apiUrl || "https://api.anthropic.com/v1/messages";
    const modelName = model || "claude-haiku-4-5-20251001";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: modelName,
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.content?.[0]?.text || "";
  }

  throw new Error(`Unsupported provider: ${provider}`);
}

// 输入清理：验证 URL 是否安全
export function sanitizeUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("data:image/")) return trimmed;
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) return trimmed;
  // 阻止 javascript: 等危险协议
  return "";
}

// 输入清理：清理文本内容（去除脚本标签）
export function sanitizeText(text: string): string {
  return text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
}
