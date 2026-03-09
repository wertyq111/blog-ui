<template>
  <div class="el-table-draggable">
    <slot />
  </div>
</template>

<script>
import Sortable from 'sortablejs';

export default {
  name: 'ElTableDraggable',
  props: {
    handle: {
      type: String,
      default: ''
    },
    animate: {
      type: Number,
      default: 150
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.initSortable();
  },
  beforeDestroy() {
    this.destroySortable();
  },
  watch: {
    disabled() {
      this.$nextTick(() => this.initSortable());
    }
  },
  methods: {
    initSortable() {
      this.destroySortable();
      if (this.disabled) return;
      this.$nextTick(() => {
        const tbody = this.$el.querySelector('.el-table__body-wrapper tbody');
        if (!tbody) return;
        this._sortable = Sortable.create(tbody, {
          handle: this.handle || undefined,
          animation: this.animate,
          onEnd: (evt) => {
            this.$emit('drop', evt);
          }
        });
      });
    },
    destroySortable() {
      if (this._sortable) {
        this._sortable.destroy();
        this._sortable = null;
      }
    }
  }
};
</script>

<style scoped>
.el-table-draggable {
  width: 100%;
}
</style>
