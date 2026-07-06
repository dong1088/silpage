# SilPage

> A desktop static site generator for cross-border e-commerce — built with Tauri + React + GrapesJS.

[中文](README_CN.md)

---

## ✨ Features

- 🎨 **Visual Drag & Drop Editor** — Based on GrapesJS, WYSIWYG page building
- 🛒 **E-commerce Ready** — Product showcase, brand site, service landing page
- 🌍 **Multi-Language** — Built-in AI translation, manage multiple language versions
- 📦 **Product Management** — Product gallery with inquiry forms
- 🔍 **SEO Optimization** — Meta tags, sitemap, Open Graph, structured data
- 🚀 **One-Click Deploy** — Deploy to Vercel / Cloudflare Pages directly
- 🔧 **Astro Generator** — Generate full Astro projects, deploy as static sites
- 💻 **Desktop App** — Powered by Tauri 2.0, local-first data storage

## 📸 Screenshots

> Welcome to contribute screenshots!

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
git clone https://github.com/dong1088/silpage.git
cd silpage

# Install dependencies
npm install
```

### Development

```bash
npm run tauri dev
```

### Build Desktop App

```bash
npm run tauri build
```

Build output is located at `src-tauri/target/release/bundle/`.

## 🖥️ Usage

1. **Create a Site** — Choose a template or blueprint to begin
2. **Design Pages** — Drag & drop components in the visual editor
3. **Add Products** — Manage products with images, prices, and categories
4. **Configure SEO** — Set titles, descriptions, Open Graph, and analytics
5. **Set Up Languages** — Add language versions with AI translation
6. **Generate & Deploy** — Generate an Astro project and deploy to Vercel or Cloudflare

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
| [Astro](https://astro.build/) | Static site generation |

## 📁 Project Structure

```
silpage/
├── src/                       # Frontend source
│   ├── generator/             # Astro project generator
│   │   ├── astroGen.ts        # Main generation orchestrator
│   │   ├── configWriter.ts    # Write Astro config files
│   │   ├── pageRenderer.ts    # Render .astro pages
│   │   ├── templateProcessor.ts # HTML/CSS processing
│   │   ├── seoInjector.ts     # SEO file generation
│   │   ├── assetManager.ts    # Asset handling
│   │   └── index.ts           # Module exports
│   ├── modules/               # Feature modules
│   │   ├── content/           # Content management (products, languages, inquiries)
│   │   ├── dashboard/         # Dashboard, site cards, import
│   │   ├── deploy/            # Deployment (Vercel / Cloudflare)
│   │   ├── design/            # Template selection & customization
│   │   └── editor/            # GrapesJS editor
│   ├── pages/                 # Page components
│   ├── services/              # Service layer
│   │   ├── deploy.ts          # Deployment logic
│   │   ├── buildService.ts    # Astro build service
│   │   ├── aiTranslation.ts   # AI translation
│   │   ├── seoGenerator.ts    # SEO checks & generation
│   │   ├── pageGenerator.ts   # Page HTML generation
│   │   └── projectStorage.ts  # Local project storage
│   ├── shared/                # Shared resources
│   │   ├── stores/            # Zustand stores
│   │   ├── components/        # Shared components (Toast, Header, AIAssist)
│   │   ├── hooks/             # Custom hooks
│   │   ├── types/             # TypeScript types
│   │   └── utils/             # Utilities (helpers, theme)
│   └── data/                  # Templates & blueprints
├── src-tauri/                 # Tauri backend (Rust)
└── public/                    # Static assets
```

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Areas Needing Help

1. **Templates** — More e-commerce templates and blueprints
2. **Editor** — Enhance GrapesJS plugins and components
3. **Testing** — Add unit and integration tests
4. **Documentation** — Improve docs and tutorials
5. **i18n** — More language support
6. **Performance** — Optimize app performance and bundle size

## 📄 License

[MIT License](LICENSE)