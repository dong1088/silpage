import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import { useProjectStore } from "../shared/stores/projectStore";
import { SiteCard } from "../modules/dashboard/components/SiteCard";
import { NewSiteModal } from "../modules/dashboard/components/NewSiteModal";
import { ImportPanel } from "../modules/dashboard/components/ImportPanel";
import { useConfirm } from "../shared/hooks/useConfirm";

export function DashboardPage() {
  const navigate = useNavigate();
  const { projects, init, isInitialized, isLoading, createProject, deleteProject } = useProjectStore();
  const [showNewSiteModal, setShowNewSiteModal] = useState(false);
  const [showImportPanel, setShowImportPanel] = useState(false);
  const { confirm, ConfirmDialog } = useConfirm();

  useEffect(() => {
    if (!isInitialized) {
      init();
    }
  }, [isInitialized, init]);

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "删除站点",
      message: "确定要删除这个站点吗？所有页面和内容都将被删除，此操作不可撤销。",
      confirmText: "删除",
      danger: true,
    });
    if (ok) {
      try {
        await deleteProject(id);
      } catch (err) {
        console.error("删除站点失败:", err);
      }
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/site/${id}`);
  };

  const deployedCount = projects.filter((s) => s.status === "deployed").length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div
            className="animate-spin inline-block w-8 h-8 border-2 border-t-transparent rounded-full mb-3"
            style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }}
          />
          <p style={{ color: "var(--text-secondary)" }}>加载项目...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 pb-24">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>总站点数</p>
              <p className="text-3xl font-bold mt-1" style={{ color: "var(--text)" }}>{projects.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--primary)", opacity: 0.1 }}>
              <svg className="w-6 h-6" style={{ color: "var(--primary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>
        <div className="rounded-xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>已部署</p>
              <p className="text-3xl font-bold mt-1" style={{ color: "var(--text)" }}>{deployedCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--primary)", opacity: 0.1 }}>
              <svg className="w-6 h-6" style={{ color: "var(--primary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="rounded-xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>草稿</p>
              <p className="text-3xl font-bold mt-1" style={{ color: "var(--text)" }}>{projects.length - deployedCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--primary)", opacity: 0.1 }}>
              <svg className="w-6 h-6" style={{ color: "var(--primary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>我的站点</h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>管理你的所有网站项目</p>
        </div>
        <div className="flex gap-3">
          <Button variant="primary" onPress={() => setShowNewSiteModal(true)}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新建站点
          </Button>
          <Button variant="outline" onPress={() => setShowImportPanel(true)}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            导入站点
          </Button>
        </div>
      </div>

      {/* Site Grid */}
      {projects.length === 0 ? (
        <div className="rounded-xl border p-16 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "var(--primary)", opacity: 0.1 }}>
            <svg className="w-10 h-10" style={{ color: "var(--primary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text)" }}>还没有站点</h3>
          <p className="mb-6 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
            点击"新建站点"开始创建你的第一个网站，数据将保存在本地电脑上
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="primary" onPress={() => setShowNewSiteModal(true)}>
              新建站点
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <SiteCard
              key={project.id}
              site={{
                id: project.id,
                name: project.name,
                description: project.description,
                template: project.template,
                status: project.status,
                deployUrl: project.deployUrl,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
              }}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <NewSiteModal isOpen={showNewSiteModal} onClose={() => setShowNewSiteModal(false)} onSubmit={createProject} />
      <ImportPanel isOpen={showImportPanel} onClose={() => setShowImportPanel(false)} onImported={handleEdit} />
      {ConfirmDialog}
    </div>
  );
}
