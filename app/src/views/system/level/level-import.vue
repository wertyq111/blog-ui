<!-- 用户导入弹窗 -->
<template>
  <app-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :visible="visible"
    title="导入用户"
    width="480px"
    @update:visible="updateVisible">
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
        <el-link
          :href="url"
          :underline="false"
          download
          style="vertical-align: baseline;"
          type="primary">下载模板
        </el-link>
      </div>
    </el-upload>
  </app-dialog>
</template>

<script>
export default {
  name: 'LevelImport',
  props: {
    // 是否打开弹窗
    visible: Boolean
  },
  data() {
    return {
      // 导入请求状态
      loading: false,
      // 导入模板下载地址
      url: process.env.VUE_APP_API_BASE_URL + "/uploads/level.xlsx"
    };
  },
  methods: {
    /* 上传 */
    beforeUpload(file) {
      this.loading = true;
      let formData = new FormData();
      formData.append('file', file);
      this.$http.post('/level/importExcel', formData).then(res => {
        this.loading = false;
        if (res.data.code === 0) {
          this.$message({type: 'success', message: res.data.msg});
          this.updateVisible(false);
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
