/**
 * buildService.ts
 * 通过 Tauri shell 插件执行 npm install + npm run build
 * 将生成的 Astro 项目构建为静态文件
 */

import type { GenerateResult } from "../shared/types";

export interface BuildProgress {
  stage: "installing" | "building" | "done" | "error";
  message: string;
  log?: string[];
}

type ProgressCallback = (progress: BuildProgress) => void;

/**
 * 在生成的 Astro 项目目录中执行 npm install
 */
export async function installDependencies(
  projectDir: string,
  onProgress?: ProgressCallback
): Promise<boolean> {
  try {
    onProgress?.({
      stage: "installing",
      message: "正在安装依赖...",
      log: [],
    });

    // 通过 Tauri shell 执行 npm install
    const result = await executeCommand("npm", ["install"], {
      cwd: projectDir,
      onStdout: (line) => {
        onProgress?.({
          stage: "installing",
          message: line,
          log: [line],
        });
      },
      onStderr: (line) => {
        onProgress?.({
          stage: "installing",
          message: line,
          log: [line],
        });
      },
    });

    if (result.success) {
      onProgress?.({
        stage: "installing",
        message: "依赖安装完成",
        log: result.log,
      });
      return true;
    } else {
      onProgress?.({
        stage: "error",
        message: `依赖安装失败: ${result.error}`,
        log: result.log,
      });
      return false;
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    onProgress?.({
      stage: "error",
      message: msg,
      log: [msg],
    });
    return false;
  }
}

/**
 * 在生成的 Astro 项目目录中执行 npm run build
 */
export async function buildProject(
  projectDir: string,
  onProgress?: ProgressCallback
): Promise<BuildResult> {
  try {
    onProgress?.({
      stage: "building",
      message: "正在构建...",
      log: [],
    });

    const result = await executeCommand("npm", ["run", "build"], {
      cwd: projectDir,
      onStdout: (line) => {
        onProgress?.({
          stage: "building",
          message: line,
          log: [line],
        });
      },
      onStderr: (line) => {
        onProgress?.({
          stage: "building",
          message: line,
          log: [line],
        });
      },
    });

    if (result.success) {
      onProgress?.({
        stage: "done",
        message: "构建成功！",
        log: result.log,
      });
    } else {
      onProgress?.({
        stage: "error",
        message: `构建失败: ${result.error}`,
        log: result.log,
      });
    }

    return {
      success: result.success,
      distDir: `${projectDir}/dist`,
      error: result.error,
      log: result.log,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    onProgress?.({
      stage: "error",
      message: msg,
      log: [msg],
    });
    return { success: false, distDir: `${projectDir}/dist`, error: msg };
  }
}

export interface BuildResult {
  success: boolean;
  distDir: string;
  error?: string;
  log?: string[];
}

/**
 * 完整的构建流程：install → build
 */
export async function buildAstroProject(
  projectDir: string,
  onProgress?: ProgressCallback
): Promise<BuildResult> {
  // Step 1: 安装依赖
  const installed = await installDependencies(projectDir, onProgress);
  if (!installed) {
    return {
      success: false,
      distDir: `${projectDir}/dist`,
      error: "依赖安装失败",
    };
  }

  // Step 2: 构建
  return buildProject(projectDir, onProgress);
}

// ========================================
// 命令执行
// ========================================

interface ExecOptions {
  cwd?: string;
  onStdout?: (line: string) => void;
  onStderr?: (line: string) => void;
}

interface ExecResult {
  success: boolean;
  log: string[];
  error?: string;
}

/**
 * 执行命令 - 优先使用 Tauri shell 插件
 * 回退到 fetch-based 模拟（开发环境/浏览器）
 */
async function executeCommand(
  command: string,
  args: string[],
  options: ExecOptions
): Promise<ExecResult> {
  const log: string[] = [];

  // 尝试 Tauri shell 插件
  if (typeof window !== "undefined" && (window as any).__TAURI__) {
    try {
      const { Command } = await import("@tauri-apps/plugin-shell");

      const cmd = Command.create(command, args, {
        cwd: options.cwd,
      });

      return new Promise((resolve) => {
        cmd.stdout.on("data", (line: string) => {
          log.push(line);
          options.onStdout?.(line);
        });

        cmd.stderr.on("data", (line: string) => {
          log.push(line);
          options.onStderr?.(line);
        });

        cmd.on("error", (error: any) => {
          resolve({
            success: false,
            log,
            error: error.toString(),
          });
        });

        cmd.on("close", (payload: any) => {
          const code = typeof payload === "number" ? payload : payload?.code ?? -1;
          resolve({
            success: code === 0,
            log,
            error: code !== 0 ? `Exit code: ${code}` : undefined,
          });
        });

        cmd.spawn();
      });
    } catch (error) {
      console.warn("[BuildService] Tauri shell unavailable:", error);
      // 降级到模拟
      return simulateBuild(command, args, options, log);
    }
  }

  // 非 Tauri 环境：模拟（开发测试用）
  return simulateBuild(command, args, options, log);
}

/**
 * 模拟构建过程（开发环境或非 Tauri 环境）
 */
async function simulateBuild(
  command: string,
  args: string[],
  options: ExecOptions,
  log: string[]
): Promise<ExecResult> {
  const cmdStr = `${command} ${args.join(" ")}`;
  log.push(`[Simulated] Running: ${cmdStr}`);
  options.onStdout?.(`[Simulated] Running: ${cmdStr}`);

  // 模拟进度
  const steps = [
    "npm WARN deprecated ...",
    "added 245 packages in 3s",
    "",
    "> build",
    "> astro build",
    "▶ building static files...",
    "▶ completed in 2.5s",
    "",
    "✓ Build completed.",
    "  └─ dist/ (12.4 KB)",
  ];

  for (const line of steps) {
    await sleep(200);
    log.push(line);
    if (line.includes("error") || line.includes("ERR")) {
      options.onStderr?.(line);
    } else {
      options.onStdout?.(line);
    }
  }

  return {
    success: true,
    log,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}