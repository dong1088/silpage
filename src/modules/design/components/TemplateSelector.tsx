import { useState } from "react";
import { Modal, Button, Card } from "@heroui/react";
import { Template } from "../../../shared/types";
import { templates } from "../../../data/templates";

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: Template) => void;
}

export function TemplateSelector({ isOpen, onClose, onSelect }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const categories = [
    { id: "all", name: "全部" },
    { id: "brand", name: "品牌官网" },
    { id: "product", name: "产品展示" },
    { id: "landing", name: "营销落地页" },
  ];

  const filteredTemplates =
    selectedCategory === "all"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  const handleSelect = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate);
      onClose();
    }
  };

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={onClose}>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>选择模板</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <div className="flex gap-2 mb-4">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    size="sm"
                    variant={selectedCategory === cat.id ? "primary" : "ghost"}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition ${
                      selectedTemplate?.id === template.id
                        ? "ring-2 ring-offset-2"
                        : ""
                    }`}
                    style={{
                      background: "var(--surface)",
                      borderColor: selectedTemplate?.id === template.id ? "var(--primary)" : "var(--border)"
                    }}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="aspect-video flex items-center justify-center" style={{ background: "var(--bg-secondary)" }}>
                      <span className="text-4xl">
                        {template.category === "brand" && "🏢"}
                        {template.category === "product" && "🛍️"}
                        {template.category === "landing" && "🚀"}
                      </span>
                    </div>
                    <Card.Content>
                      <h3 className="font-medium text-sm" style={{ color: "var(--text)" }}>{template.name}</h3>
                      <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                        {template.description}
                      </p>
                    </Card.Content>
                  </Card>
                ))}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" slot="close">
                取消
              </Button>
              <Button
                onPress={handleSelect}
                isDisabled={!selectedTemplate}
              >
                使用此模板
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
