<!-- 编辑弹窗 -->
<template>
  <el-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="'生成模板'"
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
            {{form.code}}
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="框架名称:" prop="name">
            {{form.name}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="模板字段:" prop="column">
        <el-input
          v-model="form.column"
          :rows="4"
          clearable
          :placeholder=form.tip
          type="textarea"/>
      </el-form-item>
      <el-form-item label="生成结果:">
        <el-input
          v-model="result"
          :rows="10"
          clearable
          readonly
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
        @click="convert">生成
      </el-button>
      <el-button v-if="this.result"
        :loading="loading"
        type="success"
        @click="copy">复制模板
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ConvertInitModel',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data() {
    return {
      // 表单数据
      form: {column: '', columns: []},
      // 表单验证规则
      rules: {
        column: [
          {required: true, message: '模板字段不能为空', trigger: 'blur'}
        ]
      },
      result: '',
      // 提交状态
      loading: false,
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({column: '', columns: []}, this.data);
      } else {
        this.form = {column: '', columns: []};
      }

      this.result = '';
    }
  },
  methods: {
    /* 保存编辑 */
    convert() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.convertToArray();
          this.$http.post(`/init-model/convert/${this.form.id}`, this.form).then(res => {
            this.loading = false;
            if (res.data.code === 0) {
              this.result = res.data.data;
              this.$message({type: 'success', message: "模板生成成功"});
              this.updateVisible(true);
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
    copy(){
      this.$copyText(this.result).then(() =>{
        this.$message.success("复制成功");
      }, () => {
        this.$message.error("复制失败");
      });
    },
    /* 模板参数转换成数组 */
    convertToArray() {
      this.form.columns = this.form.column
        .split(/\n/)
        .map(item => item.trim())
        .filter(item => !!item);
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
