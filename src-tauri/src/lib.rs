use std::fs;
use std::path::Path;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct ImportResult {
    success: bool,
    name: Option<String>,
    html: Option<String>,
    css: Option<String>,
    error: Option<String>,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to SilPage.", name)
}

#[tauri::command]
fn import_astro_project(path: String) -> ImportResult {
    let project_path = Path::new(&path);
    
    if !project_path.exists() {
        return ImportResult {
            success: false,
            name: None,
            html: None,
            css: None,
            error: Some("项目路径不存在".to_string()),
        };
    }

    // 读取项目名称
    let name = read_project_name(project_path);

    // 读取入口页面
    let html = read_index_page(project_path);

    // 读取样式
    let css = read_styles(project_path);

    ImportResult {
        success: true,
        name: Some(name),
        html: Some(html),
        css: Some(css),
        error: None,
    }
}

fn read_project_name(path: &Path) -> String {
    // 尝试从 astro.config.mjs 读取
    let config_files = vec![
        "astro.config.mjs",
        "astro.config.ts",
        "astro.config.js",
    ];

    for config_file in config_files {
        let config_path = path.join(config_file);
        if let Ok(content) = fs::read_to_string(&config_path) {
            if let Some(name) = extract_name_from_config(&content) {
                return name;
            }
        }
    }

    // 从 package.json 读取
    let package_path = path.join("package.json");
    if let Ok(content) = fs::read_to_string(&package_path) {
        if let Some(name) = extract_name_from_package_json(&content) {
            return name;
        }
    }

    // 使用文件夹名称
    path.file_name()
        .unwrap_or_default()
        .to_string_lossy()
        .to_string()
}

fn extract_name_from_config(content: &str) -> Option<String> {
    // 简单提取 title 字段
    if let Some(start) = content.find("title:") {
        let remaining = &content[start + 6..];
        if let Some(quote_start) = remaining.find(|c: char| c == '\'' || c == '"') {
            let quote_char = remaining.chars().nth(quote_start).unwrap();
            let after_quote = &remaining[quote_start + 1..];
            if let Some(quote_end) = after_quote.find(quote_char) {
                return Some(after_quote[..quote_end].to_string());
            }
        }
    }
    None
}

fn extract_name_from_package_json(content: &str) -> Option<String> {
    // 简单提取 name 字段
    if let Some(start) = content.find("\"name\"") {
        let remaining = &content[start + 6..];
        if let Some(colon) = remaining.find(':') {
            let after_colon = &remaining[colon + 1..];
            if let Some(quote_start) = after_colon.find('"') {
                let after_quote = &after_colon[quote_start + 1..];
                if let Some(quote_end) = after_quote.find('"') {
                    return Some(after_quote[..quote_end].to_string());
                }
            }
        }
    }
    None
}

fn read_index_page(path: &Path) -> String {
    let page_files = vec![
        "src/pages/index.astro",
        "src/pages/index.html",
        "src/pages/index.tsx",
        "src/pages/index.jsx",
        "public/index.html",
    ];

    for page_file in page_files {
        let page_path = path.join(page_file);
        if let Ok(content) = fs::read_to_string(&page_path) {
            // 如果是 Astro 文件，提取 HTML 部分
            if page_file.ends_with(".astro") {
                return extract_html_from_astro(&content);
            }
            return content;
        }
    }

    // 返回默认 HTML
    r#"<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>导入的站点</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div class="min-h-screen flex items-center justify-center">
    <h1 class="text-4xl font-bold">欢迎来到你的网站</h1>
  </div>
</body>
</html>"#.to_string()
}

fn extract_html_from_astro(content: &str) -> String {
    // 提取 --- 块之后的 HTML
    if let Some(start) = content.find("---") {
        let after_first = &content[start + 3..];
        if let Some(end) = after_first.find("---") {
            let html = &after_first[end + 3..];
            return html.trim().to_string();
        }
    }
    content.to_string()
}

fn read_styles(path: &Path) -> String {
    let style_files = vec![
        "src/styles/global.css",
        "src/styles/main.css",
        "src/assets/styles.css",
        "src/styles/base.css",
    ];

    for style_file in style_files {
        let style_path = path.join(style_file);
        if let Ok(content) = fs::read_to_string(&style_path) {
            return content;
        }
    }

    String::new()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![greet, import_astro_project])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
