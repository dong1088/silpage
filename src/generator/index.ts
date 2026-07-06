/**
 * generator/index.ts
 * Astro 生成器统一导出
 */

export { generateAstroProject, setFileWriter } from "./astroGen";
export type { AstroConfig } from "./configWriter";
export { generatePackageJson, generateAstroConfig } from "./configWriter";
export { renderPages, renderBaseLayout, type RenderedPage } from "./pageRenderer";
export {
  applyContentToHtml,
  extractEditableRegions,
  stripEditableMarkers,
  wrapCss,
  type ProcessedTemplate,
  type EditableRegionDef,
} from "./templateProcessor";
export {
  generateSeoFiles,
  generate404Page,
  generateHeadersFile,
  type SeoFiles,
} from "./seoInjector";
export { collectAssets, generateImageUtils, type AssetCopy } from "./assetManager";