<template>
  <el-dialog
    :visible="visible"
    :title="title"
    :width="width"
    :destroy-on-close="destroyOnClose"
    :lock-scroll="lockScroll"
    :custom-class="customClass"
    :before-close="beforeClose"
    :close-on-click-modal="closeOnClickModal"
    :modal="modal"
    :append-to-body="appendToBody"
    :modal-append-to-body="modalAppendToBody"
    v-bind="$attrs"
    v-on="forwardedListeners"
    @update:visible="handleUpdateVisible">
    <template v-if="$slots.title" slot="title">
      <slot name="title" />
    </template>
    <slot />
    <template v-if="$slots.footer" slot="footer">
      <slot name="footer" />
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'AppDialog',
  inheritAttrs: false,
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: [String, Number],
      default: '50%'
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    lockScroll: {
      type: Boolean,
      default: true
    },
    customClass: {
      type: String,
      default: ''
    },
    beforeClose: {
      type: Function,
      default: null
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    modal: {
      type: Boolean,
      default: true
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    modalAppendToBody: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    forwardedListeners() {
      const listeners = Object.assign({}, this.$listeners);
      delete listeners['update:visible'];
      return listeners;
    }
  },
  methods: {
    handleUpdateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
}
</script>
