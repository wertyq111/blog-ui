<!-- 编辑弹窗 -->
<template>
  <app-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改字典项':'添加字典项'"
    :visible="visible"
    width="440px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="96px">
      <el-form-item
        label="字典项名称:"
        prop="name">
        <el-input
          v-model="form.name"
          :maxlength="20"
          clearable
          placeholder="请输入字典项名称"/>
      </el-form-item>
      <el-form-item
        label="字典项值:"
        prop="code">
        <el-input
          v-model="form.code"
          :maxlength="20"
          clearable
          placeholder="请输入字典项值"/>
      </el-form-item>
      <el-form-item
        label="排序号:"
        prop="sort">
        <el-input-number
          v-model="form.sort"
          :max="9999"
          :min="0"
          class="ele-fluid ele-text-left"
          controls-position="right"
          placeholder="请输入排序号"/>
      </el-form-item>
      <el-form-item label="备注:">
        <el-input
          v-model="form.note"
          :maxlength="200"
          :rows="4"
          placeholder="请输入备注"
          type="textarea"/>
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
  name: 'DictDataEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 字典id
    dictId: Number
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        name: [
          {required: true, message: '请输入字典项名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入字典项值', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '请输入排序号', trigger: 'blur'}
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false
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
          this.$http.post('/dictdata/edit',
            Object.assign({}, this.form, {
              dict_id: this.dictId
            })
          ).then(res => {
            this.loading = false;
            if (res.data.code === 0) {
              this.$message.success(res.data.msg);
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
