<!-- 本地主题设置抽屉，移除侧栏双排菜单开关 -->
<template>
  <el-drawer
    size="300px"
    :visible="visible"
    :append-to-body="true"
    :title="t('ele.setting.title')"
    @update:visible="updateVisible">
    <div :class="['ele-setting-wrapper', {'ele-setting-dark': darkMode}]">
      <div class="ele-setting-theme ele-text-primary">
        <el-tooltip :content="t('ele.setting.sideStyles.dark')" placement="top">
          <div class="ele-bg-base ele-side-dark" @click="setSideStyle('dark')">
            <i v-if="sideStyle === 'dark'" class="el-icon-check"></i>
          </div>
        </el-tooltip>
        <el-tooltip :content="t('ele.setting.sideStyles.light')" placement="top">
          <div class="ele-bg-base" @click="setSideStyle('light')">
            <i v-if="sideStyle === 'light'" class="el-icon-check"></i>
          </div>
        </el-tooltip>
      </div>
      <div class="ele-setting-theme ele-text-primary">
        <el-tooltip :content="t('ele.setting.headStyles.light')" placement="top">
          <div class="ele-bg-base ele-head-light" @click="setHeadStyle('light')">
            <i v-if="headStyle === 'light'" class="el-icon-check"></i>
          </div>
        </el-tooltip>
        <el-tooltip :content="t('ele.setting.headStyles.dark')" placement="top">
          <div class="ele-bg-base ele-head-dark" @click="setHeadStyle('dark')">
            <i v-if="headStyle === 'dark'" class="el-icon-check"></i>
          </div>
        </el-tooltip>
        <el-tooltip :content="t('ele.setting.headStyles.primary')" placement="top">
          <div class="ele-bg-base ele-head-primary" @click="setHeadStyle('primary')">
            <div class="ele-bg-primary"></div>
            <i v-if="headStyle === 'primary'" class="el-icon-check"></i>
          </div>
        </el-tooltip>
      </div>
      <div class="ele-setting-colors">
        <el-tooltip
          v-for="(item, index) in defaultThemes"
          :key="index"
          placement="top"
          :content="t('ele.setting.colors.' + item.name)">
          <div
            class="ele-setting-color-item"
            :style="{'background-color': item.color || item.value}"
            @click="changeColor(item.value)">
            <i v-if="item.value ? item.value === color : !color" class="el-icon-check"></i>
          </div>
        </el-tooltip>
      </div>
      <div class="ele-setting-item">
        <div class="setting-item-title">{{ t('ele.setting.darkMode') }}</div>
        <div class="setting-item-control">
          <el-switch :value="darkMode" @change="setDarkMode"/>
        </div>
      </div>
      <el-divider/>
      <div class="ele-setting-title ele-text-secondary">{{ t('ele.setting.layoutStyle') }}</div>
      <div class="ele-setting-theme ele-text-primary">
        <el-tooltip :content="t('ele.setting.layoutStyles.side')" placement="top">
          <div class="ele-bg-base ele-side-dark" @click="setLayoutStyle('side')">
            <i v-if="layoutStyle === 'side'" class="el-icon-check"></i>
          </div>
        </el-tooltip>
        <el-tooltip :content="t('ele.setting.layoutStyles.top')" placement="top">
          <div class="ele-bg-base ele-head-dark" @click="setLayoutStyle('top')">
            <i v-if="layoutStyle === 'top'" class="el-icon-check"></i>
          </div>
        </el-tooltip>
        <el-tooltip :content="t('ele.setting.layoutStyles.mix')" placement="top">
          <div class="ele-bg-base ele-layout-mix" @click="setLayoutStyle('mix')">
            <i v-if="layoutStyle === 'mix'" class="el-icon-check"></i>
          </div>
        </el-tooltip>
      </div>
      <div class="ele-setting-item">
        <div class="setting-item-title">{{ t('ele.setting.bodyFull') }}</div>
        <div class="setting-item-control">
          <el-switch :value="bodyFull" @change="setBodyFull"/>
        </div>
      </div>
      <el-divider/>
      <div class="ele-setting-title ele-text-secondary">{{ t('ele.setting.other') }}</div>
      <div class="ele-setting-item">
        <div class="setting-item-title">{{ t('ele.setting.fixedHeader') }}</div>
        <div class="setting-item-control">
          <el-switch :value="fixedHeader" @change="setFixedHeader"/>
        </div>
      </div>
      <div class="ele-setting-item">
        <div class="setting-item-title">{{ t('ele.setting.fixedSidebar') }}</div>
        <div class="setting-item-control">
          <el-switch :value="fixedSidebar" @change="setFixedSidebar"/>
        </div>
      </div>
      <div class="ele-setting-item">
        <div class="setting-item-title">{{ t('ele.setting.fixedBody') }}</div>
        <div class="setting-item-control">
          <el-switch :value="fixedBody" @change="setFixedBody"/>
        </div>
      </div>
      <div class="ele-setting-item">
        <div class="setting-item-title">{{ t('ele.setting.logoAutoSize') }}</div>
        <div class="setting-item-control">
          <el-switch :value="logoAutoSize" @change="setLogoAutoSize"/>
        </div>
      </div>
      <div class="ele-setting-item">
        <div class="setting-item-title">{{ t('ele.setting.colorfulIcon') }}</div>
        <div class="setting-item-control">
          <el-switch :value="colorfulIcon" @change="setColorfulIcon"/>
        </div>
      </div>
      <div class="ele-setting-item">
        <div class="setting-item-title">{{ t('ele.setting.sideUniqueOpen') }}</div>
        <div class="setting-item-control">
          <el-switch :value="sideUniqueOpen" @change="setSideUniqueOpen"/>
        </div>
      </div>
      <div class="ele-setting-item">
        <div class="setting-item-title">{{ t('ele.setting.showFooter') }}</div>
        <div class="setting-item-control">
          <el-switch :value="showFooter" @change="setShowFooter"/>
        </div>
      </div>
      <div class="ele-setting-item">
        <div class="setting-item-title">{{ t('ele.setting.weakMode') }}</div>
        <div class="setting-item-control">
          <el-switch :value="weakMode" @change="setWeakMode"/>
        </div>
      </div>
      <div class="ele-setting-item">
        <div class="setting-item-title">{{ t('ele.setting.showTabs') }}</div>
        <div class="setting-item-control">
          <el-switch :value="showTabs" @change="setShowTabs"/>
        </div>
      </div>
      <div class="ele-setting-item">
        <div class="setting-item-title">{{ t('ele.setting.tabStyle') }}</div>
        <div class="setting-item-control">
          <el-select size="mini" :value="tabStyle" @change="setTabStyle">
            <el-option :label="t('ele.setting.tabStyles.default')" value="default"/>
            <el-option :label="t('ele.setting.tabStyles.dot')" value="dot"/>
            <el-option :label="t('ele.setting.tabStyles.card')" value="card"/>
          </el-select>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import Locale from 'element-ui/lib/mixins/locale';

const DEFAULT_THEMES = [
  {name: 'default', value: null, color: '#1890ff'},
  {name: 'dust', value: '#5f80c7'},
  {name: 'sunset', value: '#faad14'},
  {name: 'volcano', value: '#f5686f'},
  {name: 'purple', value: '#9266f9'},
  {name: 'cyan', value: '#2bccce'},
  {name: 'green', value: '#33cc99'},
  {name: 'geekblue', value: '#32a2d4'}
];

export default {
  name: 'EleSettingDrawer',
  mixins: [Locale],
  emits: ['change-style', 'change-color', 'change-dark-mode', 'change-weak-mode', 'update:visible'],
  props: {
    visible: Boolean,
    headStyle: String,
    sideStyle: String,
    layoutStyle: String,
    bodyFull: Boolean,
    fixedHeader: Boolean,
    fixedSidebar: Boolean,
    fixedBody: Boolean,
    logoAutoSize: Boolean,
    colorfulIcon: Boolean,
    sideUniqueOpen: Boolean,
    showFooter: Boolean,
    weakMode: Boolean,
    showTabs: Boolean,
    tabStyle: String,
    darkMode: Boolean,
    color: String
  },
  data() {
    return {
      defaultThemes: DEFAULT_THEMES
    };
  },
  methods: {
    updateVisible(value) {
      this.$emit('update:visible', value);
    },
    changeColor(value) {
      if (value !== this.color) {
        this.$emit('change-color', value);
      }
    },
    changeStyle(key, value) {
      this.$emit('change-style', {key, value});
    },
    setHeadStyle(value) {
      this.changeStyle('headStyle', value);
    },
    setSideStyle(value) {
      this.changeStyle('sideStyle', value);
    },
    setLayoutStyle(value) {
      this.changeStyle('layoutStyle', value);
    },
    setBodyFull(value) {
      this.changeStyle('bodyFull', value);
    },
    setFixedHeader(value) {
      this.changeStyle('fixedHeader', value);
    },
    setFixedSidebar(value) {
      this.changeStyle('fixedSidebar', value);
    },
    setFixedBody(value) {
      this.changeStyle('fixedBody', value);
      if (value) {
        document.body.style.width = null;
      }
    },
    setLogoAutoSize(value) {
      this.changeStyle('logoAutoSize', value);
    },
    setColorfulIcon(value) {
      this.changeStyle('colorfulIcon', value);
    },
    setSideUniqueOpen(value) {
      this.changeStyle('sideUniqueOpen', value);
    },
    setWeakMode(value) {
      this.$emit('change-weak-mode', value);
    },
    setDarkMode(value) {
      this.$emit('change-dark-mode', value);
    },
    setShowFooter(value) {
      this.changeStyle('showFooter', value);
      if (!value) {
        document.body.style.width = null;
      }
    },
    setShowTabs(value) {
      this.changeStyle('showTabs', value);
    },
    setTabStyle(value) {
      this.changeStyle('tabStyle', value);
    }
  }
};
</script>

<style>
.ele-setting-wrapper {
  padding: 20px 18px;
}

.ele-setting-wrapper .ele-setting-title {
  font-size: 13px;
  margin-bottom: 15px;
}

.ele-setting-wrapper .ele-setting-theme > div {
  width: 52px;
  height: 36px;
  line-height: 1;
  font-size: 18px;
  border-radius: 3px;
  margin: 0 20px 30px 0;
  padding: 14px 0 0 24px;
  box-sizing: border-box;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  display: inline-block;
  vertical-align: top;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: background-color 0.2s;
}

.ele-setting-wrapper .ele-setting-theme > div:before,
.ele-setting-wrapper .ele-setting-theme > div:after,
.ele-setting-wrapper .ele-setting-theme > div > .ele-bg-primary {
  content: "";
  width: 100%;
  height: 10px;
  background: #fff;
  position: absolute;
  left: 0;
  top: 0;
}

.ele-setting-wrapper .ele-setting-theme > div:after {
  width: 14px;
  height: 100%;
}

.ele-setting-wrapper .ele-setting-theme > div.ele-side-dark {
  background: #28333e;
  color: #fff;
}

.ele-setting-wrapper .ele-setting-theme > div.ele-side-dark:before {
  width: 30%;
  height: 100%;
  background: #001529;
}

.ele-setting-wrapper .ele-setting-theme > div.ele-head-light {
  background: #f0f2f5;
}

.ele-setting-wrapper .ele-setting-theme > div.ele-head-dark {
  background: #001529;
  color: #fff;
}

.ele-setting-wrapper .ele-setting-theme > div.ele-head-primary {
  background: #f0f2f5;
}

.ele-setting-wrapper .ele-setting-theme > div.ele-head-primary > .ele-bg-primary {
  background: #1890ff;
}

.ele-setting-wrapper .ele-setting-theme > div.ele-layout-mix {
  background: #f0f2f5;
}

.ele-setting-wrapper .ele-setting-theme > div.ele-layout-mix:after {
  width: 30%;
  height: 100%;
  background: #001529;
}

.ele-setting-wrapper .ele-setting-colors {
  margin-bottom: 8px;
}

.ele-setting-wrapper .ele-setting-color-item {
  width: 22px;
  height: 22px;
  color: #fff;
  margin-right: 12px;
  margin-bottom: 18px;
  border-radius: 2px;
  text-align: center;
  line-height: 22px;
  display: inline-block;
  cursor: pointer;
}

.ele-setting-wrapper .ele-setting-item {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ele-setting-wrapper .setting-item-title {
  font-size: 14px;
}

.ele-setting-wrapper .setting-item-control {
  margin-left: 16px;
}

.ele-setting-dark {
  color: rgba(255, 255, 255, 0.86);
}

.ele-setting-dark .el-divider {
  background-color: rgba(255, 255, 255, 0.12);
}
</style>
