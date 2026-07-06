# SilPage

> 基于 Tauri + React + GrapesJS 的跨境电商静态网站生成器。

[English](README.md)

---

## ✨ 功能特性

- 🎨 **可视化拖拽编辑器** — 基于 GrapesJS，所见即所得搭建页面
- 🛒 **电商模板** — 产品展示、品牌官网、落地页等多种模板
- 🌍 **多语言支持** — 内置 AI 翻译，轻松管理多语言站点
- 📦 **产品管理** — 内置产品展示和询盘管理
- 🔍 **SEO 优化** — Meta 标签、Sitemap、Open Graph、结构化数据
- 🚀 **一键部署** — 支持 Vercel / Cloudflare Pages 部署
- 🔧 **Astro 生成器** — 生成完整 Astro 项目，部署为静态站点
- 💻 **桌面应用** — 基于 Tauri 2.0，数据本地存储

## 📸 应用截图

> 欢迎贡献截图！

## 🚀 快速开始

### 环境要求

- Node.js 18+
- Rust (rustup)
- 系统依赖：
  - Windows: WebView2（通常已预装）
  - macOS: Xcode Command Line Tools
  - Linux: `sudo apt install libwebkit2gtk-4.1-dev libsoup-3.0-dev`

### 安装

```bash
# 克隆仓库
git clone https://github.com/dong1088/silpage.git
cd silpage

# 安装依赖
npm install
```

### 开发模式

```bash
npm run tauri dev
```

### 构建桌面应用

```bash
npm run tauri build
```

构建产物位于 `src-tauri/target/release/bundle/`。

## 🖥️ 使用流程

1. **创建站点** — 选择模板或蓝图开始建站
2. **设计页面** — 在可视化编辑器中拖拽组件
3. **添加产品** — 管理产品图片、价格和分类
4. **SEO 配置** — 设置标题、描述、Open Graph 和分析 ID
5. **多语言设置** — 添加语言版本，使用 AI 翻译内容
6. **生成部署** — 生成 Astro 项目并部署到 Vercel 或 Cloudflare

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| [Tauri 2.0](https://tauri.app/) | 桌面框架 |
| [React 19](https://react.dev/) | 前端 UI |
| [TypeScript](https://www.typescriptlang.org/) | 类型安全 |
| [Tailwind CSS](https://tailwindcss.com/) | 样式方案 |
| [Zustand](https://zustand-demo.pmnd.rs/) | 状态管理 |
| [GrapesJS](https://grapesjs.com/) | 可视化编辑器 |
| [HeroUI](https://www.heroui.com/) | UI 组件库 |
| [Astro](https://astro.build/) | 静态站点生成 |

## 📁 项目结构

```
silpage/
├── src/                       # 前端源码
│   ├── generator/             # Astro 项目生成器
│   │   ├── astroGen.ts        # 主生成编排
│   │   ├── configWriter.ts    # Astro 配置文件生成
│   │   ├── pageRenderer.ts    # .astro 页面渲染
│   │   ├── templateProcessor.ts # HTML/CSS 处理
│   │   ├── seoInjector.ts     # SEO 文件生成
│   │   ├── assetManager.ts    # 资产管理
│   │   └── index.ts           # 模块导出
│   ├── modules/               # 功能模块
│   │   ├── content/           # 内容管理（产品、语言、询盘）
│   │   ├── dashboard/         # 仪表盘、站点卡片、导入
│   │   ├── deploy/            # 部署（Vercel / Cloudflare）
│   │   ├── design/            # 模板选择与自定义
│   │   └── editor/            # GrapesJS 编辑器
│   ├── pages/                 # 页面组件
│   ├── services/              # 服务层
│   │   ├── deploy.ts          # 部署逻辑
│   │   ├── buildService.ts    # Astro 构建服务
│   │   ├── aiTranslation.ts   # AI 翻译
│   │   ├── seoGenerator.ts    # SEO 检查与生成
│   │   ├── pageGenerator.ts   # 页面 HTML 生成
│   │   └── projectStorage.ts  # 本地项目存储
│   ├── shared/                # 共享资源
│   │   ├── stores/            # Zustand 状态管理
│   │   ├── components/        # 共享组件（Toast, Header, AIAssist）
│   │   ├── hooks/             # 自定义 Hooks
│   │   ├── types/             # TypeScript 类型定义
│   │   └── utils/             # 工具函数（helpers, theme）
│   └── data/                  # 模板和蓝图数据
├── src-tauri/                 # Tauri 后端（Rust）
└── public/                    # 静态资源
```

## 🤝 参与贡献

欢迎贡献！详见 [CONTRIBUTING.md](CONTRIBUTING.md)。

### 需要帮助的方向

1. **模板** — 更多电商模板和蓝图
2. **编辑器** — 增强 GrapesJS 插件和组件
3. **测试** — 添加单元测试和集成测试
4. **文档** — 完善文档和教程
5. **国际化** — 更多语言支持
6. **性能** — 优化应用性能和打包体积

## 📄 许可证

[MIT License](LICENSE)