import { useState, useEffect } from "react";
import { Theme, themes, getTheme, setTheme } from "../utils/theme";

export function Header() {
  const [theme, setThemeState] = useState<Theme>(getTheme());

  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  const handleThemeChange = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <header
      className="backdrop-blur-md shadow-sm border-b sticky top-0 z-50"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: "var(--primary)" }}
          >
            <span className="font-bold text-lg" style={{ color: "var(--primary-foreground)" }}>
              A
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
              Astro Site Builder
            </h1>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              跨境电商建站工具
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-lg p-1" style={{ background: "var(--bg-secondary)" }}>
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`w-6 h-6 rounded-full transition-all ${
                  theme === t.id ? "ring-2 ring-offset-2 ring-gray-400" : ""
                }`}
                style={{ background: t.color }}
                title={t.name}
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
