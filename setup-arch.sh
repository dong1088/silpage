#!/bin/bash
# Astro Site Builder - Arch Linux 一键构建脚本
# 用法: bash setup-arch.sh

set -e

echo "=== 安装依赖 ==="
sudo pacman -S --needed nodejs npm rustup webkit2gtk-4.1 openssl libsoup3 base-devel git
rustup default stable

echo "=== 安装前端依赖 ==="
npm install --legacy-peer-deps

echo "=== 构建（首次约 2-3 分钟）==="
npm run tauri build

echo ""
echo "=== 完成！==="
echo "运行: ./src-tauri/target/release/astro-site-builder"
