<!-- 编辑弹窗 -->
<template>
  <app-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改文章标签':'添加文章标签'"
    :visible="visible"
    custom-class="ele-dialog-form develop-dialog"
    width="750px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      class="develop-dialog-form"
      :model="form"
      :rules="rules"
      label-width="82px">
      <el-form-item label="文章分类:" prop="categoryId">
        <el-col :span="8">
          <el-select
            v-model="form.categoryId"
            class="ele-block"
            clearable
            filterable
            placeholder="-请选择分类-"
            size="small">
            <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="标签名称:" prop="name">
        <el-col :span="8">
          <el-input
            v-model="form.name"
            :maxlength="20"
            clearable
            placeholder="请输入分类名称"/>
        </el-col>
      </el-form-item>
      <el-form-item label="描述:">
        <el-input
          v-model="form.description"
          type="textarea"
          clearable
          placeholder="请输入描述"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="develop-dialog-footer">
      <el-button
        @click="updateVisible(false)">取消
      </el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="save">保存
      </el-button>
    </div>
  </app-dialog>
</template>

<script>

export default {
  name: 'LabelEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 文章分类
    categories: Array,
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        name: [
          {required: true, message: '请输入标签名称', trigger: 'blur'}
        ],
        categoryId: [
          {required: true, message: '请选择壁纸分类', trigger: 'change'}
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
      } else {
        this.form = {};
        this.isUpdate = false;
      }
    }
  },
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          // 城市数据处理
          this.form = Object.assign({}, this.form);
          // 区别添加还是编辑
          let url = "/labels/add";
          if (this.isUpdate === true) {
            url = `/labels/${this.form.id}`
          }
          this.$http.post(url, this.form).then(res => {
            this.loading = false;
            if (res.data.code === 0) {
              this.$message({type: 'success', message: res.data.msg});
              if (!this.isUpdate) {
                this.form = {};
              }
              this.updateVisible(false);
              this.$emit('done');
            } else {
              this.$message.error(res.data.data.message ? res.data.data.message : res.data.msg);
            }
          }).catch(e => {
            this.loading = false;
            this.$message.error(e.message);
          });
        } else {
          return false;
        }
      });
    },

    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
}
</script>

<style scoped>
.develop-dialog-form {
  padding-top: 4px;
}

.develop-dialog-form ::v-deep .el-form-item {
  margin-bottom: 16px;
  padding: 14px 16px 16px;
  border: 1px solid var(--notebook-dialog-item-border, rgba(214, 222, 232, 0.92));
  border-radius: 16px;
  background: var(--notebook-dialog-item-bg, linear-gradient(180deg, #ffffff 0%, #f8fafc 100%));
  box-shadow: var(--notebook-dialog-item-shadow, 0 12px 28px rgba(15, 23, 42, 0.05));
}

.develop-dialog-form ::v-deep .el-form-item__label {
  padding: 0 12px 0 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--notebook-dialog-label, #4b5563);
}

.develop-dialog-form ::v-deep .el-input__inner,
.develop-dialog-form ::v-deep .el-textarea__inner,
.develop-dialog-form ::v-deep .el-select .el-input__inner,
.develop-dialog-form ::v-deep .el-input-number .el-input__inner {
  border-radius: 12px;
  border-color: var(--notebook-dialog-input-border, rgba(210, 218, 230, 0.95));
  background: var(--notebook-dialog-input-bg, rgba(255, 255, 255, 0.96));
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.04);
}

.develop-dialog-form ::v-deep .el-input__inner:focus,
.develop-dialog-form ::v-deep .el-textarea__inner:focus,
.develop-dialog-form ::v-deep .el-select .el-input__inner:focus,
.develop-dialog-form ::v-deep .el-input-number .el-input__inner:focus {
  border-color: var(--notebook-dialog-input-focus-border, #98aecd);
  box-shadow: var(--notebook-dialog-input-focus-shadow, 0 0 0 3px rgba(82, 126, 196, 0.08));
}

.develop-dialog-form ::v-deep .field-desc {
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.6;
  color: #8a94a6;
}

.develop-dialog-form ::v-deep .el-form-item:last-child {
  margin-bottom: 0;
}
</style>
