<template>
  <section class="wp-control">
    <div class="wp-control__group">
      <span class="wp-control__label">视图</span>
      <button
        v-for="item in tabs"
        :key="item.value"
        :class="['wp-control__pill', { 'is-active': value.view === item.value }]"
        type="button"
        @click="update('view', item.value)">
        {{ item.label }}
      </button>
    </div>
    <div class="wp-control__group wp-control__group--range">
      <span class="wp-control__label">范围</span>
      <button
        v-for="item in ranges"
        :key="item.value"
        :class="['wp-control__pill', { 'is-active': value.range === item.value }]"
        type="button"
        @click="update('range', item.value)">
        {{ item.label }}
      </button>
    </div>
  </section>
</template>

<script>
const TABS = [
  { label: "总览", value: "overview" },
  { label: "平台", value: "platform" },
];

const RANGES = [
  { label: "全部", value: "all" },
  { label: "30d", value: "30d" },
  { label: "7d", value: "7d" },
];

export default {
  name: "WpControlBar",
  props: {
    value: {
      type: Object,
      default() {
        return {
          view: "overview",
          range: "all",
        };
      },
    },
  },
  data() {
    return {
      tabs: TABS,
      ranges: RANGES,
    };
  },
  methods: {
    update(key, nextValue) {
      if (!this.value || this.value[key] === nextValue) {
        return;
      }
      this.$emit("change", Object.assign({}, this.value, { [key]: nextValue }));
    },
  },
};
</script>

<style lang="scss" scoped>
.wp-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px;
  border-radius: 22px;
  border: 1px solid rgba(214, 225, 208, 0.9);
  background: rgba(255, 255, 255, 0.72);
  box-shadow:
    0 18px 34px -24px rgba(84, 106, 74, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(150%);

  &__group {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  &__group--range {
    justify-content: flex-end;
  }

  &__label {
    font-size: 12px;
    line-height: 1.4;
    color: #7a8574;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__pill {
    min-width: 74px;
    height: 34px;
    padding: 0 14px;
    border: 1px solid rgba(198, 214, 191, 0.88);
    border-radius: 999px;
    background: rgba(249, 252, 247, 0.94);
    color: #51604b;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      border-color 0.2s ease,
      background 0.2s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 18px -14px rgba(74, 111, 53, 0.7);
    }

    &.is-active {
      border-color: rgba(111, 159, 87, 0.8);
      background: linear-gradient(180deg, #edf6e7 0%, #e1efd8 100%);
      color: #2d3d28;
      box-shadow: 0 10px 18px -16px rgba(74, 111, 53, 0.9);
    }
  }
}

@media (max-width: 767px) {
  .wp-control {
    flex-direction: column;
    align-items: stretch;

    &__group--range {
      justify-content: flex-start;
    }
  }
}
</style>
