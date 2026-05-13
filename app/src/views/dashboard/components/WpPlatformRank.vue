<template>
  <section class="wp-rank wp-glass-card">
    <div class="wp-section-head">
      <div>
        <div class="wp-section-head__eyebrow">平台贡献排行</div>
        <div class="wp-section-head__desc">按当前范围内的累计字数排序。</div>
      </div>
    </div>
    <div v-if="!rank.length" class="wp-empty-card">还没有平台贡献数据。</div>
    <div v-else class="wp-rank-list">
      <button
        v-for="item in rank"
        :key="item.platform_id || item.name"
        class="wp-rank-item"
        type="button"
        @click="$emit('open-daily')">
        <div class="wp-rank-item__head">
          <div class="wp-rank-item__title">
            <span class="wp-rank-item__badge">{{ item.rank }}</span>
            <span>{{ item.name || "未绑定平台" }}</span>
          </div>
          <div class="wp-rank-item__value">{{ formatNumber(item.words) }} 字</div>
        </div>
        <div class="wp-rank-item__bar">
          <span class="wp-rank-item__fill" :style="{ width: `${Math.max(item.percent || 0, 4)}%` }"></span>
        </div>
        <div class="wp-rank-item__meta">
          <span>{{ formatNumber(item.logs) }} 条日志</span>
          <span>{{ formatPercent(item.percent) }}</span>
        </div>
      </button>
    </div>
  </section>
</template>

<script>
export default {
  name: "WpPlatformRank",
  props: {
    rank: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    formatNumber(value) {
      return Number(value || 0).toLocaleString();
    },
    formatPercent(value) {
      const target = Number(value || 0);
      return `${target.toFixed(target >= 10 ? 0 : 1)}%`;
    },
  },
};
</script>

<style lang="scss" scoped>
.wp-rank {
  padding: 22px;
  border-radius: 24px;
}

.wp-rank-list {
  display: grid;
  gap: 12px;
}

.wp-rank-item {
  padding: 14px;
  border: 1px solid rgba(214, 225, 208, 0.9);
  border-radius: 16px;
  background: rgba(250, 252, 248, 0.92);
  text-align: left;
  cursor: pointer;
}

.wp-rank-item__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.wp-rank-item__title {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #2a3825;
  font-weight: 600;
}

.wp-rank-item__badge {
  min-width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(209, 123, 92, 0.2);
  color: #93422b;
  font-size: 12px;
}

.wp-rank-item__value {
  color: #32422e;
  font-size: 13px;
}

.wp-rank-item__bar {
  margin-top: 10px;
  height: 8px;
  border-radius: 999px;
  background: rgba(215, 223, 209, 0.7);
  overflow: hidden;
}

.wp-rank-item__fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #7bb069, #4a8f2e);
}

.wp-rank-item__meta {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  color: #62705d;
  font-size: 12px;
}
</style>
