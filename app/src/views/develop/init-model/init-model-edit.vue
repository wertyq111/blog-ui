<!-- 编辑弹窗 -->
<template>
  <app-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改框架模板':'添加框架模板'"
    :visible="visible"
    custom-class="ele-dialog-form"
    width="680px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px">
      <el-row :gutter="15">
        <el-col :sm="12">
          <el-form-item label="框架编码:" prop="code">
            <el-input
              v-model="form.code"
              :maxlength="20"
              clearable
              placeholder="请输入框架编码"/>
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="框架名称:" prop="name">
            <el-input
              v-model="form.name"
              :maxlength="20"
              clearable
              placeholder="请输入框架名称"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :sm="21">
          <el-form-item label="模板提示:" prop="tip">
            <el-input
              v-model="form.tip"
              :maxlength="200"
              clearable
              placeholder="请输入模板提示"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :sm="21">
          <el-form-item label="模型模板:" prop="template">
            <el-input
              v-model="form.template"
              :maxlength="200"
              :rows="4"
              clearable
              placeholder="请输入模型模板"
              type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
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
  name: 'InitModelEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({status: 1}, this.data),
      // 表单验证规则
      rules: {
        code: [
          {required: true, message: '请输入框架编码', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入框架名称', trigger: 'blur'}
        ],
        tip: [
          {required: true, message: '请输入模板提示', trigger: 'blur'}
        ],
        template: [
          {required: true, message: '请输入模型模板', trigger: 'blur'}
        ],
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
          // 区别添加还是编辑
          let url = "/init-model/add";
          if (this.isUpdate === true) {
            url = `/init-model/${this.form.id}`
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
</style>
