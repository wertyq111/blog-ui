<template>
  <div class="ele-body">
    <el-row :gutter="15">
      <el-col :md="6" :sm="8">
        <el-card body-style="padding: 25px;" shadow="never">
          <div class="user-info-card">
            <!-- 头像上传 -->
            <uploadImage v-model="form.avatar" :limit="1" style="left: 0px"></uploadImage>
            <h2 class="user-info-name">vwms@netsun.com</h2>
            <div class="user-info-desc">
              谁的人生不是荆棘前行，你跌倒的时候，懊恼的时候，品尝眼泪的时候，都请你不要轻言放弃，因为从来没有一种坚持会被辜负。请你相信，你的坚持，终将美好。
            </div>
          </div>
          <div class="user-info-list">
            <div class="user-info-item">
              <i class="el-icon-user"></i>
              <span>资深架构师</span>
            </div>
            <div class="user-info-item">
              <i class="el-icon-user"></i>
              <span>浙江网盛生意宝股份邮箱公司</span>
            </div>
            <div class="user-info-item">
              <i class="el-icon-location-information"></i>
              <span>中国 • 浙江省 • 杭州市</span>
            </div>
            <div class="user-info-item">
              <i class="el-icon-_school"></i>
              <span>Laravel、MySQL、Vue、ElementUI、AntDesign</span>
            </div>
          </div>
          <div style="margin: 30px 0 20px 0;">
            <el-divider class="ele-divider-dashed ele-divider-base"/>
          </div>
          <h6 class="ele-text" style="margin-bottom: 8px;">标签</h6>
          <div class="user-info-tags">
            <el-tag size="mini" type="info">风雨踏梦行</el-tag>
            <el-tag size="mini" type="info">理想的翅膀</el-tag>
            <el-tag size="mini" type="info">野心与梦想</el-tag>
            <el-tag size="mini" type="info">风雨兼程</el-tag>
            <el-tag size="mini" type="info">书写人生</el-tag>
            <el-tag size="mini" type="info">傲气女王</el-tag>
            <el-tag size="mini" type="info">逆境荒野</el-tag>
            <el-tag size="mini" type="info">温柔的暴力</el-tag>
            <el-tag size="mini" type="info">野味女生</el-tag>
            <el-tag size="mini" type="info">霸气逼人</el-tag>
            <el-tag size="mini" type="info">楼台烟雨中</el-tag>
            <el-tag size="mini" type="info">青衫落拓</el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :md="18" :sm="16">
        <el-card body-style="padding-top: 5px;" shadow="never">
          <el-tabs v-model="active" class="user-info-tabs">
            <el-tab-pane label="基本信息" name="info">
              <el-form
                ref="infoForm"
                :model="form"
                :rules="rules"
                label-width="90px"
                style="max-width: 450px;padding-top: 40px;"
                @keyup.enter.native="save"
                @submit.native.prevent>
                <el-form-item label="姓名:" prop="realname">
                  <el-input
                    v-model="form.realname"
                    clearable
                    placeholder="请输入姓名"/>
                </el-form-item>
                <el-form-item label="昵称:" prop="nickname">
                  <el-input
                    v-model="form.nickname"
                    clearable
                    placeholder="请输入昵称"/>
                </el-form-item>
                <el-form-item label="性别:" prop="gender">
                  <el-select
                    v-model="form.gender"
                    class="ele-fluid"
                    clearable
                    placeholder="请选择性别">
                    <el-option :value="1" label="男"/>
                    <el-option :value="2" label="女"/>
                    <el-option :value="3" label="保密"/>
                  </el-select>
                </el-form-item>
                <el-form-item label="联系方式:" prop="mobile">
                  <el-input
                    v-model="form.mobile"
                    clearable
                    placeholder="请输入联系方式"/>
                </el-form-item>
                <el-form-item label="邮箱:" prop="email">
                  <el-input
                    v-model="form.email"
                    clearable
                    placeholder="请输入邮箱"/>
                </el-form-item>
                <el-form-item label="详细地址:">
                  <el-input
                    v-model="form.address"
                    clearable
                    placeholder="请输入详细地址"/>
                </el-form-item>
                <el-form-item label="个人简介:">
                  <el-input
                    v-model="form.intro"
                    :rows="4"
                    placeholder="请输入个人简介"
                    type="textarea"/>
                </el-form-item>
                <el-form-item>
                  <el-button
                    :loading="loading"
                    type="primary"
                    @click="save">保存更改
                  </el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="账号绑定" name="account">
              <div class="user-account-list">
                <div class="user-account-item ele-cell">
                  <div class="ele-cell-content">
                    <div>密保手机</div>
                    <div class="ele-text-secondary">已绑定手机：180****2354</div>
                  </div>
                  <el-link :underline="false" type="primary">去修改</el-link>
                </div>
                <el-divider/>
                <div class="user-account-item ele-cell">
                  <div class="ele-cell-content">
                    <div>密保邮箱</div>
                    <div class="ele-text-secondary">已绑定邮箱：vwms@netsun.com</div>
                  </div>
                  <el-link :underline="false" type="primary">去修改</el-link>
                </div>
                <el-divider/>
                <div class="user-account-item ele-cell">
                  <div class="ele-cell-content">
                    <div>密保问题</div>
                    <div class="ele-text-secondary">未设置密保问题</div>
                  </div>
                  <el-link :underline="false" type="primary">去设置</el-link>
                </div>
                <el-divider/>
                <div class="user-account-item ele-cell">
                  <i class="user-account-icon el-icon-_qq"></i>
                  <div class="ele-cell-content">
                    <div>绑定QQ</div>
                    <div class="ele-text-secondary">当前未绑定QQ账号</div>
                  </div>
                  <el-link :underline="false" type="primary">去绑定</el-link>
                </div>
                <el-divider/>
                <div class="user-account-item ele-cell">
                  <i class="user-account-icon el-icon-_wechat"></i>
                  <div class="ele-cell-content">
                    <div>绑定微信</div>
                    <div class="ele-text-secondary">当前未绑定绑定微信账号</div>
                  </div>
                  <el-link :underline="false" type="primary">去绑定</el-link>
                </div>
                <el-divider/>
                <div class="user-account-item ele-cell">
                  <i class="user-account-icon el-icon-_alipay"></i>
                  <div class="ele-cell-content">
                    <div>绑定支付宝</div>
                    <div class="ele-text-secondary">当前未绑定绑定支付宝账号</div>
                  </div>
                  <el-link :underline="false" type="primary">去绑定</el-link>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import setting from '@/config/setting';
import uploadImage from '@/components/uploadImage.vue'

export default {
  name: 'UserInfo',
  components: {uploadImage},
  data() {
    return {
      // tab页选中
      active: 'info',
      // 表单数据
      form: {},
      // 表单验证规则
      rules: {
        realname: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        nickname: [
          {required: true, message: '请输入昵称', trigger: 'blur'}
        ],
        gender: [
          {required: true, message: '请选择性别', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'}
        ]
      },
      // 保存按钮loading
      loading: false,
      // 是否显示裁剪弹窗
      showCropper: false
    };
  },
  mounted() {
    // 获取用户信息
    this.getUserInfo();
  },
  methods: {
    /* 获取当前用户信息 */
    getUserInfo() {
      if (setting.userUrl) {
        this.$http.get(setting.userUrl).then((res) => {
          const result = setting.parseUser ? setting.parseUser(res.data) : res.data;
          if (result.code === 0) {
            // 赋予对象值
            this.form = JSON.parse(JSON.stringify(result.data))
          } else {
            this.$message.error(result.msg);
          }
        }).catch(e => {
          this.$message.error(e.message);
        });
      }
    },
    /* 保存更改 */
    save() {
      this.$refs['infoForm'].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$http.post('/index/updateUserInfo', this.form).then(res => {
            this.loading = false;
            if (res.data.code === 0) {
              this.$message.success('保存成功');
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
    }
  }
}
</script>

<style scoped>
.ele-body {
  padding-bottom: 0;
}

.el-card {
  margin-bottom: 15px;
}

/* 用户资料卡片 */
.user-info-card {
  padding-top: 8px;
  text-align: center;
}

.user-info-card .user-info-avatar-group {
  position: relative;
  cursor: pointer;
  margin: 0 auto;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  overflow: hidden;
}

.user-info-card .user-info-avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info-card .user-info-avatar-group > i {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #FFF;
  font-size: 30px;
  display: none;
  z-index: 2;
}

.user-info-card .user-info-avatar-group:hover > i {
  display: block;
}

.user-info-card .user-info-avatar-group:hover:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .3);
}

.user-info-card .user-info-name {
  font-size: 24px;
  margin-top: 20px;
}

.user-info-card .user-info-desc {
  margin-top: 8px;
}

/* 用户信息列表 */
.user-info-list {
  margin-top: 30px;
}

.user-info-list .user-info-item {
  margin-bottom: 10px;
  display: flex;
  align-items: baseline;
}

.user-info-item > i {
  margin-right: 10px;
  font-size: 16px;
}

.user-info-item > span {
  flex: 1;
  display: block;
}

/* 用户标签 */
.user-info-tags .el-tag {
  margin: 10px 10px 0 0;
}

/* 用户账号绑定列表 */
.user-account-list {
  margin-top: 10px;
}

.user-account-list .user-account-item {
  padding: 15px;
}

.user-account-list .user-account-item .ele-text-secondary {
  margin-top: 6px;
}

.user-account-list .user-account-item .user-account-icon {
  width: 42px;
  height: 42px;
  line-height: 42px;
  text-align: center;
  color: #FFF;
  font-size: 26px;
  border-radius: 50%;
  background-color: #3492ED;
  box-sizing: border-box;
}

.user-account-list .user-account-item .user-account-icon.el-icon-_wechat {
  background-color: #4DAF29;
  font-size: 28px;
}

.user-account-list .user-account-item .user-account-icon.el-icon-_alipay {
  background-color: #1476FE;
  padding-left: 5px;
  font-size: 32px;
}

/* tab页签 */
.user-info-tabs ::v-deep .el-tabs__nav-wrap {
  padding-left: 20px;
}
</style>
