<template>
  <div class="wp-weather-chip">
    <i :class="icon"></i>
    <span>{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: "WpWeatherChip",
  props: {
    icon: {
      type: String,
      default: "el-icon-sunny",
    },
    text: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.wp-weather-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(240, 246, 236, 0.92);
  color: #586753;
  font-size: 12px;
  line-height: 1.6;
}
</style>
