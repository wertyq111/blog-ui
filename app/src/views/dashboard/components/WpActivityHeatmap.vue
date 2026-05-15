<template>
  <section class="wp-heat">
    <div class="wp-heat__header">
      <div>
        <div class="wp-heat__title">365 天活跃热力图</div>
        <div class="wp-heat__sub">{{ subText }}</div>
      </div>
      <div class="wp-heat__legend">
        <span class="wp-heat__legend-label">少</span>
        <span v-for="l in 5" :key="l" class="wp-heat__legend-cell" :class="'lvl-' + (l - 1)"></span>
        <span class="wp-heat__legend-label">多</span>
      </div>
    </div>

    <div v-if="!decoratedCells.length" class="wp-heat__empty">
      还没有写作活跃数据，先去写今天第一条日志。
    </div>
    <div v-else class="wp-heat__body">
      <svg :width="svgWidth" :height="svgHeight" class="wp-heat__svg">
        <!-- month labels -->
        <text
          v-for="m in monthLabels"
          :key="'m' + m.wi"
          :x="m.wi * (cellSize + cellGap)"
          y="10"
          class="wp-heat__month">{{ m.label }}</text>
        <g transform="translate(0, 16)">
          <rect
            v-for="cell in svgCells"
            :key="cell.date"
            :x="cell.x"
            :y="cell.y"
            :width="cellSize"
            :height="cellSize"
            :rx="2.5"
            :fill="levelFill(cell.level)"
            :stroke="hoverDate === cell.date ? '#2e7d4c' : 'transparent'"
            :stroke-width="hoverDate === cell.date ? 1.5 : 0"
            :opacity="cell.muted ? 0.3 : 1"
            style="cursor: pointer"
            @mouseenter="onCellEnter(cell)"
            @mouseleave="hoverDate = null"
            @click="$emit('select-date', cell.date)" />
        </g>
      </svg>
      <!-- hover tooltip -->
      <div
        v-if="hoverCell"
        class="wp-heat__tip"
        :style="{ left: hoverCell.tipX + 'px', top: hoverCell.tipY + 'px' }">
        <div class="wp-heat__tip-date">{{ hoverCell.date }}</div>
        <div class="wp-heat__tip-val">{{ hoverCell.words > 0 ? hoverCell.words.toLocaleString() + ' 字' : '没写' }}</div>
      </div>
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
const RANGE_DAYS = { all: 0, "30d": 30, "7d": 7 };
const LEVEL_FILLS = ["#eef4ee", "#d8ecdb", "#9dd3a9", "#5fa979", "#2e7d4c"];

export default {
  name: "WpActivityHeatmap",
  props: {
    cells: { type: Array, default: () => [] },
    buckets: { type: Array, default: () => [0, 200, 800, 2000] },
    range: { type: String, default: "all" },
  },
  data() {
    return {
      hoverDate: null,
      hoverCell: null,
      cellSize: 13,
      cellGap: 3,
    };
  },
  computed: {
    decoratedCells() {
      const visibleDays = RANGE_DAYS[this.range] || 0;
      const cutoff = visibleDays ? this.resolveDateOffset(visibleDays - 1) : "";
      return (this.cells || []).map((cell) => {
        const words = Number(cell && cell.words ? cell.words : 0);
        return {
          date: cell.date,
          words,
          dow: cell.dow != null ? cell.dow : new Date(cell.date + "T00:00:00").getDay(),
          level: this.resolveLevel(words),
          muted: cutoff ? cell.date < cutoff : false,
        };
      });
    },
    weeks() {
      const weeks = [];
      let current = [];
      if (this.decoratedCells.length) {
        const firstDow = this.decoratedCells[0].dow;
        for (let i = 0; i < firstDow; i++) current.push(null);
      }
      this.decoratedCells.forEach((d) => {
        current.push(d);
        if (current.length === 7) {
          weeks.push(current);
          current = [];
        }
      });
      if (current.length) {
        while (current.length < 7) current.push(null);
        weeks.push(current);
      }
      return weeks;
    },
    svgCells() {
      const cs = this.cellSize;
      const gap = this.cellGap;
      const result = [];
      this.weeks.forEach((w, wi) => {
        w.forEach((d, di) => {
          if (!d) return;
          result.push({
            ...d,
            x: wi * (cs + gap),
            y: di * (cs + gap),
          });
        });
      });
      return result;
    },
    monthLabels() {
      const labels = [];
      let lastMonth = -1;
      this.weeks.forEach((w, wi) => {
        const first = w.find((d) => d);
        if (!first) return;
        const m = parseInt(first.date.slice(5, 7), 10);
        if (m !== lastMonth) {
          labels.push({ wi, label: m + "月" });
          lastMonth = m;
        }
      });
      return labels;
    },
    svgWidth() {
      return this.weeks.length * (this.cellSize + this.cellGap);
    },
    svgHeight() {
      return 7 * (this.cellSize + this.cellGap) + 18;
    },
    subText() {
      if (this.range === "30d") return "最近 30 天保持高亮，其余日期保留全年底稿。";
      if (this.range === "7d") return "最近 7 天保持高亮，其余日期保留全年底稿。";
      return "点击任意一天，跳转到对应日期的工作日常 · hover 查看详情";
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
  },
  methods: {
    levelFill(l) {
      return LEVEL_FILLS[l] || LEVEL_FILLS[0];
    },
    resolveLevel(words) {
      const marks = Array.isArray(this.buckets) ? this.buckets.slice(1) : [];
      if (!words) return 0;
      if (!marks.length) return 1;
      let level = 1;
      marks.forEach((mark, i) => {
        if (words > Number(mark || 0)) level = Math.min(4, i + 2);
      });
      return level;
    },
    resolveDateOffset(offset) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - offset);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    },
    onCellEnter(cell) {
      this.hoverDate = cell.date;
      this.hoverCell = {
        date: cell.date,
        words: cell.words,
        tipX: cell.x + this.cellSize / 2,
        tipY: cell.y + 16 + this.cellSize + 6,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.wp-heat {
  display: flex;
  flex-direction: column;
  padding: 18px 20px;
  border-radius: var(--wp-radius-card, 16px);
  height: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(214, 225, 208, 0.9);
  background: rgba(255, 255, 255, 0.55);
  box-shadow:
    0 28px 48px -28px rgba(84, 106, 74, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 12px;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: var(--wp-ink-1, #1f2a1a);
  }

  &__sub {
    margin-top: 2px;
    color: var(--wp-ink-3, #94a189);
    font-size: 12px;
    line-height: 1.6;
  }

  &__legend {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
  }

  &__legend-label {
    margin: 0 4px;
    font-size: 11px;
    color: var(--wp-ink-3, #94a189);
  }

  &__legend-cell {
    width: 11px;
    height: 11px;
    border-radius: 2.5px;
    background: #eef4ee;

    &.lvl-1 { background: #d8ecdb; }
    &.lvl-2 { background: #9dd3a9; }
    &.lvl-3 { background: #5fa979; }
    &.lvl-4 { background: #2e7d4c; }
  }

  &__empty {
    flex: 1;
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

  &__body {
    position: relative;
    overflow-x: auto;
    padding: 4px 0;
    flex: 1;
  }

  &__svg {
    display: block;
  }

  &__month {
    fill: var(--wp-ink-3, #94a189);
    font-size: 9.5px;
  }

  &__tip {
    position: absolute;
    padding: 6px 10px;
    border-radius: 6px;
    background: rgba(30, 40, 26, 0.88);
    color: #fff;
    font-size: 11px;
    white-space: nowrap;
    pointer-events: none;
    transform: translateX(-50%);
    z-index: 10;

    &::before {
      content: "";
      position: absolute;
      top: -4px;
      left: 50%;
      transform: translateX(-50%);
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 4px solid rgba(30, 40, 26, 0.88);
    }
  }

  &__tip-date {
    opacity: 0.7;
    font-size: 10px;
  }

  &__tip-val {
    font-weight: 600;
    margin-top: 1px;
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
