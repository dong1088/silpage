import { useState } from "react";
import { Button } from "@heroui/react";
import { useInquiryStore } from "../../../shared/stores/inquiryStore";
import { useConfirm } from "../../../shared/hooks/useConfirm";

interface InquiryManagerProps {
  siteId: string;
}

export function InquiryManager({ siteId }: InquiryManagerProps) {
  const { getSiteInquiries, markAsRead, deleteInquiry } = useInquiryStore();
  const { confirm, ConfirmDialog } = useConfirm();
  const inquiries = getSiteInquiries(siteId);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const filtered = inquiries.filter((i) => {
    if (filter === "unread") return !i.read;
    if (filter === "read") return i.read;
    return true;
  });

  const handleDelete = async (id: string) => {
    const ok = await confirm({ title: "删除询盘", message: "确定要删除这条询盘吗？", confirmText: "删除", danger: true });
    if (ok) deleteInquiry(id);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("zh-CN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium" style={{ color: "var(--text)" }}>
          询盘管理
          {inquiries.filter((i) => !i.read).length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
              {inquiries.filter((i) => !i.read).length}
            </span>
          )}
        </h3>
      </div>

      {/* 筛选 */}
      <div className="flex gap-2 mb-4">
        {(["all", "unread", "read"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1 text-xs rounded-full transition"
            style={{
              background: filter === f ? "var(--primary)" : "var(--bg-secondary)",
              color: filter === f ? "var(--primary-foreground)" : "var(--text-secondary)",
            }}
          >
            {f === "all" ? "全部" : f === "unread" ? "未读" : "已读"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12" style={{ color: "var(--text-secondary)" }}>
          <div className="text-4xl mb-3">📬</div>
          <p>暂无询盘</p>
          <p className="text-xs mt-1">部署网站后，客户通过表单提交的询盘会显示在这里</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inquiry) => (
            <div
              key={inquiry.id}
              className="border rounded-lg p-4 transition"
              style={{
                borderColor: inquiry.read ? "var(--border)" : "var(--primary)",
                background: inquiry.read ? "var(--surface)" : "var(--bg-secondary)",
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {!inquiry.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                  <span className="font-medium" style={{ color: "var(--text)" }}>
                    {inquiry.name}
                  </span>
                  {inquiry.productName && (
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
                      {inquiry.productName}
                    </span>
                  )}
                </div>
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {formatDate(inquiry.createdAt)}
                </span>
              </div>

              <div className="text-sm space-y-1 mb-3" style={{ color: "var(--text-secondary)" }}>
                <p>📧 {inquiry.email}</p>
                {inquiry.phone && <p>📱 {inquiry.phone}</p>}
                {inquiry.company && <p>🏢 {inquiry.company}</p>}
                <p className="mt-2" style={{ color: "var(--text)" }}>{inquiry.message}</p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.productName || "Inquiry")}`}
                  className="text-xs px-3 py-1 rounded hover:opacity-80"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  回复邮件
                </a>
                {!inquiry.read && (
                  <button
                    onClick={() => markAsRead(inquiry.id)}
                    className="text-xs px-3 py-1 rounded hover:opacity-80"
                    style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}
                  >
                    标为已读
                  </button>
                )}
                <button
                  onClick={() => handleDelete(inquiry.id)}
                  className="text-xs px-3 py-1 rounded hover:opacity-80 text-red-500"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {ConfirmDialog}
    </div>
  );
}
