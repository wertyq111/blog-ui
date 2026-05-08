<template>
  <div class="ele-body develop-page admin-workspace-page image-process-page">
    <el-card shadow="never" class="develop-shell admin-workspace-shell">
      <section class="develop-hero">
        <div class="develop-hero__copy">
          <div class="develop-hero__eyebrow">Design Tooling</div>
          <div class="develop-hero__title">图片处理</div>
          <div class="develop-hero__desc">识别文本里的图片地址，批量替换图片资源，并统一调整图片定位和热区坐标。</div>
        </div>
      </section>

      <section class="image-tool-layout">
        <div class="image-tool-main">
          <section class="develop-panel image-tool-panel image-tool-panel--source">
            <div class="image-tool-panel__header">
              <div>
                <div class="image-tool-panel__title">原文本</div>
                <div class="image-tool-panel__desc">支持粘贴文本，也可以点击选择或把 txt/html/css 文件拖进来。</div>
              </div>
              <el-button size="small" type="primary" icon="el-icon-upload2" @click="openFilePicker">
                导入文件
              </el-button>
              <input
                ref="fileInput"
                class="image-tool-file-input"
                type="file"
                accept=".txt,.html,.htm,.css,text/plain,text/html,text/css"
                @change="handleFileChange">
            </div>

            <div
              class="image-tool-dropzone"
              :class="{'image-tool-dropzone--dragging': draggingFile}"
              @dragenter.prevent="handleDragEnter"
              @dragover.prevent
              @dragleave.prevent="handleDragLeave"
              @drop.prevent="handleDrop">
              <i class="el-icon-upload"></i>
              <span>{{ draggingFile ? '松开导入文件' : '拖拽文件到这里导入' }}</span>
            </div>

            <el-input
              v-model="sourceText"
              class="image-tool-textarea"
              type="textarea"
              resize="none"
              spellcheck="false"
              placeholder="把 txt 的文本内容粘贴到这里"
              @input="handleSourceInput"/>
          </section>

          <section class="develop-panel image-tool-panel image-tool-panel--output">
            <div class="image-tool-panel__header">
              <div>
                <div class="image-tool-panel__title">替换结果</div>
                <div class="image-tool-panel__desc">{{ statusText || '生成后的文本会显示在这里。' }}</div>
              </div>
            </div>
            <el-input
              v-model="resultText"
              class="image-tool-textarea"
              type="textarea"
              resize="none"
              readonly
              spellcheck="false"
              placeholder="替换后的内容会显示在这里"/>
          </section>
        </div>

        <aside class="develop-table-shell image-tool-side">
          <div class="develop-table-shell__header image-tool-side__header">
            <div>
              <div class="develop-table-shell__title">图片地址</div>
              <div class="develop-table-shell__desc">识别结果按出现顺序替换，空的新地址会保留原地址。</div>
            </div>
            <el-button size="small" type="primary" icon="el-icon-search" @click="scanImageUrls">
              识别地址
            </el-button>
          </div>

          <div class="image-tool-url-list">
            <el-empty
              v-if="foundUrls.length === 0"
              :image-size="96"
              description="没有识别到图片地址"/>
            <div
              v-for="(item, index) in foundUrls"
              :key="`${item.start}-${item.end}`"
              class="image-tool-url-item">
              <div class="image-tool-url-item__label">第 {{ index + 1 }} 条</div>
              <el-input
                :value="item.url"
                type="textarea"
                :rows="2"
                readonly
                resize="none"/>
              <el-input
                v-model.trim="replacementUrls[index]"
                placeholder="填写新的图片地址"
                clearable/>
            </div>
          </div>

          <div class="image-tool-actions">
            <div class="image-tool-move">
              <div class="image-tool-move__header">
                <strong>左右位移</strong>
                <span>{{ moveSummary }}</span>
              </div>
              <el-input-number
                v-model="offset"
                class="image-tool-offset"
                :min="0"
                :step="1"
                controls-position="right"/>
              <div class="image-tool-action-grid">
                <el-button size="small" @click="generateResult(0)">仅替换生成</el-button>
                <el-button size="small" type="primary" plain @click="generateResult(-1)">左移生成</el-button>
                <el-button size="small" type="primary" plain @click="generateResult(1)">右移生成</el-button>
              </div>
            </div>

            <div class="image-tool-action-grid image-tool-action-grid--bottom">
              <el-button icon="el-icon-document-copy" @click="copyResult">复制结果</el-button>
              <el-button type="primary" icon="el-icon-download" @click="downloadResult">导出 txt</el-button>
            </div>
          </div>
        </aside>
      </section>
    </el-card>
  </div>
</template>

<script>
const IMAGE_URL_PATTERN = /(?:url\(\s*(['"]?)([^'")\s]+?\.(?:jpg|jpeg|png|gif|webp|bmp|svg)(?:\?[^'")\s]*)?)\1\s*\))|(?:(?:src|data-src|data-original)=["']([^"']+?\.(?:jpg|jpeg|png|gif|webp|bmp|svg)(?:\?[^"']*)?)["'])/gi;
const POSITION_PATTERN = /(data-w="(?:area|img)"[^>]*?style="[^"]*?left:)(-?\d+)px/gi;
const MAP_COORDS_PATTERN = /(<area\b[^>]*\bcoords=")([^"]+)(")/gi;
const ACCEPTED_EXTENSIONS = ['txt', 'html', 'htm', 'css'];

export default {
  name: 'DesignImageProcess',
  data() {
    return {
      sourceText: '',
      resultText: '',
      statusText: '',
      foundUrls: [],
      replacementUrls: [],
      scannedText: '',
      offset: 360,
      moveSummary: '定位节点 0 个，坐标热区 0 个',
      draggingFile: false,
      dragDepth: 0
    };
  },
  methods: {
    openFilePicker() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const [file] = event.target.files;
      if (!file) {
        return;
      }
      this.readTextFile(file);
      event.target.value = '';
    },
    handleDragEnter() {
      this.dragDepth += 1;
      this.draggingFile = true;
    },
    handleDragLeave() {
      this.dragDepth = Math.max(this.dragDepth - 1, 0);
      this.draggingFile = this.dragDepth > 0;
    },
    handleDrop(event) {
      this.dragDepth = 0;
      this.draggingFile = false;
      const [file] = event.dataTransfer.files;
      if (!file) {
        return;
      }
      this.readTextFile(file);
    },
    readTextFile(file) {
      const extension = this.getFileExtension(file.name);
      if (!ACCEPTED_EXTENSIONS.includes(extension)) {
        this.$message.error('只能导入 txt、html、htm、css 文件');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.sourceText = String(reader.result || '');
        this.scanImageUrls();
      };
      reader.onerror = () => {
        this.$message.error('文件读取失败');
      };
      reader.readAsText(file, 'utf-8');
    },
    getFileExtension(filename) {
      const parts = filename.toLowerCase().split('.');
      return parts.length > 1 ? parts.pop() : '';
    },
    scanImageUrls() {
      this.foundUrls = [];
      IMAGE_URL_PATTERN.lastIndex = 0;

      let match = IMAGE_URL_PATTERN.exec(this.sourceText);
      while (match) {
        const url = match[2] || match[3];
        const start = match.index + match[0].indexOf(url);
        this.foundUrls.push({
          url,
          start,
          end: start + url.length
        });
        match = IMAGE_URL_PATTERN.exec(this.sourceText);
      }

      this.scannedText = this.sourceText;
      this.replacementUrls = this.foundUrls.map(() => '');
      this.statusText = `识别到 ${this.foundUrls.length} 条图片地址`;
      this.updateMoveSummary();
    },
    handleSourceInput() {
      this.updateMoveSummary();
      if (this.foundUrls.length > 0 && this.scannedText !== this.sourceText) {
        this.foundUrls = [];
        this.replacementUrls = [];
        this.scannedText = '';
        this.statusText = '文本已变更，请重新识别地址';
      }
    },
    applyUrlReplacements(text) {
      let output = '';
      let cursor = 0;

      this.foundUrls.forEach((item, index) => {
        const replacement = (this.replacementUrls[index] || '').trim();
        output += text.slice(cursor, item.start);
        output += replacement || item.url;
        cursor = item.end;
      });
      output += text.slice(cursor);

      return output;
    },
    shiftMapCoords(coordsText, delta) {
      const values = coordsText.split(',').map((item) => item.trim());
      if (values.length === 0 || values.some((item) => item === '' || Number.isNaN(Number(item)))) {
        return coordsText;
      }

      return values
        .map((value, index) => (index % 2 === 0 ? String(Number(value) + delta) : value))
        .join(',');
    },
    applyHorizontalShift(text, delta) {
      let movedBlocks = 0;
      let movedMaps = 0;
      POSITION_PATTERN.lastIndex = 0;
      MAP_COORDS_PATTERN.lastIndex = 0;

      const withLeftMoved = text.replace(POSITION_PATTERN, (_, prefix, left) => {
        movedBlocks += 1;
        return `${prefix}${Number(left) + delta}px`;
      });

      const withCoordsMoved = withLeftMoved.replace(MAP_COORDS_PATTERN, (_, start, coords, end) => {
        movedMaps += 1;
        return `${start}${this.shiftMapCoords(coords, delta)}${end}`;
      });

      return {
        text: withCoordsMoved,
        movedBlocks,
        movedMaps
      };
    },
    updateMoveSummary() {
      POSITION_PATTERN.lastIndex = 0;
      MAP_COORDS_PATTERN.lastIndex = 0;
      const blockCount = (this.sourceText.match(POSITION_PATTERN) || []).length;
      const mapCount = (this.sourceText.match(MAP_COORDS_PATTERN) || []).length;
      this.moveSummary = `定位节点 ${blockCount} 个，坐标热区 ${mapCount} 个`;
    },
    generateResult(direction) {
      if (!Number.isFinite(Number(this.offset))) {
        this.$message.error('请输入有效位移像素');
        return;
      }
      const replacedText = this.applyUrlReplacements(this.sourceText);
      const delta = direction === 0 ? 0 : Number(this.offset) * direction;
      const replacedCount = this.replacementUrls.filter((item) => item && item.trim() !== '').length;
      const shiftResult = this.applyHorizontalShift(replacedText, delta);
      const parts = [`已替换 ${replacedCount} 条图片地址`];

      this.resultText = shiftResult.text;

      if (delta !== 0) {
        parts.push(`已${delta > 0 ? '右移' : '左移'} ${Math.abs(delta)}px`);
        parts.push(`定位节点 ${shiftResult.movedBlocks} 个`);
        parts.push(`坐标热区 ${shiftResult.movedMaps} 个`);
      }
      this.statusText = parts.join('，');
    },
    copyResult() {
      if (!this.resultText) {
        this.$message.error('没有可复制的结果');
        return;
      }
      this.$copyText(this.resultText).then(() => {
        this.$message.success('结果已复制');
      }, () => {
        this.$message.error('复制失败');
      });
    },
    downloadResult() {
      if (!this.resultText) {
        this.$message.error('没有可导出的结果');
        return;
      }
      const blob = new Blob([this.resultText], {type: 'text/plain;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = '替换后的文本.txt';
      link.click();
      URL.revokeObjectURL(url);
    }
  }
};
</script>

<style scoped>
.image-tool-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 16px;
  min-height: calc(100vh - 250px);
}

.image-tool-main {
  display: grid;
  grid-template-rows: minmax(320px, 1fr) minmax(240px, 0.72fr);
  gap: 16px;
  min-width: 0;
}

.image-tool-panel,
.image-tool-side {
  min-height: 0;
}

.image-tool-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.image-tool-panel__header,
.image-tool-side__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.image-tool-panel__title {
  color: var(--cyber-text, #253126);
  font-size: 16px;
  font-weight: 700;
}

.image-tool-panel__desc {
  margin-top: 4px;
  color: var(--cyber-text-soft, rgba(49, 61, 50, 0.72));
  font-size: 13px;
  line-height: 1.5;
}

.image-tool-file-input {
  display: none;
}

.image-tool-dropzone {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 58px;
  border: 1px dashed rgba(129, 160, 118, 0.45);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--cyber-text-soft, rgba(49, 61, 50, 0.78));
  font-size: 14px;
  transition: border-color 0.18s ease, background 0.18s ease, color 0.18s ease;
}

.image-tool-dropzone--dragging {
  border-color: #409eff;
  background: rgba(64, 158, 255, 0.1);
  color: #409eff;
}

.image-tool-textarea {
  flex: 1;
  min-height: 0;
}

.image-tool-textarea >>> .el-textarea__inner {
  height: 100%;
  min-height: 180px !important;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
  line-height: 1.55;
}

.image-tool-side {
  display: flex;
  flex-direction: column;
  padding: 18px;
}

.image-tool-url-list {
  flex: 1;
  min-height: 0;
  margin: 8px -4px 0;
  padding: 0 4px;
  overflow: auto;
}

.image-tool-url-item {
  display: grid;
  gap: 8px;
  padding: 0 0 14px;
  margin-bottom: 14px;
  border-bottom: 1px solid rgba(129, 160, 118, 0.18);
}

.image-tool-url-item__label {
  color: var(--cyber-text, #253126);
  font-size: 13px;
  font-weight: 700;
}

.image-tool-actions {
  display: grid;
  gap: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(129, 160, 118, 0.18);
}

.image-tool-move {
  display: grid;
  gap: 10px;
}

.image-tool-move__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--cyber-text, #253126);
  font-size: 14px;
}

.image-tool-move__header span {
  color: var(--cyber-text-soft, rgba(49, 61, 50, 0.72));
  font-size: 12px;
}

.image-tool-offset,
.image-tool-offset >>> .el-input-number {
  width: 100%;
}

.image-tool-action-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.image-tool-action-grid--bottom {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

body.cyber-theme-dark .image-tool-page .image-tool-dropzone {
  border-color: rgba(103, 196, 255, 0.26);
  background: rgba(8, 18, 30, 0.45);
  color: rgba(202, 224, 248, 0.78);
}

body.cyber-theme-dark .image-tool-page .image-tool-dropzone--dragging {
  border-color: #18a8ff;
  background: rgba(24, 168, 255, 0.12);
  color: #8fd5ff;
}

body.cyber-theme-dark .image-tool-page .image-tool-url-item,
body.cyber-theme-dark .image-tool-page .image-tool-actions {
  border-color: rgba(103, 196, 255, 0.16);
}

@media (max-width: 1180px) {
  .image-tool-layout {
    grid-template-columns: 1fr;
  }

  .image-tool-side {
    min-height: 520px;
  }
}

@media (max-width: 768px) {
  .image-tool-main {
    grid-template-rows: 360px 300px;
  }

  .image-tool-panel__header,
  .image-tool-side__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .image-tool-action-grid,
  .image-tool-action-grid--bottom {
    grid-template-columns: 1fr;
  }
}
</style>
