<!-- 编辑弹窗 -->
<template>
  <app-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改壁纸分类':'添加壁纸分类'"
    :visible="visible"
    width="500px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
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
        <upload-qiniu-picture
          v-model="form.picUrl"
          :isAdmin="false"
          :prefix="'wallpaper_classify'"
          style="margin-top: 10px"
          :maxSize="2"
          :maxNumber="1"
          @addPicture="handleImage"/>
      </el-form-item>
      <el-form-item label="是否推荐:">
        <el-switch v-model="form.select" />
      </el-form-item>
    </el-form>
    <div slot="footer">
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
</style>
