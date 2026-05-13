<template>
  <span class="wp-rabbit" :class="{ 'wp-rabbit--blink': blinking }" aria-hidden="true">
    <svg viewBox="0 0 32 32" width="22" height="22" focusable="false">
      <!-- 简笔兔子：两耳 + 圆脑袋 + 两只眼睛。线条用 currentColor。 -->
      <path
        d="M11 4 Q10.4 9 12.2 12.6 M21 4 Q21.6 9 19.8 12.6"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-linecap="round"
        fill="none" />
      <circle cx="16" cy="20" r="8" stroke="currentColor" stroke-width="1.4" fill="none" />
      <ellipse class="wp-rabbit__eye wp-rabbit__eye--l" cx="13" cy="19.5" rx="1" ry="1.2" fill="currentColor" />
      <ellipse class="wp-rabbit__eye wp-rabbit__eye--r" cx="19" cy="19.5" rx="1" ry="1.2" fill="currentColor" />
      <path d="M15.2 22 Q16 22.6 16.8 22" stroke="currentColor" stroke-width="0.9" stroke-linecap="round" fill="none" />
    </svg>
  </span>
</template>

<script>
/**
 * 兔子小 icon：每 8~14 秒随机一次眨眼。
 * 复用 currentColor，颜色由外部决定。aria-hidden 因为它是装饰性的，文本由父级承担。
 */
export default {
  name: "WpRabbitIcon",
  data() {
    return {
      blinking: false,
      timer: null,
    };
  },
  mounted() {
    this.scheduleBlink();
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  },
  methods: {
    scheduleBlink() {
      // 在 8000~14000 ms 之间随机选择一次
      const delay = 8000 + Math.random() * 6000;
      this.timer = setTimeout(() => {
        this.blinking = true;
        setTimeout(() => {
          this.blinking = false;
          this.scheduleBlink();
        }, 220);
      }, delay);
    },
  },
};
</script>

<style lang="scss" scoped>
.wp-rabbit {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  color: var(--wp-ink-2, #5c6b57);
  flex-shrink: 0;
}

.wp-rabbit__eye {
  transform-origin: center;
  transform-box: fill-box;
}

.wp-rabbit--blink .wp-rabbit__eye {
  animation: wp-blink 220ms ease-in-out;
}

@keyframes wp-blink {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.05);
  }
}

@media (prefers-reduced-motion: reduce) {
  .wp-rabbit--blink .wp-rabbit__eye {
    animation: none;
  }
}
</style>
