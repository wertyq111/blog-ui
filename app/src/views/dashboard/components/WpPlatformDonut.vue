<template>
  <section class="wp-platform-donut wp-glass-card">
    <div class="wp-platform-donut__eyebrow">平台分布</div>
    <div v-if="!hasData" class="wp-platform-donut__empty">还没有平台数据。</div>
    <div v-else ref="chart" class="wp-platform-donut__chart"></div>
  </section>
</template>

<script>
import echarts from "../utils/echarts";

const PALETTE = ["#7bb069", "#9ccc80", "#b5d9a8", "#4a8f2e", "#c8e0b5", "#2e5a1b"];

export default {
  name: "WpPlatformDonut",
  props: {
    platformDist: {
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
      return Array.isArray(this.platformDist) && this.platformDist.length > 0;
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
    platformDist: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          if (this.hasData) this.initChart();
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

      this.chart.setOption(
        {
          animationDuration: 300,
          tooltip: {
            trigger: "item",
            formatter: "{b}: {c} 字 ({d}%)",
            confine: true,
          },
          legend: {
            orient: "vertical",
            right: 0,
            top: "center",
            itemWidth: 10,
            itemHeight: 10,
            textStyle: { color: "#7e8a79", fontSize: 11 },
          },
          series: [
            {
              type: "pie",
              radius: ["38%", "62%"],
              center: ["36%", "50%"],
              data: this.platformDist.map((d, i) => ({
                name: d.name,
                value: d.words,
                itemStyle: { color: PALETTE[i % PALETTE.length] },
              })),
              label: { show: false },
              labelLine: { show: false },
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
.wp-platform-donut {
  display: flex;
  flex-direction: column;
  min-height: 100%;
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
