<template>
  <section class="wp-weekday wp-glass-card">
    <div class="wp-weekday__head">
      <div>
        <div class="wp-weekday__title">星期分布</div>
        <div class="wp-weekday__sub" v-if="peakDay">
          周{{ peakDay.label }}最有产出 · 日均 {{ peakDay.avg.toLocaleString() }} 字
        </div>
      </div>
    </div>
    <div v-if="!items.length" class="wp-weekday__empty">还没有星期分布数据。</div>
    <div v-else class="wp-weekday__grid">
      <div v-for="(d, i) in items" :key="d.label" class="wp-weekday__col">
        <div class="wp-weekday__bar-wrap">
          <div class="wp-weekday__val">{{ d.avg }}</div>
          <div
            :class="['wp-weekday__bar', { 'wp-weekday__bar--peak': i === peakIdx }]"
            :style="{ height: barHeight(d.avg) }" />
        </div>
        <div :class="['wp-weekday__label', { 'wp-weekday__label--end': i === 0 || i === 6 }]">
          {{ d.label }}
        </div>
      </div>
    </div>
  </section>
</template>

<script>
const LABELS = ["日", "一", "二", "三", "四", "五", "六"];

export default {
  name: "WpWeekdayBar",
  props: {
    weekDist: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    items() {
      if (!Array.isArray(this.weekDist) || this.weekDist.length < 7) return [];
      // 后端 index 0=周一..6=周日，设计稿 index 0=周日..6=周六
      return [
        { label: LABELS[0], avg: this.weekDist[6] },  // 周日
        { label: LABELS[1], avg: this.weekDist[0] },  // 周一
        { label: LABELS[2], avg: this.weekDist[1] },  // 周二
        { label: LABELS[3], avg: this.weekDist[2] },  // 周三
        { label: LABELS[4], avg: this.weekDist[3] },  // 周四
        { label: LABELS[5], avg: this.weekDist[4] },  // 周五
        { label: LABELS[6], avg: this.weekDist[5] },  // 周六
      ];
    },
    max() {
      return Math.max(...this.items.map((d) => d.avg), 1);
    },
    peakIdx() {
      let idx = 0;
      let maxVal = 0;
      this.items.forEach((d, i) => {
        if (d.avg > maxVal) {
          maxVal = d.avg;
          idx = i;
        }
      });
      return idx;
    },
    peakDay() {
      return this.items.length ? this.items[this.peakIdx] : null;
    },
  },
  methods: {
    barHeight(avg) {
      return `${(avg / this.max) * 100}%`;
    },
  },
};
</script>

<style lang="scss" scoped>
.wp-weekday {
  display: flex;
  flex-direction: column;
  padding: 18px 20px;
  border-radius: var(--wp-radius-card, 16px);

  &__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 14px;
    gap: 12px;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: var(--wp-ink-1, #1f2a1a);
  }

  &__sub {
    font-size: 12px;
    color: var(--wp-ink-3, #94a189);
    margin-top: 2px;
  }

  &__empty {
    flex: 1;
    min-height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 18px;
    background: rgba(240, 246, 236, 0.9);
    color: #7e8a79;
    font-size: 14px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 14px;
    height: 220px;
    padding: 8px 4px 0;
  }

  &__col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  &__bar-wrap {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
  }

  &__val {
    font-size: 11px;
    color: var(--wp-ink-3, #94a189);
    font-variant-numeric: tabular-nums;
  }

  &__bar {
    width: 100%;
    max-width: 36px;
    background: linear-gradient(180deg, var(--wp-green, #5fa979) 0%, var(--wp-green-l, #d8ecdb) 100%);
    border-radius: 8px 8px 4px 4px;
    min-height: 6px;

    &--peak {
      background: linear-gradient(180deg, var(--wp-green-d, #2e7d4c) 0%, var(--wp-green, #5fa979) 100%);
    }
  }

  &__label {
    font-size: 12px;
    color: var(--wp-ink-2, #5c6b57);

    &--end {
      color: var(--wp-warn, #d49b4a);
      font-weight: 500;
    }
  }
}
</style>
