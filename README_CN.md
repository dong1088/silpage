# SilPage

> 一个基于 Tauri + React + GrapesJS 的桌面静态网页生成器。

[English](README.md)

---

## ✨ 功能特性

- 🎨 **可视化拖拽编辑器** - 基于 GrapesJS，所见即所得
- 🛒 **跨境电商专用模板** - 产品展示、品牌官网、落地页
- 🚀 **一键部署** - 支持 Vercel / Cloudflare Pages
- 🌍 **多语言支持** - 轻松创建多语言站点
- 📦 **产品管理** - 内置产品展示和询盘管理
- 🔍 **SEO 优化** - 基础 SEO 设置，提升搜索排名
- 💻 **桌面应用** - 基于 Tauri 2.0，数据本地存储

## 📸 截图

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
# 克隆项目
git clone https://github.com/your-username/silpage.git
cd silpage

# 安装依赖
npm install
```

### 开发

```bash
npm run tauri dev
```

### 构建

```bash
npm run tauri build
```

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| [Tauri 2.0](https://tauri.app/) | 桌面应用框架 |
| [React 19](https://react.dev/) | 前端 UI |
| [TypeScript](https://www.typescriptlang.org/) | 类型安全 |
| [Tailwind CSS](https://tailwindcss.com/) | 样式系统 |
| [Zustand](https://zustand-demo.pmnd.rs/) | 状态管理 |
| [GrapesJS](https://grapesjs.com/) | 可视化编辑器 |
| [HeroUI](https://www.heroui.com/) | UI 组件库 |

## 📁 项目结构

```
silpage/
├── src/                    # 前端源码
│   ├── components/         # 通用组件
│   ├── modules/            # 功能模块
│   │   ├── content/        # 内容管理
│   │   ├── dashboard/      # 仪表盘
│   │   ├── deploy/         # 部署功能
│   │   ├── design/         # 设计定制
│   │   └── editor/         # 可视化编辑器
│   ├── pages/              # 页面组件
│   ├── services/           # 服务层
│   ├── shared/             # 共享资源
│   └── data/               # 模板数据
├── src-tauri/              # Tauri 后端 (Rust)
└── public/                 # 静态资源
```

## 🤝 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。

### 需要帮助的领域

1. **模板设计** - 更多跨境电商模板
2. **编辑器功能** - 增强 GrapesJS 编辑器
3. **测试** - 添加单元测试和集成测试
4. **文档** - 完善文档和教程
5. **国际化** - 更多语言支持
6. **性能优化** - 提升应用性能

## 📄 许可证

[MIT License](LICENSE)

## 🙏 致谢

- [GrapesJS](https://grapesjs.com/) - Web Builder Framework
- [Tauri](https://tauri.app/) - Desktop Application Framework
- [HeroUI](https://www.heroui.com/) - UI Component Library
