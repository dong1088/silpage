import { TemplateCustomization } from "../../../shared/types";

interface TemplateCustomizerProps {
  customization: TemplateCustomization;
  onChange: (customization: TemplateCustomization) => void;
}

const fonts = [
  "Inter",
  "Noto Sans SC",
  "Playfair Display",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
];

export function TemplateCustomizer({ customization, onChange }: TemplateCustomizerProps) {
  const handleColorChange = (key: keyof TemplateCustomization["colors"], value: string) => {
    onChange({
      ...customization,
      colors: {
        ...customization.colors,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">主题颜色</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600">主色调</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customization.colors.primary}
                onChange={(e) => handleColorChange("primary", e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-500">{customization.colors.primary}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600">次要色</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customization.colors.secondary}
                onChange={(e) => handleColorChange("secondary", e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-500">{customization.colors.secondary}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600">强调色</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customization.colors.accent}
                onChange={(e) => handleColorChange("accent", e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-500">{customization.colors.accent}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600">背景色</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customization.colors.background}
                onChange={(e) => handleColorChange("background", e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-500">{customization.colors.background}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600">文字色</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customization.colors.text}
                onChange={(e) => handleColorChange("text", e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-500">{customization.colors.text}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">字体</h3>
        <select
          value={customization.font}
          onChange={(e) => onChange({ ...customization, font: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {fonts.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
