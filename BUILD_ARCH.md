# SilPage - Arch Linux 构建指南

## 一键安装依赖

```bash
sudo pacman -S --needed nodejs npm rustup webkit2gtk-4.1 openssl libsoup3 base-devel git
rustup default stable
```

## 构建运行

```bash
# 克隆项目（把地址换成你的）
git clone https://github.com/你的用户名/silpage.git
cd silpage

# 安装前端依赖
npm install

# 构建（首次会编译 Rust，约 2-3 分钟）
npm run tauri build
```

## 安装

构建完成后，安装包在 `src-tauri/target/release/bundle/` 下：

```bash
# 方式一：直接运行 exe
./src-tauri/target/release/silpage

# 方式二：安装 pacman 包（如果生成了）
sudo pacman -U src-tauri/target/release/bundle/pacman/*.pkg.tar.zst
```

## 常见问题

**Q: 报错 "webkit2gtk-4.1 not found"**
```bash
sudo pacman -S webkit2gtk-4.1
```

**Q: 报错 "openssl not found"**
```bash
sudo pacman -S openssl
```

**Q: npm install 报错**
```bash
# 清除缓存重试
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

**Q: 想开发模式运行（热更新）**
```bash
npm run tauri dev
```
