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
      <el-form-item label="壁纸:" prop="smallPicUrl">
        <div class="develop-dialog-media-card">
          <div class="field-desc">建议上传高清壁纸，列表封面和详情预览会统一使用这张图。</div>
          <upload-qiniu-picture
            v-model="form.smallPicUrl"
            :isAdmin="false"
            :prefix="'wallpaper'"
            :maxSize="2"
            :maxNumber="1"
            @addPicture="handleWallpaper"/>
        </div>
      </el-form-item>
      <el-form-item label="壁纸分类:" prop="classId">
        <el-col :span="8">
          <el-select
            v-model="form.classId"
            class="ele-block"
            clearable
            filterable
            placeholder="-请选择分类-"
            size="small">
            <el-option v-for="item in classifies" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="发布者:" prop="nickname">
        <el-col :span="8">
          <el-input
            v-model="form.nickname"
            :maxlength="20"
            clearable
            placeholder="请输入发布者"/>
        </el-col>
      </el-form-item>
      <el-form-item label="描述:">
        <el-input
          v-model="form.description"
          type="textarea"
          clearable
          placeholder="请输入发布者"/>
      </el-form-item>
      <el-form-item label="评分:">
        <div class="score">
          <el-rate
            v-model="form.score"
            allow-half
            show-score
            score-template="{value}分"
            :colors="scoreColors">
          </el-rate>
        </div>
      </el-form-item>
      <el-form-item label="标签:">
        <el-tag
          :key="tag"
          v-for="tag in form.tags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{ tag }}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="tagVisible"
          v-model="tagValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleTagConfirm"
          @blur="handleTagConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showTag">+添加标签</el-button>
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
  name: 'WallpaperEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 壁纸分类
    classifies: Array,
  },
  components: {UploadQiniuPicture},
  data() {
    return {
      // 表单数据
      form: Object.assign({status: 1, gender: 1}, this.data),
      // 表单验证规则
      rules: {
        nickname: [
          {required: true, message: '请输入发布者', trigger: 'blur'}
        ],
        classId: [
          {required: true, message: '请选择壁纸分类', trigger: 'change'}
        ],
        smallPicUrl: [
          {required: true, message: '请添加壁纸', trigger: 'blur'}
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 评分颜色
      scoreColors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      // 标签编辑状态
      tagVisible: false,
      // 标签值
      tagValue: ''
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
          let url = "/wallpaper/add";
          if (this.isUpdate === true) {
            url = `/wallpaper/${this.form.id}`
          }
          console.log(url)
          console.log(this.form)
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

    /* 关闭标签 */
    handleClose(tag) {
      this.form.tags.splice(this.form.tags.indexOf(tag), 1);
    },

    /* 显示新标签 */
    showTag() {
      this.tagVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    /* 编辑标签 */
    handleTagConfirm() {
      let tagValue = this.tagValue;
      if (tagValue) {
        this.form.tags = this.form.tags ? this.form.tags : [];
        this.form.tags.push(tagValue);
      }
      this.tagVisible = false;
      this.tagValue = '';
    },

    /* 更新壁纸图片 */
    handleWallpaper(url) {
      this.form.url = url
      this.form.smallPicUrl = url + "?imageMogr2/thumbnail/!10p"
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
