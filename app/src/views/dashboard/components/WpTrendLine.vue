<template>
  <section class="wp-trend">
    <div class="wp-trend__eyebrow">近 30 日字数走势</div>
    <div v-if="!hasData" class="wp-trend__empty">最近 30 天还没有趋势数据。</div>
    <div v-else ref="chart" class="wp-trend__chart"></div>
  </section>
</template>

<script>
import echarts from "../utils/echarts";

export default {
  name: "WpTrendLine",
  props: {
    data: {
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
      return Array.isArray(this.data) && this.data.length > 0;
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
    data: {
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
      const labels = this.data.map((item) => this.formatDate(item.date));
      const values = this.data.map((item) => Number(item.words || 0));
      // 期望最多 5~6 个 label 不挤；30 个数据时取 6 表示"每 7 个显示 1 个"
      const labelInterval = labels.length > 8 ? Math.max(1, Math.ceil(labels.length / 6)) : 0;

      this.chart.setOption(
        {
          animationDuration: 300,
          grid: {
            left: 0,
            right: 4,
            top: 12,
            bottom: 20,
            containLabel: true,
          },
          tooltip: {
            trigger: "axis",
            confine: true,
            formatter(params) {
              const point = params && params[0] ? params[0] : null;
              if (!point) {
                return "";
              }
              return `${point.axisValue}<br/>${Number(point.data || 0).toLocaleString()} 字`;
            },
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: labels,
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
              margin: 12,
              hideOverlap: true,
              // ECharts 文档约定：函数返回 true=显示 / false=隐藏。
              // 之前是反的，导致 30 个 label 几乎全部叠在一起。
              interval(index) {
                if (labelInterval === 0) return true;
                return index % labelInterval === 0 || index === labels.length - 1;
              },
            },
          },
          yAxis: {
            type: "value",
            show: false,
          },
          series: [
            {
              type: "line",
              smooth: true,
              data: values,
              showSymbol: false,
              lineStyle: {
                color: "#7bb069",
                width: 2,
              },
              areaStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgba(123, 176, 105, 0.32)",
                    },
                    {
                      offset: 1,
                      color: "rgba(123, 176, 105, 0)",
                    },
                  ],
                },
              },
            },
          ],
        },
        true
      );
    },
    formatDate(value) {
      if (!value) {
        return "";
      }
      return String(value).slice(5);
    },
  },
};
</script>

<style lang="scss" scoped>
.wp-trend {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 22px;
  border-radius: 24px;
  border: 1px solid rgba(214, 225, 208, 0.9);
  background: rgba(255, 255, 255, 0.72);
  box-shadow:
    0 24px 40px -30px rgba(84, 106, 74, 0.42),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(150%);

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
    min-height: 180px;
  }

  &__empty {
    flex: 1;
    min-height: 180px;
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
  .wp-trend {
    padding: 18px;
  }
}
</style>
