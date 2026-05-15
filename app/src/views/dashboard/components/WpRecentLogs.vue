<template>
  <section class="wp-logs wp-glass-card">
    <div class="wp-logs__head">
      <div>
        <div class="wp-logs__title">工作日常</div>
        <div class="wp-logs__sub">
          共 {{ totalLogs || 0 }} 条<span v-if="weekDelta"> · 本周 +{{ weekDelta }}</span>
        </div>
      </div>
      <a class="wp-logs__link" @click.prevent="$emit('navigate', '/develop/work-daily')">查看全部 →</a>
    </div>
    <div v-if="!recentLogs.length" class="wp-logs__empty">暂无日志记录。</div>
    <div v-else class="wp-logs__list">
      <div
        v-for="(log, i) in recentLogs"
        :key="log.id || i"
        class="wp-logs__row"
        @click="$emit('navigate', '/develop/work-daily?date=' + resolveDate(log))">
        <div class="wp-logs__date">
          <div class="wp-logs__date-md">{{ formatMD(resolveDate(log)) }}</div>
          <div class="wp-logs__date-y">{{ formatYear(resolveDate(log)) }}</div>
        </div>
        <div class="wp-logs__body">
          <div class="wp-logs__row-title">{{ logTitle(log) }}</div>
          <div class="wp-logs__desc">{{ getLogPreview(log) }}</div>
          <div class="wp-logs__meta">
            <span class="wp-logs__words">{{ logWords(log).toLocaleString() }} 字</span>
            <span
              v-for="tag in logTags(log)"
              :key="tag"
              class="wp-logs__tag">#{{ tag }}</span>
          </div>
        </div>
        <button class="wp-logs__action" type="button">
          <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 4l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "WpRecentLogs",
  props: {
    recentLogs: {
      type: Array,
      default() {
        return [];
      },
    },
    totalLogs: {
      type: [Number, String],
      default: 0,
    },
    weekDelta: {
      type: [Number, String],
      default: 0,
    },
    formatDateLabel: {
      type: Function,
      default: null,
    },
    getLogPreview: {
      type: Function,
      default() {
        return () => "暂无日志摘要";
      },
    },
  },
  methods: {
    resolveDate(log) {
      if (!log) return null;
      return log.log_date || (log.created_at && log.created_at.slice(0, 10)) || (log.create_time && log.create_time.slice(0, 10)) || null;
    },
    formatMD(date) {
      if (!date) return "--";
      return String(date).slice(5, 10);
    },
    formatYear(date) {
      if (!date) return "";
      return String(date).slice(0, 4);
    },
    logTitle(log) {
      if (!log) return "无标题";
      const date = this.resolveDate(log);
      const content = log.content;
      if (!content) return `${this.formatMD(date)} 工作日志`;
      let platforms = [];
      if (typeof content === "object" && Array.isArray(content.platforms)) {
        platforms = content.platforms;
      } else if (Array.isArray(content)) {
        platforms = content;
      }
      if (platforms.length > 0) {
        const names = platforms
          .map((p) => p.platform_name || p.platformName)
          .filter(Boolean);
        if (names.length > 0) {
          return `工作日报（${this.formatMD(date)}）`;
        }
      }
      return `${this.formatMD(date)} 工作日志`;
    },
    logWords(log) {
      if (!log || !log.content) return 0;
      let platforms = [];
      const content = log.content;
      if (typeof content === "object" && Array.isArray(content.platforms)) {
        platforms = content.platforms;
      } else if (Array.isArray(content)) {
        platforms = content;
      }
      let total = 0;
      platforms.forEach((p) => {
        const text = String(p.content || "");
        const plain = text.replace(/[#>*_`~[\]()-]/g, " ").replace(/\s+/g, "");
        total += plain.length;
      });
      return total;
    },
    logTags(log) {
      if (!log) return [];
      // 优先使用后端返回的真实标签
      if (Array.isArray(log.tags) && log.tags.length) {
        return log.tags.slice(0, 3);
      }
      // fallback: 从 content 中提取平台名
      if (!log.content) return [];
      let platforms = [];
      const content = log.content;
      if (typeof content === "object" && Array.isArray(content.platforms)) {
        platforms = content.platforms;
      } else if (Array.isArray(content)) {
        platforms = content;
      }
      const names = platforms
        .map((p) => p.platform_name || p.platformName)
        .filter(Boolean);
      return [...new Set(names)].slice(0, 3);
    },
  },
};
</script>

<style lang="scss" scoped>
.wp-logs {
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

  &__link {
    font-size: 12px;
    color: var(--wp-green-d, #2e7d4c);
    cursor: pointer;
    white-space: nowrap;
  }

  &__empty {
    min-height: 100px;
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
  }

  &__row {
    display: grid;
    grid-template-columns: 64px 1fr 24px;
    gap: 16px;
    padding: 14px 0;
    border-top: 1px solid var(--wp-glass-border, rgba(214, 225, 208, 0.9));
    align-items: center;
    cursor: pointer;

    &:first-child {
      border-top: 0;
      padding-top: 4px;
    }

    &:hover .wp-logs__action {
      background: var(--wp-green-l, #d8ecdb);
      color: var(--wp-green-d, #2e7d4c);
    }
  }

  &__date-md {
    font-size: 18px;
    font-weight: 600;
    line-height: 1;
    color: var(--wp-ink-1, #1f2a1a);
    font-family: "Helvetica Neue", Helvetica, sans-serif;
  }

  &__date-y {
    font-size: 10px;
    color: var(--wp-ink-3, #94a189);
    margin-top: 4px;
  }

  &__row-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--wp-ink-1, #1f2a1a);
  }

  &__desc {
    font-size: 12px;
    color: var(--wp-ink-2, #5c6b57);
    margin-top: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
  }

  &__words {
    font-size: 11px;
    color: var(--wp-ink-3, #94a189);
    background: var(--wp-green-bg, #eef6ee);
    padding: 1px 8px;
    border-radius: 10px;
  }

  &__tag {
    font-size: 11px;
    color: var(--wp-green-d, #2e7d4c);
  }

  &__action {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 0;
    background: transparent;
    cursor: pointer;
    color: var(--wp-ink-3, #94a189);
    display: grid;
    place-items: center;
  }
}
</style>
