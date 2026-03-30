<!-- 编辑弹窗 -->
<template>
  <app-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="'转换路径'"
    :visible="visible"
    custom-class="ele-dialog-form develop-dialog"
    width="680px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      class="develop-dialog-form"
      :model="form"
      :rules="rules"
      label-width="100px">
      <el-row :gutter="15">
        <el-col :sm="12">
          <el-form-item label="项目编码:" prop="code">
            <div class="develop-dialog-static">{{form.code}}</div>
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="项目名称:" prop="name">
            <div class="develop-dialog-static">{{form.name}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="待转换路径:" prop="path">
        <el-input
          v-model="form.path"
          :maxlength="200000"
          :rows="4"
          clearable
          placeholder="请输入待转换路径"
          type="textarea"/>
      </el-form-item>
      <el-form-item label="转换结果:">
        <el-input
          v-model="result"
          :rows="5"
          clearable
          readonly
          type="textarea"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="develop-dialog-footer">
      <el-button
        @click="updateVisible(false)">取消
      </el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="convert">转换
      </el-button>
      <el-button v-if="this.result"
        :loading="loading"
        type="success"
        @click="copy">复制路径
      </el-button>
    </div>
  </app-dialog>
</template>

<script>
export default {
  name: 'ConvertServerPath',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data() {
    return {
      // 表单数据
      form: {paths: []},
      // 表单验证规则
      rules: {
        path: [
          {required: true, message: '待转换路径不能为空！', trigger: 'blur'}
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
        this.form = Object.assign({}, this.data);
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
          this.$http.post(`/server-path/convert/${this.form.id}`, this.form).then(res => {
            this.loading = false;
            if (res.data.code === 0) {
              this.result = this.convertToString(res.data.data);
              this.$message({type: 'success', message: "转换成功"});
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
    /* 路径地址转换成数组 */
    convertToArray() {
      this.form.paths = this.form.path.split(/\n/);
    },
    /* 路径地址转换成字符串 */
    convertToString(data) {
      return data.join(" ");
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
}
</script>

<style scoped>
.develop-dialog-static {
  min-height: 42px;
  padding: 10px 14px;
  border-radius: 14px;
  line-height: 1.5;
}
</style>
