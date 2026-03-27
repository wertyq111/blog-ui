<template>
  <div class="profile-page ele-body">
    <div class="profile-page__backdrop"></div>
    <el-row :gutter="24" class="profile-page__grid">
      <el-col :lg="9" :md="10" :sm="24" :xs="24">
        <section class="profile-hero">
          <div class="profile-hero__decor profile-hero__decor--mint"></div>
          <div class="profile-hero__decor profile-hero__decor--lime"></div>
          <div class="profile-hero__orbit profile-hero__orbit--one"></div>
          <div class="profile-hero__orbit profile-hero__orbit--two"></div>

          <div class="profile-hero__eyebrow">
            <span class="profile-hero__status"></span>
            数字身份档案
          </div>
          <div class="profile-hero__headline">
            <h2>{{ displayName }}</h2>
            <p>{{ heroSubtitle }}</p>
          </div>

          <div
            class="profile-model-shell"
            :class="{
              'is-loading': modelLoading,
              'is-error': modelError
            }">
            <model-viewer
              v-if="!modelError"
              :src="currentModelSrc"
              alt="3D digital persona model"
              camera-controls
              auto-rotate
              interaction-prompt="none"
              rotation-per-second="12deg"
              camera-orbit="0deg 78deg 105%"
              min-camera-orbit="auto auto 92%"
              max-camera-orbit="auto auto 122%"
              shadow-intensity="0.9"
              exposure="1.05"
              touch-action="pan-y"
              disable-zoom
              @load="handleModelLoad"
              @error="handleModelError">
            </model-viewer>
            <div v-if="modelLoading && !modelError" class="profile-model-shell__overlay">
              <div class="profile-model-shell__spinner"></div>
              <span>数字人加载中...</span>
            </div>
            <div v-if="modelError" class="profile-model-shell__fallback">
              <div class="profile-model-shell__fallback-icon">3D</div>
              <h3>数字形象暂时不可用</h3>
              <p>模型加载失败时，资料编辑区仍可正常使用。</p>
            </div>
          </div>

          <div class="profile-hero__meta">
            <div v-for="item in profileMeta" :key="item.label" class="profile-hero__meta-item">
              <i :class="item.icon"></i>
              <div>
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
              </div>
            </div>
          </div>

          <div class="profile-hero__tags">
            <span v-for="tag in heroTags" :key="tag" class="profile-chip">{{ tag }}</span>
          </div>
        </section>
      </el-col>
      <el-col :lg="15" :md="14" :sm="24" :xs="24">
        <section class="profile-panel">
          <div class="profile-panel__header">
            <div>
              <span class="profile-panel__kicker">Profile Editor</span>
              <h3>个人资料</h3>
              <p>管理基础身份信息、头像素材与账号绑定状态。</p>
            </div>
            <div class="profile-avatar-upload">
              <div class="profile-avatar-upload__label">头像上传</div>
              <uploadImage v-model="form.avatar" :limit="1"></uploadImage>
            </div>
          </div>

          <el-tabs v-model="active" class="profile-tabs">
            <el-tab-pane label="基本信息" name="info">
              <el-form
                ref="infoForm"
                :model="form"
                :rules="rules"
                label-width="98px"
                class="profile-form"
                @keyup.enter.native="save"
                @submit.native.prevent>
                <div class="profile-form__grid">
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
                  <el-form-item label="详细地址:" class="profile-form__span-2">
                    <el-input
                      v-model="form.address"
                      clearable
                      placeholder="请输入详细地址"/>
                  </el-form-item>
                  <el-form-item label="个人简介:" class="profile-form__span-2">
                    <el-input
                      v-model="form.intro"
                      :rows="4"
                      placeholder="请输入个人简介"
                      type="textarea"/>
                  </el-form-item>
                </div>
                <el-form-item class="profile-form__action">
                  <el-button
                    :loading="loading"
                    type="primary"
                    @click="save">保存更改
                  </el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="账号绑定" name="account">
              <div class="profile-account-list">
                <div
                  v-for="item in accountBindings"
                  :key="item.title"
                  class="profile-account-item">
                  <div class="profile-account-item__icon">
                    <i :class="item.icon"></i>
                  </div>
                  <div class="profile-account-item__content">
                    <strong>{{ item.title }}</strong>
                    <p>{{ item.description }}</p>
                  </div>
                  <el-link :underline="false" type="primary">{{ item.action }}</el-link>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </section>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import setting from '@/config/setting';
import uploadImage from '@/components/uploadImage.vue';

const createDefaultForm = () => ({
  avatar: '',
  realname: '',
  nickname: '',
  gender: 1,
  mobile: '',
  email: '',
  address: '',
  intro: ''
});

export default {
  name: 'UserInfo',
  components: {uploadImage},
  data() {
    return {
      active: 'info',
      form: createDefaultForm(),
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
      loading: false,
      modelLoading: true,
      modelError: false,
      heroTags: [
        'Digital Persona',
        'Laravel',
        'Vue 2',
        'MySQL',
        'Element UI',
        'Mint Glow'
      ],
      staticMeta: {
        role: '资深架构师',
        company: '浙江网盛生意宝股份邮箱公司',
        location: '中国 · 浙江省 · 杭州市',
        stack: 'Laravel、MySQL、Vue、ElementUI、AntDesign'
      },
      accountBindings: [
        {
          title: '密保手机',
          description: '已绑定手机：180****2354',
          action: '去修改',
          icon: 'el-icon-mobile-phone'
        },
        {
          title: '密保邮箱',
          description: '已绑定邮箱：vwms@netsun.com',
          action: '去修改',
          icon: 'el-icon-message'
        },
        {
          title: '密保问题',
          description: '未设置密保问题',
          action: '去设置',
          icon: 'el-icon-key'
        },
        {
          title: '绑定 QQ',
          description: '当前未绑定 QQ 账号',
          action: '去绑定',
          icon: 'el-icon-_qq'
        },
        {
          title: '绑定微信',
          description: '当前未绑定微信账号',
          action: '去绑定',
          icon: 'el-icon-_wechat'
        },
        {
          title: '绑定支付宝',
          description: '当前未绑定支付宝账号',
          action: '去绑定',
          icon: 'el-icon-_alipay'
        }
      ]
    };
  },
  computed: {
    currentModelSrc() {
      return Number(this.form.gender) === 2
        ? '/models/profile/girl.glb'
        : '/models/profile/boy.glb';
    },
    displayName() {
      return this.form.nickname || this.form.realname || this.form.email || '数字分身档案';
    },
    heroSubtitle() {
      const genderMap = {
        1: '男性数字形象在线，轻交互模式已启用。',
        2: '女性数字形象在线，轻交互模式已启用。',
        3: '保密模式已启用，当前展示默认数字形象。'
      };
      return genderMap[Number(this.form.gender)] || genderMap[1];
    },
    profileMeta() {
      return [
        {
          label: '角色定位',
          value: this.staticMeta.role,
          icon: 'el-icon-user'
        },
        {
          label: '组织信息',
          value: this.staticMeta.company,
          icon: 'el-icon-office-building'
        },
        {
          label: '所在地区',
          value: this.form.address || this.staticMeta.location,
          icon: 'el-icon-location-information'
        },
        {
          label: '技术栈',
          value: this.staticMeta.stack,
          icon: 'el-icon-_school'
        }
      ];
    }
  },
  watch: {
    'form.gender'() {
      this.resetModelState();
    }
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    resetModelState() {
      this.modelLoading = true;
      this.modelError = false;
    },
    handleModelLoad() {
      this.modelLoading = false;
      this.modelError = false;
    },
    handleModelError() {
      this.modelLoading = false;
      this.modelError = true;
    },
    getUserInfo() {
      if (setting.userUrl) {
        this.$http.get(setting.userUrl).then((res) => {
          const result = setting.parseUser ? setting.parseUser(res.data) : res.data;
          if (result.code === 0) {
            this.form = Object.assign(createDefaultForm(), result.data || {});
            this.resetModelState();
          } else {
            this.$message.error(result.msg);
          }
        }).catch((e) => {
          this.$message.error(e.message);
        });
      }
    },
    save() {
      this.$refs.infoForm.validate((valid) => {
        if (!valid) {
          return false;
        }
        this.loading = true;
        this.$http.post('/index/updateUserInfo', this.form).then((res) => {
          this.loading = false;
          if (res.data.code === 0) {
            this.$message.success('保存成功');
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
        });
      });
    }
  }
};
</script>

<style scoped>
.profile-page {
  position: relative;
  padding-bottom: 20px;
  overflow: hidden;
}

.profile-page__backdrop {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 18% 18%, rgba(120, 255, 214, 0.22), transparent 30%),
    radial-gradient(circle at 84% 12%, rgba(214, 255, 114, 0.24), transparent 28%),
    radial-gradient(circle at 68% 70%, rgba(32, 201, 178, 0.12), transparent 34%),
    linear-gradient(180deg, rgba(247, 252, 249, 0.9) 0%, rgba(241, 249, 246, 0.96) 100%);
  pointer-events: none;
}

.profile-page__grid {
  position: relative;
  z-index: 1;
}

.profile-hero,
.profile-panel {
  position: relative;
  overflow: hidden;
  min-height: 100%;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 32px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 30px 90px rgba(25, 58, 50, 0.12);
}

.profile-hero {
  padding: 28px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.84), rgba(243, 250, 246, 0.92)),
    linear-gradient(135deg, rgba(255, 255, 255, 0.82), rgba(230, 255, 244, 0.55));
}

.profile-hero__decor,
.profile-hero__orbit {
  position: absolute;
  pointer-events: none;
}

.profile-hero__decor {
  filter: blur(10px);
  opacity: 0.9;
}

.profile-hero__decor--mint {
  top: 80px;
  right: -40px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(32, 201, 178, 0.28), transparent 70%);
}

.profile-hero__decor--lime {
  bottom: 60px;
  left: -20px;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(214, 255, 114, 0.18), transparent 72%);
}

.profile-hero__orbit {
  border: 1px solid rgba(129, 219, 201, 0.28);
  border-radius: 999px;
}

.profile-hero__orbit--one {
  top: 140px;
  left: 50%;
  width: 260px;
  height: 260px;
  transform: translateX(-50%);
}

.profile-hero__orbit--two {
  top: 185px;
  left: 50%;
  width: 320px;
  height: 180px;
  transform: translateX(-50%) rotate(-12deg);
}

.profile-hero__eyebrow {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.66);
  color: #188a77;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.profile-hero__status {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #20c9b2;
  box-shadow: 0 0 0 6px rgba(32, 201, 178, 0.12);
}

.profile-hero__headline {
  position: relative;
  margin-top: 22px;
  z-index: 1;
}

.profile-hero__headline h2 {
  margin: 0;
  color: #17322d;
  font-size: 34px;
  line-height: 1.08;
}

.profile-hero__headline p {
  margin: 12px 0 0;
  max-width: 320px;
  color: #648079;
  font-size: 14px;
  line-height: 1.75;
}

.profile-model-shell {
  position: relative;
  margin-top: 18px;
  height: 440px;
  border-radius: 28px;
  background:
    radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.92), transparent 40%),
    linear-gradient(180deg, rgba(241, 250, 246, 0.92), rgba(227, 246, 238, 0.72));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.78);
  overflow: hidden;
}

.profile-model-shell::after {
  content: '';
  position: absolute;
  inset: 14px;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.55);
  pointer-events: none;
}

.profile-model-shell:hover {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.82),
    0 18px 60px rgba(32, 201, 178, 0.18);
}

.profile-model-shell model-viewer {
  width: 100%;
  height: 100%;
  --poster-color: transparent;
  background: transparent;
}

.profile-model-shell__overlay,
.profile-model-shell__fallback {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  color: #52716a;
  background: linear-gradient(180deg, rgba(247, 252, 249, 0.32), rgba(244, 250, 247, 0.86));
}

.profile-model-shell__spinner {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 3px solid rgba(32, 201, 178, 0.15);
  border-top-color: #20c9b2;
  animation: profile-spin 1s linear infinite;
}

.profile-model-shell__fallback-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 24px;
  background: linear-gradient(135deg, #20c9b2, #8cf5d4);
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.profile-model-shell__fallback h3 {
  margin: 0;
  color: #17322d;
  font-size: 20px;
}

.profile-model-shell__fallback p {
  margin: 0;
  max-width: 240px;
  text-align: center;
  line-height: 1.7;
}

.profile-hero__meta {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 24px;
}

.profile-hero__meta-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.7);
}

.profile-hero__meta-item > i {
  margin-top: 3px;
  color: #20c9b2;
  font-size: 18px;
}

.profile-hero__meta-item span {
  display: block;
  color: #7b908b;
  font-size: 12px;
}

.profile-hero__meta-item strong {
  display: block;
  margin-top: 6px;
  color: #1e3933;
  font-size: 13px;
  line-height: 1.6;
  font-weight: 600;
}

.profile-hero__tags {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}

.profile-chip {
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.76);
  color: #285149;
  font-size: 12px;
  font-weight: 600;
}

.profile-panel {
  padding: 28px 28px 10px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.88), rgba(244, 250, 247, 0.9));
}

.profile-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 18px;
}

.profile-panel__kicker {
  display: inline-block;
  margin-bottom: 10px;
  color: #20a892;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.profile-panel__header h3 {
  margin: 0;
  color: #17322d;
  font-size: 30px;
}

.profile-panel__header p {
  margin: 10px 0 0;
  color: #6d8881;
  font-size: 14px;
  line-height: 1.7;
}

.profile-avatar-upload {
  min-width: 170px;
  padding: 16px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
}

.profile-avatar-upload__label {
  margin-bottom: 10px;
  color: #6f8681;
  font-size: 12px;
  font-weight: 600;
}

.profile-avatar-upload ::v-deep .finish_room2 {
  display: block;
}

.profile-avatar-upload ::v-deep .finish_room2 > div {
  display: block;
}

.profile-avatar-upload ::v-deep .finish_room2 .room_img,
.profile-avatar-upload ::v-deep .room_add_img {
  width: 110px;
  height: 110px;
  margin: 0;
  border-radius: 22px;
  background: rgba(237, 246, 242, 0.88);
}

.profile-avatar-upload ::v-deep .room_add_img {
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-avatar-upload ::v-deep .room_add_img span {
  margin-top: 0 !important;
}

.profile-tabs {
  margin-top: 10px;
}

.profile-form {
  padding-top: 12px;
}

.profile-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2px 24px;
}

.profile-form__span-2 {
  grid-column: span 2;
}

.profile-form__action {
  margin-top: 6px;
}

.profile-account-list {
  display: grid;
  gap: 14px;
  padding: 8px 0 18px;
}

.profile-account-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.72);
}

.profile-account-item__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 16px;
  background: linear-gradient(135deg, #20c9b2, #8cefd4);
  color: #fff;
  font-size: 22px;
  flex-shrink: 0;
}

.profile-account-item__icon .el-icon-_wechat {
  font-size: 24px;
}

.profile-account-item__icon .el-icon-_alipay {
  font-size: 26px;
}

.profile-account-item__content {
  flex: 1;
}

.profile-account-item__content strong {
  color: #17322d;
  font-size: 15px;
}

.profile-account-item__content p {
  margin: 6px 0 0;
  color: #708884;
  font-size: 13px;
}

.profile-page ::v-deep .el-tabs__nav-wrap::after {
  height: 1px;
  background: rgba(33, 95, 83, 0.08);
}

.profile-page ::v-deep .el-tabs__nav-wrap {
  padding-left: 0;
}

.profile-page ::v-deep .el-tabs__item {
  height: 42px;
  line-height: 42px;
  color: #69817b;
  font-weight: 600;
}

.profile-page ::v-deep .el-tabs__item.is-active {
  color: #179e88;
}

.profile-page ::v-deep .el-tabs__active-bar {
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, #20c9b2, #d6ff72);
}

.profile-page ::v-deep .el-form-item__label {
  color: #5c746e;
  font-weight: 600;
}

.profile-page ::v-deep .el-input__inner,
.profile-page ::v-deep .el-textarea__inner,
.profile-page ::v-deep .el-select .el-input__inner {
  height: 46px;
  border: 1px solid rgba(128, 175, 165, 0.18);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.82);
  color: #17322d;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65);
}

.profile-page ::v-deep .el-textarea__inner {
  min-height: 124px !important;
  padding-top: 12px;
}

.profile-page ::v-deep .el-input__inner:focus,
.profile-page ::v-deep .el-textarea__inner:focus {
  border-color: rgba(32, 201, 178, 0.55);
  box-shadow: 0 0 0 4px rgba(32, 201, 178, 0.1);
}

.profile-page ::v-deep .el-button--primary {
  min-width: 140px;
  height: 46px;
  padding: 0 24px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #20c9b2, #7de8d2);
  box-shadow: 0 16px 30px rgba(32, 201, 178, 0.26);
}

.profile-page ::v-deep .el-button--primary:hover,
.profile-page ::v-deep .el-button--primary:focus {
  background: linear-gradient(135deg, #1bc0aa, #89f0db);
}

@keyframes profile-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1200px) {
  .profile-panel__header {
    flex-direction: column;
  }

  .profile-avatar-upload {
    width: 100%;
  }
}

@media (max-width: 992px) {
  .profile-hero,
  .profile-panel {
    border-radius: 26px;
  }

  .profile-model-shell {
    height: 380px;
  }

  .profile-hero__meta {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-page__grid {
    margin: 0 -4px;
  }

  .profile-hero,
  .profile-panel {
    padding: 20px;
  }

  .profile-panel__header h3,
  .profile-hero__headline h2 {
    font-size: 26px;
  }

  .profile-model-shell {
    height: 320px;
  }

  .profile-form__grid {
    grid-template-columns: 1fr;
  }

  .profile-form__span-2 {
    grid-column: span 1;
  }

  .profile-account-item {
    align-items: flex-start;
  }
}
</style>
