<!-- 编辑弹窗 -->
<template>
  <app-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改用户':'添加用户'"
    :visible="visible"
    custom-class="ele-dialog-form develop-dialog"
    width="680px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      class="develop-dialog-form"
      :model="form"
      :rules="rules"
      label-width="82px">
      <div class="field-desc">维护后台账号、角色和状态，保证访问权限一致。</div>
      <el-row :gutter="15">
        <el-col :sm="12">
          <el-form-item label="邮箱:" prop="email">
            <el-input
              v-model="form.email"
              :maxlength="100"
              clearable
              placeholder="请输入邮箱"/>
          </el-form-item>
          <el-form-item label="用户账号:" prop="username">
            <el-input
              v-model="form.username"
              :disabled="isUpdate"
              :maxlength="20"
              clearable
              placeholder="请输入用户账号"/>
          </el-form-item>
          <el-form-item
            label="登录密码:"
            prop="password">
            <el-input
              v-model="form.password"
              :maxlength="20"
              placeholder="请输入登录密码"
              show-password/>
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="手机号:" prop="phone">
            <el-input
              v-model="form.phone"
              :maxlength="11"
              clearable
              placeholder="请输入手机号"/>
          </el-form-item>
          <el-form-item label="角色:" prop="role_ids">
            <el-select
              v-model="form.role_ids"
              class="ele-block"
              clearable
              multiple
              placeholder="请选择角色">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="状态:" prop="status">
            <el-radio-group
              v-model="form.status">
              <el-radio :label="1">在用</el-radio>
              <el-radio :label="2">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
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
import validate from 'ele-admin/packages/validate';

export default {
  name: 'UserEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({status: 1}, this.data),
      // 表单验证规则
      rules: {
        username: [
          {
            required: true,
            type: 'string',
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error('请输入用户账号'));
              }
              if(this.isUpdate) {
                callback()
              } else {
                this.$http.get('/users/checkUser?username=' + value).then(res => {
                  if (res.data.code !== 0 || !res.data.data.length) {
                    return callback();
                  }
                  if (this.isUpdate && res.data.data[0].username === this.data.username) {
                    return callback();
                  }
                  callback(new Error('账号已经存在'));
                }).catch(e => {
                  if(e.response) {
                    callback(new Error(e.response.data.data.message));
                  } else {
                    callback()
                  }
                });
              }

            }
          }
        ],
        status: [
          {required: true, message: '请选择状态', trigger: 'blur'}
        ],
        email: [
          {pattern: validate.email, message: '邮箱格式不正确', trigger: 'blur'}
        ],
        // password: [
        //   {required: true, pattern: /^[\S]{5,18}$/, message: '密码必须为5-18位非空白字符', trigger: 'blur'}
        // ],
        phone: [
          {pattern: validate.phone, message: '手机号格式不正确', trigger: 'blur'}
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 角色列表
      roleList: [],
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data, {
          role_ids: this.data.roles.map(d => d.id)
        });
        // 清空密码输入框
        this.$set(this.form, "password", "")
        this.isUpdate = true;
      } else {
        this.form = {};
        this.isUpdate = false;
      }
    }
  },
  mounted() {
    this.queryRoles();  // 查询角色列表
  },
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          let url = this.isUpdate ? `/users/${this.form.id}` : '/users/edit'
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
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },
    /* 查询角色列表 */
    queryRoles() {
      this.$http.get('/role/getRoleList').then(res => {
        if (res.data.code === 0) {
          this.roleList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
  }
}
</script>

<style scoped>
</style>
