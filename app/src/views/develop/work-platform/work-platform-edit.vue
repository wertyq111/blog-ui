<!-- 编辑弹窗 -->
<template>
  <app-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改平台':'添加平台'"
    :visible="visible"
    custom-class="ele-dialog-form develop-dialog"
    width="520px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      class="develop-dialog-form"
      :model="form"
      :rules="rules"
      label-width="90px">
      <el-row :gutter="15">
        <el-col :sm="24">
          <el-form-item label="平台名称:" prop="name">
            <el-input v-model="form.name" :maxlength="50" clearable placeholder="请输入平台名称"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :sm="12">
          <el-form-item label="状态:" prop="status">
            <el-switch
              v-model="form.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#c0c4cc"
              aria-label="平台启用状态开关"/>
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="排序:" prop="sort">
            <el-input-number v-model="form.sort" :min="0" style="width: 100%"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="develop-dialog-footer">
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button :loading="loading" type="primary" @click="save">保存</el-button>
    </div>
  </app-dialog>
</template>

<script>
export default {
  name: 'WorkPlatformEdit',
  props: {
    visible: Boolean,
    data: Object
  },
  data() {
    return {
      form: Object.assign({status: 1, sort: 0}, this.data),
      rules: {
        name: [{required: true, message: '请输入平台名称', trigger: 'blur'}]
      },
      loading: false,
      isUpdate: false
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
      } else {
        this.form = {status: 1, sort: 0};
        this.isUpdate = false;
      }
    }
  },
  methods: {
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          let url = '/work-platform/add';
          if (this.isUpdate === true) {
            url = `/work-platform/${this.form.id}`;
          }
          this.$http.post(url, this.form).then(res => {
            this.loading = false;
            if (res.data.code === 0) {
              this.$message({type: 'success', message: res.data.msg});
              if (!this.isUpdate) {
                this.form = {status: 1, sort: 0};
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
        }
      });
    },
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
}
</script>

<style scoped>
</style>
