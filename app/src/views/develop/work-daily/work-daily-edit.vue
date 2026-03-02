<!-- 编辑弹窗 -->
<template>
  <el-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改日常':'添加日常'"
    :visible="visible"
    custom-class="ele-dialog-form"
    width="900px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="90px">
      <el-row :gutter="15">
        <el-col :sm="12">
          <el-form-item label="日期:" prop="logDate">
            <el-date-picker v-model="form.logDate" type="date" placeholder="选择日期" style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="平台:" prop="platformId">
            <el-select v-model="form.platformId" placeholder="请选择平台" style="width: 100%">
              <el-option v-for="item in platforms" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :sm="24">
          <el-form-item label="内容:" prop="content">
            <mavon-editor v-model="form.content" :toolbarsFlag="true" :subfield="true" />
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
  name: 'WorkDailyEdit',
  components: {mavonEditor},
  props: {
    visible: Boolean,
    data: Object,
    platforms: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: Object.assign({}, this.data),
      rules: {
        logDate: [{required: true, message: '请选择日期', trigger: 'change'}],
        platformId: [{required: true, message: '请选择平台', trigger: 'change'}],
        content: [{required: true, message: '请输入内容', trigger: 'blur'}]
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
        this.form = {logDate: '', platformId: null, content: ''};
        this.isUpdate = false;
      }
    }
  },
  methods: {
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          let url = '/work-daily/add';
          if (this.isUpdate === true) {
            url = `/work-daily/${this.form.id}`;
          }
          const payload = {
            logDate: this.formatDate(this.form.logDate),
            platformId: this.form.platformId,
            content: this.form.content
          };
          this.$http.post(url, payload).then(res => {
            this.loading = false;
            if (res.data.code === 0) {
              this.$message({type: 'success', message: res.data.msg});
              if (!this.isUpdate) {
                this.form = {logDate: '', platformId: null, content: ''};
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
    },
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const y = d.getFullYear();
      const m = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
  }
}
</script>

<style scoped>
</style>
