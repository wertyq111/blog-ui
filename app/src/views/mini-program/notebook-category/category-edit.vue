<!-- 编辑弹窗 -->
<template>
  <app-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改文章分类':'添加文章分类'"
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
      <el-form-item label="分类名称:" prop="name">
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
      <el-form-item label="优先级:" prop="priority">
        <el-col :span="5">
          <el-input
            v-model.number="form.priority"
            clearable
            placeholder="请输入优先级"/>
        </el-col>
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
  name: 'CategoryEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        name: [
          {required: true, message: '请输入文章分类名', trigger: 'blur'}
        ],
        priority: [
          {type: 'number', required: true, message: '优先级必须为数字'}
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
          let url = "/categories/add";
          if (this.isUpdate === true) {
            url = `/categories/${this.form.id}`
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
              this.$message.error(res.data.msg);
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
  border: 1px solid rgba(214, 222, 232, 0.92);
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
}

.develop-dialog-form ::v-deep .el-form-item__label {
  padding: 0 12px 0 0;
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
}

.develop-dialog-form ::v-deep .el-input__inner,
.develop-dialog-form ::v-deep .el-textarea__inner,
.develop-dialog-form ::v-deep .el-select .el-input__inner,
.develop-dialog-form ::v-deep .el-input-number .el-input__inner {
  border-radius: 12px;
  border-color: rgba(210, 218, 230, 0.95);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.04);
}

.develop-dialog-form ::v-deep .el-input__inner:focus,
.develop-dialog-form ::v-deep .el-textarea__inner:focus,
.develop-dialog-form ::v-deep .el-select .el-input__inner:focus,
.develop-dialog-form ::v-deep .el-input-number .el-input__inner:focus {
  border-color: #98aecd;
  box-shadow: 0 0 0 3px rgba(82, 126, 196, 0.08);
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
