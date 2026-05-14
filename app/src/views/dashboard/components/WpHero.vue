<template>
  <section class="wp-hero wp-glass-card">
    <div class="wp-hero__copy">
      <div class="wp-hero__eyebrow">DEVELOP WORKSPACE</div>
      <h1 class="wp-hero__title">{{ greeting }}，{{ displayName }}</h1>
      <p class="wp-hero__desc">{{ todayText }}</p>
      <wp-weather-chip :icon="weatherIcon" :text="weatherText" />
    </div>
    <div class="wp-hero__actions">
      <el-button class="ele-btn-icon" icon="el-icon-edit-outline" type="primary" @click="$emit('go', '/develop/work-daily')">
        写日志
      </el-button>
      <el-button class="ele-btn-icon" icon="el-icon-document-add" @click="$emit('go', '/develop/work-doc')">
        新建文档
      </el-button>
      <el-button class="ele-btn-icon" icon="el-icon-_surveying" @click="$emit('go', '/develop/convert-path')">
        路径转换
      </el-button>
    </div>
  </section>
</template>

<script>
import WpWeatherChip from "./WpWeatherChip.vue";

export default {
  name: "WpHero",
  components: {
    WpWeatherChip,
  },
  props: {
    greeting: {
      type: String,
      default: "晚上好",
    },
    displayName: {
      type: String,
      default: "开发者",
    },
    todayText: {
      type: String,
      default: "",
    },
    weatherIcon: {
      type: String,
      default: "el-icon-sunny",
    },
    weatherText: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.wp-hero {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 28px;
  border-radius: 30px;
  overflow: hidden;
}

// 候选 1：浅色慢呼吸渐变。10s 周期，幅度足够肉眼察觉 —— 是持续循环动效，不是 fade-in
.wp-hero::before {
  content: "";
  position: absolute;
  inset: -40% -25% -25% -40%;
  background:
    radial-gradient(closest-side at 20% 30%, rgba(156, 204, 128, 0.62), transparent 68%),
    radial-gradient(closest-side at 78% 26%, rgba(245, 225, 213, 0.58), transparent 68%),
    radial-gradient(closest-side at 50% 90%, rgba(200, 224, 181, 0.4), transparent 65%);
  animation: wp-hero-breath 10s ease-in-out infinite;
  z-index: 0;
  pointer-events: none;
  will-change: transform, opacity;
}

.wp-hero > * {
  position: relative;
  z-index: 1;
}

@keyframes wp-hero-breath {
  0%, 100% {
    transform: translate3d(-6%, -4%, 0) scale(1);
    opacity: 0.85;
  }
  50% {
    transform: translate3d(5%, 4%, 0) scale(1.12);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wp-hero::before {
    animation: none;
  }
}

.wp-hero__copy {
  flex: 1;
  min-width: 0;
}

.wp-hero__eyebrow {
  color: #7a8574;
  font-size: 12px;
  line-height: 1.4;
  letter-spacing: 0.1em;
  font-family: var(--wp-font-mono, "JetBrains Mono", "SF Mono", ui-monospace, monospace);
  text-transform: uppercase;
}

.wp-hero__title {
  margin: 12px 0 0;
  color: #1f2a1a;
  font-size: 40px;
  line-height: 1.05;
  font-weight: 700;
  font-family: var(--wp-font-display, "Fraunces", "Source Han Serif SC", "Songti SC", serif);
}

.wp-hero__desc {
  max-width: 720px;
  margin: 14px 0 0;
  color: #5c6b57;
  font-size: 14px;
  line-height: 1.8;
}

.wp-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-end;
}

@media (max-width: 991px) {
  .wp-hero {
    flex-direction: column;
  }

  .wp-hero__actions {
    justify-content: flex-start;
  }
}
</style>
