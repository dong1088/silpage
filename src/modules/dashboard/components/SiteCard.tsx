import { Card, Button, Chip } from "@heroui/react";
import { SiteProject } from "../../../shared/types";

interface SiteCardProps {
  site: Pick<SiteProject, "id" | "name" | "description" | "template" | "status" | "deployUrl" | "createdAt" | "updatedAt">;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SiteCard({ site, onEdit, onDelete }: SiteCardProps) {
  const templateNames: Record<string, string> = {
    brand: "品牌官网",
    product: "产品展示",
    landing: "营销落地页",
    "brand-minimal": "简约品牌",
    "product-showcase": "产品展示",
    "landing-tech": "科技落地页",
    "brand-elegant": "优雅品牌",
    "landing-app": "App推广",
    custom: "自定义",
  };

  return (
    <div className="group hover:shadow-xl transition-all duration-300 overflow-hidden rounded-xl border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      {/* Preview Image */}
      <div className="relative aspect-video flex items-center justify-center overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
        <div className="absolute inset-0" style={{ background: "var(--primary)", opacity: 0.05 }} />
        <span className="text-6xl font-bold relative z-10" style={{ color: "var(--primary)", opacity: 0.3 }}>
          {site.name.charAt(0)}
        </span>
        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-20">
          <span className={`px-2 py-1 text-xs rounded-full ${
            site.status === "deployed" 
              ? "bg-green-100 text-green-700" 
              : "bg-gray-100 text-gray-600"
          }`}>
            {site.status === "deployed" ? "已部署" : "草稿"}
          </span>
        </div>
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 z-20">
          <button
            onClick={() => onEdit(site.id)}
            className="px-4 py-2 rounded-lg shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            编辑站点
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate text-lg" style={{ color: "var(--text)" }}>{site.name}</h3>
            <p className="text-sm mt-1 flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              {templateNames[site.template] || site.template}
            </p>
          </div>
          <button
            onClick={() => onDelete(site.id)}
            className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
            style={{ color: "var(--text-secondary)" }}
          >
            <svg className="w-4 h-4 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {site.description && (
          <p className="text-sm mt-2 line-clamp-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {site.description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {new Date(site.updatedAt).toLocaleDateString("zh-CN", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        <button
          onClick={() => onEdit(site.id)}
          className="text-sm font-medium hover:underline"
          style={{ color: "var(--primary)" }}
        >
          编辑
        </button>
      </div>
    </div>
  );
}
