<template>
  <el-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate ? '修改分类' : '添加分类'"
    :visible="visible"
    custom-class="ele-dialog-form"
    width="520px"
    @update:visible="updateVisible">
    <el-form ref="form" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="分类名称:" prop="name">
        <el-input v-model="form.name" placeholder="请输入分类名称" />
        <div class="field-desc">支持多级分类，建议短小清晰。</div>
      </el-form-item>
      <el-form-item label="上级分类:" prop="parentId">
        <el-select v-model="form.parentId" placeholder="顶级分类" style="width: 100%">
          <el-option label="顶级分类" :value="0" />
          <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <div class="field-desc">用于左侧多级菜单结构。</div>
      </el-form-item>
      <el-form-item label="排序:" prop="sort">
        <el-input-number v-model="form.sort" :min="0" :max="999" style="width: 100%" />
        <div class="field-desc">数字越小越靠前。</div>
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-switch
          v-model="form.status"
          :active-value="1"
          :inactive-value="0"
          active-text="启用"
          inactive-text="停用" />
        <div class="field-desc">停用后仍会显示在左侧分类树，并标记为“停用”。</div>
      </el-form-item>
      <el-form-item label="小图标:" prop="icon">
        <el-select v-model="form.icon" clearable filterable placeholder="请选择图标" style="width: 100%">
          <el-option v-for="item in iconOptions" :key="item.value" :label="item.label" :value="item.value">
            <i :class="item.value" style="margin-right: 8px;" />
            <span>{{ item.label }}</span>
          </el-option>
        </el-select>
        <div class="field-desc">可选 Element 内置图标，展示在左侧分类树。</div>
      </el-form-item>
      <el-form-item label="说明:" prop="description">
        <el-input type="textarea" v-model="form.description" placeholder="可选说明" />
        <div class="field-desc">描述该分类的用途或范围。</div>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button :loading="loading" type="primary" @click="save">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'WorkDocCategoryEdit',
  props: {
    visible: Boolean,
    data: Object,
    categories: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        id: null,
        name: '',
        parentId: 0,
        sort: 0,
        status: 1,
        icon: '',
        description: ''
      },
      iconOptions: [
        { label: '文档', value: 'el-icon-document' },
        { label: '文件夹', value: 'el-icon-folder' },
        { label: '文件', value: 'el-icon-tickets' },
        { label: '知识库', value: 'el-icon-reading' },
        { label: '工具', value: 'el-icon-set-up' },
        { label: '代码', value: 'el-icon-cpu' },
        { label: '任务', value: 'el-icon-s-claim' },
        { label: '公告', value: 'el-icon-bell' },
        { label: '标签', value: 'el-icon-collection-tag' },
        { label: '星标', value: 'el-icon-star-on' }
      ],
      rules: {
        name: [{required: true, message: '请输入分类名称', trigger: 'blur'}]
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
          name: init.name || '',
          parentId: init.parent_id ?? init.parentId ?? 0,
          sort: init.sort ?? 0,
          status: init.status ?? 1,
          icon: init.icon || '',
          description: init.description || ''
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
      this.form = {id: null, name: '', parentId: 0, sort: 0, status: 1, icon: '', description: ''};
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return;
        this.loading = true;
        const url = this.isUpdate ? `/work-doc-category/${this.form.id}` : '/work-doc-category/add';
        const payload = {
          name: this.form.name,
          parent_id: this.form.parentId,
          sort: this.form.sort,
          status: this.form.status,
          icon: this.form.icon,
          description: this.form.description
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
