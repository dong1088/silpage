# SilPage

> A desktop static site generator built with Tauri + React + GrapesJS.

[中文](README_CN.md)

---

## ✨ Features

- 🎨 **Visual Drag & Drop Editor** - Based on GrapesJS, WYSIWYG
- 🛒 **E-commerce Templates** - Product showcase, brand site, landing page
- 🚀 **One-Click Deploy** - Support Vercel / Cloudflare Pages
- 🌍 **Multi-Language** - Easy to create multilingual sites
- 📦 **Product Management** - Built-in product display and inquiry management
- 🔍 **SEO Optimization** - Basic SEO settings for better search rankings
- 💻 **Desktop App** - Based on Tauri 2.0, local data storage

## 📸 Screenshots

> Screenshots welcome!

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Rust (rustup)
- System dependencies:
  - Windows: WebView2 (usually pre-installed)
  - macOS: Xcode Command Line Tools
  - Linux: `sudo apt install libwebkit2gtk-4.1-dev libsoup-3.0-dev`

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/silpage.git
cd silpage

# Install dependencies
npm install
```

### Development

```bash
npm run tauri dev
```

### Build

```bash
npm run tauri build
```

## 🛠️ Tech Stack

| Tech | Usage |
|------|-------|
| [Tauri 2.0](https://tauri.app/) | Desktop framework |
| [React 19](https://react.dev/) | Frontend UI |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Zustand](https://zustand-demo.pmnd.rs/) | State management |
| [GrapesJS](https://grapesjs.com/) | Visual editor |
| [HeroUI](https://www.heroui.com/) | UI components |

## 📁 Project Structure

```
silpage/
├── src/                    # Frontend source
│   ├── components/         # Shared components
│   ├── modules/            # Feature modules
│   │   ├── content/        # Content management
│   │   ├── dashboard/      # Dashboard
│   │   ├── deploy/         # Deployment
│   │   ├── design/         # Design customization
│   │   └── editor/         # Visual editor
│   ├── pages/              # Page components
│   ├── services/           # Services layer
│   ├── shared/             # Shared resources
│   └── data/               # Template data
├── src-tauri/              # Tauri backend (Rust)
└── public/                 # Static assets
```

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Areas Needing Help

1. **Templates** - More e-commerce templates
2. **Editor** - Enhance GrapesJS editor
3. **Testing** - Add unit and integration tests
4. **Documentation** - Improve docs and tutorials
5. **i18n** - More language support
6. **Performance** - Optimize app performance

## 📄 License

[MIT License](LICENSE)

## 🙏 Acknowledgments

- [GrapesJS](https://grapesjs.com/) - Web Builder Framework
- [Tauri](https://tauri.app/) - Desktop Application Framework
- [HeroUI](https://www.heroui.com/) - UI Component Library
