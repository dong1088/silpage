import { useState, useCallback } from "react";
import { Button } from "@heroui/react";
import { ProductInfo } from "../../../shared/types";
import { useContentStore } from "../../../shared/stores/contentStore";
import { useProjectStore } from "../../../shared/stores/projectStore";
import { useToast } from "../../../shared/components/Toast";
import { useConfirm } from "../../../shared/hooks/useConfirm";
import { ImageUploader } from "./ImageUploader";

interface ProductManagerProps {
  siteId: string;
}

export function ProductManager({ siteId }: ProductManagerProps) {
  const { products, addProduct, updateProduct, deleteProduct, getSiteProducts } =
    useContentStore();
  const { regenerateProductPages } = useProjectStore();
  const { toast } = useToast();
  const { confirm, ConfirmDialog } = useConfirm();
  const siteProducts = getSiteProducts(siteId);

  // 产品变更后自动重新生成产品页面
  const syncProductPages = useCallback(() => {
    const updated = getSiteProducts(siteId);
    regenerateProductPages(siteId, updated);
  }, [siteId, getSiteProducts, regenerateProductPages]);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductInfo | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    currency: "CNY",
    category: "",
    tags: "",
    sku: "",
    stock: 0,
  });
  const [productImage, setProductImage] = useState("");

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      currency: "CNY",
      category: "",
      tags: "",
      sku: "",
      stock: 0,
    });
    setProductImage("");
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product: ProductInfo) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      currency: product.currency,
      category: product.category,
      tags: product.tags.join(", "),
      sku: product.sku || "",
      stock: product.stock || 0,
    });
    setProductImage(product.images[0] || "");
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast("请输入产品名称", "error");
      return;
    }

    const productData = {
      siteId,
      name: formData.name,
      description: formData.description,
      price: formData.price,
      currency: formData.currency,
      images: productImage ? [productImage] : [],
      category: formData.category,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      sku: formData.sku || undefined,
      stock: formData.stock || undefined,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }

    syncProductPages();
    resetForm();
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({ title: "删除产品", message: "确定要删除这个产品吗？相关产品页面也会被删除。", confirmText: "删除", danger: true });
    if (ok) {
      deleteProduct(id);
      syncProductPages();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-700">产品管理</h3>
        <Button
          size="sm"
          onPress={() => setShowForm(true)}
        >
          + 添加产品
        </Button>
      </div>

      {showForm && (
        <div className="border rounded-lg p-4 mb-4 bg-gray-50">
          <h4 className="font-medium mb-3">
            {editingProduct ? "编辑产品" : "添加产品"}
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">产品名称 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                placeholder="输入产品名称"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">产品描述</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                placeholder="输入产品描述"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">价格</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">货币</label>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="CNY">CNY (¥)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">分类</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                placeholder="服装、电子产品等"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                标签（逗号分隔）
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                placeholder="新品, 热销, 限时优惠"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">SKU</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                  placeholder="可选"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">库存</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">产品图片</label>
              <ImageUploader
                currentImage={productImage}
                onUpload={setProductImage}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                onPress={resetForm}
              >
                取消
              </Button>
              <Button onPress={handleSubmit}>
                {editingProduct ? "保存" : "添加"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {siteProducts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-3xl mb-2">📦</div>
          <p>暂无产品，点击"添加产品"开始</p>
        </div>
      ) : (
        <div className="space-y-3">
          {siteProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-3 flex items-center gap-3"
            >
              <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                {product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <span className="text-2xl">📦</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{product.name}</div>
                <div className="text-sm text-gray-500 truncate">
                  {product.description}
                </div>
                <div className="text-sm font-medium mt-1" style={{ color: "var(--primary)" }}>
                  {product.currency === "CNY" ? "¥" : product.currency === "EUR" ? "€" : product.currency === "GBP" ? "£" : "$"}
                  {product.price}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onPress={() => handleEdit(product)}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  编辑
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onPress={() => handleDelete(product.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  删除
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {ConfirmDialog}
    </div>
  );
}
