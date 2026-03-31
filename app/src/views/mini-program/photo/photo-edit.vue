<!-- 编辑弹窗 -->
<template>
  <app-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改照片':'添加照片'"
    :visible="visible"
    custom-class="ele-dialog-form develop-dialog"
    width="750px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      class="develop-dialog-form"
      :model="form"
      :rules="rules"
      label-width="82px">
      <el-form-item label="照片:" prop="url">
        <div class="develop-dialog-media-card">
          <div class="field-desc">建议上传清晰照片，预览会自动生成适合列表的缩略图。</div>
          <upload-qiniu-picture
            v-model="form.smallPicUrl"
            :isAdmin="false"
            :prefix="'photos'"
            :maxSize="2"
            :maxNumber="1"
            @addPicture="handlePhoto"/>
        </div>
      </el-form-item>
      <el-form-item label="相册:" prop="categoryId">
        <el-col :span="8">
          <el-select
            v-model="form.categoryId"
            class="ele-block"
            clearable
            filterable
            placeholder="-请选择相册-"
            size="small">
            <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="描述:">
        <el-col :span="8">
        <el-input
          v-model="form.remark"
          clearable
          placeholder="请输入描述"/>
        </el-col>
      </el-form-item>
    </el-form>
    <div slot="footer" class="develop-dialog-footer">
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
import UploadQiniuPicture from "@/components/uploadQiniuPicture.vue";

export default {
  name: 'PhotoEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 相册
    categories: Array,
  },
  components: {UploadQiniuPicture},
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        categoryId: [
          {required: true, message: '请选择相册', trigger: 'change'}
        ],
        url: [
          {required: true, message: '请添加照片', trigger: 'blur'}
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
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          // 城市数据处理
          this.form = Object.assign({}, this.form);
          // 区别添加还是编辑
          let url = "/photo/add";
          if (this.isUpdate === true) {
            url = `/photo/${this.form.id}`
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

    /* 更新照片图片 */
    handlePhoto(url) {
      this.form.url = url
      this.form.smallPicUrl = url + "?imageMogr2/thumbnail/!30p"
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
  border: 1px solid rgba(214, 222, 232, 0.92);
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
}

.develop-dialog-form ::v-deep .el-form-item__label {
  padding: 0 12px 0 0;
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
}

.develop-dialog-form ::v-deep .el-input__inner,
.develop-dialog-form ::v-deep .el-textarea__inner,
.develop-dialog-form ::v-deep .el-select .el-input__inner,
.develop-dialog-form ::v-deep .el-input-number .el-input__inner {
  border-radius: 12px;
  border-color: rgba(210, 218, 230, 0.95);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.04);
}

.develop-dialog-form ::v-deep .el-input__inner:focus,
.develop-dialog-form ::v-deep .el-textarea__inner:focus,
.develop-dialog-form ::v-deep .el-select .el-input__inner:focus,
.develop-dialog-form ::v-deep .el-input-number .el-input__inner:focus {
  border-color: #98aecd;
  box-shadow: 0 0 0 3px rgba(82, 126, 196, 0.08);
}

.develop-dialog-form ::v-deep .field-desc {
  margin-bottom: 10px;
  font-size: 12px;
  line-height: 1.6;
  color: #8a94a6;
}

.develop-dialog-form ::v-deep .el-form-item:last-child {
  margin-bottom: 0;
}

.develop-dialog-media-card {
  padding: 14px;
  border: 1px solid rgba(208, 217, 230, 0.96);
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(246, 249, 252, 0.98) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.82),
    0 10px 24px rgba(15, 23, 42, 0.05);
}

.develop-dialog-media-card ::v-deep .avatar-uploader .el-upload,
.develop-dialog-media-card ::v-deep .upload-demo .el-upload,
.develop-dialog-media-card ::v-deep .el-upload-dragger {
  width: 100%;
  min-height: 176px;
  border-radius: 14px;
  border-color: rgba(186, 198, 214, 0.96);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(242, 246, 251, 0.96) 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.86);
}

.develop-dialog-media-card ::v-deep .avatar-uploader .el-upload:hover,
.develop-dialog-media-card ::v-deep .upload-demo .el-upload:hover,
.develop-dialog-media-card ::v-deep .el-upload-dragger:hover {
  border-color: #8ba6cf;
}

.develop-dialog-media-card ::v-deep .avatar-uploader-icon,
.develop-dialog-media-card ::v-deep .el-upload__text,
.develop-dialog-media-card ::v-deep .el-upload__tip {
  color: #647083;
}

.score {
  margin-top: 10px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
