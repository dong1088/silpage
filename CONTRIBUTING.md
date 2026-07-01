# 贡献指南

感谢你对 SilPage 项目的关注！我们欢迎任何形式的贡献。

## 如何贡献

### 报告 Bug

1. 在 [Issues](../../issues) 中搜索是否已有相同问题
2. 如果没有，创建一个新的 Issue
3. 请包含以下信息：
   - 操作系统和版本
   - 重现步骤
   - 期望行为和实际行为
   - 截图（如果可能）

### 提交功能建议

1. 在 [Issues](../../issues) 中创建一个新的 Issue
2. 使用 `feature` 标签
3. 详细描述你的想法和使用场景

### 提交代码

1. Fork 本仓库
2. 创建你的特性分支：`git checkout -b feature/amazing-feature`
3. 提交你的更改：`git commit -m 'Add some amazing feature'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 创建一个 Pull Request

## 开发环境

### 前置要求

- Node.js 18+
- Rust (rustup)
- 系统依赖：
  - Windows: WebView2 (通常已预装)
  - macOS: Xcode Command Line Tools
  - Linux: `sudo apt install libwebkit2gtk-4.1-dev libsoup-3.0-dev`

### 安装

```bash
# 克隆项目
git clone https://github.com/your-username/silpage.git
cd silpage

# 安装依赖
npm install

# 启动开发服务器
npm run tauri dev
```

### 项目结构

```
src/
├── modules/          # 功能模块（按功能划分）
│   ├── content/      # 内容管理
│   ├── dashboard/    # 仪表盘
│   ├── deploy/       # 部署
│   ├── design/       # 设计定制
│   └── editor/       # 可视化编辑器
├── services/         # 服务层（数据持久化、API）
├── shared/           # 共享资源（hooks、stores、types）
└── pages/            # 页面组件
```

### 代码规范

- 使用 TypeScript
- 遵循 ESLint 规则
- 组件使用函数式组件 + Hooks
- 状态管理使用 Zustand
- 样式使用 Tailwind CSS

### 提交规范

使用语义化的提交信息：

```
feat: 添加新功能
fix: 修复 Bug
docs: 更新文档
style: 代码格式调整
refactor: 重构
test: 添加测试
chore: 构建/工具变动
```

## 需要帮助的领域

我们特别欢迎以下方面的贡献：

1. **模板设计** - 更多跨境电商模板
2. **编辑器功能** - 增强 GrapesJS 编辑器
3. **测试** - 添加单元测试和集成测试
4. **文档** - 完善文档和教程
5. **国际化** - 更多语言支持
6. **性能优化** - 提升应用性能

## 联系方式

- GitHub Issues: [Issues](../../issues)
- GitHub Discussions: [Discussions](../../discussions)

---

# Contributing Guide

Thank you for your interest in SilPage! We welcome contributions of any kind.

## How to Contribute

### Reporting Bugs

1. Search existing [Issues](../../issues) for duplicates
2. Create a new Issue if none exists
3. Include:
   - OS and version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if possible)

### Feature Requests

1. Create a new Issue with `feature` label
2. Describe your idea and use case in detail

### Code Contributions

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add some amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Create Pull Request

## Development Setup

### Prerequisites

- Node.js 18+
- Rust (rustup)
- System dependencies:
  - Windows: WebView2 (usually pre-installed)
  - macOS: Xcode Command Line Tools
  - Linux: `sudo apt install libwebkit2gtk-4.1-dev libsoup-3.0-dev`

### Getting Started

```bash
git clone https://github.com/your-username/silpage.git
cd silpage
npm install
npm run tauri dev
```

### Code Style

- Use TypeScript
- Follow ESLint rules
- Functional components + Hooks
- Zustand for state management
- Tailwind CSS for styling

### Commit Convention

Use semantic commit messages:

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Code style changes
refactor: Refactor code
test: Add tests
chore: Build/tool changes
```

## Areas Needing Help

1. **Templates** - More e-commerce templates
2. **Editor** - Enhance GrapesJS editor
3. **Testing** - Add unit and integration tests
4. **Documentation** - Improve docs and tutorials
5. **i18n** - More language support
6. **Performance** - Optimize app performance

## Contact

- GitHub Issues: [Issues](../../issues)
- GitHub Discussions: [Discussions](../../discussions)
