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
          <el-form-item label="平台:" prop="platforms">
            <el-select v-model="form.platformIds" multiple placeholder="请选择平台" style="width: 100%">
              <el-option v-for="item in platforms" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :sm="24">
          <el-form-item label="各平台内容:" prop="platforms">
            <div v-for="pid in form.platformIds" :key="pid" style="margin-bottom: 16px; border:1px solid #ebeef5; padding:10px; border-radius:4px">
              <div style="font-weight:600; margin-bottom:8px">{{ findPlatformName(pid) || pid }}</div>
              <mavon-editor v-model="form.platformContents[pid]" :toolbarsFlag="true" :subfield="true" />
            </div>
            <el-input v-if="allowCustom" v-model="form.customPlatformName" placeholder="新增临时平台名（可选）" style="margin-top:8px;"/>
            <mavon-editor v-if="allowCustom && form.customPlatformName" v-model="form.customPlatformContent" :toolbarsFlag="true" :subfield="true" style="margin-top:8px" />
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
    },
    findPlatformName: {
      type: Function,
      default: () => ''
    }
  },
  data() {
    return {
      form: Object.assign({}, this.data),
      rules: {
        logDate: [{required: true, message: '请选择日期', trigger: 'change'}],
        platforms: [{required: true, message: '请选择并填写平台内容', trigger: 'change'}]
      },
      loading: false,
      isUpdate: false,
      allowCustom: true
    };
  },
  watch: {
    data() {
      if (this.data) {
        // 初始化 form from existing data structure
        const init = Object.assign({}, this.data);
        init.platformIds = [];
        init.platformContents = {};
        if (init.content && init.content.platforms) {
          init.content.platforms.forEach(p => {
            if (p.platformId) {
              init.platformIds.push(p.platformId);
              init.platformContents[p.platformId] = p.content;
            } else if (p.platformName) {
              init.customPlatformName = p.platformName;
              init.customPlatformContent = p.content;
            }
          });
        }
        this.form = init;
        this.isUpdate = true;
      } else {
        this.form = {logDate: '', platformIds: [], platformContents: {}, customPlatformName: '', customPlatformContent: ''};
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

          const platforms = [];
          (this.form.platformIds || []).forEach(pid => {
            platforms.push({platformId: pid, content: this.form.platformContents[pid] || ''});
          });
          if (this.form.customPlatformName) {
            platforms.push({platformId: null, platformName: this.form.customPlatformName, content: this.form.customPlatformContent || ''});
          }

          const payload = {
            log_date: this.formatDate(this.form.logDate),
            platforms: platforms
          };

          this.$http.post(url, payload).then(res => {
            this.loading = false;
            if (res.data.code === 0) {
              this.$message({type: 'success', message: res.data.msg || '保存成功'});
              if (!this.isUpdate) {
                this.form = {logDate: '', platformIds: [], platformContents: {}, customPlatformName: '', customPlatformContent: ''};
              }
              this.updateVisible(false);
              this.$emit('done');
            } else {
              this.$message.error(res.data.msg || '保存失败');
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
