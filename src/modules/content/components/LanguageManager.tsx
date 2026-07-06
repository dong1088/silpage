import { useState, useRef, useEffect } from "react";
import { Button } from "@heroui/react";
import { useProjectStore } from "../../../shared/stores/projectStore";
import { useContentStore } from "../../../shared/stores/contentStore";
import { useToast } from "../../../shared/components/Toast";
import { LANGUAGES, translateBatch, type TranslationConfig } from "../../../services/aiTranslation";

interface LanguageManagerProps {
  siteId: string;
}

export function LanguageManager({ siteId }: LanguageManagerProps) {
  const { currentProject, updateProject } = useProjectStore();
  const { getSiteContents } = useContentStore();
  const { toast } = useToast();

  const [newLang, setNewLang] = useState("");
  const [translatingLangs, setTranslatingLangs] = useState<Set<string>>(new Set());
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [apiConfig, setApiConfig] = useState<TranslationConfig>(() => {
    // 尝试从 localStorage 恢复 API Key
    try {
      const saved = localStorage.getItem("silpage-ai-config");
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...parsed };
      }
    } catch { /* ignore */ }
    return {
      provider: "openai",
      apiKey: "",
      apiUrl: "",
      model: "",
    };
  });

  // 持久化 API Key 到 localStorage
  const updateApiConfig = (config: TranslationConfig) => {
    setApiConfig(config);
    try {
      localStorage.setItem("silpage-ai-config", JSON.stringify(config));
    } catch { /* ignore */ }
  };

  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  if (!currentProject) return null;

  const languages = currentProject.languages || ["zh"];
  const defaultLang = currentProject.defaultLanguage || "zh";

  const availableLanguages = Object.entries(LANGUAGES).filter(
    ([code]) => !languages.includes(code)
  );

  const handleAddLanguage = () => {
    if (!newLang || languages.includes(newLang)) return;
    const updated = [...languages, newLang];
    updateProject(siteId, { languages: updated });
    setNewLang("");
    toast(`已添加 ${LANGUAGES[newLang]} 语言`, "success");
  };

  const handleRemoveLanguage = (lang: string) => {
    if (lang === defaultLang) {
      toast("不能删除默认语言", "error");
      return;
    }
    const updated = languages.filter((l) => l !== lang);
    updateProject(siteId, { languages: updated });
    toast(`已移除 ${LANGUAGES[lang]} 语言`, "success");
  };

  const handleTranslateAll = async (targetLang: string) => {
    if (!apiConfig.apiKey) {
      toast("请先配置 AI API Key", "error");
      setShowApiConfig(true);
      return;
    }

    setTranslatingLangs((prev) => new Set(prev).add(targetLang));
    try {
      // 获取所有内容
      const contents = getSiteContents(siteId);
      const contentMap: Record<string, string> = {};
      for (const c of contents) {
        if (c.type === "text" && c.value) {
          contentMap[c.key] = c.value;
        }
      }

      if (Object.keys(contentMap).length === 0) {
        toast('暂无内容需要翻译，请先在"内容管理"中填写内容', "info");
        return;
      }

      const translated = await translateBatch(contentMap, defaultLang, targetLang, apiConfig);

      if (!mountedRef.current) return;

      // 保存翻译结果
      const i18nKey = `i18n_${targetLang}`;
      const { setContent } = useContentStore.getState();
      for (const [key, value] of Object.entries(translated)) {
        setContent(siteId, `${i18nKey}_${key}`, value);
      }

      toast(`已翻译为 ${LANGUAGES[targetLang]}，共 ${Object.keys(translated).length} 条`, "success");
    } catch (err) {
      if (!mountedRef.current) return;
      toast("翻译失败：" + (err instanceof Error ? err.message : String(err)), "error");
    } finally {
      if (mountedRef.current) {
        setTranslatingLangs((prev) => {
          const next = new Set(prev);
          next.delete(targetLang);
          return next;
        });
      }
    }
  };

  return (
    <div>
      <h3 className="font-medium mb-4" style={{ color: "var(--text)" }}>多语言管理</h3>

      {/* 当前语言列表 */}
      <div className="space-y-2 mb-6">
        {languages.map((lang) => (
          <div
            key={lang}
            className="flex items-center justify-between p-3 rounded-lg border"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm" style={{ color: "var(--text)" }}>
                {LANGUAGES[lang] || lang}
              </span>
              <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
                {lang}
              </span>
              {lang === defaultLang && (
                <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-600">默认</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {lang !== defaultLang && (
                <>
                  <button
                    onClick={() => handleTranslateAll(lang)}
                    disabled={translatingLangs.has(lang)}
                    className="text-xs px-3 py-1 rounded hover:opacity-80"
                    style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                  >
                    {translatingLangs.has(lang) ? "翻译中..." : "AI 翻译"}
                  </button>
                  <button
                    onClick={() => handleRemoveLanguage(lang)}
                    className="text-xs px-2 py-1 rounded hover:opacity-80 text-red-500"
                  >
                    移除
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 添加语言 */}
      {availableLanguages.length > 0 && (
        <div className="flex gap-2 mb-6">
          <select
            value={newLang}
            onChange={(e) => setNewLang(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg text-sm"
            style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
          >
            <option value="">选择语言...</option>
            {availableLanguages.map(([code, name]) => (
              <option key={code} value={code}>{name} ({code})</option>
            ))}
          </select>
          <Button size="sm" onPress={handleAddLanguage} isDisabled={!newLang}>
            添加
          </Button>
        </div>
      )}

      {/* API 配置 */}
      <div className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
        <button
          onClick={() => setShowApiConfig(!showApiConfig)}
          className="text-sm font-medium mb-3 flex items-center gap-1"
          style={{ color: "var(--primary)" }}
        >
          ⚙️ AI 翻译配置
          <svg className={`w-4 h-4 transition ${showApiConfig ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showApiConfig && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>AI 服务商</label>
              <select
                value={apiConfig.provider}
                onChange={(e) => setApiConfig({ ...apiConfig, provider: e.target.value as TranslationConfig["provider"] })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
              >
                <option value="openai">OpenAI (GPT)</option>
                <option value="claude">Anthropic (Claude)</option>
                <option value="custom">自定义 API</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>API Key</label>
              <input
                type="password"
                value={apiConfig.apiKey}
                onChange={(e) => updateApiConfig({ ...apiConfig, apiKey: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
                placeholder="sk-..."
              />
            </div>
            {apiConfig.provider === "custom" && (
              <div>
                <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>API URL</label>
                <input
                  type="text"
                  value={apiConfig.apiUrl || ""}
                  onChange={(e) => updateApiConfig({ ...apiConfig, apiUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
                  placeholder="https://api.example.com/v1/chat/completions"
                />
              </div>
            )}
            <div>
              <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>模型（可选）</label>
              <input
                type="text"
                value={apiConfig.model || ""}
                onChange={(e) => updateApiConfig({ ...apiConfig, model: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
                placeholder="gpt-4o-mini / claude-haiku-4-5-20251001"
              />
            </div>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              API Key 会保存在浏览器本地存储中，方便下次使用
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
