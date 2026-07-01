import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import { TemplateCustomization } from "../../../shared/types";
import { markEditableComponents, applyContentToEditor } from "../../../services/contentBinding";

export interface GrapesEditorHandle {
  updateContent: (contents: Record<string, string>) => void;
  getEditor: () => any;
}

interface GrapesEditorProps {
  initialHtml?: string;
  initialCss?: string;
  customization?: TemplateCustomization;
  onSave?: (html: string, css: string) => void;
}

export const GrapesEditor = forwardRef<GrapesEditorHandle, GrapesEditorProps>(
  function GrapesEditor(
    { initialHtml = "", initialCss = "", customization, onSave },
    ref
  ) {
    const editorRef = useRef<HTMLDivElement>(null);
    const editorInstanceRef = useRef<any>(null);
    const onSaveRef = useRef(onSave);

    useEffect(() => {
      onSaveRef.current = onSave;
    }, [onSave]);

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      updateContent(contents: Record<string, string>) {
        const editor = editorInstanceRef.current;
        if (editor) {
          applyContentToEditor(editor, contents);
        }
      },
      getEditor() {
        return editorInstanceRef.current;
      },
    }));

    useEffect(() => {
      if (!editorRef.current || editorInstanceRef.current) return;

      const editor = grapesjs.init({
        container: editorRef.current,
        height: "100%",
        width: "100%",
        storageManager: false,
        styleManager: {
          appendTo: "#gjs-style-manager",
        },
        layerManager: {
          appendTo: "#gjs-layers",
        },
        panels: {
          defaults: [],
        },
        deviceManager: {
          devices: [
            { name: "Desktop", width: "" },
            { name: "Tablet", width: "768px", widthMedia: "768px" },
            { name: "Mobile", width: "375px", widthMedia: "375px" },
          ],
        },
        blockManager: {
          appendTo: "#gjs-blocks",
          blocks: [
            {
              id: "text",
              label: "文本",
              content: '<div class="p-4">在这里输入文字</div>',
              category: "基础",
            },
            {
              id: "image",
              label: "图片",
              content: '<img src="https://via.placeholder.com/300x200" class="w-full"/>',
              category: "基础",
            },
            {
              id: "button",
              label: "按钮",
              content: '<button class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">点击按钮</button>',
              category: "基础",
            },
            {
              id: "link",
              label: "链接",
              content: '<a href="#" class="text-indigo-600 hover:text-indigo-800 underline">链接文字</a>',
              category: "基础",
            },
            {
              id: "header",
              label: "导航",
              content: `<nav class="flex items-center justify-between p-4 bg-white shadow-sm">
                <div class="text-xl font-bold">Logo</div>
                <div class="flex gap-4">
                  <a href="#">首页</a><a href="#">产品</a><a href="#">关于</a><a href="#">联系</a>
                </div>
              </nav>`,
              category: "布局",
            },
            {
              id: "hero",
              label: "首屏",
              content: `<section class="py-20 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center">
                <h1 class="text-5xl font-bold mb-4">欢迎来到我们的网站</h1>
                <p class="text-xl mb-8">这里是副标题描述</p>
                <button class="px-8 py-4 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition">开始体验</button>
              </section>`,
              category: "布局",
            },
            {
              id: "footer",
              label: "页脚",
              content: `<footer class="bg-gray-800 text-white py-12 px-8">
                <div class="grid grid-cols-3 gap-8">
                  <div><h3 class="text-lg font-bold mb-4">关于我们</h3><p class="text-gray-400">公司简介内容</p></div>
                  <div><h3 class="text-lg font-bold mb-4">联系方式</h3><p class="text-gray-400">email@example.com</p></div>
                  <div><h3 class="text-lg font-bold mb-4">关注我们</h3><p class="text-gray-400">社交媒体链接</p></div>
                </div>
                <div class="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">&copy; 2024 版权所有</div>
              </footer>`,
              category: "布局",
            },
            {
              id: "inquiry-form",
              label: "询盘表单",
              content: `<div class="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-sm">
                <h2 class="text-2xl font-bold text-center mb-6 text-gray-900">产品询盘</h2>
                <form class="space-y-4" onsubmit="event.preventDefault(); alert('感谢您的询盘！');">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
                    <input type="text" name="name" required class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Your Name" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">邮箱 *</label>
                    <input type="email" name="email" required class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">电话</label>
                    <input type="tel" name="phone" class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="+1 234 567 8900" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">留言</label>
                    <textarea name="message" rows="4" class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="I would like to inquire about..."></textarea>
                  </div>
                  <button type="submit" class="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">提交询盘</button>
                </form>
              </div>`,
              category: "电商",
            },
            {
              id: "whatsapp-btn",
              label: "WhatsApp",
              content: `<a href="https://wa.me/?text=Hello" target="_blank" class="fixed bottom-6 right-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition z-50">
                <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>`,
              category: "电商",
            },
          ],
        },
      });

      // 加载初始内容
      if (initialHtml) {
        editor.setComponents(initialHtml);
      }
      if (initialCss) {
        editor.setStyle(initialCss);
      }

      // 标记可编辑组件（延迟确保 DOM 已渲染）
      editor.on("load", () => {
        // 首次标记
        setTimeout(() => markEditableComponents(editor), 100);
      });

      // 新增组件时也标记
      editor.on("component:add", () => {
        markEditableComponents(editor);
      });

      // 添加保存命令
      editor.Commands.add("save-cmd", {
        run: () => {
          const html = editor.getHtml() || "";
          const css = editor.getCss() || "";
          onSaveRef.current?.(html, css);
        },
      });

      editorInstanceRef.current = editor;

      return () => {
        editor.destroy();
        editorInstanceRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 页面切换时更新编辑器内容
    const prevHtmlRef = useRef(initialHtml);
    const prevCssRef = useRef(initialCss);
    useEffect(() => {
      const editor = editorInstanceRef.current;
      if (!editor) return;
      if (initialHtml !== prevHtmlRef.current || initialCss !== prevCssRef.current) {
        prevHtmlRef.current = initialHtml;
        prevCssRef.current = initialCss;
        if (initialHtml) {
          editor.setComponents(initialHtml);
        }
        if (initialCss) {
          editor.setStyle(initialCss);
        }
        // 重新标记可编辑组件
        setTimeout(() => markEditableComponents(editor), 100);
      }
    }, [initialHtml, initialCss]);

    // 应用自定义样式
    useEffect(() => {
      if (!customization || !editorInstanceRef.current) return;
      const editor = editorInstanceRef.current;
      const wrapper = editor.DomComponents.getWrapper();
      if (wrapper) {
        const customCss = `
          :root {
            --color-primary: ${customization.colors.primary};
            --color-secondary: ${customization.colors.secondary};
            --color-accent: ${customization.colors.accent};
            --color-background: ${customization.colors.background};
            --color-text: ${customization.colors.text};
            --font-family: ${customization.font}, sans-serif;
          }
          body {
            font-family: var(--font-family);
            color: var(--color-text);
            background-color: var(--color-background);
          }
        `;
        editor.addStyle(customCss);
      }
    }, [customization]);

    const handleUndo = useCallback(() => {
      editorInstanceRef.current?.UndoManager.undo();
    }, []);

    const handleRedo = useCallback(() => {
      editorInstanceRef.current?.UndoManager.redo();
    }, []);

    const handleDeviceChange = useCallback((device: string) => {
      editorInstanceRef.current?.setDevice(device);
    }, []);

    const handleSave = useCallback(() => {
      const editor = editorInstanceRef.current;
      if (editor) {
        const html = editor.getHtml() || "";
        const css = editor.getCss() || "";
        onSaveRef.current?.(html, css);
      }
    }, []);

    // 键盘快捷键
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
          e.preventDefault();
          handleSave();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleSave]);

    return (
      <div className="flex flex-col h-full">
        {/* 工具栏 */}
        <div
          className="border-b px-4 py-2 flex items-center justify-between shrink-0"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <button onClick={handleUndo} className="px-3 py-1 text-sm rounded hover:opacity-80" style={{ color: "var(--text-secondary)" }} title="撤销">撤销</button>
            <button onClick={handleRedo} className="px-3 py-1 text-sm rounded hover:opacity-80" style={{ color: "var(--text-secondary)" }} title="重做">重做</button>
            <div className="w-px h-6 mx-2" style={{ background: "var(--border)" }} />
            <button onClick={() => handleDeviceChange("Desktop")} className="px-3 py-1 text-sm rounded hover:opacity-80" style={{ color: "var(--text-secondary)" }}>桌面</button>
            <button onClick={() => handleDeviceChange("Tablet")} className="px-3 py-1 text-sm rounded hover:opacity-80" style={{ color: "var(--text-secondary)" }}>平板</button>
            <button onClick={() => handleDeviceChange("Mobile")} className="px-3 py-1 text-sm rounded hover:opacity-80" style={{ color: "var(--text-secondary)" }}>手机</button>
          </div>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-medium rounded-lg transition hover:opacity-90" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>保存</button>
        </div>

        {/* 编辑器主体 */}
        <div className="flex flex-1 overflow-hidden">
          <div className="w-48 border-r overflow-y-auto p-3 shrink-0" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <h3 className="text-sm font-medium mb-3" style={{ color: "var(--text-secondary)" }}>组件</h3>
            <div id="gjs-blocks" />
          </div>
          <div ref={editorRef} className="flex-1" />
          <div className="w-64 border-l overflow-y-auto shrink-0" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="p-3">
              <h3 className="text-sm font-medium mb-3" style={{ color: "var(--text-secondary)" }}>样式</h3>
              <div id="gjs-style-manager" />
            </div>
            <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
              <h3 className="text-sm font-medium mb-3" style={{ color: "var(--text-secondary)" }}>图层</h3>
              <div id="gjs-layers" />
            </div>
          </div>
        </div>
      </div>
    );
  }
);
