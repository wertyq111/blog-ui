<template>
  <app-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate ? '修改文档' : '添加文档'"
    :visible="visible"
    custom-class="ele-dialog-form develop-dialog"
    width="900px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      class="develop-dialog-form"
      :model="form"
      :rules="rules"
      label-width="100px">
      <div class="develop-dialog-card">
        <div class="develop-dialog-card__title">文档信息</div>
        <div class="develop-dialog-card__body">
          <el-row :gutter="15">
            <el-col :sm="12">
              <el-form-item label="标题:" prop="title">
                <el-input v-model="form.title" placeholder="请输入标题" />
                <div class="field-desc">建议使用问题/结论式标题，便于检索。</div>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="分类:" prop="categoryId">
                <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 100%">
                  <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
                <div class="field-desc">文档所属的目录层级。</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :sm="8">
              <el-form-item label="模板:" prop="templateType">
                <el-select v-model="form.templateType" placeholder="请选择模板" style="width: 100%" @change="applyTemplate">
                  <el-option v-for="t in templates" :key="t.value" :label="t.label" :value="t.value" />
                </el-select>
                <div class="field-desc">选择模板可自动填充结构。</div>
              </el-form-item>
            </el-col>
            <el-col :sm="8">
              <el-form-item label="状态:" prop="status">
                <el-select v-model="form.status" style="width: 100%">
                  <el-option label="启用" :value="1" />
                  <el-option label="停用" :value="0" />
                </el-select>
                <div class="field-desc">停用后在列表中可隐藏。</div>
              </el-form-item>
            </el-col>
            <el-col :sm="8">
              <el-form-item label="优先级:" prop="priority">
                <el-input-number v-model="form.priority" :min="0" :max="10" style="width: 100%" />
                <div class="field-desc">数字越大优先展示。</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :sm="12">
              <el-form-item label="标签:" prop="tagsText">
                <el-input v-model="form.tagsText" placeholder="使用英文逗号分隔" />
                <div class="field-desc">例如：接口,MySQL,性能</div>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="项目来源:" prop="source">
                <el-select v-model="form.source" clearable filterable placeholder="请选择工作平台" style="width: 100%">
                  <el-option
                    v-for="item in sourceOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" />
                </el-select>
                <div class="field-desc">项目来源直接复用工作平台，便于统一管理。</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :sm="12">
              <el-form-item label="置顶:" prop="isPin">
                <el-switch v-model="form.isPin" :active-value="1" :inactive-value="0" />
                <div class="field-desc">置顶后优先显示在列表顶部。</div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="develop-dialog-card develop-dialog-card--content">
        <div class="develop-dialog-card__title">正文内容</div>
        <div class="develop-dialog-card__body">
          <el-row :gutter="15">
            <el-col :sm="24">
              <el-form-item label="内容:" prop="content">
                <mavon-editor v-model="form.content" :externalLink="mavonExternalLink" :toolbarsFlag="true" :subfield="true" />
                <div class="field-desc">支持 Markdown 编写，建议包含问题、结论和步骤。</div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="develop-dialog-footer">
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button :loading="loading" type="primary" @click="save">保存</el-button>
    </div>
  </app-dialog>
</template>

<script>
import {mavonEditor} from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
import mavonLocalAssets from '@/utils/mavon-local-assets';

export default {
  name: 'WorkDocEdit',
  components: {mavonEditor},
  props: {
    visible: Boolean,
    data: Object,
    categories: {
      type: Array,
      default: () => []
    },
    templates: {
      type: Array,
      default: () => []
    },
    mavonExternalLink: {
      type: Object,
      default: () => mavonLocalAssets
    }
  },
  data() {
    return {
      form: {
        id: null,
        title: '',
        categoryId: null,
        templateType: 'custom',
        content: '',
        tagsText: '',
        status: 1,
        priority: 0,
        source: '',
        isPin: 0
      },
      rules: {
        title: [{required: true, message: '请输入标题', trigger: 'blur'}],
        categoryId: [{required: true, message: '请选择分类', trigger: 'change'}],
        content: [{required: true, message: '请输入内容', trigger: 'blur'}]
      },
      projectSources: [],
      loading: false,
      isUpdate: false
    };
  },
  computed: {
    sourceOptions() {
      const options = (this.projectSources || []).map(item => ({
        label: item.name,
        value: item.name
      }));
      if (this.form.source && !options.some(item => item.value === this.form.source)) {
        options.unshift({
          label: `${this.form.source}（历史值）`,
          value: this.form.source
        });
      }
      return options;
    }
  },
  watch: {
    data() {
      if (this.data) {
        const init = Object.assign({}, this.data);
        this.form = {
          id: init.id,
          title: init.title || '',
          categoryId: init.category_id || init.categoryId || (init.category ? init.category.id : null),
          templateType: init.template_type || init.templateType || 'custom',
          content: init.content || '',
          tagsText: Array.isArray(init.tags) ? init.tags.join(',') : (init.tags || ''),
          status: init.status ?? 1,
          priority: init.priority ?? 0,
          source: init.source || '',
          isPin: init.is_pin ?? init.isPin ?? 0
        };
        this.isUpdate = true;
      } else {
        this.resetForm();
        this.isUpdate = false;
      }
    }
  },
  created() {
    this.fetchProjectSources();
  },
  methods: {
    fetchProjectSources() {
      this.$http.get('/work-platform/list', {params: {status: 1}}).then(res => {
        if (res.data.code === 0) {
          this.projectSources = res.data.data || [];
        } else {
          this.projectSources = [];
        }
      }).catch(() => {
        this.projectSources = [];
      });
    },
    resetForm() {
      this.form = {
        id: null,
        title: '',
        categoryId: null,
        templateType: 'custom',
        content: '',
        tagsText: '',
        status: 1,
        priority: 0,
        source: '',
        isPin: 0
      };
    },
    applyTemplate() {
      const tpl = this.templates.find(t => t.value === this.form.templateType);
      if (tpl && (!this.form.content || this.form.content.trim() === '')) {
        this.form.content = tpl.content || '';
      }
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return;
        this.loading = true;
        const url = this.isUpdate ? `/work-doc/${this.form.id}` : '/work-doc/add';
        const tags = this.form.tagsText
          ? this.form.tagsText.split(',').map(t => t.trim()).filter(Boolean)
          : [];
        const payload = {
          title: this.form.title,
          category_id: this.form.categoryId,
          template_type: this.form.templateType,
          content: this.form.content,
          tags: tags,
          status: this.form.status,
          priority: this.form.priority,
          source: this.form.source,
          is_pin: this.form.isPin
        };

        this.$http.post(url, payload).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.$message.success(res.data.msg || '保存成功');
            this.updateVisible(false);
            this.$emit('done');
          } else {
            this.$message.error(res.data.msg || '保存失败');
          }
        }).catch(e => {
          this.loading = false;
          this.$message.error(e.message);
        });
      });
    },
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
}
</script>

<style scoped>
.develop-dialog-card {
  padding: 16px;
  border: 1px solid var(--develop-dialog-card-border, rgba(215, 228, 205, 0.86));
  border-radius: 18px;
  background: var(--develop-dialog-card-bg,
    radial-gradient(circle at top right, rgba(173, 236, 109, 0.12), transparent 22%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.84) 0%, rgba(247, 251, 243, 0.76) 100%));
  box-shadow: var(--develop-dialog-card-shadow,
    inset 0 1px 0 rgba(255, 255, 255, 0.88),
    0 14px 28px rgba(160, 186, 145, 0.12));
}

.develop-dialog-card + .develop-dialog-card {
  margin-top: 14px;
}

.develop-dialog-card__title {
  margin-bottom: 14px;
  color: var(--develop-dialog-card-title, #2d392d);
  font-size: 14px;
  font-weight: 700;
}

.develop-dialog-card__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field-desc {
  font-size: 12px;
  color: var(--develop-dialog-card-muted, #999);
  margin-top: 4px;
}

.develop-dialog-card ::v-deep .v-note-wrapper {
  min-height: 360px;
  border: 1px solid var(--develop-dialog-markdown-border, rgba(215, 228, 205, 0.86));
  border-radius: 16px;
  background: var(--develop-dialog-markdown-bg, rgba(255, 255, 255, 0.96));
  box-shadow: var(--develop-dialog-markdown-shadow,
    inset 0 1px 0 rgba(255, 255, 255, 0.82),
    0 14px 28px rgba(160, 186, 145, 0.12));
  overflow: hidden;
}

.develop-dialog-card ::v-deep .v-note-op {
  background: var(--develop-dialog-markdown-toolbar-bg, rgba(247, 251, 243, 0.92)) !important;
  border-bottom: 1px solid var(--develop-dialog-markdown-border, rgba(215, 228, 205, 0.86)) !important;
}

.develop-dialog-card ::v-deep .v-note-op .op-icon,
.develop-dialog-card ::v-deep .v-note-op .v-left-item,
.develop-dialog-card ::v-deep .v-note-op .v-right-item,
.develop-dialog-card ::v-deep .v-note-op .op-icon-divider {
  color: var(--develop-dialog-markdown-text, #2d392d) !important;
}

.develop-dialog-card ::v-deep .v-note-op .op-icon.selected {
  background: rgba(93, 153, 214, 0.18) !important;
  color: var(--develop-dialog-text-primary, #eef6ff) !important;
}

.develop-dialog-card ::v-deep .op-header,
.develop-dialog-card ::v-deep .op-image,
.develop-dialog-card ::v-deep .v-note-navigation-wrapper {
  background: var(--develop-dialog-markdown-toolbar-bg, rgba(247, 251, 243, 0.92)) !important;
  border-color: var(--develop-dialog-markdown-border, rgba(215, 228, 205, 0.86)) !important;
}

.develop-dialog-card ::v-deep .dropdown-item,
.develop-dialog-card ::v-deep .dropdown-item span,
.develop-dialog-card ::v-deep .v-note-navigation-title,
.develop-dialog-card ::v-deep .v-note-navigation-close {
  color: var(--develop-dialog-markdown-text, #2d392d) !important;
}

.develop-dialog-card ::v-deep .v-note-panel,
.develop-dialog-card ::v-deep .v-show-content,
.develop-dialog-card ::v-deep .content-input-wrapper,
.develop-dialog-card ::v-deep .auto-textarea-wrapper.content-input,
.develop-dialog-card ::v-deep .auto-textarea-block,
.develop-dialog-card ::v-deep .v-show-content-html,
.develop-dialog-card ::v-deep .v-note-read-model {
  background: var(--develop-dialog-markdown-panel-bg, rgba(255, 255, 255, 0.96)) !important;
  color: var(--develop-dialog-markdown-text, #2d392d) !important;
}

.develop-dialog-card ::v-deep .content-input-wrapper,
.develop-dialog-card ::v-deep .auto-textarea-wrapper.content-input,
.develop-dialog-card ::v-deep .v-show-content,
.develop-dialog-card ::v-deep .v-show-content-html,
.develop-dialog-card ::v-deep .v-note-read-model,
.develop-dialog-card ::v-deep .v-note-navigation-wrapper {
  border-color: var(--develop-dialog-markdown-border, rgba(215, 228, 205, 0.86)) !important;
}

.develop-dialog-card ::v-deep .content-input-wrapper textarea,
.develop-dialog-card ::v-deep .auto-textarea-wrapper.content-input textarea,
.develop-dialog-card ::v-deep .v-show-content,
.develop-dialog-card ::v-deep .v-show-content p,
.develop-dialog-card ::v-deep .v-show-content li,
.develop-dialog-card ::v-deep .v-show-content span,
.develop-dialog-card ::v-deep .v-show-content-html,
.develop-dialog-card ::v-deep .v-show-content-html p,
.develop-dialog-card ::v-deep .v-show-content-html li,
.develop-dialog-card ::v-deep .v-show-content-html span,
.develop-dialog-card ::v-deep .v-note-read-content,
.develop-dialog-card ::v-deep .v-note-read-content p,
.develop-dialog-card ::v-deep .v-note-read-content li,
.develop-dialog-card ::v-deep .v-note-read-content span {
  color: var(--develop-dialog-markdown-text, #2d392d) !important;
}
</style>
