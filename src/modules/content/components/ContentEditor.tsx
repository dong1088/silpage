import { useState, useMemo } from "react";
import { Button } from "@heroui/react";
import { useContentStore } from "../../../shared/stores/contentStore";
import { useToast } from "../../../shared/components/Toast";
import { useConfirm } from "../../../shared/hooks/useConfirm";
import { AIAssist } from "../../../shared/components/AIAssist";
import { ImageUploader } from "./ImageUploader";
import { parseEditableRegions, EditableRegion } from "../../../services/contentBinding";

interface ContentEditorProps {
  siteId: string;
  templateHtml?: string;
  onContentChange?: (key: string, value: string) => void;
}

// 根据 key 生成分组名
function getGroupLabel(key: string): string {
  if (key.startsWith("hero_")) return "首屏区域";
  if (key.startsWith("nav_")) return "导航栏";
  if (key.startsWith("logo_")) return "品牌标识";
  if (key.startsWith("about_")) return "关于我们";
  if (key.startsWith("service_")) return "服务内容";
  if (key.startsWith("product_")) return "产品信息";
  if (key.startsWith("feature_")) return "功能特性";
  if (key.startsWith("contact_")) return "联系方式";
  if (key.startsWith("cta_")) return "行动号召";
  if (key.startsWith("footer_")) return "页脚";
  return "其他";
}

// 对可编辑区域按分组排序
function groupRegions(regions: EditableRegion[]): Map<string, EditableRegion[]> {
  const groups = new Map<string, EditableRegion[]>();
  const order = ["品牌标识", "导航栏", "首屏区域", "关于我们", "服务内容", "产品信息", "功能特性", "行动号召", "联系方式", "页脚", "其他"];

  for (const region of regions) {
    const group = getGroupLabel(region.key);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push(region);
  }

  // 按预定义顺序排序
  const sorted = new Map<string, EditableRegion[]>();
  for (const key of order) {
    if (groups.has(key)) sorted.set(key, groups.get(key)!);
  }
  return sorted;
}

export function ContentEditor({ siteId, templateHtml, onContentChange }: ContentEditorProps) {
  const { setContent, getSiteContents, deleteContent } = useContentStore();
  const { toast } = useToast();
  const { confirm, ConfirmDialog } = useConfirm();
  const siteContents = getSiteContents(siteId);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newType, setNewType] = useState<"text" | "image">("text");

  // 解析模板可编辑区域
  const editableRegions = useMemo(() => {
    if (!templateHtml) return [];
    return parseEditableRegions(templateHtml);
  }, [templateHtml]);

  const groupedRegions = useMemo(() => groupRegions(editableRegions), [editableRegions]);

  // 获取某个 key 的当前值
  const getValue = (key: string, defaultValue: string): string => {
    const stored = siteContents.find((c) => c.key === key);
    return stored?.value || defaultValue;
  };

  const handleTemplateChange = (key: string, value: string, type: EditableRegion["type"]) => {
    setContent(siteId, key, value, type === "image" ? "image" : "text");
    onContentChange?.(key, value);
  };

  const handleAdd = () => {
    if (!newKey.trim()) {
      toast("请输入内容标识", "error");
      return;
    }
    setContent(siteId, newKey, newValue, newType);
    setNewKey("");
    setNewValue("");
    setShowAddForm(false);
  };

  const handleUpdate = (key: string, value: string) => {
    setContent(siteId, key, value);
    onContentChange?.(key, value);
  };

  const handleDelete = async (key: string) => {
    const ok = await confirm({ title: "删除内容", message: `确定要删除 "${key}" 吗？`, confirmText: "删除", danger: true });
    if (ok) deleteContent(siteId, key);
  };

  // 自定义内容（不在模板标记中的）
  const templateKeys = new Set(editableRegions.map((r) => r.key));
  const customContents = siteContents.filter((c) => !templateKeys.has(c.key));

  return (
    <div>
      <h3 className="font-medium mb-4" style={{ color: "var(--text)" }}>内容管理</h3>

      {/* 模板内容表单 */}
      {editableRegions.length > 0 && (
        <div className="space-y-4 mb-6">
          {Array.from(groupedRegions.entries()).map(([group, regions]) => (
            <div key={group}>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: "var(--primary)", borderColor: "var(--border)" }}>
                {group}
              </h4>
              <div className="space-y-3">
                {regions.map((region) => {
                  const currentValue = getValue(region.key, region.defaultValue);

                  if (region.type === "image") {
                    return (
                      <div key={region.key}>
                        <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                          {region.label}
                        </label>
                        <ImageUploader
                          currentImage={currentValue}
                          onUpload={(url) => handleTemplateChange(region.key, url, "image")}
                        />
                      </div>
                    );
                  }

                  // 文本/链接：短文本用 input，长文本用 textarea
                  const isLong = region.defaultValue.length > 30 || region.key.includes("desc") || region.key.includes("text");
                  return (
                    <div key={region.key}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                          {region.label}
                        </label>
                        {region.type === "text" && (
                          <div className="flex gap-1">
                            <AIAssist
                              mode="translate"
                              currentText={currentValue}
                              onResult={(text) => handleTemplateChange(region.key, text, "text")}
                            />
                            {isLong && (
                              <AIAssist
                                mode="improve"
                                currentText={currentValue}
                                onResult={(text) => handleTemplateChange(region.key, text, "text")}
                              />
                            )}
                          </div>
                        )}
                      </div>
                      {isLong ? (
                        <textarea
                          value={currentValue}
                          onChange={(e) => handleTemplateChange(region.key, e.target.value, "text")}
                          rows={2}
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2"
                          style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
                        />
                      ) : (
                        <input
                          type="text"
                          value={currentValue}
                          onChange={(e) => handleTemplateChange(region.key, e.target.value, "text")}
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2"
                          style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 分隔线 */}
      {editableRegions.length > 0 && (
        <div className="border-t my-4" style={{ borderColor: "var(--border)" }} />
      )}

      {/* 自定义内容 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>自定义内容</h4>
          <Button size="sm" variant="ghost" onPress={() => setShowAddForm(true)}>
            + 添加
          </Button>
        </div>

        {showAddForm && (
          <div className="border rounded-lg p-4 mb-4" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>内容标识</label>
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="w-full px-3 py-2 border rounded text-sm"
                  placeholder="my_custom_key"
                  style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>类型</label>
                <div className="flex gap-2">
                  <Button size="sm" variant={newType === "text" ? "primary" : "ghost"} onPress={() => setNewType("text")}>文本</Button>
                  <Button size="sm" variant={newType === "image" ? "primary" : "ghost"} onPress={() => setNewType("image")}>图片</Button>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>内容</label>
                {newType === "text" ? (
                  <textarea
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border rounded text-sm"
                    style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                ) : (
                  <ImageUploader onUpload={setNewValue} />
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onPress={() => setShowAddForm(false)}>取消</Button>
                <Button onPress={handleAdd}>添加</Button>
              </div>
            </div>
          </div>
        )}

        {customContents.length > 0 && (
          <div className="space-y-2">
            {customContents.map((content) => (
              <div key={content.id} className="border rounded-lg p-3" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono px-2 py-1 rounded" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
                    {content.key}
                  </span>
                  <Button size="sm" variant="ghost" onPress={() => handleDelete(content.key)} className="text-red-600">删除</Button>
                </div>
                {content.type === "image" ? (
                  <ImageUploader currentImage={content.value} onUpload={(url) => handleUpdate(content.key, url)} />
                ) : (
                  <textarea
                    value={content.value}
                    onChange={(e) => handleUpdate(content.key, e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border rounded text-sm"
                    style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {customContents.length === 0 && !showAddForm && (
          <p className="text-xs text-center py-4" style={{ color: "var(--text-secondary)" }}>
            暂无自定义内容
          </p>
        )}
      </div>
      {ConfirmDialog}
    </div>
  );
}
