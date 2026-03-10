<!-- 编辑弹窗 -->
<template>
  <el-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改壁纸':'添加壁纸'"
    :visible="visible"
    custom-class="ele-dialog-form"
    width="750px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
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
        <tinymce-editor :height="300" v-model="form.content" :init="initEditor"/>
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
        <upload-qiniu-picture
          v-model="form.cover"
          :isAdmin="false"
          :prefix="'articleCover'"
          style="margin-top: 10px"
          :maxSize="2"
          :maxNumber="1"
          @addPicture="handleCover"/>
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
  </el-dialog>
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
        skin_url: '/tinymce/skins/ui/oxide',
        content_css: '/tinymce/skins/content/default/content.css',
        language_url: '/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        plugins: 'code print preview fullscreen paste searchreplace save autosave link autolink image imagetools media table codesample lists advlist hr charmap emoticons anchor directionality pagebreak quickbars nonbreaking visualblocks visualchars wordcount',
        toolbar: 'fullscreen preview code | undo redo | forecolor backcolor | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | formatselect fontselect fontsizeselect | link image media emoticons charmap anchor pagebreak codesample | ltr rtl',
        toolbar_drawer: 'sliding',
        images_upload_handler: async (blobInfo, success, error) => {``
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
