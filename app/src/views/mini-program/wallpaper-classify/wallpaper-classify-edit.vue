<!-- 编辑弹窗 -->
<template>
  <app-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改壁纸分类':'添加壁纸分类'"
    :visible="visible"
    custom-class="ele-dialog-form develop-dialog"
    width="500px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      class="develop-dialog-form"
      :model="form"
      :rules="rules"
      label-width="82px">
      <el-form-item
        label="分类名称:"
        prop="name">
        <el-input
          v-model="form.name"
          :maxlength="20"
          clearable
          placeholder="请输入分类名称"/>
      </el-form-item>
      <el-form-item label="排序号:" prop="sort">
        <el-input-number
          v-model="form.sort"
          :min="0"
          class="ele-fluid ele-text-left"
          controls-position="right"
          placeholder="请输入排序号"/>
      </el-form-item>
      <el-form-item label="封面:" prop="picUrl">
        <div class="develop-dialog-media-card">
          <div class="field-desc">建议使用明亮简洁的封面图，便于列表与专题页统一展示。</div>
          <upload-qiniu-picture
            v-model="form.picUrl"
            :isAdmin="false"
            :prefix="'wallpaper_classify'"
            :maxSize="2"
            :maxNumber="1"
            @addPicture="handleImage"/>
        </div>
      </el-form-item>
      <el-form-item label="是否推荐:">
        <el-switch v-model="form.select" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="develop-dialog-footer">
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="save">保存
      </el-button>
    </div>
  </app-dialog>
</template>

<script>
import UploadQiniuPicture from "@/components/uploadQiniuPicture.vue";

export default {
  name: 'WallpaperClassify',
  components: {UploadQiniuPicture},
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'}
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
        if("select" in this.data) {
          this.$set(this.data, "select", !!this.data.select) // 转换成 boolean 值
        }

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
          let url = "/wallpaper-classify/add";
          if (this.isUpdate === true) {
            url = `/wallpaper-classify/${this.form.id}`
          }
          this.$http.post(url, this.form).then(res => {
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
    /* 更新封面 */
    handleImage(url) {
      this.form.picUrl = url
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
  border: 1px solid var(--notebook-dialog-item-border, rgba(214, 222, 232, 0.92));
  border-radius: 16px;
  background: var(--notebook-dialog-item-bg, linear-gradient(180deg, #ffffff 0%, #f8fafc 100%));
  box-shadow: var(--notebook-dialog-item-shadow, 0 12px 28px rgba(15, 23, 42, 0.05));
}

.develop-dialog-form ::v-deep .el-form-item__label {
  padding: 0 12px 0 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--notebook-dialog-label, #4b5563);
}

.develop-dialog-form ::v-deep .el-input__inner,
.develop-dialog-form ::v-deep .el-textarea__inner,
.develop-dialog-form ::v-deep .el-select .el-input__inner,
.develop-dialog-form ::v-deep .el-input-number .el-input__inner {
  border-radius: 12px;
  border-color: var(--notebook-dialog-input-border, rgba(210, 218, 230, 0.95));
  background: var(--notebook-dialog-input-bg, rgba(255, 255, 255, 0.96));
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.04);
}

.develop-dialog-form ::v-deep .el-input__inner:focus,
.develop-dialog-form ::v-deep .el-textarea__inner:focus,
.develop-dialog-form ::v-deep .el-select .el-input__inner:focus,
.develop-dialog-form ::v-deep .el-input-number .el-input__inner:focus {
  border-color: var(--notebook-dialog-input-focus-border, #98aecd);
  box-shadow: var(--notebook-dialog-input-focus-shadow, 0 0 0 3px rgba(82, 126, 196, 0.08));
}

.develop-dialog-form ::v-deep .field-desc {
  margin-bottom: 10px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--notebook-dialog-desc, #8a94a6);
}

.develop-dialog-form ::v-deep .el-form-item:last-child {
  margin-bottom: 0;
}

.develop-dialog-media-card {
  padding: 14px;
  border: 1px solid var(--notebook-dialog-panel-border, rgba(208, 217, 230, 0.96));
  border-radius: 18px;
  background: var(--notebook-dialog-panel-bg, linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(246, 249, 252, 0.98) 100%));
  box-shadow: var(--notebook-dialog-panel-shadow,
    inset 0 1px 0 rgba(255, 255, 255, 0.82),
    0 10px 24px rgba(15, 23, 42, 0.05));
}

.develop-dialog-media-card ::v-deep .avatar-uploader .el-upload,
.develop-dialog-media-card ::v-deep .upload-demo .el-upload,
.develop-dialog-media-card ::v-deep .el-upload-dragger {
  width: 100%;
  min-height: 176px;
  border-radius: 14px;
  border-color: var(--notebook-dialog-upload-border, rgba(186, 198, 214, 0.96));
  background: var(--notebook-dialog-upload-bg, linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(242, 246, 251, 0.96) 100%));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.86);
}

.develop-dialog-media-card ::v-deep .avatar-uploader .el-upload:hover,
.develop-dialog-media-card ::v-deep .upload-demo .el-upload:hover,
.develop-dialog-media-card ::v-deep .el-upload-dragger:hover {
  border-color: var(--notebook-dialog-upload-hover-border, #8ba6cf);
}

.develop-dialog-media-card ::v-deep .avatar-uploader-icon,
.develop-dialog-media-card ::v-deep .el-upload__text,
.develop-dialog-media-card ::v-deep .el-upload__tip {
  color: var(--notebook-dialog-upload-text, #647083);
}
</style>
