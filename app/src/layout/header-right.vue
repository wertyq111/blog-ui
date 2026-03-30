<!-- 顶栏右侧区域按钮 -->
<template>
  <div class="ele-admin-header-tool cyber-header-tool">
    <!-- 全屏切换 -->
    <div id="full-screen" class="ele-admin-header-tool-item cyber-header-tool-item hidden-xs-only" @click="changeFullscreen">
      <i :class="fullscreen ? 'el-icon-_screen-restore' : 'el-icon-_screen-full'"></i>
    </div>
    <!-- 语言切换 -->
    <div id="language-select" class="ele-admin-header-tool-item cyber-header-tool-item">
      <el-dropdown placement="bottom" @command="changeLanguage">
        <i class="el-icon-_language"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="en">
            <span :class="{'ele-text-primary': language === 'en'}">English</span>
          </el-dropdown-item>
          <el-dropdown-item command="zh_CN">
            <span :class="{'ele-text-primary': language === 'zh_CN'}">简体中文</span>
          </el-dropdown-item>
          <el-dropdown-item command="zh_TW">
            <span :class="{'ele-text-primary': language === 'zh_TW'}">繁體中文</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 消息通知 -->
    <div id="notice-receive" class="ele-admin-header-tool-item cyber-header-tool-item">
      <ele-notice/>
    </div>
    <!-- 用户信息 -->
    <div id="user-info" class="ele-admin-header-tool-item cyber-header-tool-item">
      <el-dropdown @command="onUserDropClick">
        <div class="ele-admin-header-avatar cyber-header-avatar">
          <el-avatar :src="headerAvatar"/>
          <span class="hidden-xs-only">{{ loginUser.member ? loginUser.member.nickname : loginUser.username }}</span>
          <i class="el-icon-arrow-down hidden-xs-only"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="profile" icon="el-icon-user">
            {{ $t('layout.header.profile') }}
          </el-dropdown-item>
          <el-dropdown-item command="password" icon="el-icon-key">
            {{ $t('layout.header.password') }}
          </el-dropdown-item>
          <el-dropdown-item command="logout" divided icon="el-icon-switch-button">
            {{ $t('layout.header.logout') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 主题设置 -->
    <div v-if="showSetting" class="ele-admin-header-tool-item cyber-header-tool-item" @click="openSetting">
      <i class="el-icon-_more"></i>
    </div>
  </div>
</template>

<script>
import EleNotice from './notice.vue';
import {isFullscreen, toggleFullscreen} from 'ele-admin/packages/util';
import defaultAvatar from '@/assets/avatar.png';

export default {
  name: 'EleHeaderRight',
  components: {EleNotice},
  emits: ['item-click', 'change-language'],
  props: {
    // 是否显示打开设置抽屉按钮
    showSetting: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    // 当前登录用户信息
    loginUser() {
      return this.$store.state.user.user;
    },
    headerAvatar() {
      const member = this.loginUser && this.loginUser.member ? this.loginUser.member : null;
      return member && member.avatar ? member.avatar : defaultAvatar;
    },
    // 当前语言
    language() {
      return this.$i18n.locale;
    }
  },
  data() {
    return {
      // 是否全屏状态
      fullscreen: false
    };
  },
  mounted() {
  },
  methods: {
    /* 个人信息下拉菜单点击 */
    onUserDropClick(command) {
      if (command === 'logout') {
        // 退出登录
        this.$confirm(
          this.$t('layout.logout.message'),
          this.$t('layout.logout.title'),
          {type: 'warning'}
        ).then(() => {
          // 清除缓存的token
          this.$store.dispatch('user/removeToken').then(() => {
            location.replace('/login');  // 这样跳转避免再次登录重复注册动态路由
          });
          // 调用接口退出登录
          // this.$http.delete('/user/logout').then(res => {
          //   if (res.data.code === 0) {
          //     // 清除缓存的token
          //     this.$store.dispatch('user/removeToken').then(() => {
          //       location.replace('/login');  // 这样跳转避免再次登录重复注册动态路由
          //     });
          //   } else {
          //     this.$message.error(res.data.msg);
          //   }
          // }).catch(e => {
          //   let res = e.response
          //   this.$message.error(res.data.data.message);
          // });
        }).catch(e => {
          console.log(e)
        });
      } else if (command === 'profile') {
        if (this.$route.fullPath !== '/user/profile') {
          this.$router.push('/user/profile');
        }
      } else if (command === 'password') {
        this.$emit('item-click', 'password');
      }
    },
    /* 打开设置抽屉 */
    openSetting() {
      this.$emit('item-click', 'setting');
    },
    /* 全屏切换 */
    changeFullscreen() {
      try {
        this.fullscreen = toggleFullscreen();
      } catch (e) {
        this.$message.error('您的浏览器不支持全屏模式');
      }
    },
    /* 检查全屏状态 */
    checkFullscreen() {
      this.fullscreen = isFullscreen();
    },
    /* 切换语言 */
    changeLanguage(lang) {
      this.$emit('change-language', lang);
    }
  }
}
</script>
