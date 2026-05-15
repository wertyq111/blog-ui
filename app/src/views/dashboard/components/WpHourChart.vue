<template>
  <section class="wp-hour-chart wp-glass-card">
    <div class="wp-hour-chart__head">
      <div>
        <div class="wp-hour-chart__title">24 小时时段分布</div>
        <div class="wp-hour-chart__sub">{{ subtitle }}</div>
      </div>
    </div>
    <div v-if="!hasData" class="wp-hour-chart__empty">还没有写作时段数据。</div>
    <div v-else class="wp-hour-chart__body">
      <div ref="chart" class="wp-hour-chart__chart"></div>
    </div>
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
    peakHour() {
      if (!this.hasData) return { hour: 0, value: 0 };
      let maxVal = 0;
      let maxH = 0;
      this.hourDist.forEach((v, i) => {
        if (v > maxVal) {
          maxVal = v;
          maxH = i;
        }
      });
      return { hour: maxH, value: maxVal };
    },
    subtitle() {
      if (!this.hasData) return "";
      const avg = Math.round(this.hourDist.reduce((s, v) => s + v, 0) / 24);
      return `高产时段 ${String(this.peakHour.hour).padStart(2, "0")}:00 · 平均 ${avg} 字/时`;
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
      const peak = this.peakHour;
      const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
      const periodLabel = this.resolvePeriodLabel(peak.hour);

      this.chart.setOption(
        {
          animationDuration: 600,
          polar: {
            radius: ["43%", "86%"],
          },
          angleAxis: {
            type: "category",
            data: hours,
            startAngle: 90,
            clockwise: true,
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: {
              fontSize: 9,
              color: "#94a189",
              interval: 5,
              formatter(val) {
                return val.replace(":00", "");
              },
            },
            splitLine: { show: false },
          },
          radiusAxis: {
            type: "value",
            show: false,
            max: max,
          },
          tooltip: {
            trigger: "item",
            confine: true,
            formatter(params) {
              if (!params || params.value === undefined) return "";
              return `${params.name}<br/>${Number(params.value || 0).toLocaleString()} 字`;
            },
          },
          series: [
            {
              type: "bar",
              coordinateSystem: "polar",
              data: dist.map((v, i) => ({
                value: v,
                itemStyle: {
                  color: i === peak.hour ? "#2e7d4c" : (i >= 14 && i <= 16) ? "#5fa979" : "#a9cdb3",
                  opacity: v === 0 ? 0.25 : 1,
                },
              })),
              barWidth: 6,
              roundCap: true,
            },
          ],
          graphic: [
            {
              type: "text",
              left: "center",
              top: "42%",
              style: {
                text: String(peak.hour),
                fontSize: 28,
                fontWeight: 700,
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fill: "#1f2a1a",
                textAlign: "center",
              },
            },
            {
              type: "text",
              left: "center",
              top: "52%",
              style: {
                text: "时",
                fontSize: 12,
                fill: "#5c6b57",
                textAlign: "center",
              },
            },
            {
              type: "text",
              left: "center",
              top: "58%",
              style: {
                text: `${periodLabel}最有产出`,
                fontSize: 10.5,
                fill: "#94a189",
                textAlign: "center",
              },
            },
          ],
        },
        true
      );
    },
    resolvePeriodLabel(hour) {
      if (hour > 5 && hour <= 11) return "早晨";
      if (hour > 11 && hour <= 13) return "中午";
      if (hour > 13 && hour <= 18) return "下午";
      if (hour > 18 && hour <= 22) return "晚上";
      return "深夜";
    },
  },
};
</script>

<style lang="scss" scoped>
.wp-hour-chart {
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

  &__body {
    flex: 1;
    display: grid;
    place-items: center;
    padding: 10px 0;
  }

  &__chart {
    width: 100%;
    min-height: 260px;
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
