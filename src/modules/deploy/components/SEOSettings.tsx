import { useState } from "react";
import { Button } from "@heroui/react";
import { useContentStore } from "../../../shared/stores/contentStore";
import { useProjectStore } from "../../../shared/stores/projectStore";
import { useToast } from "../../../shared/components/Toast";
import { AIAssist } from "../../../shared/components/AIAssist";
import { runPreDeployChecks } from "../../../services/seoGenerator";

interface SEOSettingsProps {
  siteId: string;
}

export function SEOSettings({ siteId }: SEOSettingsProps) {
  const { getContent, setContent } = useContentStore();
  const { currentProject } = useProjectStore();
  const { toast } = useToast();

  const [title, setTitle] = useState(getContent(siteId, "seo_title") || "");
  const [description, setDescription] = useState(getContent(siteId, "seo_description") || "");
  const [keywords, setKeywords] = useState(getContent(siteId, "seo_keywords") || "");
  const [ogImage, setOgImage] = useState(getContent(siteId, "seo_og_image") || "");
  const [analyticsId, setAnalyticsId] = useState(getContent(siteId, "seo_analytics_id") || "");

  const handleSave = () => {
    setContent(siteId, "seo_title", title);
    setContent(siteId, "seo_description", description);
    setContent(siteId, "seo_keywords", keywords);
    setContent(siteId, "seo_og_image", ogImage);
    setContent(siteId, "seo_analytics_id", analyticsId);
    toast("SEO 设置已保存", "success");
  };

  // 部署前检查
  const checks = currentProject ? runPreDeployChecks(currentProject) : [];

  return (
    <div>
      <h3 className="font-medium mb-4" style={{ color: "var(--text)" }}>SEO 设置</h3>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm" style={{ color: "var(--text-secondary)" }}>页面标题</label>
            <AIAssist
              mode="improve"
              currentText={title}
              onResult={setTitle}
            />
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 text-sm"
            style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
            placeholder="我的品牌官网"
          />
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>建议 50-60 个字符</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm" style={{ color: "var(--text-secondary)" }}>页面描述</label>
            <AIAssist
              mode="improve"
              currentText={description}
              onResult={setDescription}
            />
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 text-sm"
            style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
            placeholder="描述你的网站..."
          />
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>建议 150-160 个字符</p>
        </div>

        <div>
          <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>关键词（逗号分隔）</label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 text-sm"
            style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
            placeholder="品牌, 产品, 服务"
          />
        </div>

        <div>
          <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>社交分享图片 URL</label>
          <input
            type="text"
            value={ogImage}
            onChange={(e) => setOgImage(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 text-sm"
            style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
            placeholder="https://example.com/og-image.jpg"
          />
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>建议尺寸 1200x630</p>
        </div>

        <div>
          <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>Google Analytics ID</label>
          <input
            type="text"
            value={analyticsId}
            onChange={(e) => setAnalyticsId(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 text-sm"
            style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
            placeholder="G-XXXXXXXXXX"
          />
        </div>

        <Button onPress={handleSave} className="w-full">保存 SEO 设置</Button>
      </div>

      {/* SEO 预览 */}
      <div className="mt-6 p-3 rounded-lg" style={{ background: "var(--bg-secondary)" }}>
        <h4 className="text-sm font-medium mb-2" style={{ color: "var(--text)" }}>搜索引擎预览</h4>
        <div className="border rounded-lg p-3" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="text-sm font-medium truncate" style={{ color: "#1a0dab" }}>
            {title || "页面标题"}
          </div>
          <div className="text-xs truncate" style={{ color: "#006621" }}>
            example.com
          </div>
          <div className="text-xs mt-1 line-clamp-2" style={{ color: "#545454" }}>
            {description || "页面描述将显示在这里..."}
          </div>
        </div>
      </div>

      {/* 部署前检查 */}
      {checks.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3" style={{ color: "var(--text)" }}>部署前检查</h4>
          <div className="space-y-2">
            {checks.map((check) => (
              <div key={check.name} className="flex items-center gap-2 text-sm">
                <span>{check.passed ? "✅" : "⚠️"}</span>
                <span className="font-medium" style={{ color: "var(--text)" }}>{check.name}</span>
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{check.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
