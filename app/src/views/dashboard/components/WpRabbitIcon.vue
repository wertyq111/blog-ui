<template>
  <span class="wp-rabbit" :class="{ 'wp-rabbit--blink': blinking }" aria-hidden="true">
    <svg viewBox="0 0 36 36" width="24" height="24" focusable="false">
      <!--
        精致兔子：圆润长耳 + 内耳粉色 + 饱满脸蛋 + 腮红 + 胡须 + 三角鼻 + 微笑
        所有线条用 currentColor，腮红和内耳用固定柔和色。
      -->
      <!-- 左耳外轮廓 -->
      <path
        d="M12.5 14 C12 10.5 10.2 4.5 10.8 2.5 C11.4 0.8 13.2 1 13.6 2.8 C14.2 5.2 14 10.8 13.8 14"
        stroke="currentColor" stroke-width="1.2" stroke-linecap="round" fill="none" />
      <!-- 左耳内粉色 -->
      <path
        d="M12.8 12.5 C12.5 9.6 11.4 5.2 11.8 3.6 C12 2.8 13 3 13.2 4 C13.5 6 13.5 10 13.4 12.5"
        fill="#e8c4c0" opacity="0.55" />
      <!-- 右耳外轮廓 -->
      <path
        d="M23.5 14 C24 10.5 25.8 4.5 25.2 2.5 C24.6 0.8 22.8 1 22.4 2.8 C21.8 5.2 22 10.8 22.2 14"
        stroke="currentColor" stroke-width="1.2" stroke-linecap="round" fill="none" />
      <!-- 右耳内粉色 -->
      <path
        d="M23.2 12.5 C23.5 9.6 24.6 5.2 24.2 3.6 C24 2.8 23 3 22.8 4 C22.5 6 22.5 10 22.6 12.5"
        fill="#e8c4c0" opacity="0.55" />
      <!-- 圆润的脸 -->
      <ellipse cx="18" cy="22" rx="9.5" ry="9" stroke="currentColor" stroke-width="1.2" fill="none" />
      <!-- 腮红 -->
      <ellipse cx="11.2" cy="23.8" rx="2" ry="1.2" fill="#e8c4c0" opacity="0.4" />
      <ellipse cx="24.8" cy="23.8" rx="2" ry="1.2" fill="#e8c4c0" opacity="0.4" />
      <!-- 左眼 -->
      <ellipse class="wp-rabbit__eye wp-rabbit__eye--l" cx="14.5" cy="21" rx="1.2" ry="1.5" fill="currentColor" />
      <!-- 左眼高光 -->
      <circle cx="14.9" cy="20.3" r="0.45" fill="white" opacity="0.85" />
      <!-- 右眼 -->
      <ellipse class="wp-rabbit__eye wp-rabbit__eye--r" cx="21.5" cy="21" rx="1.2" ry="1.5" fill="currentColor" />
      <!-- 右眼高光 -->
      <circle cx="21.9" cy="20.3" r="0.45" fill="white" opacity="0.85" />
      <!-- 鼻子三角 -->
      <path d="M17.4 23.5 L18 24.4 L18.6 23.5 Z" fill="currentColor" opacity="0.7" />
      <!-- 微笑 -->
      <path d="M16 25 Q18 26.2 20 25" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" fill="none" />
      <!-- 左胡须 -->
      <line x1="9" y1="22.8" x2="13" y2="23.2" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" opacity="0.45" />
      <line x1="9.2" y1="24.5" x2="13" y2="24.2" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" opacity="0.45" />
      <!-- 右胡须 -->
      <line x1="23" y1="23.2" x2="27" y2="22.8" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" opacity="0.45" />
      <line x1="23" y1="24.2" x2="26.8" y2="24.5" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" opacity="0.45" />
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
