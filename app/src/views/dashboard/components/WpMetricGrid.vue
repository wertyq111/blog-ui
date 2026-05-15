<template>
  <div class="wp-metric-grid">
    <wp-metric-tile
      v-for="item in items"
      :key="item.key"
      :label="item.label"
      :value="item.value"
      :numeric-value="item.numericValue"
      :unit="item.unit"
      :meta="item.meta"
      :accent="!!item.accent"
      :action="item.action" />
  </div>
</template>

<script>
import WpMetricTile from "./WpMetricTile.vue";

export default {
  name: "WpMetricGrid",
  components: {
    WpMetricTile,
  },
  props: {
    items: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.wp-metric-grid {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 10px;
}

@media (max-width: 1500px) {
  .wp-metric-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 1100px) {
  .wp-metric-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .wp-metric-grid {
    grid-template-columns: 1fr;
  }
}
</style>
