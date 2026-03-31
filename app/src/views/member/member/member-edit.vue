<!-- 编辑弹窗 -->
<template>
  <app-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改会员':'添加会员'"
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
      <div class="field-desc">维护会员基础资料、城市和等级信息，统一会员画像。</div>
      <el-form-item label="会员账号:">
        <span class="ele-text-primary">{{ form.user ? form.user.username : null }}</span>
      </el-form-item>
      <el-form-item label="会员头像：">
        <uploadImage v-model="form.avatar" :limit="1"></uploadImage>
      </el-form-item>
      <el-row :gutter="15">
        <el-col :sm="12">
          <el-form-item label="会员姓名:" prop="realname">
            <el-input
              v-model="form.realname"
              :maxlength="20"
              clearable
              placeholder="请输入会员姓名"/>
          </el-form-item>
          <el-form-item label="性别:" prop="gender">
            <el-select
              v-model="form.gender"
              class="ele-block"
              clearable
              placeholder="请选择性别">
              <el-option :value="1" label="男"/>
              <el-option :value="2" label="女"/>
              <el-option :value="3" label="保密"/>
            </el-select>
          </el-form-item>
          <el-form-item label="设备类型:" prop="device">
            <el-select
              v-model="form.device"
              class="ele-block"
              clearable
              placeholder="请选择设备类型">
              <el-option :value="1" label="苹果"/>
              <el-option :value="2" label="安卓"/>
              <el-option :value="3" label="WAP站"/>
              <el-option :value="4" label="PC站"/>
              <el-option :value="5" label="后台"/>
            </el-select>
          </el-form-item>
          <el-form-item label="所在城市:" prop="city">
            <el-cascader
              v-model="city"
              :options="regions.cityData"
              class="ele-fluid"
              clearable
              placeholder="请选择省市区"
              popper-class="ele-pop-wrap-higher"/>
          </el-form-item>
          <el-form-item label="状态:" prop="status">
            <el-radio-group
              v-model="form.status">
              <el-radio :label="1">在用</el-radio>
              <el-radio :label="2">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="会员昵称:" prop="nickname">
            <el-input
              v-model="form.nickname"
              :maxlength="20"
              clearable
              placeholder="请输入会员昵称"/>
          </el-form-item>
          <el-form-item label="出生日期:" prop="birthday">
            <el-date-picker
              v-model="form.birthday"
              class="ele-fluid"
              placeholder="请选择出生日期"
              type="date"
              value-format="yyyy-MM-dd"/>
          </el-form-item>
          <el-form-item label="会员来源:" prop="source">
            <el-select
              v-model="form.source"
              class="ele-block"
              clearable
              placeholder="请选择会员来源">
              <el-option :value="1" label="APP注册"/>
              <el-option :value="2" label="小程序注册"/>
              <el-option :value="3" label="网站注册"/>
              <el-option :value="4" label="WAP站注册"/>
              <el-option :value="5" label="马甲会员"/>
            </el-select>
          </el-form-item>
          <el-form-item label="详细地址:" prop="address">
            <el-input
              v-model="form.address"
              :maxlength="150"
              clearable
              placeholder="请输入详细地址"/>
          </el-form-item>
          <el-form-item label="会员等级:" prop="memberLevel">
            <el-select
              v-model="form.memberLevel"
              class="ele-block"
              clearable
              filterable
              placeholder="-请选择会员等级-"
              size="small">
              <el-option v-for="item in memberLevelList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="个人简介:">
        <el-input
          v-model="form.intro"
          :maxlength="200"
          :rows="3"
          clearable
          placeholder="请输入个人简介"
          type="textarea"/>
      </el-form-item>
      <el-form-item label="个人签名:">
        <el-input
          v-model="form.signature"
          :maxlength="200"
          :rows="3"
          clearable
          placeholder="请输入个人签名"
          type="textarea"/>
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
import uploadImage from '@/components/uploadImage.vue'
import regions from 'ele-admin/packages/regions';

export default {
  name: 'MemberEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  components: {uploadImage},
  data() {
    return {
      // 省市区数据
      regions: regions,
      // 选中的省市区
      city: [],
      // 选中的省市
      provinceCity: [],
      // 选中的省
      province: [],
      // 表单数据
      form: Object.assign({status: 1, gender: 1}, this.data),
      // 表单验证规则
      rules: {
        realname: [
          {required: true, message: '请输入会员姓名', trigger: 'blur'}
        ],
        nickname: [
          {required: true, message: '请输入会员名', trigger: 'blur'}
        ],
        gender: [
          {required: true, message: '请选择性别', trigger: 'blur'}
        ],
        birthday: [
          {required: true, message: '请选择出生日期', trigger: 'blur'}
        ],
        device: [
          {required: true, message: '请选择设备类型', trigger: 'blur'}
        ],
        source: [
          {required: true, message: '请选择注册来源', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择状态', trigger: 'blur'}
        ],
        memberLevel: [
          {required: true, message: '请选择会员等级', trigger: 'blur'}
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 会员等级列表
      memberLevelList: [],
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data, {
          // 清空密码
          password: "",
        });
        // 取值赋予城市组件
        this.city = this.data.city;
        this.isUpdate = true;
      } else {
        this.form = {};
        this.isUpdate = false;
        // 清空省市区控件
        this.city = [];
      }
    }
  },
  mounted() {
    // 获取职级列表
    this.getMemberLevelList();
  },
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          // 城市数据处理
          this.form = Object.assign({}, this.form, {
            city: this.city
          });
          // 区别添加还是编辑
          let url = "/members/add";
          if (this.isUpdate === true) {
            url = `/members/${this.form.id}`
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
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },
    /**
     * 获取会员等级列表
     */
    getMemberLevelList() {
      this.$http.get('/member-level/list').then(res => {
        if (res.data.code === 0) {
          this.memberLevelList = res.data.data;
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
