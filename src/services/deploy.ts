import { DeployConfig, DeployResult } from "../shared/types";

function buildFullHtml(html: string, css: string, projectName: string): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>${css}</style>
</head>
<body>
  ${html}
</body>
</html>`;
}

export async function deployToVercel(
  html: string,
  css: string,
  config: DeployConfig
): Promise<DeployResult> {
  try {
    const fullHtml = buildFullHtml(html, css, config.projectName);

    const response = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: config.projectName,
        files: [
          {
            file: "index.html",
            data: btoa(unescape(encodeURIComponent(fullHtml))),
            encoding: "base64",
          },
        ],
        projectSettings: { framework: null },
        target: "production",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error?.message || "部署失败" };
    }

    return { success: true, url: `https://${data.url}`, deployId: data.id };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "网络错误" };
  }
}

export async function deployToCloudflare(
  html: string,
  css: string,
  config: DeployConfig
): Promise<DeployResult> {
  try {
    const fullHtml = buildFullHtml(html, css, config.projectName);
    const headers = {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    };

    // 步骤 1：创建或获取项目
    let projectId: string;
    const projectRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${config.token}/pages/projects`,
      { method: "GET", headers }
    );

    // Cloudflare Pages Direct Upload 需要 account_id，这里用 token 做简化处理
    // 实际使用中需要用户提供 account_id
    const createRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${config.token}/pages/projects`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: config.projectName,
          production_branch: "main",
        }),
      }
    );

    const createData = await createRes.json();
    if (!createData.success && !createData.errors?.[0]?.message?.includes("already exists")) {
      return { success: false, error: createData.errors?.[0]?.message || "创建项目失败" };
    }

    projectId = createData.result?.id || config.projectName;

    // 步骤 2：通过 Direct Upload 部署
    // 注意：Cloudflare Pages Direct Upload 需要 multipart/form-data
    const boundary = "----FormBoundary" + Math.random().toString(36).slice(2);
    const encoder = new TextEncoder();

    const parts: Uint8Array[] = [];

    // 添加 index.html 文件
    const fileHeader = `--${boundary}\r\nContent-Disposition: form-data; name="files"; filename="index.html"\r\nContent-Type: text/html\r\n\r\n`;
    parts.push(encoder.encode(fileHeader));
    parts.push(encoder.encode(fullHtml));
    parts.push(encoder.encode("\r\n"));

    // 添加 manifest
    const manifestHeader = `--${boundary}\r\nContent-Disposition: form-data; name="manifest"\r\nContent-Type: application/json\r\n\r\n`;
    parts.push(encoder.encode(manifestHeader));
    parts.push(encoder.encode(JSON.stringify({ "/index.html": { contentType: "text/html" } })));
    parts.push(encoder.encode(`\r\n--${boundary}--\r\n`));

    const body = new Blob(parts as BlobPart[]);

    const deployRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${config.token}/pages/projects/${projectId}/deployments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.token}`,
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
        },
        body,
      }
    );

    const deployData = await deployRes.json();

    if (!deployData.success) {
      return { success: false, error: deployData.errors?.[0]?.message || "部署失败" };
    }

    const url = deployData.result?.url
      ? `https://${deployData.result.url}`
      : `https://${config.projectName}.pages.dev`;

    return { success: true, url, deployId: deployData.result?.id };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "网络错误" };
  }
}

export async function deploy(
  html: string,
  css: string,
  config: DeployConfig
): Promise<DeployResult> {
  if (config.platform === "vercel") {
    return deployToVercel(html, css, config);
  } else {
    return deployToCloudflare(html, css, config);
  }
}
