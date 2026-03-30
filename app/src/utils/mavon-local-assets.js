const mavonAssetBase = "/mavon-editor";

const resolveHighlightStyle = (styleName) => styleName || "github";

const mavonLocalAssets = Object.freeze({
  markdown_css() {
    return `${mavonAssetBase}/markdown/github-markdown.min.css`;
  },
  hljs_js() {
    return `${mavonAssetBase}/highlightjs/highlight.min.js`;
  },
  hljs_lang(lang) {
    return `${mavonAssetBase}/highlightjs/languages/${lang}.min.js`;
  },
  hljs_css(styleName) {
    return `${mavonAssetBase}/highlightjs/styles/${resolveHighlightStyle(styleName)}.min.css`;
  },
  katex_js() {
    return `${mavonAssetBase}/katex/katex.min.js`;
  },
  katex_css() {
    return `${mavonAssetBase}/katex/katex.min.css`;
  },
});

export default mavonLocalAssets;
