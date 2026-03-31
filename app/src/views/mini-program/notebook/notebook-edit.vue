<!-- 编辑弹窗 -->
<template>
  <app-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改壁纸':'添加壁纸'"
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
      <el-form-item label="标题:" prop="title">
        <el-col :span="8">
          <el-input
            v-model="form.title"
            :maxlength="20"
            clearable
            placeholder="请输入标题"/>
        </el-col>
      </el-form-item>
      <el-form-item label="内容:" prop="title">
        <div class="develop-dialog-editor-card">
          <div class="field-desc">支持图文混排，建议先完成正文结构，再补充封面图。</div>
          <tinymce-editor :height="300" v-model="form.content" :init="initEditor"/>
        </div>
      </el-form-item>
      <el-form-item label="文章分类:" prop="categoryId">
        <el-col :span="8">
          <el-select
            v-model="form.categoryId"
            class="ele-block"
            clearable
            filterable
            placeholder="-请选择分类-"
            @change="handleLabels"
            size="small">
            <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="文章标签:" prop="labelId">
        <el-col :span="8">
          <el-select
            v-model="form.labelId"
            class="ele-block"
            clearable
            filterable
            placeholder="-请选择标签-"
            size="small">
            <el-option v-for="item in labels" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="背景:" prop="cover">
        <div class="develop-dialog-media-card">
          <div class="field-desc">建议使用横图或留白充足的封面，便于文章卡片与详情页统一展示。</div>
          <upload-qiniu-picture
            v-model="form.cover"
            :isAdmin="false"
            :prefix="'articleCover'"
            :maxSize="2"
            :maxNumber="1"
            @addPicture="handleCover"/>
        </div>
      </el-form-item>
      <el-form-item label="启用评论:" prop="comment_status">
        <el-switch
          v-model="form.commentStatus"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="是"
          inactive-text="否">
        </el-switch>
      </el-form-item>
      <el-form-item label="是否推荐:" prop="comment_status">
        <el-switch
          v-model="form.recommendStatus"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="是"
          inactive-text="否">
        </el-switch>
      </el-form-item>
      <el-form-item label="是否可见:" prop="comment_status">
        <el-switch
          v-model="form.viewStatus"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="是"
          inactive-text="否">
        </el-switch>
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
import TinymceEditor from '@/components/TinymceEditor/index.vue';
import setting from '@/config/setting';

export default {
  name: 'NotebookEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 文章分类
    categories: Array,
  },
  components: {UploadQiniuPicture, TinymceEditor},
  data() {
    return {
      // 表单数据
      form: Object.assign({comment_status: 0, recommend_status: 0, view_status: 0}, this.data),
      // 表单验证规则
      rules: {
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'}
        ],
        categoryId: [
          {required: true, message: '请选择文章分类', trigger: 'change'}
        ],
        labelId: [
          {required: true, message: '请选择文章标签', trigger: 'change'}
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 标签
      labels: []
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
        this.handleLabels(this.data.categoryId);
      } else {
        this.form = {};
        this.isUpdate = false;
      }
    }
  },
  computed: {
    // 初始化富文本
    initEditor() {
      return {
        height: 300,
        branding: false,
        language_url: '/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        plugins: 'code print preview fullscreen paste searchreplace save autosave link autolink image imagetools media table codesample lists advlist hr charmap emoticons anchor directionality pagebreak quickbars nonbreaking visualblocks visualchars wordcount',
        toolbar: 'fullscreen preview code | undo redo | forecolor backcolor | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | formatselect fontselect fontsizeselect | link image media emoticons charmap anchor pagebreak codesample | ltr rtl',
        toolbar_drawer: 'sliding',
        images_upload_handler: async (blobInfo, success, error) => {
          let file = blobInfo.blob();

          // 上传到七牛云
          let result = await this.upLoadToQiniu(file);
          console.log(result)
          if (result.status === 200) {
            let picUrl = setting.qiniuDownloadnUrl + "/" + result.data.key
            picUrl = await this.getPrivatePicUrl(picUrl)
            success(picUrl);
          } else {
            error("图片上传失败");
          }
        },
        file_picker_types: 'media',
        file_picker_callback: () => {
        }
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
          let url = "/articles/add";
          if (this.isUpdate === true) {
            url = `/articles/${this.form.id}`
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

    /* 更新壁纸图片 */
    async handleCover(url) {
      this.form.url = url
      this.form.cover = await this.getPrivatePicUrl(url)
    },

    /* 上传图片 */
    async upLoadToQiniu(file) {
      const config = {
        headers: {"Content-Type": "multipart/form-data"}
      };
      let fileType = "";
      if (file.type === "image/png") {
        fileType = "png";
      } else {
        fileType = "jpg";
      }
      // 重命名要上传的文件
      const key = `articlePicture/${new Date().getTime()}${Math.random().toString(36).slice(2)}.${fileType}`;
      // 上传时候的Token,可前端自己生成,安全起见后端生成！
      // 这里是express后端生成的Token
      const res = await this.$http.get("/qiniu/up-token");
      const token = res.data.data.upToken;
      const FormData = require('form-data');
      let formData = new FormData();
      formData.append("file", file);
      formData.append("token", token);
      formData.append("key", key);
      return await this.$http.post(setting.qiniuUploadUrl, formData, config);
    },

    /* 上传图片前的准备 */
    beforeUpload(file) {
      // debugger
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isJPG) {
        this.$message({
          showClose: true,
          message: "上传图片只能是JPG/PNG 格式!",
          type: "error"
        });
      }
      if (!isLt10M) {
        this.$message({
          showClose: true,
          message: "上传头像图片大小不能超过 10MB!",
          type: "error"
        });
      }
      return isJPG && isLt10M;
    },

    /* 获取私有图片地址 */
    async getPrivatePicUrl(url) {
      let res = await this.$http.get("/qiniu/private-url", {params: {url, percent: 30}})
      if (res.status === 200) {
        console.log(res.data.data.url)
        return res.data.data.url
      }
    },

    /* 处理分类下的标签 */
    handleLabels(categoryId) {
      let index = this.categories.findIndex((c) => {
        return categoryId === c.id;
      });
      this.labels = this.categories[index].labels

      // 清空标签列表,如果有选中的优先选中标签
      let checkLabelIndex = this.labels.findIndex((l) => {
        return this.data.labelId === l.id;
      })

      if (checkLabelIndex === -1) {
        this.form.labelId = null
      } else {
        this.form.labelId = this.data.labelId
      }
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

.develop-dialog-media-card,
.develop-dialog-editor-card {
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

.develop-dialog-editor-card ::v-deep .tox-tinymce {
  border: 0 !important;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: none;
}

.develop-dialog-editor-card ::v-deep .tox-editor-container,
.develop-dialog-editor-card ::v-deep .tox-editor-header {
  border-radius: 14px;
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
