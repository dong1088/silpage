export type Theme = "minimal" | "orange" | "blue" | "purple" | "dark";

export const themes: { id: Theme; name: string; color: string; textColor: string }[] = [
  { id: "minimal", name: "极简黑白", color: "#000000", textColor: "#ffffff" },
  { id: "orange", name: "活力橙", color: "#f97316", textColor: "#ffffff" },
  { id: "blue", name: "专业蓝", color: "#2563eb", textColor: "#ffffff" },
  { id: "purple", name: "优雅紫", color: "#7c3aed", textColor: "#ffffff" },
  { id: "dark", name: "暗夜蓝", color: "#3b82f6", textColor: "#ffffff" },
];

export function getTheme(): Theme {
  const saved = localStorage.getItem("theme");
  return (saved as Theme) || "blue";
}

export function setTheme(theme: Theme): void {
  localStorage.setItem("theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
}
