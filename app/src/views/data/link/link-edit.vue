<!-- 编辑弹窗 -->
<template>
  <app-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改友链':'添加友链'"
    :visible="visible"
    width="750px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="82px">
      <el-form-item label="友链图片：">
        <uploadImage v-model="form.image" :limit="1"></uploadImage>
      </el-form-item>
      <el-row :gutter="15">
        <el-col :sm="12">
          <el-form-item label="友链名称:" prop="name">
            <el-input
              v-model="form.name"
              :maxlength="150"
              clearable
              placeholder="请输入友链名称"/>
          </el-form-item>
          <el-form-item label="友链URL:" prop="url">
            <el-input
              v-model="form.url"
              :maxlength="255"
              clearable
              placeholder="请输入友链URL"/>
          </el-form-item>
          <el-form-item label="友链形式:" prop="form">
            <el-radio-group
              v-model="form.form">
              <el-radio :label="1">文字链接</el-radio>
              <el-radio :label="2">图片链接</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序号:" prop="sort">
            <el-input-number
              v-model="form.sort"
              :min="0"
              class="ele-fluid ele-text-left"
              controls-position="right"
              placeholder="请输入排序号"/>
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="友链类型:" prop="type">
            <el-select
              v-model="form.type"
              class="ele-block"
              clearable
              placeholder="请选择友链类型">
              <el-option :value="1" label="友情链接"/>
              <el-option :value="2" label="合作伙伴"/>
            </el-select>
          </el-form-item>
          <el-form-item label="友链平台:" prop="platform">
            <el-select
              v-model="form.platform"
              class="ele-block"
              clearable
              placeholder="请选择友链平台">
              <el-option :value="1" label="PC站"/>
              <el-option :value="2" label="WAP站"/>
              <el-option :value="3" label="微信小程序"/>
              <el-option :value="4" label="APP应用"/>
            </el-select>
          </el-form-item>
          <el-form-item label="友链状态:" prop="status">
            <el-radio-group
              v-model="form.status">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注:">
        <el-input
          v-model="form.note"
          :maxlength="200"
          :rows="3"
          clearable
          placeholder="请输入备注"
          type="textarea"/>
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
import uploadImage from '@/components/uploadImage.vue'

export default {
  name: 'LinkEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  components: {uploadImage},
  data() {
    return {
      // 表单数据
      form: Object.assign({status: 1}, this.data),
      // 表单验证规则
      rules: {
        name: [
          {required: true, message: '请输入友链名称', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择友链状态', trigger: 'blur'}
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
          this.$http.post('/link/edit', this.form).then(res => {
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
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
}
</script>

<style scoped>
</style>
