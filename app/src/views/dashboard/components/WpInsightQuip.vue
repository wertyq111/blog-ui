<template>
  <section class="wp-quip wp-glass-card">
    <div class="wp-quip__head">
      <wp-rabbit-icon />
      <div class="wp-quip__eyebrow">今日小结</div>
    </div>
    <div class="wp-quip__text">{{ text }}</div>
  </section>
</template>

<script>
import WpRabbitIcon from "./WpRabbitIcon.vue";

export default {
  name: "WpInsightQuip",
  components: { WpRabbitIcon },
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

.wp-quip__head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: var(--wp-ink-2, #5c6b57);
}

.wp-quip__eyebrow {
  font-size: 12px;
  line-height: 1.4;
  color: #7a8574;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-family: var(--wp-font-mono, "JetBrains Mono", "SF Mono", ui-monospace, monospace);
}

.wp-quip__text {
  margin-top: 4px;
  color: #40503b;
  font-size: 15px;
  line-height: 1.7;
  font-family: var(--wp-font-body, "Hanken Grotesk", "PingFang SC", system-ui, sans-serif);
}
</style>
