<template>
  <section class="wp-heat">
    <div class="wp-heat__header">
      <div>
        <div class="wp-heat__eyebrow">365 天活跃热力图</div>
        <div class="wp-heat__sub">{{ subText }}</div>
      </div>
      <div class="wp-heat__legend">
        <span>少</span>
        <span
          v-for="level in 5"
          :key="level"
          :class="['wp-heat__legend-cell', 'lvl-' + (level - 1)]"></span>
        <span>多</span>
      </div>
    </div>

    <div v-if="!decoratedCells.length" class="wp-heat__empty">
      还没有写作活跃数据，先去写今天第一条日志。
    </div>
    <div
      v-else
      class="wp-heat__grid"
      :style="{ '--cols': cols }">
      <button
        v-for="cell in decoratedCells"
        :key="cell.date"
        :class="[
          'wp-heat__cell',
          'lvl-' + cell.level,
          { 'wp-heat__cell--muted': cell.muted },
        ]"
        :title="cell.title"
        type="button"
        @click="$emit('select-date', cell.date)"></button>
    </div>

    <div v-if="decoratedCells.length" class="wp-heat__foot">
      <div class="wp-heat__foot-item">
        <div class="wp-heat__foot-label">最高单日</div>
        <div class="wp-heat__foot-value">{{ maxDayWords.toLocaleString() }}<span>字</span></div>
      </div>
      <div class="wp-heat__foot-item">
        <div class="wp-heat__foot-label">活跃天</div>
        <div class="wp-heat__foot-value">{{ activeDays }}<span>/{{ decoratedCells.length }}</span></div>
      </div>
      <div class="wp-heat__foot-item">
        <div class="wp-heat__foot-label">空白天</div>
        <div class="wp-heat__foot-value">{{ blankDays }}<span>天</span></div>
      </div>
      <div class="wp-heat__foot-item">
        <div class="wp-heat__foot-label">日均</div>
        <div class="wp-heat__foot-value">{{ avgWords }}<span>字</span></div>
      </div>
    </div>
  </section>
</template>

<script>
const RANGE_DAYS = {
  all: 0,
  "30d": 30,
  "7d": 7,
};

export default {
  name: "WpActivityHeatmap",
  props: {
    cells: {
      type: Array,
      default() {
        return [];
      },
    },
    buckets: {
      type: Array,
      default() {
        return [0, 200, 800, 2000];
      },
    },
    range: {
      type: String,
      default: "all",
    },
  },
  computed: {
    cols() {
      return Math.max(1, Math.ceil(this.decoratedCells.length / 7));
    },
    subText() {
      if (this.range === "30d") {
        return "最近 30 天保持高亮，其余日期保留全年底稿。";
      }
      if (this.range === "7d") {
        return "最近 7 天保持高亮，其余日期保留全年底稿。";
      }
      return "点击任意一天，可直接跳到对应日期的工作日常。";
    },
    maxDayWords() {
      if (!this.decoratedCells.length) return 0;
      return Math.max(...this.decoratedCells.map((c) => c.words));
    },
    activeDays() {
      return this.decoratedCells.filter((c) => c.words > 0).length;
    },
    blankDays() {
      return this.decoratedCells.filter((c) => c.words === 0).length;
    },
    avgWords() {
      if (!this.decoratedCells.length) return 0;
      const total = this.decoratedCells.reduce((s, c) => s + c.words, 0);
      return Math.round(total / this.decoratedCells.length);
    },
    decoratedCells() {
      const visibleDays = RANGE_DAYS[this.range] || 0;
      const cutoff = visibleDays
        ? this.resolveDateOffset(visibleDays - 1)
        : "";

      return (this.cells || []).map((cell) => {
        const words = Number(cell && cell.words ? cell.words : 0);
        return {
          date: cell.date,
          words,
          logs: Number(cell && cell.logs ? cell.logs : 0),
          level: this.resolveLevel(words),
          muted: cutoff ? cell.date < cutoff : false,
          title: this.buildTitle(cell),
        };
      });
    },
  },
  methods: {
    resolveLevel(words) {
      const marks = Array.isArray(this.buckets) ? this.buckets.slice(1) : [];
      if (!words) {
        return 0;
      }
      if (!marks.length) {
        return 1;
      }
      let level = 1;
      marks.forEach((mark, index) => {
        if (words > Number(mark || 0)) {
          level = Math.min(4, index + 2);
        }
      });
      return level;
    },
    buildTitle(cell) {
      const label = this.formatWeekday(cell.date);
      const words = Number(cell && cell.words ? cell.words : 0);
      const logs = Number(cell && cell.logs ? cell.logs : 0);
      if (!words && !logs) {
        return `${cell.date} ${label} · 没写`;
      }
      return `${cell.date} ${label} · 写了 ${this.formatNumber(words)} 字 · ${logs} 条日志`;
    },
    formatWeekday(value) {
      if (!value) {
        return "";
      }
      const date = new Date(`${value}T00:00:00`);
      const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      return weekdays[date.getDay()];
    },
    formatNumber(value) {
      return Number(value || 0).toLocaleString();
    },
    resolveDateOffset(offset) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - offset);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.wp-heat {
  //min-height: 100%;
  padding: 18px 20px;
  border-radius: var(--wp-radius-card, 16px);
  border: 1px solid rgba(214, 225, 208, 0.9);
  background: rgba(255, 255, 255, 0.72);
  box-shadow:
    0 24px 40px -30px rgba(84, 106, 74, 0.42),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(150%);

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;
  }

  &__eyebrow {
    font-size: 12px;
    line-height: 1.4;
    color: #6e7a69;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__sub {
    margin-top: 6px;
    color: #7e8a79;
    font-size: 13px;
    line-height: 1.6;
  }

  &__legend {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #92a08b;
    font-size: 12px;
    line-height: 1.4;
    white-space: nowrap;
  }

  &__legend-cell {
    width: 11px;
    height: 11px;
    border-radius: 2.5px;
    background: #eef4ee;

    &.lvl-1 {
      background: #d8ecdb;
    }

    &.lvl-2 {
      background: #9dd3a9;
    }

    &.lvl-3 {
      background: #5fa979;
    }

    &.lvl-4 {
      background: #2e7d4c;
    }
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 160px;
    border-radius: 18px;
    background: rgba(240, 246, 236, 0.9);
    color: #7e8a79;
    font-size: 14px;
    text-align: center;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(var(--cols), 13px);
    grid-template-rows: repeat(7, 13px);
    grid-auto-flow: column;
    gap: 3px;
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  &__cell {
    width: 13px;
    height: 13px;
    padding: 0;
    border: none;
    border-radius: 2.5px;
    background: #eef4ee;
    cursor: pointer;
    transition:
      transform 0.18s ease,
      box-shadow 0.18s ease,
      opacity 0.18s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 0 0 1.5px #2e7d4c;
    }

    &.lvl-1 {
      background: #d8ecdb;
    }

    &.lvl-2 {
      background: #9dd3a9;
    }

    &.lvl-3 {
      background: #5fa979;
    }

    &.lvl-4 {
      background: #2e7d4c;
    }
  }

  &__cell--muted {
    opacity: 0.3;
  }

  &__foot {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px dashed rgba(214, 225, 208, 0.9);
  }

  &__foot-label {
    font-size: 11px;
    color: var(--wp-ink-3, #94a189);
  }

  &__foot-value {
    font-size: 20px;
    font-weight: 600;
    margin-top: 2px;
    color: var(--wp-ink-1, #1f2a1a);

    span {
      font-size: 11px;
      color: var(--wp-ink-3, #94a189);
      margin-left: 4px;
      font-weight: 400;
    }
  }
}

@media (max-width: 767px) {
  .wp-heat {
    padding: 18px;

    &__header {
      flex-direction: column;
    }
  }
}
</style>
