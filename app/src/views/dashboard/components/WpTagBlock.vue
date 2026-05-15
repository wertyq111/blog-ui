<template>
  <section class="wp-tag-block wp-glass-card">
    <div class="wp-tag-block__head">
      <div>
        <div class="wp-tag-block__title">标签 Top 10</div>
        <div class="wp-tag-block__sub">本年累计 · 共 {{ tags.length }} 个标签</div>
      </div>
    </div>
    <div v-if="!tags.length" class="wp-tag-block__empty">
      标签系统建设中，敬请期待。
    </div>
    <div v-else class="wp-tag-block__list">
      <div v-for="(t, i) in tags" :key="t.name" class="wp-tag-block__row">
        <span class="wp-tag-block__rank">{{ String(i + 1).padStart(2, '0') }}</span>
        <span class="wp-tag-block__name">{{ t.name }}</span>
        <div class="wp-tag-block__bar-wrap">
          <div class="wp-tag-block__bar" :style="{ width: barWidth(t.count) }" />
        </div>
        <span class="wp-tag-block__count">{{ t.count }}</span>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "WpTagBlock",
  props: {
    tags: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    max() {
      return this.tags.length ? Math.max(...this.tags.map((t) => t.count), 1) : 1;
    },
  },
  methods: {
    barWidth(count) {
      return `${(count / this.max) * 100}%`;
    },
  },
};
</script>

<style lang="scss" scoped>
.wp-tag-block {
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

  &__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__row {
    display: grid;
    grid-template-columns: 24px 80px 1fr 36px;
    gap: 10px;
    align-items: center;
    font-size: 12px;
  }

  &__rank {
    color: var(--wp-ink-3, #94a189);
    font-variant-numeric: tabular-nums;
    font-size: 11px;
  }

  &__name {
    color: var(--wp-ink-1, #1f2a1a);
  }

  &__bar-wrap {
    background: #f1f6f0;
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
  }

  &__bar {
    height: 100%;
    background: linear-gradient(90deg, var(--wp-green-d, #2e7d4c), var(--wp-green, #5fa979));
    border-radius: 4px;
  }

  &__count {
    color: var(--wp-ink-2, #5c6b57);
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
}
</style>
