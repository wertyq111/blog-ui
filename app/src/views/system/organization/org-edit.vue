<!-- 编辑弹窗 -->
<template>
  <el-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改机构':'添加机构'"
    :visible="visible"
    custom-class="ele-dialog-form"
    width="640px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="82px">
      <el-row :gutter="15">
        <el-col :sm="12">
          <el-form-item label="上级机构:">
            <treeselect
              v-model="form.parentId"
              :defaultExpandLevel="4"
              :normalizer="normalizer"
              :options="organizationList"
              placeholder="请选择上级机构"/>
          </el-form-item>
          <el-form-item
            label="机构名称:"
            prop="organizationName">
            <el-input
              v-model="form.organizationName"
              :maxlength="20"
              clearable
              placeholder="请输入机构名称"/>
          </el-form-item>
          <el-form-item
            label="机构全称:"
            prop="organizationFullName">
            <el-input
              v-model="form.organizationFullName"
              :maxlength="100"
              clearable
              placeholder="请输入机构全称"/>
          </el-form-item>
          <el-form-item
            label="机构代码:"
            prop="organizationCode">
            <el-input
              v-model="form.organizationCode"
              :maxlength="20"
              clearable
              placeholder="请输入机构代码"/>
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item
            label="机构类型:"
            prop="organizationType">
            <el-select
              v-model="form.organizationType"
              class="ele-fluid"
              clearable
              placeholder="请选择机构类型">
              <el-option
                v-for="(item,index) in organizationTypeList"
                :key="index"
                :label="item.dictDataName"
                :value="item.dictDataId"/>
            </el-select>
          </el-form-item>
          <el-form-item
            label="排序号:"
            prop="sortNumber">
            <el-input-number
              v-model="form.sortNumber"
              :max="99999"
              :min="0"
              class="ele-fluid ele-text-left"
              controls-position="right"
              placeholder="请输入排序号"/>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input
              v-model="form.comments"
              :maxlength="200"
              :rows="4"
              placeholder="请输入备注"
              type="textarea"/>
          </el-form-item>
        </el-col>
      </el-row>
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
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'OrgEdit',
  components: {Treeselect},
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 全部机构
    organizationList: Array
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data, {
        parentId: this.data ? (this.data.parentId === 0 ? null : this.data.parentId) : null
      }),
      // 表单验证规则
      rules: {
        organizationName: [
          {required: true, message: '请输入机构名称', trigger: 'blur'}
        ],
        organizationFullName: [
          {required: true, message: '请输入机构全称', trigger: 'blur'}
        ],
        organizationCode: [
          {required: true, message: '请输入机构代码', trigger: 'blur'}
        ],
        organizationType: [
          {required: true, message: '请选择机构类型', trigger: 'blur'}
        ],
        sortNumber: [
          {required: true, message: '请输入排序号', trigger: 'blur'}
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 机构类型列表
      organizationTypeList: []
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data, {
          parentId: this.data.parentId === 0 ? null : this.data.parentId
        });
        this.isUpdate = !!this.data.organizationId;
      } else {
        this.form = {};
        this.isUpdate = false;
      }
    }
  },
  mounted() {
    this.queryOrganizationType();  // 获取机构类型
  },
  methods: {
    /* 下拉树组件格式化数据 */
    normalizer(d) {
      return {
        id: d.organizationId,
        label: d.organizationName
      };
    },
    /* 保存编辑 */
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$http.post('/sys/organization',
            Object.assign({}, this.form, {
              parentId: this.form.parentId || 0
            })
          ).then(res => {
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
    },
    /* 查询机构类型 */
    queryOrganizationType() {
      this.$http.get('/sys/dictdata', {
        params: {
          dictCode: 'organization_type'
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.organizationTypeList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    }
  }
}
</script>

<style scoped>
</style>
