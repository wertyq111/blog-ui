<template>
  <button
    :class="['wp-metric', 'wp-glass-card', { 'wp-metric--accent': accent, 'wp-metric--interactive': !!action }]"
    type="button"
    @click="handleClick">
    <div class="wp-metric__label">{{ label }}</div>
    <div class="wp-metric__value">
      <span>{{ displayValue }}</span>
      <small v-if="unit">{{ unit }}</small>
    </div>
    <div class="wp-metric__meta">{{ meta }}</div>
  </button>
</template>

<script>
import { countUp } from "../utils/wp-count-up";

export default {
  name: "WpMetricTile",
  props: {
    label: {
      type: String,
      default: "",
    },
    // 已格式化的字符串（fallback 显示，比如 "458,500" 或 "下午"）
    value: {
      type: [String, Number],
      default: "0",
    },
    // 原始数字；提供时启用 CountUp 动画，结束后用 toLocaleString 格式化
    numericValue: {
      type: Number,
      default: null,
    },
    unit: {
      type: String,
      default: "",
    },
    meta: {
      type: String,
      default: "",
    },
    accent: {
      type: Boolean,
      default: false,
    },
    action: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      currentNum: 0,
      stopAnimation: null,
    };
  },
  computed: {
    isNumeric() {
      return typeof this.numericValue === "number" && Number.isFinite(this.numericValue);
    },
    displayValue() {
      if (this.isNumeric) {
        return Math.round(this.currentNum).toLocaleString();
      }
      return this.value;
    },
  },
  watch: {
    numericValue: {
      immediate: false,
      handler(next, prev) {
        if (typeof next !== "number") return;
        this.animateTo(typeof prev === "number" ? prev : 0, next);
      },
    },
  },
  mounted() {
    if (this.isNumeric) {
      this.animateTo(0, this.numericValue);
    }
  },
  beforeDestroy() {
    if (this.stopAnimation) {
      this.stopAnimation();
      this.stopAnimation = null;
    }
  },
  methods: {
    animateTo(from, to) {
      if (this.stopAnimation) {
        this.stopAnimation();
        this.stopAnimation = null;
      }
      // 数字为 0 时直接落地，不必动画
      if (to === 0) {
        this.currentNum = 0;
        return;
      }
      this.currentNum = from;
      this.stopAnimation = countUp({
        from,
        to,
        duration: 1200,
        onUpdate: (v) => {
          this.currentNum = v;
        },
      });
    },
    handleClick() {
      if (this.action) {
        this.action();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wp-metric {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  min-height: 148px;
  padding: 22px;
  border-radius: 24px;
  text-align: left;
  cursor: default;
  font-variant-numeric: tabular-nums;
}

.wp-metric--accent {
  background: linear-gradient(180deg, rgba(245, 225, 213, 0.88), rgba(255, 255, 255, 0.76));
}

.wp-metric--interactive {
  cursor: pointer;
}

.wp-metric__label {
  color: #7a8574;
  font-size: 12px;
  line-height: 1.4;
  letter-spacing: 0.08em;
  font-family: var(--wp-font-mono, "JetBrains Mono", "SF Mono", ui-monospace, monospace);
  text-transform: uppercase;
}

.wp-metric__value {
  color: #1f2a1a;
  font-size: 34px;
  line-height: 1;
  font-weight: 700;
  font-family: var(--wp-font-display, "Fraunces", "Source Han Serif SC", "Songti SC", serif);
}

.wp-metric__value small {
  margin-left: 6px;
  color: #6e7a69;
  font-size: 14px;
  font-weight: 500;
  font-family: var(--wp-font-body, "Hanken Grotesk", "PingFang SC", system-ui, sans-serif);
}

.wp-metric__meta {
  color: #5c6b57;
  font-size: 13px;
  line-height: 1.6;
  font-family: var(--wp-font-mono, "JetBrains Mono", "SF Mono", ui-monospace, monospace);
}
</style>
