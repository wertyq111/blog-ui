<!-- 编辑弹窗 -->
<template>
  <app-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改明细':'添加明细'"
    :visible="visible"
    custom-class="ele-dialog-form"
    width="750px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="82px">
      <el-form-item label="编码:" prop="code">
        <el-col :span="8">
          <el-input
            v-model="form.code"
            :maxlength="20"
            clearable
            placeholder="请输入编码"/>
        </el-col>
      </el-form-item>
      <el-form-item label="名称:" prop="name">
        <el-col :span="8">
          <el-input
            v-model="form.name"
            :maxlength="200"
            clearable
            placeholder="请输入名称"/>
        </el-col>
      </el-form-item>
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
  name: 'SupplyEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 文章分类
    categories: Array,
  },
  components: {},
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        code: [
          {required: true, message: '请输入编码', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'}
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
  computed: {},
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          // 城市数据处理
          this.form = Object.assign({}, this.form);
          // 区别添加还是编辑
          let url = "/tobacco-supply/add";
          if (this.isUpdate === true) {
            url = `/tobacco-supply/${this.form.id}`
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
</style>
