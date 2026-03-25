<!-- 编辑弹窗 -->
<template>
  <app-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改日常':'添加日常'"
    :visible="visible"
    custom-class="ele-dialog-form daily-edit-dialog"
    width="900px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      class="daily-edit-form"
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
          <el-form-item label="平台:" prop="platformIds">
            <el-select v-model="form.platformIds" multiple placeholder="请选择平台" style="width: 100%">
              <el-option v-for="item in platforms" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :sm="24">
          <el-form-item label="各平台内容:" prop="platformContents">
            <div v-for="pid in form.platformIds" :key="pid" class="daily-edit-platform-card">
              <div class="daily-edit-platform-card__title">{{ findPlatformName(pid) || pid }}</div>
              <mavon-editor v-model="form.platformContents[pid]" :toolbarsFlag="true" :subfield="true" />
            </div>
            <el-input v-if="allowCustom" v-model="form.customPlatformName" class="daily-edit-custom-name" placeholder="新增临时平台名（可选）"/>
            <div v-if="allowCustom && form.customPlatformName" class="daily-edit-platform-card daily-edit-platform-card--custom">
              <div class="daily-edit-platform-card__title">{{ form.customPlatformName }}</div>
              <mavon-editor v-model="form.customPlatformContent" :toolbarsFlag="true" :subfield="true" />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="daily-edit-footer">
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button :loading="loading" type="primary" @click="save">保存</el-button>
    </div>
  </app-dialog>
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
        platformIds: [{required: true, message: '请选择平台', trigger: 'change'}],
        platformContents: [
          {
            validator: (rule, value, callback) => {
              const ids = this.form.platformIds || [];
              const contents = this.form.platformContents || {};
              if (!ids.length) {
                return callback(new Error('请选择并填写平台内容'));
              }
              const missing = ids.filter(id => !contents[id] || !contents[id].trim());
              if (missing.length) {
                return callback(new Error('请填写已选择平台的内容'));
              }
              callback();
            },
            trigger: 'blur'
          }
        ]
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
    },
    'form.platformIds'(val) {
      if (!this.form.platformContents) {
        this.$set(this.form, 'platformContents', {});
      }
      (val || []).forEach(id => {
        if (this.form.platformContents[id] === undefined) {
          this.$set(this.form.platformContents, id, '');
        }
      });
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
.daily-edit-form ::v-deep .el-form-item__label {
  color: rgba(226, 240, 255, 0.88);
  font-weight: 600;
}

.daily-edit-form ::v-deep .el-input__inner,
.daily-edit-form ::v-deep .el-textarea__inner,
.daily-edit-form ::v-deep .el-date-editor.el-input__inner {
  background: rgba(8, 15, 26, 0.82);
  border: 1px solid rgba(97, 160, 224, 0.2);
  border-radius: 14px;
  color: #eef6ff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.daily-edit-form ::v-deep .el-input__inner::placeholder,
.daily-edit-form ::v-deep .el-textarea__inner::placeholder {
  color: rgba(152, 181, 214, 0.56);
}

.daily-edit-platform-card {
  margin-bottom: 16px;
  border: 1px solid rgba(98, 174, 239, 0.18);
  border-radius: 18px;
  padding: 14px;
  background:
    radial-gradient(circle at top right, rgba(43, 160, 255, 0.14), transparent 28%),
    linear-gradient(180deg, rgba(14, 24, 37, 0.88) 0%, rgba(10, 18, 30, 0.92) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 16px 28px rgba(2, 8, 18, 0.18);
}

.daily-edit-platform-card__title {
  margin-bottom: 10px;
  color: #f0f7ff;
  font-size: 14px;
  font-weight: 700;
}

.daily-edit-custom-name {
  margin-top: 8px;
}

.daily-edit-platform-card--custom {
  margin-top: 12px;
}

.daily-edit-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.daily-edit-footer ::v-deep .el-button {
  border-radius: 12px;
}

.daily-edit-form ::v-deep .v-note-wrapper {
  min-height: 360px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(94, 153, 214, 0.18);
  box-shadow: 0 14px 28px rgba(2, 9, 19, 0.18);
}

.daily-edit-form ::v-deep .v-note-op,
.daily-edit-form ::v-deep .v-note-panel,
.daily-edit-form ::v-deep .v-show-content,
.daily-edit-form ::v-deep .content-input-wrapper,
.daily-edit-form ::v-deep .auto-textarea-input,
.daily-edit-form ::v-deep .v-note-show {
  background: #0b1421 !important;
  color: #eef6ff !important;
}

.daily-edit-form ::v-deep .v-note-op {
  border-bottom: 1px solid rgba(94, 153, 214, 0.16);
}

.daily-edit-form ::v-deep .v-note-op .op-icon,
.daily-edit-form ::v-deep .v-note-op .op-icon.dropdown-wrapper {
  color: rgba(200, 224, 248, 0.78) !important;
}
</style>
