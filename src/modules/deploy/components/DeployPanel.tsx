import { useState } from "react";
import { Button } from "@heroui/react";
import { DeployPlatform, DeployConfig } from "../../../shared/types";
import { useDeployStore } from "../../../shared/stores/deployStore";
import { useToast } from "../../../shared/components/Toast";

interface DeployPanelProps {
  siteId: string;
  siteName: string;
  onDeploy: (html: string, css: string) => Promise<void>;
}

export function DeployPanel({ siteId, siteName, onDeploy }: DeployPanelProps) {
  const { setConfig, getConfig, getSiteHistory } = useDeployStore();
  const { toast } = useToast();
  const config = getConfig(siteId);
  const history = getSiteHistory(siteId);

  const [platform, setPlatform] = useState<DeployPlatform>(
    config?.platform || "vercel"
  );
  const [token, setToken] = useState(config?.token || "");
  const [projectName, setProjectName] = useState(
    config?.projectName || siteName.toLowerCase().replace(/\s+/g, "-")
  );
  const [domain, setDomain] = useState(config?.domain || "");
  const [isDeploying, setIsDeploying] = useState(false);
  const [showTokenHelp, setShowTokenHelp] = useState(false);

  const handleSaveConfig = () => {
    const newConfig: DeployConfig = {
      platform,
      token,
      projectName,
      domain: domain || undefined,
    };
    setConfig(siteId, newConfig);
    toast("配置已保存", "success");
  };

  const handleDeploy = async () => {
    if (!token) {
      toast("请先配置 API Token", "error");
      return;
    }
    setIsDeploying(true);
    try {
      await onDeploy("", "");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div>
      <h3 className="font-medium mb-4" style={{ color: "var(--text)" }}>部署设置</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
            部署平台
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={platform === "vercel" ? "primary" : "outline"}
              onPress={() => setPlatform("vercel")}
              className="w-full"
            >
              <div className="text-center">
                <div className="font-medium">Vercel</div>
                <div className="text-xs opacity-80">全球 CDN</div>
              </div>
            </Button>
            <Button
              variant={platform === "cloudflare" ? "primary" : "outline"}
              onPress={() => setPlatform("cloudflare")}
              className="w-full"
            >
              <div className="text-center">
                <div className="font-medium">Cloudflare</div>
                <div className="text-xs opacity-80">边缘节点</div>
              </div>
            </Button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm" style={{ color: "var(--text-secondary)" }}>API Token</label>
            <Button
              size="sm"
              variant="ghost"
              onPress={() => setShowTokenHelp(!showTokenHelp)}
              className="text-indigo-600 hover:text-indigo-700"
            >
              如何获取？
            </Button>
          </div>
          {showTokenHelp && (
            <div className="text-xs p-2 rounded mb-2" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
              {platform === "vercel" ? (
                <p>
                  访问{" "}
                  <a href="https://vercel.com/account/tokens" target="_blank" rel="noreferrer" className="underline" style={{ color: "var(--primary)" }}>
                    Vercel Tokens
                  </a>{" "}
                  创建 Token
                </p>
              ) : (
                <p>
                  访问{" "}
                  <a href="https://dash.cloudflare.com/profile/api-tokens" target="_blank" rel="noreferrer" className="underline" style={{ color: "var(--primary)" }}>
                    Cloudflare API Tokens
                  </a>{" "}
                  创建 Token
                </p>
              )}
            </div>
          )}
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 text-sm"
            style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
            placeholder="输入 API Token"
          />
        </div>

        <div>
          <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>项目名称</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 text-sm"
            style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
            placeholder="my-site"
          />
        </div>

        <div>
          <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>自定义域名（可选）</label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 text-sm"
            style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
            placeholder="example.com"
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onPress={handleSaveConfig} className="flex-1">
            保存配置
          </Button>
          <Button
            onPress={handleDeploy}
            isDisabled={!token || isDeploying}
            className="flex-1"
          >
            {isDeploying ? "部署中..." : "一键部署"}
          </Button>
        </div>
      </div>

      {history.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3" style={{ color: "var(--text)" }}>部署历史</h4>
          <div className="space-y-2">
            {history.slice(0, 5).map((record) => (
              <div key={record.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      record.status === "success" ? "bg-green-500" : record.status === "failed" ? "bg-red-500" : "bg-yellow-500"
                    }`}
                  />
                  <span style={{ color: "var(--text-secondary)" }}>
                    {record.platform === "vercel" ? "Vercel" : "Cloudflare"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {record.url && (
                    <a href={record.url} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: "var(--primary)" }}>
                      访问
                    </a>
                  )}
                  <span style={{ color: "var(--text-secondary)" }}>
                    {new Date(record.deployedAt).toLocaleDateString("zh-CN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
