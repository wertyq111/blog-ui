<template>
  <section class="wp-quip wp-glass-card">
    <div class="wp-quip__eyebrow">今日小结</div>
    <div class="wp-quip__text">{{ text }}</div>
  </section>
</template>

<script>
export default {
  name: "WpInsightQuip",
  props: {
    text: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.wp-quip {
  padding: 22px;
  border-radius: 24px;
}

.wp-quip__eyebrow {
  font-size: 12px;
  line-height: 1.4;
  color: #7a8574;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.wp-quip__text {
  margin-top: 12px;
  color: #40503b;
  font-size: 15px;
  line-height: 1.7;
}
</style>
