<!-- 编辑弹窗 -->
<template>
  <el-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改照片':'添加照片'"
    :visible="visible"
    custom-class="ele-dialog-form"
    width="750px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="82px">
      <el-form-item label="照片:" prop="url">
        <upload-qiniu-picture
          v-model="form.smallPicUrl"
          :isAdmin="false"
          :prefix="'photos'"
          style="margin-top: 10px"
          :maxSize="2"
          :maxNumber="1"
          @addPicture="handlePhoto"/>
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
