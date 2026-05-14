<template>
  <section class="wp-hour-chart wp-glass-card">
    <div class="wp-hour-chart__eyebrow">24h 写作分布</div>
    <div v-if="!hasData" class="wp-hour-chart__empty">还没有写作时段数据。</div>
    <div v-else ref="chart" class="wp-hour-chart__chart"></div>
  </section>
</template>

<script>
import echarts from "../utils/echarts";

export default {
  name: "WpHourChart",
  props: {
    hourDist: {
      type: Array,
      default() {
        return [];
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
      return Array.isArray(this.hourDist) && this.hourDist.some((v) => v > 0);
    },
  },
  mounted() {
    if (this.hasData) {
      this.$nextTick(this.initChart);
    }
    window.addEventListener("resize", this.resizeChart);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeChart);
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  },
  watch: {
    hourDist: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          if (this.hasData) {
            this.initChart();
          }
        });
      },
    },
  },
  methods: {
    initChart() {
      if (!this.$refs.chart) return;
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chart);
      }
      this.renderChart();
    },
    resizeChart() {
      if (this.chart) this.chart.resize();
    },
    renderChart() {
      if (!this.chart) return;
      const dist = this.hourDist;
      const max = Math.max(...dist, 1);
      const hours = Array.from({ length: 24 }, (_, i) => `${i}h`);

      this.chart.setOption(
        {
          animationDuration: 300,
          grid: { left: 0, right: 4, top: 8, bottom: 22, containLabel: true },
          tooltip: {
            trigger: "axis",
            confine: true,
            formatter(params) {
              const p = params && params[0] ? params[0] : null;
              if (!p) return "";
              return `${p.axisValue}<br/>${Number(p.data || 0).toLocaleString()} 字`;
            },
          },
          xAxis: {
            type: "category",
            data: hours,
            axisTick: { show: false },
            axisLine: { lineStyle: { color: "#d7dfd1" } },
            axisLabel: { color: "#94a189", fontSize: 10, interval: 5 },
          },
          yAxis: {
            type: "value",
            show: false,
          },
          series: [
            {
              type: "bar",
              data: dist.map((v) => ({
                value: v,
                itemStyle: {
                  color: {
                    type: "linear",
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                      { offset: 0, color: v / max > 0.5 ? "#7bb069" : "#b5d9a8" },
                      { offset: 1, color: "rgba(123,176,105,0.2)" },
                    ],
                  },
                  borderRadius: [3, 3, 0, 0],
                },
              })),
              barMaxWidth: 12,
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
.wp-hour-chart {
  display: flex;
  flex-direction: column;
  //min-height: 100%;
  padding: 22px;
  border-radius: 24px;

  &__eyebrow {
    flex-shrink: 0;
    margin-bottom: 14px;
    color: #6e7a69;
    font-size: 12px;
    line-height: 1.4;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__chart {
    flex: 1;
    min-height: 160px;
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
}
</style>
