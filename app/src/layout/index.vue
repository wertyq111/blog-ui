<!-- 框架布局 -->
<template>
  <ele-pro-layout
    ref="layout"
    :body-full="theme.bodyFull"
    :collapse="theme.collapse"
    :color="theme.color"
    :colorful-icon="theme.colorfulIcon"
    :dark-mode="theme.darkMode"
    :fixed-body="theme.fixedBody"
    :fixed-header="theme.fixedHeader"
    :fixed-sidebar="theme.fixedSidebar"
    :head-style="theme.headStyle"
    :hide-footers="setting.hideFooters"
    :hide-sidebars="setting.hideSidebars"
    :home-title="homeTitle"
    :i18n="i18n"
    :layout-style="theme.layoutStyle"
    :logo-auto-size="theme.logoAutoSize"
    :menus="user.menus"
    :need-setting="setting.needSetting"
    :project-name="projectName"
    :repeatable-tabs="setting.repeatableTabs"
    :show-content="showContent"
    :show-footer="theme.showFooter"
    :show-setting.sync="showSetting"
    :show-tabs="theme.showTabs"
    :side-menu-style="theme.sideMenuStyle"
    :side-style="theme.sideStyle"
    :side-unique-open="theme.sideUniqueOpen"
    :tab-style="theme.tabStyle"
    :tabs="theme.tabs"
    :weak-mode="theme.weakMode"
    @logo-click="onLogoClick"
    @reload-page="reloadPage"
    @update-screen="updateScreen"
    @update-collapse="updateCollapse"
    @tab-add="tabAdd"
    @tab-remove="tabRemove"
    @tab-remove-all="tabRemoveAll"
    @tab-remove-left="tabRemoveLeft"
    @tab-remove-right="tabRemoveRight"
    @tab-remove-other="tabRemoveOther"
    @change-style="changeStyle"
    @change-color="changeColor"
    @change-dark-mode="changeDarkMode"
    @change-weak-mode="changeWeakMode"
    @set-home-components="setHomeComponents">
    <!-- logo图标 -->
    <template slot="logo">
      <img alt="logo" src="@/assets/logo.png"/>
    </template>
    <!-- 顶栏右侧区域 -->
    <template slot="right">
      <ele-header-right
        ref="header"
        :show-setting="setting.needSetting"
        @change-language="changeLanguage"
        @item-click="onItemClick"/>
    </template>
    <!-- 全局页脚 -->
    <template slot="footer">
      <ele-footer/>
    </template>
    <!-- 修改密码弹窗 -->
    <ele-password :visible.sync="showPassword"/>
  </ele-pro-layout>
</template>

<script>
import {mapGetters} from 'vuex';
import EleHeaderRight from './header-right.vue';
import ElePassword from './password.vue';
import EleFooter from './footer.vue';
import setting from '@/config/setting';
import {
  addPageTab,
  reloadPageTab,
  removeAllPageTab,
  removeLeftPageTab,
  removeOtherPageTab,
  removePageTab,
  removeRightPageTab
} from '@/utils/page-tab-util';

export default {
  name: 'EleLayout',
  components: {
    EleHeaderRight,
    ElePassword,
    EleFooter
  },
  computed: {
    // 主页标题, 移除国际化上面template中使用:home-title="setting.homeTitle"
    homeTitle() {
      return this.$t('layout.home');
    },
    ...mapGetters(['theme', 'user'])
  },
  data() {
    return {
      // 全局配置
      setting: setting,
      // 是否显示修改密码弹窗
      showPassword: false,
      // 是否显示主题设置抽屉
      showSetting: false,
      // 是否显示主体部分
      showContent: true,
      // 项目名
      projectName: process.env.VUE_APP_NAME
    };
  },
  created() {
    // 获取用户信息
    this.getUserInfo();
  },
  methods: {
    /* 获取当前用户信息 */
    getUserInfo() {
      if (setting.userUrl) {
        this.$http.get(setting.userUrl, {params: {include: ['member']}}).then((res) => {
          const result = setting.parseUser ? setting.parseUser(res.data) : res.data;
          if (result.code === 0) {
            const user = result.data;
            this.$store.dispatch('user/setUser', user);
            this.$store.dispatch('user/setRoles', user ? user.roles : null);
            this.$store.dispatch('user/setAuthorities', user ? user.authorities : null);
            // 设置节点权限
            this.$store.dispatch('user/setPermission', user ? user.permissions : null);
          } else if (result.msg) {
            this.$message.error(result.msg);
          }
          // 在用户权限信息请求完成后再渲染主体部分, 以免权限控制指令不生效
          this.showContent = true;
        }).catch((e) => {
          console.error(e);
          this.showContent = true;
          this.$message.error(e.message);
        });
      }
    },
    /* 顶栏右侧点击 */
    onItemClick(key) {
      if (key === 'password') {
        this.showPassword = true;
      } else if (key === 'setting') {
        this.showSetting = true;
      }
    },
    /* 刷新页签 */
    reloadPage() {
      reloadPageTab();
    },
    /* logo点击事件 */
    onLogoClick(isHome) {
      if (!isHome) {
        this.$router.push('/');
      }
    },
    /* 更新collapse */
    updateCollapse(value) {
      this.$store.dispatch('theme/set', {key: 'collapse', value: value});
    },
    /* 更新屏幕尺寸 */
    updateScreen() {
      this.$store.dispatch('theme/updateScreen');
      const checkFullscreen = this.$refs.header.checkFullscreen;
      checkFullscreen && checkFullscreen();
    },
    /* 切换主题风格 */
    changeStyle(value) {
      this.$store.dispatch('theme/set', value);
    },
    /* 切换主题色 */
    changeColor(value) {
      const loading = this.$loading({lock: true, background: 'transparent'});
      this.$store.dispatch('theme/setColor', value).then(() => {
        loading.close();
      }).catch((e) => {
        console.error(e);
        loading.close();
        this.$message.error('主题加载失败');
      });
    },
    changeDarkMode(value) {
      this.$store.dispatch('theme/setDarkMode', value);
    },
    changeWeakMode(value) {
      this.$store.dispatch('theme/setWeakMode', value);
    },
    setHomeComponents(components) {
      this.$store.dispatch('theme/setHomeComponents', components);
    },
    /* 添加tab */
    tabAdd(value) {
      addPageTab(value);
    },
    /* 移除tab */
    tabRemove(obj) {
      removePageTab(obj.name).then(({lastPath}) => {
        if (obj.active === obj.name) {
          this.$router.push(lastPath || '/');
        }
      });
    },
    /* 移除全部tab */
    tabRemoveAll(active) {
      removeAllPageTab();
      if (active !== '/') {
        this.$router.push('/');
      }
    },
    /* 移除左边tab */
    tabRemoveLeft(value) {
      removeLeftPageTab(value);
    },
    /* 移除右边tab */
    tabRemoveRight(value) {
      removeRightPageTab(value);
    },
    /* 移除其它tab */
    tabRemoveOther(value) {
      removeOtherPageTab(value);
    },
    /* 菜单路由国际化对应的名称 */
    i18n(path, key/*, menu*/) {
      // 参数三menu即原始菜单数据, 如果需要菜单标题多语言数据从接口返回可用此参数获取对应的多语言标题
      // 例如下面这样写, 接口的菜单数据为{path: '/system/user', titles: {zh: '用户管理', en: 'User'}}
      // return menu ? menu.titles[this.$i18n.locale] : null;
      const k = 'route.' + key + '._name', title = this.$t(k);
      return title === k ? null : title;
    },
    /* 切换语言 */
    changeLanguage(lang) {
      this.$i18n.locale = lang;
      this.$refs.layout.changeLanguage();
      localStorage.setItem('i18n-lang', lang);
    }
  }
}
</script>
