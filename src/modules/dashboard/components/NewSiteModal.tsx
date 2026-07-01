import { useState } from "react";
import { Modal, Button, Input } from "@heroui/react";
import { Template, type Blueprint } from "../../../shared/types";
import { TemplateSelector } from "../../design/components/TemplateSelector";
import { useToast } from "../../../shared/components/Toast";
import { getBlueprints, getBlueprintCategories } from "../../../data/blueprints";

interface NewSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; template: string }) => Promise<any>;
  onApplyBlueprint?: (blueprint: Blueprint) => void;
}

export function NewSiteModal({ isOpen, onClose, onSubmit, onApplyBlueprint }: NewSiteModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [bpCategory, setBpCategory] = useState("all");
  const [mode, setMode] = useState<"template" | "blueprint">("blueprint");

  const blueprints = getBlueprints();
  const categories = getBlueprintCategories();
  const filteredBps = bpCategory === "all" ? blueprints : blueprints.filter((b) => b.category === bpCategory);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    if (mode === "template" && !selectedTemplate) return;
    if (mode === "blueprint" && !selectedBlueprint) return;

    setIsCreating(true);
    try {
      const templateId = mode === "blueprint" ? selectedBlueprint!.template : selectedTemplate!.id;
      await onSubmit({ name, description, template: templateId });
      if (mode === "blueprint" && selectedBlueprint && onApplyBlueprint) {
        onApplyBlueprint(selectedBlueprint);
      }
      setName("");
      setDescription("");
      setSelectedTemplate(null);
      setSelectedBlueprint(null);
      onClose();
    } catch (err) {
      console.error("创建站点失败:", err);
      toast("创建站点失败：" + (err instanceof Error ? err.message : String(err)), "error");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <Modal>
        <Modal.Backdrop isOpen={isOpen} onOpenChange={onClose}>
          <Modal.Container>
            <Modal.Dialog>
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>新建站点</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--text)" }}>站点名称 *</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="我的品牌官网" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--text)" }}>站点描述</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="简单描述你的站点..." rows={2} className="w-full px-3 py-2 border rounded-lg" style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </div>

                  {/* 模式切换 */}
                  <div className="flex gap-2">
                    <button onClick={() => setMode("blueprint")} className="flex-1 px-3 py-2 text-sm rounded-lg border transition" style={{ background: mode === "blueprint" ? "var(--primary)" : "transparent", color: mode === "blueprint" ? "var(--primary-foreground)" : "var(--text-secondary)", borderColor: mode === "blueprint" ? "var(--primary)" : "var(--border)" }}>
                      🏭 行业方案
                    </button>
                    <button onClick={() => setMode("template")} className="flex-1 px-3 py-2 text-sm rounded-lg border transition" style={{ background: mode === "template" ? "var(--primary)" : "transparent", color: mode === "template" ? "var(--primary-foreground)" : "var(--text-secondary)", borderColor: mode === "template" ? "var(--primary)" : "var(--border)" }}>
                      🎨 选模板
                    </button>
                  </div>

                  {/* Blueprint 选择 */}
                  {mode === "blueprint" && (
                    <div>
                      <div className="flex gap-1 mb-3 flex-wrap">
                        {categories.map((cat) => (
                          <button key={cat.id} onClick={() => setBpCategory(cat.id)} className="px-2 py-1 text-xs rounded-full transition" style={{ background: bpCategory === cat.id ? "var(--primary)" : "var(--bg-secondary)", color: bpCategory === cat.id ? "var(--primary-foreground)" : "var(--text-secondary)" }}>
                            {cat.name}
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                        {filteredBps.map((bp) => (
                          <button key={bp.id} onClick={() => { setSelectedBlueprint(bp); setSelectedTemplate(null); }} className="p-3 text-left border rounded-lg transition" style={{ borderColor: selectedBlueprint?.id === bp.id ? "var(--primary)" : "var(--border)", background: selectedBlueprint?.id === bp.id ? "var(--bg-secondary)" : "var(--surface)" }}>
                            <div className="font-medium text-sm" style={{ color: "var(--text)" }}>{bp.name}</div>
                            <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{bp.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 模板选择 */}
                  {mode === "template" && (
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>选择模板 *</label>
                      {selectedTemplate ? (
                        <div className="border rounded-lg p-4 flex items-center justify-between" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
                          <div>
                            <div className="font-medium" style={{ color: "var(--text)" }}>{selectedTemplate.name}</div>
                            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>{selectedTemplate.description}</div>
                          </div>
                          <Button size="sm" variant="ghost" onPress={() => setShowTemplateSelector(true)} style={{ color: "var(--primary)" }}>更换</Button>
                        </div>
                      ) : (
                        <Button variant="outline" className="w-full" onPress={() => setShowTemplateSelector(true)}>点击选择模板</Button>
                      )}
                    </div>
                  )}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" slot="close">取消</Button>
                <Button
                  onPress={handleSubmit}
                  isDisabled={!name.trim() || (mode === "template" ? !selectedTemplate : !selectedBlueprint) || isCreating}
                >
                  {isCreating ? "创建中..." : "创建"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <TemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelect={setSelectedTemplate}
      />
    </>
  );
}
