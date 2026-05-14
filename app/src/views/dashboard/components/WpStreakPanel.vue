<template>
  <section class="wp-streak wp-glass-card">
    <!-- 连续打卡 -->
    <div class="wp-streak__block">
      <div class="wp-streak__eyebrow">连续打卡</div>
      <div class="wp-streak__big">
        <span class="wp-streak__num">{{ currentStreak }}</span>
        <span class="wp-streak__unit">天</span>
      </div>
      <div class="wp-streak__hint">{{ streakHint }}</div>
      <div class="wp-streak__row">
        <div class="wp-streak__sub">
          <div class="wp-streak__sub-label">最长连续</div>
          <div class="wp-streak__sub-val">{{ longestStreak }} 天</div>
        </div>
        <div class="wp-streak__sub">
          <div class="wp-streak__sub-label">高峰时段</div>
          <div class="wp-streak__sub-val">{{ peakLabel }}</div>
        </div>
      </div>
    </div>

    <div class="wp-streak__divider"></div>

    <!-- 最爱平台 -->
    <div class="wp-streak__block">
      <div class="wp-streak__eyebrow">主力平台</div>
      <template v-if="favoritePlatform">
        <div class="wp-streak__platform-name">{{ favoritePlatform.name }}</div>
        <div class="wp-streak__bar-wrap">
          <div class="wp-streak__bar-fill" :style="{ width: favoritePlatform.percent + '%' }"></div>
        </div>
        <div class="wp-streak__platform-meta">
          <span>{{ formatNumber(favoritePlatform.words) }} 字</span>
          <span>{{ favoritePlatform.percent }}%</span>
        </div>
      </template>
      <div v-else class="wp-streak__empty">暂无平台贡献数据</div>
    </div>
  </section>
</template>

<script>
export default {
  name: "WpStreakPanel",
  props: {
    metrics: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    currentStreak() {
      return (this.metrics.current_streak && this.metrics.current_streak.value) || 0;
    },
    streakHint() {
      return (this.metrics.current_streak && this.metrics.current_streak.hint) || "今天还没写呢";
    },
    longestStreak() {
      return (this.metrics.longest_streak && this.metrics.longest_streak.value) || 0;
    },
    peakLabel() {
      return (this.metrics.peak_hour && this.metrics.peak_hour.label) || "—";
    },
    favoritePlatform() {
      return this.metrics.favorite_platform || null;
    },
  },
  methods: {
    formatNumber(value) {
      const n = Number(value || 0);
      if (n >= 10000) return (n / 10000).toFixed(1) + "w";
      return n.toLocaleString();
    },
  },
};
</script>

<style lang="scss" scoped>
.wp-streak {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  border-radius: 24px;
  height: 100%;
  box-sizing: border-box;

  &__eyebrow {
    margin-bottom: 12px;
    color: #6e7a69;
    font-size: 11px;
    line-height: 1.4;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-family: var(--wp-font-mono, "JetBrains Mono", ui-monospace, monospace);
  }

  &__big {
    display: flex;
    align-items: baseline;
    gap: 4px;
    margin-bottom: 6px;
  }

  &__num {
    font-size: 52px;
    font-weight: 900;
    color: #4a8f2e;
    line-height: 1;
    font-family: var(--wp-font-display, "Fraunces", serif);
  }

  &__unit {
    font-size: 22px;
    font-weight: 700;
    color: #7bb069;
  }

  &__hint {
    font-size: 12px;
    color: #94a189;
    margin-bottom: 16px;
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding-top: 14px;
    border-top: 1px solid rgba(214, 225, 208, 0.6);
  }

  &__sub-label {
    font-size: 11px;
    color: #94a189;
    margin-bottom: 4px;
  }

  &__sub-val {
    font-size: 16px;
    font-weight: 700;
    color: #1f2a1a;
  }

  &__divider {
    height: 1px;
    background: rgba(214, 225, 208, 0.6);
    margin: 0 -4px;
  }

  &__platform-name {
    font-size: 18px;
    font-weight: 800;
    color: #1f2a1a;
    margin-bottom: 12px;
  }

  &__bar-wrap {
    height: 6px;
    background: rgba(156, 204, 128, 0.2);
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  &__bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #4a8f2e, #7bb069);
    border-radius: 6px;
    transition: width 0.6s ease;
  }

  &__platform-meta {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #94a189;
  }

  &__empty {
    font-size: 13px;
    color: #94a189;
    padding: 8px 0;
  }
}
</style>
