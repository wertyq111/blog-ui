<template>
  <div class="login-page">
    <section class="login-visual">
      <div class="visual-brand">
        <img class="brand-logo" src="/favicon.ico" alt="网站图标">
        <span class="brand-text">个人博客</span>
      </div>

      <div class="character-scene">
        <div ref="purpleChar" class="char char-purple" :style="purpleStyle">
          <span class="eye eye-left" :style="purpleEyeStyle"><span class="pupil" :style="purplePupilStyle"></span></span>
          <span class="eye eye-right" :style="purpleEyeStyle"><span class="pupil" :style="purplePupilStyle"></span></span>
        </div>
        <div ref="blackChar" class="char char-black" :style="blackStyle">
          <span class="eye eye-left" :style="blackEyeStyle"><span class="pupil" :style="blackPupilStyle"></span></span>
          <span class="eye eye-right" :style="blackEyeStyle"><span class="pupil" :style="blackPupilStyle"></span></span>
        </div>
        <div ref="orangeChar" class="char char-orange" :style="orangeStyle">
          <span class="dot dot-left" :style="orangePupilStyle"></span>
          <span class="dot dot-right" :style="orangePupilStyle"></span>
        </div>
        <div ref="yellowChar" class="char char-yellow" :style="yellowStyle">
          <span class="dot dot-left" :style="yellowPupilStyle"></span>
          <span class="dot dot-right" :style="yellowPupilStyle"></span>
          <span class="mouth" :style="yellowMouthStyle"></span>
        </div>
      </div>

      <div class="visual-legal">
        <a href="https://beian.miit.gov.cn/" target="_blank">隐私政策</a>
        <a href="https://beian.miit.gov.cn/" target="_blank">服务条款</a>
      </div>
    </section>

    <section class="login-main">
      <div class="language-switch">
        <el-dropdown placement="bottom" @command="changeLanguage">
          <i class="el-icon-_language"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="zh_CN">
              <span :class="{ 'ele-text-primary': language === 'zh_CN' }">简体中文</span>
            </el-dropdown-item>
            <el-dropdown-item command="en">
              <span :class="{ 'ele-text-primary': language === 'en' }">English</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <div class="login-panel">
        <div class="mobile-brand">
          <img class="brand-logo" src="/favicon.ico" alt="网站图标">
          <span>个人博客</span>
        </div>

        <h1 class="panel-title">欢迎回来！</h1>
        <p class="panel-subtitle">请填写账号信息继续访问后台</p>

        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          class="login-form"
          size="large"
          @keyup.enter.native="doSubmit">
          <div class="field-title">账号</div>
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              @focus="handleFieldFocus('username')"
              @blur="handleFieldBlur('username')"
              @input="handleFieldInput('username')"
              clearable
              placeholder="请输入账号"
              prefix-icon="el-icon-user"/>
          </el-form-item>

          <div class="field-title">密码</div>
          <el-form-item prop="password">
            <el-input
              ref="passwordInput"
              v-model="form.password"
              @focus="handleFieldFocus('password')"
              @blur="handleFieldBlur('password')"
              @input="handleFieldInput('password')"
              @click.native="syncPasswordVisibility"
              @keyup.native="syncPasswordVisibility"
              @mouseup.native="syncPasswordVisibility"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              show-password/>
          </el-form-item>

          <div class="field-title">验证码</div>
          <el-form-item prop="captcha">
            <div class="captcha-row">
              <el-input
                v-model="form.captcha"
                @focus="handleFieldFocus('captcha')"
                @blur="handleFieldBlur('captcha')"
                @input="handleFieldInput('captcha')"
                clearable
                maxlength="4"
                placeholder="请输入验证码"
                prefix-icon="el-icon-_vercode"/>
              <img
                v-if="captcha"
                :src="captcha"
                alt="验证码"
                class="login-captcha"
                @click="changeCode"/>
            </div>
          </el-form-item>

          <div class="remember-row">
            <el-checkbox v-model="form.remember">30天内记住我</el-checkbox>
            <router-link class="forgot-link" to="/forget">忘记密码？</router-link>
          </div>

          <el-button
            :loading="loading"
            class="main-login-btn"
            @click="doSubmit">
            {{ loading ? '登录中...' : '登录' }}
          </el-button>

          <div class="signup-tip">
            没有账号？
            <span>请联系管理员开通</span>
          </div>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
import setting from '@/config/setting';

export default {
  name: 'Login',
  data() {
    return {
      // 加载状态
      loading: false,
      // 表单数据
      form: {
        username: '',
        password: '',
        captcha: '',
        captcha_key: '',
        remember: true
      },
      // 验证码base64数据
      captcha: '',
      // 当前激活输入项
      activeField: '',
      // 密码是否可见
      isPasswordVisible: false,
      // 鼠标位置
      mouseX: 0,
      mouseY: 0,
      // 角色动态位置
      purplePos: {faceX: 0, faceY: 0, bodySkew: 0},
      blackPos: {faceX: 0, faceY: 0, bodySkew: 0},
      orangePos: {faceX: 0, faceY: 0, bodySkew: 0},
      yellowPos: {faceX: 0, faceY: 0, bodySkew: 0},
      // 动画状态
      isPurpleBlinking: false,
      isBlackBlinking: false,
      isLookingAtEachOther: false,
      isPurplePeeking: false,
      // 定时器句柄
      lookTimer: null,
      purpleBlinkTimer: null,
      blackBlinkTimer: null,
      purplePeekTimer: null
    };
  },
  computed: {
    // 表单验证规则
    rules() {
      return {
        username: [
          {required: true, message: this.$t('login.username'), type: 'string', trigger: 'blur'}
        ],
        password: [
          {required: true, message: this.$t('login.password'), type: 'string', trigger: 'blur'}
        ],
        captcha: [
          {required: true, message: this.$t('login.captcha'), type: 'string', trigger: 'blur'}
        ]
      };
    },
    // 当前语言
    language() {
      return this.$i18n.locale;
    },
    isTyping() {
      return this.activeField === 'username' || this.activeField === 'password';
    },
    isHidingPassword() {
      return this.form.password.length > 0 && !this.isPasswordVisible;
    },
    purpleStyle() {
      const skew = this.clamp(this.purplePos.bodySkew, -6, 6);
      let transform = `skewX(${skew}deg)`;
      if (this.form.password.length > 0 && this.isPasswordVisible) {
        transform = 'skewX(0deg)';
      } else if (this.isTyping || this.isHidingPassword) {
        transform = `skewX(${skew - 12}deg) translateX(40px)`;
      }
      return {
        height: (this.isTyping || this.isHidingPassword) ? '340px' : '300px',
        transform
      };
    },
    purpleEyeStyle() {
      const eyeOffset = this.getPurpleEyeOffset();
      return {
        height: this.isPurpleBlinking ? '2px' : '26px',
        transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`
      };
    },
    purplePupilStyle() {
      const look = this.getPurpleLook();
      return {
        transform: `translate(${look.x}px, ${look.y}px)`,
        opacity: this.isPurpleBlinking ? 0 : 1
      };
    },
    blackStyle() {
      const skew = this.clamp(this.blackPos.bodySkew, -6, 6);
      let transform = `skewX(${skew}deg)`;
      if (this.form.password.length > 0 && this.isPasswordVisible) {
        transform = 'skewX(0deg)';
      } else if (this.isLookingAtEachOther) {
        transform = `skewX(${skew * 1.5 + 10}deg) translateX(20px)`;
      } else if (this.isTyping || this.isHidingPassword) {
        transform = `skewX(${skew * 1.5}deg)`;
      }
      return {
        transform
      };
    },
    blackEyeStyle() {
      const eyeOffset = this.getBlackEyeOffset();
      return {
        height: this.isBlackBlinking ? '2px' : '24px',
        transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`
      };
    },
    blackPupilStyle() {
      const look = this.getBlackLook();
      return {
        transform: `translate(${look.x}px, ${look.y}px)`,
        opacity: this.isBlackBlinking ? 0 : 1
      };
    },
    orangeStyle() {
      const skew = this.clamp(this.orangePos.bodySkew, -6, 6);
      return {
        transform: (this.form.password.length > 0 && this.isPasswordVisible) ? 'skewX(0deg)' : `skewX(${skew}deg)`
      };
    },
    yellowStyle() {
      const skew = this.clamp(this.yellowPos.bodySkew, -6, 6);
      return {
        transform: (this.form.password.length > 0 && this.isPasswordVisible) ? 'skewX(0deg)' : `skewX(${skew}deg)`
      };
    },
    orangePupilStyle() {
      const look = this.getOrangeLook();
      return {
        transform: `translate(${look.x}px, ${look.y}px)`
      };
    },
    yellowPupilStyle() {
      const look = this.getYellowLook();
      return {
        transform: `translate(${look.x}px, ${look.y}px)`
      };
    },
    yellowMouthStyle() {
      const look = this.getYellowLook();
      return {
        transform: `translate(${look.x}px, ${look.y}px)`
      };
    }
  },
  mounted() {
    window.addEventListener('mousemove', this.handleWindowMouseMove);
    this.scheduleBlink('purple');
    this.scheduleBlink('black');
    this.updateCharacterMotion();
    if (setting.takeToken()) {
      this.goHome();
    } else {
      this.changeCode();
    }
  },
  beforeDestroy() {
    window.removeEventListener('mousemove', this.handleWindowMouseMove);
    clearTimeout(this.lookTimer);
    clearTimeout(this.purpleBlinkTimer);
    clearTimeout(this.blackBlinkTimer);
    clearTimeout(this.purplePeekTimer);
  },
  methods: {
    /* 提交 */
    doSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false;
        }
        this.loading = true;
        // let formData = new FormData();
        // for (let key in this.form) {
        //   formData.append(key, this.form[key]);
        // }
        this.$http.post('/user/login', this.form).then((res) => {
          if (res.data.code === 0) {
            this.$message.success('登录成功');
            this.$store.dispatch('user/setToken', {
              token: 'Bearer ' + res.data.data.access_token,
              remember: this.form.remember
            }).then(() => {
              this.goHome();
            });
          } else {
            this.$message.error(res.data.data ? res.data.data.message : res.data.msg);
            // 重新刷新验证码
            this.changeCode()
          }
        }).catch(err => {
          const message = err?.response?.data?.data?.message || err.message || '登录失败';
          this.$message.error(message);
          // 重新刷新验证码
          this.changeCode();
        }).finally(() => {
          this.loading = false;
        });
      });
    },
    /* 跳转到首页 */
    goHome() {
      const query = this.$route.query;
      const path = query && query.from ? query.from : '/';
      this.$router.push(path).catch(() => {
      });
    },
    /* 更换图形验证码 */
    changeCode() {
      // 这里演示的验证码是后端返回base64格式的形式, 如果后端地址直接是图片请参考忘记密码页面
      this.$http.get('/captcha').then(res => {
        if (res.data.code === 0) {
          this.captcha = res.data.data.captcha_image_content;
          this.form.captcha_key = res.data.data.captcha_key;
          if (this.$refs.form) {
            this.$refs.form.clearValidate();
          }
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.message);
      });
    },
    /* 切换语言 */
    changeLanguage(lang) {
      this.$i18n.locale = lang;
      localStorage.setItem('i18n-lang', lang);
    },
    handleWindowMouseMove(e) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.updateCharacterMotion();
    },
    clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    },
    calculatePosition(refName) {
      const el = this.$refs[refName];
      if (!el || !el.getBoundingClientRect) {
        return {faceX: 0, faceY: 0, bodySkew: 0};
      }
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 3;
      const deltaX = this.mouseX - centerX;
      const deltaY = this.mouseY - centerY;
      return {
        faceX: this.clamp(deltaX / 20, -15, 15),
        faceY: this.clamp(deltaY / 30, -10, 10),
        bodySkew: this.clamp(-deltaX / 120, -6, 6)
      };
    },
    updateCharacterMotion() {
      this.purplePos = this.calculatePosition('purpleChar');
      this.blackPos = this.calculatePosition('blackChar');
      this.orangePos = this.calculatePosition('orangeChar');
      this.yellowPos = this.calculatePosition('yellowChar');
    },
    scheduleBlink(type) {
      const delay = Math.random() * 4000 + 3000;
      const timer = setTimeout(() => {
        if (type === 'purple') {
          this.isPurpleBlinking = true;
        } else {
          this.isBlackBlinking = true;
        }
        setTimeout(() => {
          if (type === 'purple') {
            this.isPurpleBlinking = false;
          } else {
            this.isBlackBlinking = false;
          }
          this.scheduleBlink(type);
        }, 150);
      }, delay);
      if (type === 'purple') {
        this.purpleBlinkTimer = timer;
      } else {
        this.blackBlinkTimer = timer;
      }
    },
    triggerLookAtEachOther() {
      this.isLookingAtEachOther = true;
      clearTimeout(this.lookTimer);
      this.lookTimer = setTimeout(() => {
        this.isLookingAtEachOther = false;
      }, 800);
    },
    schedulePurplePeek() {
      clearTimeout(this.purplePeekTimer);
      this.isPurplePeeking = false;
      if (!(this.form.password.length > 0 && this.isPasswordVisible)) {
        return;
      }
      const loop = () => {
        const delay = Math.random() * 3000 + 2000;
        this.purplePeekTimer = setTimeout(() => {
          this.isPurplePeeking = true;
          setTimeout(() => {
            this.isPurplePeeking = false;
            loop();
          }, 800);
        }, delay);
      };
      loop();
    },
    getPasswordInputType() {
      const passwordInput = this.$refs.passwordInput;
      if (!passwordInput || !passwordInput.$el) {
        return 'password';
      }
      const nativeInput = passwordInput.$el.querySelector('input');
      return nativeInput ? nativeInput.type : 'password';
    },
    syncPasswordVisibility() {
      this.$nextTick(() => {
        this.isPasswordVisible = this.getPasswordInputType() === 'text';
        this.schedulePurplePeek();
      });
    },
    handleFieldFocus(field) {
      const wasTyping = this.isTyping;
      this.activeField = field;
      if (!wasTyping && this.isTyping) {
        this.triggerLookAtEachOther();
      }
      if (field === 'password') {
        this.syncPasswordVisibility();
      }
    },
    handleFieldBlur(field) {
      if (this.activeField !== field) {
        return;
      }
      this.activeField = '';
      this.syncPasswordVisibility();
    },
    handleFieldInput(field) {
      if (field === 'username' || field === 'password') {
        this.triggerLookAtEachOther();
      }
      if (field === 'password') {
        this.syncPasswordVisibility();
      }
    },
    getPurpleLook() {
      if (this.form.password.length > 0 && this.isPasswordVisible) {
        return this.isPurplePeeking ? {x: 4, y: 5} : {x: -4, y: -4};
      }
      if (this.isLookingAtEachOther) {
        return {x: 3, y: 4};
      }
      return {
        x: this.clamp(this.purplePos.faceX / 3, -5, 5),
        y: this.clamp(this.purplePos.faceY / 3, -4, 4)
      };
    },
    getPurpleEyeOffset() {
      if (this.form.password.length > 0 && this.isPasswordVisible) {
        return {x: -10, y: -6};
      }
      if (this.isLookingAtEachOther) {
        return {x: 12, y: 18};
      }
      return {
        x: this.clamp(this.purplePos.faceX, -14, 14),
        y: this.clamp(this.purplePos.faceY, -10, 10)
      };
    },
    getBlackLook() {
      if (this.form.password.length > 0 && this.isPasswordVisible) {
        return {x: -4, y: -4};
      }
      if (this.isLookingAtEachOther) {
        return {x: 0, y: -4};
      }
      return {
        x: this.clamp(this.blackPos.faceX / 3, -4, 4),
        y: this.clamp(this.blackPos.faceY / 3, -4, 4)
      };
    },
    getBlackEyeOffset() {
      if (this.form.password.length > 0 && this.isPasswordVisible) {
        return {x: -16, y: -4};
      }
      if (this.isLookingAtEachOther) {
        return {x: 6, y: -14};
      }
      return {
        x: this.clamp(this.blackPos.faceX, -12, 12),
        y: this.clamp(this.blackPos.faceY, -9, 9)
      };
    },
    getOrangeLook() {
      if (this.form.password.length > 0 && this.isPasswordVisible) {
        return {x: -5, y: -4};
      }
      return {
        x: this.clamp(this.orangePos.faceX / 3, -5, 5),
        y: this.clamp(this.orangePos.faceY / 3, -4, 4)
      };
    },
    getYellowLook() {
      if (this.form.password.length > 0 && this.isPasswordVisible) {
        return {x: -5, y: -4};
      }
      return {
        x: this.clamp(this.yellowPos.faceX / 3, -5, 5),
        y: this.clamp(this.yellowPos.faceY / 3, -4, 4)
      };
    }
  }
}
</script>

<style scoped>
/* Layout */
.login-page {
  display: flex;
  min-height: 100vh;
  background: #f4f5f7;
  font-family: inherit;
}

.login-visual {
  flex: 1;
  min-width: 520px;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 24% 18%, rgba(182, 193, 208, .38), transparent 52%),
    radial-gradient(circle at 82% 30%, rgba(74, 85, 105, .3), transparent 36%),
    linear-gradient(160deg, #6f798b 0%, #5e6879 42%, #596476 100%);
}

.login-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: #f8f9fb;
}

.language-switch {
  position: absolute;
  top: 26px;
  right: 28px;
  z-index: 2;
  color: #607189;
}

.language-switch i {
  font-size: 22px;
  cursor: pointer;
}

.visual-brand {
  position: absolute;
  top: 48px;
  left: 48px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-logo {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  object-fit: cover;
  box-shadow: 0 4px 14px rgba(0, 0, 0, .22);
}

.brand-text {
  font-size: 28px;
  font-weight: 600;
  color: #f2f6ff;
  letter-spacing: .5px;
}

.character-scene {
  position: absolute;
  left: 50%;
  bottom: 92px;
  width: 520px;
  height: 420px;
  transform: translateX(-50%);
}

.char {
  position: absolute;
  transition: transform .7s ease-in-out, height .7s ease-in-out;
  transform-origin: bottom center;
}

.eye {
  display: block;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #fff;
  position: absolute;
  transition: transform .7s ease-in-out, height .15s ease;
  transform-origin: center center;
  overflow: hidden;
}

.pupil {
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #25292f;
  position: absolute;
  left: 8px;
  top: 8px;
  transform: translate(0, 0);
  transition: transform .1s ease-out, opacity .2s ease;
}

.char-purple {
  width: 178px;
  height: 300px;
  left: 78px;
  bottom: 0;
  border-radius: 12px 12px 0 0;
  background: linear-gradient(180deg, #6d47f4 0%, #5c35db 100%);
}

.char-purple .eye-left {
  left: 30px;
  top: 24px;
}

.char-purple .eye-right {
  left: 82px;
  top: 24px;
}

.char-black {
  width: 122px;
  height: 210px;
  left: 242px;
  bottom: 0;
  border-radius: 10px 10px 0 0;
  background: #2e3036;
}

.char-black .eye-left {
  width: 24px;
  height: 24px;
  left: 10px;
  top: 18px;
}

.char-black .eye-right {
  width: 24px;
  height: 24px;
  left: 50px;
  top: 18px;
}

.char-orange {
  width: 240px;
  height: 200px;
  left: 20px;
  bottom: 0;
  border-radius: 120px 120px 0 0;
  background: #f59462;
  z-index: 3;
}

.char-yellow {
  width: 142px;
  height: 230px;
  left: 320px;
  bottom: 0;
  border-radius: 72px 72px 0 0;
  background: #e5d758;
  z-index: 4;
}

.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #2c3037;
  position: absolute;
  transition: transform .2s ease-out;
}

.char-orange .dot-left {
  left: 70px;
  top: 74px;
}

.char-orange .dot-right {
  left: 114px;
  top: 74px;
}

.char-yellow .dot-left {
  left: 34px;
  top: 34px;
}

.char-yellow .dot-right {
  left: 70px;
  top: 34px;
}

.char-yellow .mouth {
  width: 80px;
  height: 6px;
  border-radius: 6px;
  background: #333840;
  position: absolute;
  left: 30px;
  top: 84px;
  transition: transform .2s ease-out;
}

.visual-legal {
  position: absolute;
  left: 48px;
  bottom: 42px;
  display: flex;
  gap: 28px;
}

.visual-legal a {
  color: rgba(225, 233, 244, .52);
  font-size: 14px;
  text-decoration: none;
}

.visual-legal a:hover {
  color: rgba(225, 233, 244, .9);
}

.login-panel {
  width: 440px;
  max-width: calc(100% - 48px);
}

.mobile-brand {
  display: none;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  color: #111827;
  font-size: 18px;
  font-weight: 600;
}

.panel-title {
  margin: 0;
  color: #0f172a;
  font-size: 56px;
  line-height: 1.16;
  text-align: center;
  font-weight: 700;
}

.panel-subtitle {
  margin: 14px 0 36px;
  text-align: center;
  font-size: 16px;
  color: #64748b;
}

.field-title {
  margin: 0 0 10px;
  color: #111827;
  font-weight: 600;
  font-size: 16px;
}

.login-form ::v-deep .el-form-item {
  margin-bottom: 20px;
}

.login-form ::v-deep .el-input__inner {
  height: 50px;
  border-radius: 25px;
  border-color: #d7dce5;
  background: #fff;
  font-size: 16px;
}

.login-form ::v-deep .el-input__icon {
  line-height: 50px;
}

.captcha-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.captcha-row ::v-deep .el-input {
  flex: 1;
}

.login-captcha {
  width: 170px;
  min-width: 170px;
  height: 50px;
  border-radius: 25px;
  border: 1px solid #d7dce5;
  cursor: pointer;
  background: #fff;
  object-fit: cover;
}

.remember-row {
  margin: 6px 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.remember-row ::v-deep .el-checkbox__label {
  font-size: 16px;
  color: #111827;
}

.forgot-link {
  font-size: 16px;
  color: #3b82f6;
  text-decoration: none;
}

.forgot-link:hover {
  color: #2563eb;
}

.main-login-btn {
  width: 100%;
  height: 52px;
  border-radius: 26px;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.main-login-btn {
  color: #111827;
  background: #fff;
  border: 1px solid #d7dce5;
}

.main-login-btn:hover,
.main-login-btn:focus {
  color: #111827;
  border-color: #c5ccd8;
  background: #f8fafc;
}

.signup-tip {
  margin-top: 22px;
  text-align: center;
  color: #64748b;
  font-size: 16px;
}

.signup-tip span {
  color: #111827;
  font-weight: 600;
}

/* Responsive */
@media screen and (max-width: 1280px) {
  .panel-title {
    font-size: 46px;
  }

  .panel-subtitle {
    font-size: 15px;
  }

  .field-title,
  .remember-row ::v-deep .el-checkbox__label,
  .forgot-link,
  .main-login-btn,
  .signup-tip,
  .visual-legal a {
    font-size: 15px;
  }

  .login-form ::v-deep .el-input__inner {
    font-size: 16px;
  }
}

@media screen and (max-width: 1024px) {
  .login-visual {
    display: none;
  }

  .login-main {
    flex: 1 1 100%;
  }

  .mobile-brand {
    display: flex;
  }

  .language-switch {
    color: #64748b;
  }

  .panel-title {
    text-align: left;
  }

  .panel-subtitle {
    text-align: left;
  }
}

@media screen and (max-width: 768px) {
  .login-main {
    align-items: flex-start;
    padding: 84px 0 40px;
  }

  .login-panel {
    max-width: calc(100% - 32px);
  }

  .panel-title {
    font-size: 40px;
  }

  .panel-subtitle {
    margin-bottom: 28px;
    font-size: 15px;
  }

  .field-title {
    font-size: 15px;
  }

  .login-captcha {
    width: 136px;
    min-width: 136px;
  }

  .remember-row ::v-deep .el-checkbox__label,
  .forgot-link,
  .main-login-btn,
  .signup-tip {
    font-size: 15px;
  }

  .main-login-btn {
    height: 46px;
  }
}
</style>
