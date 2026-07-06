import { useState, useCallback, useEffect, useRef, useMemo, lazy, Suspense, type ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjectStore } from "../shared/stores/projectStore";
import { useDeployStore } from "../shared/stores/deployStore";
import { useContentStore } from "../shared/stores/contentStore";
import { templates } from "../data/templates";
import type { TemplateCustomization, Page } from "../shared/types";
import type { GrapesEditorHandle } from "../modules/editor/components/GrapesEditor";
import { ContentEditor } from "../modules/content/components/ContentEditor";
import { applyContentToHtml } from "../services/contentBinding";
import { ProductManager } from "../modules/content/components/ProductManager";
import { SEOSettings } from "../modules/deploy/components/SEOSettings";
import { DeployPanel } from "../modules/deploy/components/DeployPanel";
import { TemplateCustomizer } from "../modules/design/components/TemplateCustomizer";
import { InquiryManager } from "../modules/content/components/InquiryManager";
import { LanguageManager } from "../modules/content/components/LanguageManager";
import { deploy } from "../services/deploy";
import { useToast } from "../shared/components/Toast";

const GrapesEditor = lazy(() =>
  import("../modules/editor/components/GrapesEditor").then((m) => ({ default: m.GrapesEditor }))
);

type SiteTab = "editor" | "content" | "products" | "inquiries" | "i18n" | "seo" | "deploy" | "preview";

const tabs: { id: SiteTab; label: string; icon: ReactNode }[] = [
  { id: "editor", label: "编辑器", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> },
  { id: "content", label: "内容", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
  { id: "products", label: "产品", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
  { id: "inquiries", label: "询盘", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
  { id: "i18n", label: "多语言", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg> },
  { id: "seo", label: "SEO", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> },
  { id: "deploy", label: "部署", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
  { id: "preview", label: "预览", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> },
];

export function SitePage() {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loadProject, currentProject, savePageContent, addPage } = useProjectStore();
  const { getConfig, addHistory } = useDeployStore();
  const { getSiteContents } = useContentStore();
  const editorRef = useRef<GrapesEditorHandle>(null);

  const [activeTab, setActiveTab] = useState<SiteTab>("editor");
  const [activePageId, setActivePageId] = useState<string>("");
  const [customization, setCustomization] = useState<TemplateCustomization>({
    colors: { primary: "#6366f1", secondary: "#8b5cf6", accent: "#f59e0b", background: "#ffffff", text: "#1f2937" },
    font: "Inter",
  });
  const [showStylePanel, setShowStylePanel] = useState(false);

  const project = currentProject;
  const activePage = project?.pages.find((p) => p.id === activePageId);

  // 加载项目
  useEffect(() => {
    if (siteId) {
      loadProject(siteId);
    }
  }, [siteId, loadProject]);

  // 站点变化时重置 initRef（确保切换站点后重新初始化）
  useEffect(() => {
    initRef.current = false;
    setActivePageId("");
  }, [siteId]);

  // 项目加载后设置默认页面
  const initRef = useRef(false);
  useEffect(() => {
    if (!project || initRef.current) return;
    if (project.pages.length > 0) {
      setActivePageId(project.pages[0].id);
    }
    const template = templates.find((t) => t.id === project.template);
    if (template) {
      setCustomization({ colors: template.defaultColors, font: template.defaultFont });
    }
    initRef.current = true;
  }, [project]);

  // 站点不存在时跳回首页（加载完成后检查）
  useEffect(() => {
    if (siteId && project === null && !useProjectStore.getState().isLoading) {
      // 加载完成但项目不存在
      const timer = setTimeout(() => {
        const p = useProjectStore.getState().currentProject;
        if (!p) {
          toast("站点不存在", "error");
          navigate("/");
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [siteId, project, navigate, toast]);

  const handleSave = useCallback(async (html: string, css: string) => {
    if (!siteId || !activePageId) return;
    try {
      await savePageContent(siteId, activePageId, html, css);
      toast("保存成功！", "success");
    } catch (err) {
      toast("保存失败：" + (err instanceof Error ? err.message : ""), "error");
    }
  }, [siteId, activePageId, savePageContent, toast]);

  const handleDeploy = useCallback(async (html: string, css: string) => {
    if (!siteId) return;
    const config = getConfig(siteId);
    if (!config) {
      toast("请先配置部署设置", "error");
      setActiveTab("deploy");
      return;
    }
    const currentHtml = html || activePage?.html || "";
    const currentCss = css || activePage?.css || "";
    const result = await deploy(currentHtml, currentCss, config);
    addHistory({
      id: crypto.randomUUID(),
      siteId,
      platform: config.platform,
      url: result.url || "",
      status: result.success ? "success" : "failed",
      deployedAt: new Date().toISOString(),
    });
    if (result.success) {
      toast(`部署成功！访问地址：${result.url}`, "success");
    } else {
      toast(`部署失败：${result.error}`, "error");
    }
  }, [siteId, activePage, getConfig, addHistory, toast]);

  // 内容变更时同步到编辑器
  const handleContentChange = useCallback((key: string, value: string) => {
    editorRef.current?.updateContent({ [key]: value });
  }, []);

  // 获取当前页面的模板 HTML（用于内容绑定解析）
  const templateHtml = useMemo(() => {
    if (!project) return "";
    const template = templates.find((t) => t.id === project.template);
    return template?.html || "";
  }, [project]);

  // 构建预览 HTML
  const previewHtml = useMemo(() => {
    if (!activePage) return "";
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${activePage.title} | ${project?.name || ""}</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>${activePage.css}</style>
</head>
<body>
  ${activePage.html}
</body>
</html>`;
  }, [activePage, project?.name]);

  // 切换页面
  const handlePageSwitch = useCallback((pageId: string) => {
    setActivePageId(pageId);
  }, []);

  const [showPageNameInput, setShowPageNameInput] = useState(false);
  const [newPageName, setNewPageName] = useState("");

  // 新增页面
  const handleAddPage = useCallback(async () => {
    if (!siteId) return;
    setShowPageNameInput(true);
    setNewPageName("");
  }, [siteId]);

  const handleConfirmAddPage = useCallback(async () => {
    if (!siteId || !newPageName.trim()) return;
    const name = newPageName.trim();
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9一-鿿-]/g, "");
    await addPage(siteId, {
      slug: slug || "new-page",
      title: name,
      type: "custom",
      html: "<div class='min-h-screen p-8'><h1 class='text-3xl font-bold'>" + name + "</h1></div>",
      css: "",
      isGenerated: false,
    });
    setShowPageNameInput(false);
    setNewPageName("");
    toast("页面已添加", "success");
  }, [siteId, newPageName, addPage, toast]);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin inline-block w-8 h-8 border-2 border-t-transparent rounded-full" style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-73px)]">
      {/* 侧边导航 */}
      <aside className="w-16 border-r flex flex-col items-center py-4 gap-1 shrink-0" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <button onClick={() => navigate("/")} className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition hover:opacity-80" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }} title="返回主界面">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="w-12 h-12 rounded-lg flex flex-col items-center justify-center transition text-xs gap-0.5"
            style={{
              background: activeTab === tab.id ? "var(--primary)" : "transparent",
              color: activeTab === tab.id ? "var(--primary-foreground)" : "var(--text-secondary)",
            }}
            title={tab.label}
          >
            {tab.icon}
            <span className="text-[10px]">{tab.label}</span>
          </button>
        ))}

        <div className="mt-auto pt-4 border-t w-full flex justify-center" style={{ borderColor: "var(--border)" }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "var(--bg-secondary)", color: "var(--primary)" }} title={project.name}>
            {project.name.charAt(0)}
          </div>
        </div>
      </aside>

      {/* 内容区域 */}
      <main className="flex-1 overflow-hidden">
        {activeTab === "editor" && (
          <div className="flex h-full">
            <div className="flex-1 flex flex-col">
              {/* 页面选择 + 样式切换 */}
              <div className="border-b px-4 py-1.5 flex items-center gap-3 shrink-0" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                {/* 页面下拉 */}
                <select
                  value={activePageId}
                  onChange={(e) => handlePageSwitch(e.target.value)}
                  className="px-3 py-1 text-sm border rounded-lg"
                  style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text)" }}
                >
                  {project.pages.map((p) => (
                    <option key={p.id} value={p.id}>{p.title} ({p.slug})</option>
                  ))}
                </select>
                <button onClick={handleAddPage} className="px-2 py-1 text-xs rounded border hover:opacity-80" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }} title="新增页面">
                  + 新页面
                </button>
                {showPageNameInput && (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={newPageName}
                      onChange={(e) => setNewPageName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleConfirmAddPage()}
                      className="px-2 py-1 text-xs border rounded w-32"
                      style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
                      placeholder="页面名称"
                      autoFocus
                    />
                    <button onClick={handleConfirmAddPage} className="px-2 py-1 text-xs rounded" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>确定</button>
                    <button onClick={() => setShowPageNameInput(false)} className="px-2 py-1 text-xs rounded" style={{ color: "var(--text-secondary)" }}>取消</button>
                  </div>
                )}
                <div className="flex-1" />
                <button
                  onClick={() => setShowStylePanel(!showStylePanel)}
                  className="px-3 py-1 text-xs rounded transition flex items-center gap-1.5"
                  style={{ background: showStylePanel ? "var(--primary)" : "transparent", color: showStylePanel ? "var(--primary-foreground)" : "var(--text-secondary)" }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                  样式
                </button>
              </div>
              {/* 编辑器 */}
              <div className="flex-1 overflow-hidden">
                {activePage && (
                  <Suspense fallback={<div className="flex items-center justify-center h-full" style={{ color: "var(--text-secondary)" }}>加载编辑器...</div>}>
                    <GrapesEditor
                      ref={editorRef}
                      initialHtml={activePage.html}
                      initialCss={activePage.css}
                      customization={customization}
                      onSave={handleSave}
                    />
                  </Suspense>
                )}
              </div>
            </div>
            {showStylePanel && (
              <div className="w-72 border-l overflow-y-auto p-4" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm" style={{ color: "var(--text)" }}>样式自定义</h3>
                  <button onClick={() => setShowStylePanel(false)} className="p-1 rounded hover:opacity-70" style={{ color: "var(--text-secondary)" }}>✕</button>
                </div>
                <TemplateCustomizer customization={customization} onChange={setCustomization} />
              </div>
            )}
          </div>
        )}

        {activeTab === "content" && (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto">
              <ContentEditor siteId={siteId!} templateHtml={templateHtml} onContentChange={handleContentChange} />
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto">
              <ProductManager siteId={siteId!} />
            </div>
          </div>
        )}

        {activeTab === "inquiries" && (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto">
              <InquiryManager siteId={siteId!} />
            </div>
          </div>
        )}

        {activeTab === "i18n" && (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-xl mx-auto">
              <LanguageManager siteId={siteId!} />
            </div>
          </div>
        )}

        {activeTab === "seo" && (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-xl mx-auto">
              <SEOSettings siteId={siteId!} />
            </div>
          </div>
        )}

        {activeTab === "deploy" && (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-xl mx-auto">
              <DeployPanel siteId={siteId!} siteName={project.name} onDeploy={handleDeploy} />
            </div>
          </div>
        )}

        {activeTab === "preview" && (
          <div className="h-full">
            {activePage && (
              <iframe srcDoc={previewHtml} className="w-full h-full border-0" title="网站预览" sandbox="allow-scripts allow-forms" />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
