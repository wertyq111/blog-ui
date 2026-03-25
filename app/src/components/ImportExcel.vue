<!-- 用户导入弹窗 -->
<template>
  <app-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :visible="visible"
    :title="title"
    width="480px"
    @update:visible="updateVisible">
    <div v-if="errors.length > 0"
         :style="'height:calc(100vh - ' + (errors.length < 5 ? 800 - (errors.length * 50) : 700) + 'px);'">
      <el-scrollbar style="height: 100%;"> <!-- 滚动条 -->
        <el-alert
          v-for="(msg, index) in errors"
          :key="index"
          :title="msg"
          type="error">
        </el-alert>
      </el-scrollbar><!-- /滚动条 -->
    </div>
    <el-upload
      v-loading="loading"
      :before-upload="beforeUpload"
      :show-file-list="false"
      accept=".xls,.xlsx"
      action=""
      class="ele-block"
      drag>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或 <em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip ele-text-center">
        <span>只能上传xls、xlsx文件，</span>
      </div>
    </el-upload>
  </app-dialog>
</template>

<script>

export default {
  name: 'ImportExcel',
  props: {
    // 是否打开弹窗
    visible: Boolean,
    // 导入标题
    title: {
      type: String,
      default: ""
    },
    // 导入文件夹
    target: {
      String,
      default: ""
    },
    // 模板文件名
    template_file_name: String,
    // 导入 url
    url: String,
    // 参数
    params: {
      Object,
      default: null
    },
    // 动态模板地址
    dynamic_template_url: {
      String,
      default: null
    }
  },
  data() {
    return {
      // 导入请求状态
      loading: false,
      // 导入模板下载地址
      templateUrl: this.dynamic_template_url
        ? this.dynamic_template_url
        : `${process.env.VUE_APP_API_BASE_URL}/downloads/template/${this.template_file_name}.xls`,
      // 导入请求 url
      targetUrl: '/' + this.target + '/import',
      // 错误列表
      errors: []
    };
  },
  methods: {
    /* 上传 */
    beforeUpload(file) {
      this.loading = true;
      let formData = new FormData();
      formData.append('file', file);
      if (this.params !== null) {
        for (let key in this.params) {
          formData.append(key, this.params[key])
        }
      }
      this.$http.post(this.targetUrl, formData).then(res => {
        this.loading = false;
        if (res.data.code === 0) {
          console.log(res.data)
          this.$message({type: 'success', message: res.data.data.message});
          this.errors = []
          res.data.data.errors.forEach(err => {
            this.errors.push(err)
          })

          if (this.errors.length === 0) {
            this.updateVisible(false);
          }
          this.$emit('done');
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.loading = false;
        this.$message.error(e.message);
      });
      return false;
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
}
</script>

<style scoped>
.ele-block ::v-deep .el-upload,
.ele-block ::v-deep .el-upload-dragger {
  width: 100%;
}
</style>
