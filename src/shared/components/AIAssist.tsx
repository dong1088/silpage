import { useState } from "react";
import { useAIConfigStore } from "../stores/aiConfigStore";
import { useToast } from "./Toast";
import { translateText } from "../../services/aiTranslation";
import { callAI } from "../utils/helpers";

interface AIAssistProps {
  onResult: (text: string) => void;
  currentText?: string;
  mode: "translate" | "generate" | "improve";
  context?: string;
}

export function AIAssist({ onResult, currentText, mode, context }: AIAssistProps) {
  const { config } = useAIConfigStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [targetLang, setTargetLang] = useState("en");

  const handleAction = async () => {
    if (!config?.apiKey) {
      toast("请先在多语言页面配置 AI API Key", "error");
      return;
    }

    setIsLoading(true);
    try {
      if (mode === "translate" && currentText) {
        const result = await translateText(currentText, "zh", targetLang, config);
        onResult(result);
        toast("翻译完成", "success");
      } else if (mode === "generate") {
        const prompt = context || "Write a professional website headline";
        const result = await callAI(prompt, config);
        onResult(result);
        toast("生成完成", "success");
      } else if (mode === "improve" && currentText) {
        const prompt = `Improve the following text for a professional e-commerce website. Keep the same language. Only output the improved text.\n\n${currentText}`;
        const result = await callAI(prompt, config);
        onResult(result);
        toast("优化完成", "success");
      }
    } catch (err) {
      toast("AI 处理失败：" + (err instanceof Error ? err.message : String(err)), "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {mode === "translate" && (
        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="px-1 py-0.5 text-xs border rounded"
          style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="ja">日本語</option>
          <option value="ko">한국어</option>
          <option value="ar">العربية</option>
          <option value="pt">Português</option>
          <option value="ru">Русский</option>
        </select>
      )}
      <button
        onClick={handleAction}
        disabled={isLoading}
        className="px-2 py-1 text-xs rounded hover:opacity-80 transition flex items-center gap-1"
        style={{ background: "var(--bg-secondary)", color: "var(--primary)" }}
        title={mode === "translate" ? "AI 翻译" : mode === "generate" ? "AI 生成" : "AI 优化"}
      >
        {isLoading ? (
          <span className="animate-spin">⏳</span>
        ) : (
          <span>✨</span>
        )}
        {mode === "translate" ? "翻译" : mode === "generate" ? "生成" : "优化"}
      </button>
    </div>
  );
}
