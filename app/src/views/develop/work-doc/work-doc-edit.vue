<template>
  <el-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate ? '修改文档' : '添加文档'"
    :visible="visible"
    custom-class="ele-dialog-form"
    width="900px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px">
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
          <el-form-item label="来源:" prop="source">
            <el-input v-model="form.source" placeholder="如链接/项目名" />
            <div class="field-desc">记录文档来源或关联项目。</div>
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
      <el-row :gutter="15">
        <el-col :sm="24">
          <el-form-item label="内容:" prop="content">
            <mavon-editor v-model="form.content" :toolbarsFlag="true" :subfield="true" />
            <div class="field-desc">支持 Markdown 编写，建议包含问题、结论和步骤。</div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button :loading="loading" type="primary" @click="save">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {mavonEditor} from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';

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
      loading: false,
      isUpdate: false
    };
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
  methods: {
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
.field-desc {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
</style>
