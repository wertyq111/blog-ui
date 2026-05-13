<template>
  <button
    :class="['wp-metric', 'wp-glass-card', { 'wp-metric--accent': accent, 'wp-metric--interactive': !!action }]"
    type="button"
    @click="handleClick">
    <div class="wp-metric__label">{{ label }}</div>
    <div class="wp-metric__value">
      <span>{{ value }}</span>
      <small v-if="unit">{{ unit }}</small>
    </div>
    <div class="wp-metric__meta">{{ meta }}</div>
  </button>
</template>

<script>
export default {
  name: "WpMetricTile",
  props: {
    label: {
      type: String,
      default: "",
    },
    value: {
      type: [String, Number],
      default: "0",
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
  methods: {
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
}

.wp-metric__value {
  color: #1f2a1a;
  font-size: 34px;
  line-height: 1;
  font-weight: 700;
}

.wp-metric__value small {
  margin-left: 6px;
  color: #6e7a69;
  font-size: 14px;
  font-weight: 500;
}

.wp-metric__meta {
  color: #5c6b57;
  font-size: 13px;
  line-height: 1.6;
}
</style>
