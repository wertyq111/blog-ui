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
      <el-form-item label="壁纸:" prop="smallPicUrl">
        <upload-qiniu-picture
          v-model="form.smallPicUrl"
          :isAdmin="false"
          :prefix="'wallpaper'"
          style="margin-top: 10px"
          :maxSize="2"
          :maxNumber="1"
          @addPicture="handleWallpaper"/>
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
          placeholder="请输入描述"/>
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
