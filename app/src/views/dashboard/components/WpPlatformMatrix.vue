<template>
  <section class="wp-matrix">
    <div class="wp-matrix__header">
      <div>
        <div class="wp-matrix__eyebrow">月度矩阵</div>
        <div class="wp-matrix__sub">按平台观察各月份的字数分布。</div>
      </div>
    </div>
    <div v-if="!hasData" class="wp-matrix__empty">还没有平台月度矩阵数据。</div>
    <div v-else ref="chart" class="wp-matrix__chart"></div>
  </section>
</template>

<script>
import echarts from "../utils/echarts";

export default {
  name: "WpPlatformMatrix",
  props: {
    matrix: {
      type: Object,
      default() {
        return {
          months: [],
          rows: [],
          buckets: [0, 500, 2000, 5000],
        };
      },
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  computed: {
    hasData() {
      const rows = this.matrix && Array.isArray(this.matrix.rows) ? this.matrix.rows : [];
      const months = this.matrix && Array.isArray(this.matrix.months) ? this.matrix.months : [];
      return rows.length > 0 && months.length > 0;
    },
  },
  mounted() {
    if (this.hasData) {
      this.initChart();
    }
    window.addEventListener("resize", this.resizeChart);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeChart);
    this.destroyChart();
  },
  watch: {
    matrix: {
      deep: true,
      handler() {
        if (!this.hasData) {
          this.destroyChart();
          return;
        }
        this.$nextTick(() => {
          this.initChart();
          this.renderChart();
        });
      },
    },
  },
  methods: {
    initChart() {
      if (!this.$refs.chart) {
        return;
      }
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chart);
      }
      this.renderChart();
    },
    destroyChart() {
      if (!this.chart) {
        return;
      }
      this.chart.dispose();
      this.chart = null;
    },
    resizeChart() {
      if (this.chart) {
        this.chart.resize();
      }
    },
    renderChart() {
      if (!this.chart) {
        return;
      }
      const months = this.matrix.months || [];
      const rows = this.matrix.rows || [];
      const values = [];
      rows.forEach((row, rowIndex) => {
        const cells = Array.isArray(row.cells) ? row.cells : [];
        const logCells = Array.isArray(row.log_cells) ? row.log_cells : [];
        cells.forEach((words, monthIndex) => {
          values.push([
            monthIndex,
            rowIndex,
            Number(words || 0),
            Number(logCells[monthIndex] || 0),
          ]);
        });
      });
      const maxValue = values.reduce((max, item) => Math.max(max, item[2]), 0) || 1;
      const buckets = Array.isArray(this.matrix.buckets) ? this.matrix.buckets.map((item) => Number(item || 0)) : [0, 500, 2000, 5000];
      const b1 = buckets[1] || 200;
      const b2 = buckets[2] || 800;
      const b3 = buckets[3] || 2000;
      const top = Math.max(maxValue, b3);

      this.chart.setOption(
        {
          animationDuration: 300,
          grid: {
            left: 92,
            right: 16,
            top: 16,
            bottom: 24,
            containLabel: false,
          },
          tooltip: {
            confine: true,
            formatter: (params) => {
              const row = rows[params.value[1]] || {};
              const month = months[params.value[0]] || "";
              return `${row.name || "--"} · ${month}<br/>${Number(params.value[2] || 0).toLocaleString()} 字 / ${Number(params.value[3] || 0).toLocaleString()} 条日志`;
            },
          },
          xAxis: {
            type: "category",
            data: months.map((item) => String(item).slice(2)),
            axisLine: {
              lineStyle: {
                color: "#d7dfd1",
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: "#94a189",
              fontSize: 11,
            },
            splitArea: {
              show: false,
            },
          },
          yAxis: {
            type: "category",
            data: rows.map((item) => item.name || "--"),
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: "#51604b",
              fontSize: 12,
            },
          },
          visualMap: {
            type: "piecewise",
            show: false,
            calculable: false,
            pieces: [
              { lte: 0, color: "#eaf3e2" },
              { gt: 0, lte: b1, color: "#c8e0b5" },
              { gt: b1, lte: b2, color: "#9ccc80" },
              { gt: b2, lte: b3, color: "#7bb069" },
              { gt: b3, lte: top, color: "#4a8f2e" },
            ],
          },
          series: [
            {
              type: "heatmap",
              data: values,
              label: {
                show: false,
              },
              itemStyle: {
                borderRadius: 4,
                borderColor: "rgba(255, 255, 255, 0.9)",
                borderWidth: 2,
              },
            },
          ],
        },
        true
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.wp-matrix {
  padding: 22px;
  border-radius: 24px;
  border: 1px solid rgba(214, 225, 208, 0.9);
  background: rgba(255, 255, 255, 0.72);
  box-shadow:
    0 24px 40px -30px rgba(84, 106, 74, 0.42),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(150%);

  &__header {
    margin-bottom: 14px;
  }

  &__eyebrow {
    color: #6e7a69;
    font-size: 12px;
    line-height: 1.4;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__sub {
    margin-top: 6px;
    color: #7e8a79;
    font-size: 13px;
    line-height: 1.6;
  }

  &__chart,
  &__empty {
    height: 360px;
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 18px;
    background: rgba(240, 246, 236, 0.9);
    color: #7e8a79;
    font-size: 14px;
    text-align: center;
  }
}

@media (max-width: 767px) {
  .wp-matrix {
    padding: 18px;

    &__chart,
    &__empty {
      height: 300px;
    }
  }
}
</style>
