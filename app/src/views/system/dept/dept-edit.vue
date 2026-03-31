<!-- 编辑弹窗 -->
<template>
  <app-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改部门':'添加部门'"
    :visible="visible"
    custom-class="ele-dialog-form develop-dialog"
    width="750px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      class="develop-dialog-form"
      :model="form"
      :rules="rules"
      label-width="92px"
      @keyup.enter.native="save"
      @submit.native.prevent>
      <div class="field-desc">维护部门名称、编码、层级和排序，保持组织树展示一致。</div>
      <el-row :gutter="15">
        <el-col :sm="12">
          <el-form-item label="部门名称:" prop="name">
            <el-input
              v-model="form.name"
              clearable
              placeholder="请输入部门名称"/>
          </el-form-item>
          <el-form-item label="部门编码:" prop="code">
            <el-input
              v-model="form.code"
              clearable
              placeholder="请输入部门编码"/>
          </el-form-item>
          <el-form-item label="部门类型:" prop="type">
            <el-select
              v-model="form.type"
              class="ele-block"
              clearable
              placeholder="请选择部门类型">
              <el-option :value="1" label="公司"/>
              <el-option :value="2" label="子公司"/>
              <el-option :value="3" label="部门"/>
              <el-option :value="4" label="小组"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="部门全称:" prop="fullname">
            <el-input
              v-model="form.fullname"
              clearable
              placeholder="请输入部门名称"/>
          </el-form-item>
          <el-form-item label="上级部门:">
            <treeselect
              v-model="form.pid"
              :defaultExpandLevel="3"
              :normalizer="normalizer"
              :options="deptList"
              placeholder="请选择上级部门"/>
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
      </el-row>
      <el-form-item label="备注:">
        <el-input
          v-model="form.note"
          :maxlength="200"
          :rows="4"
          clearable
          placeholder="请输入备注"
          type="textarea"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="develop-dialog-footer">
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
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

export default {
  name: 'DeptEdit',
  components: {Treeselect},
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 全部部门数据
    deptList: Array
  },
  data() {
    return {
      // 表单数据
      form: this.initFormData(this.data),
      // 表单验证规则
      rules: {
        name: [
          {required: true, message: '请输入部门名称', trigger: 'blur'}
        ],
        fullname: [
          {required: true, message: '请输入部门全称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入部门编码', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请选择部门类型', trigger: 'blur'}
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
      this.isUpdate = !!(this.data && this.data.id);
      this.form = this.initFormData(this.data);
    }
  },
  methods: {
    /* 下拉树格式化 */
    normalizer(d) {
      return {
        id: d.id,
        label: d.name,
        children: d.children || undefined
      };
    },
    /* 保存编辑 */
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$http.post('/dept/edit',
            Object.assign({}, this.form, {
              pid: this.form.pid || 0
            })
          ).then(res => {
            this.loading = false;
            if (res.data.code === 0) {
              this.$message.success(res.data.msg);
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
    },
    /* 初始化form数据 */
    initFormData(data) {
      // 初始化默认值
      let form = {type: 1};
      if (data) {
        Object.assign(form, data, {
          pid: data.pid === 0 ? null : data.pid,
        });
      }
      return form;
    },
  }
}
</script>

<style scoped>
</style>
