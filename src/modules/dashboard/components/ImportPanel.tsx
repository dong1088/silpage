import { useState } from "react";
import { useProjectStore } from "../../../shared/stores/projectStore";
import { useContentStore } from "../../../shared/stores/contentStore";

interface ImportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onImported: (siteId: string) => void;
}

export function ImportPanel({ isOpen, onClose, onImported }: ImportPanelProps) {
  const { createProject } = useProjectStore();
  const { setContent } = useContentStore();

  const [importType, setImportType] = useState<"folder" | "zip" | "url">("folder");
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImportFromFolder = async () => {
    setIsImporting(true);
    setError(null);

    try {
      // 使用 Tauri 文件对话框选择文件夹
      const { open } = await import("@tauri-apps/plugin-dialog");
      const selected = await open({
        directory: true,
        multiple: false,
        title: "选择 Astro 项目文件夹",
      });

      if (!selected) {
        setIsImporting(false);
        return;
      }

      const folderPath = selected as string;

      // 读取项目信息
      const { invoke } = await import("@tauri-apps/api/core");
      const result = await invoke<{
        success: boolean;
        name?: string;
        html?: string;
        css?: string;
        error?: string;
      }>("import_astro_project", { path: folderPath });

      if (!result.success) {
        setError(result.error || "导入失败");
        setIsImporting(false);
        return;
      }

      // 创建站点
      const site = await createProject({
        name: result.name || "导入的站点",
        description: `从 ${folderPath} 导入`,
        template: "custom",
      });

      // 保存内容
      if (result.html) {
        setContent(site.id, "html", result.html);
      }
      if (result.css) {
        setContent(site.id, "css", result.css);
      }

      setIsImporting(false);
      onImported(site.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "导入失败");
      setIsImporting(false);
    }
  };

  const handleImportFromZip = async () => {
    setIsImporting(true);
    setError(null);

    try {
      const { open } = await import("@tauri-apps/plugin-dialog");
      const selected = await open({
        multiple: false,
        title: "选择 ZIP 文件",
        filters: [
          {
            name: "ZIP 文件",
            extensions: ["zip"],
          },
        ],
      });

      if (!selected) {
        setIsImporting(false);
        return;
      }

      // TODO: 解压 ZIP 并导入
      setError("ZIP 导入功能开发中");
      setIsImporting(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "导入失败");
      setIsImporting(false);
    }
  };

  const handleImportFromUrl = async () => {
    const url = prompt("请输入 GitHub 仓库地址：");
    if (!url) return;

    setIsImporting(true);
    setError(null);

    try {
      // TODO: 从 URL 克隆并导入
      setError("URL 导入功能开发中");
      setIsImporting(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "导入失败");
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="rounded-xl shadow-xl w-full max-w-md mx-4" style={{ background: "var(--surface)" }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>导入站点</h2>
            <button onClick={onClose} className="p-2 rounded-lg transition hover:opacity-70" style={{ color: "var(--text-secondary)" }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            <button onClick={handleImportFromFolder} disabled={isImporting} className="w-full p-4 border rounded-lg text-left transition disabled:opacity-50" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📁</span>
                <div>
                  <div className="font-medium">从文件夹导入</div>
                  <div className="text-sm" style={{ color: "var(--text-secondary)" }}>选择本地项目文件夹</div>
                </div>
              </div>
            </button>
            <button onClick={handleImportFromZip} disabled={isImporting} className="w-full p-4 border rounded-lg text-left transition disabled:opacity-50" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📦</span>
                <div>
                  <div className="font-medium">从 ZIP 导入</div>
                  <div className="text-sm" style={{ color: "var(--text-secondary)" }}>导入压缩的项目文件</div>
                </div>
              </div>
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-lg text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
              {error}
            </div>
          )}

          {isImporting && (
            <div className="mt-4 text-center" style={{ color: "var(--text-secondary)" }}>
              <div className="animate-spin inline-block w-6 h-6 border-2 border-t-transparent rounded-full mb-2" style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }} />
              <div>导入中...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
