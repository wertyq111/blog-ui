<template>
  <section class="wp-quick-card wp-glass-card">
    <div class="wp-quick-card__head">
      <span>{{ title }}</span>
      <el-link v-if="linkText" :underline="false" type="primary" @click="$emit('navigate', linkTarget)">{{ linkText }}</el-link>
    </div>
    <slot />
  </section>
</template>

<script>
export default {
  name: "WpQuickCard",
  props: {
    title: {
      type: String,
      default: "",
    },
    linkText: {
      type: String,
      default: "",
    },
    linkTarget: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.wp-quick-card {
  padding: 20px;
  border-radius: 22px;
}

.wp-quick-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
  color: #2d3d28;
  font-size: 14px;
  font-weight: 600;
}
</style>
