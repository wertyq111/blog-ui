<template>
  <section class="wp-quick">
    <div class="wp-section-head">
    </div>
    <div class="wp-quick-grid">
      <wp-quick-card title="最近文档" link-text="查看全部" link-target="/develop/work-doc" @navigate="$emit('navigate', $event)">
        <div v-if="errorMap.docs" class="wp-mini-state">{{ errorMap.docs }}</div>
        <div v-else-if="loadingMap.docs" class="wp-mini-state">文档加载中...</div>
        <div v-else-if="!recentDocs.length" class="wp-mini-state">还没有开发文档。</div>
        <div v-else class="wp-mini-list">
          <button
            v-for="item in recentDocs"
            :key="item.id || item.title"
            class="wp-mini-list__item"
            type="button"
            @click="$emit('navigate', '/develop/work-doc')">
            <div class="wp-mini-list__title">{{ item.title || "未命名文档" }}</div>
            <div class="wp-mini-list__meta">{{ item.source || "未设置来源" }} · {{ formatDateLabel(item.updated_at || item.updateTime || item.createTime) }}</div>
          </button>
        </div>
      </wp-quick-card>

      <wp-quick-card title="启用平台" link-text="平台管理" link-target="/develop/work-platform" @navigate="$emit('navigate', $event)">
        <div v-if="errorMap.platforms" class="wp-mini-state">{{ errorMap.platforms }}</div>
        <div v-else-if="loadingMap.platforms" class="wp-mini-state">平台加载中...</div>
        <div v-else-if="!platforms.length" class="wp-mini-state">当前没有启用的平台。</div>
        <div v-else>
          <div class="wp-platform-summary">{{ platforms.length }} 个启用平台</div>
          <div class="wp-chip-list">
            <span v-for="item in platforms" :key="item.id || item.name" class="wp-chip">{{ item.name }}</span>
          </div>
        </div>
      </wp-quick-card>

      <wp-quick-card title="路径与模型" link-text="进入工具" link-target="/develop/convert-path" @navigate="$emit('navigate', $event)">
        <div class="wp-combo">
          <div class="wp-combo__block">
            <div class="wp-combo__label">路径转换</div>
            <div v-if="errorMap.paths" class="wp-mini-state">{{ errorMap.paths }}</div>
            <div v-else-if="loadingMap.paths" class="wp-mini-state">路径项目加载中...</div>
            <div v-else-if="!recentPaths.length" class="wp-mini-state">暂无路径项目。</div>
            <div v-else class="wp-mini-list">
              <button
                v-for="item in recentPaths"
                :key="item.id || item.code"
                class="wp-mini-list__item"
                type="button"
                @click="$emit('navigate', '/develop/convert-path')">
                <div class="wp-mini-list__title">{{ item.name || item.code }}</div>
                <div class="wp-mini-list__meta">{{ item.code || "未配置编码" }}</div>
              </button>
            </div>
          </div>
          <div class="wp-combo__block">
            <div class="wp-combo__label">模型初始化</div>
            <div v-if="errorMap.models" class="wp-mini-state">{{ errorMap.models }}</div>
            <div v-else-if="loadingMap.models" class="wp-mini-state">模型配置加载中...</div>
            <div v-else-if="!recentModels.length" class="wp-mini-state">暂无模型配置。</div>
            <div v-else class="wp-mini-list">
              <button
                v-for="item in recentModels"
                :key="item.id || item.code"
                class="wp-mini-list__item"
                type="button"
                @click="$emit('navigate', '/develop/init-model')">
                <div class="wp-mini-list__title">{{ item.name || item.code }}</div>
                <div class="wp-mini-list__meta">{{ item.code || "未配置编码" }}</div>
              </button>
            </div>
          </div>
        </div>
      </wp-quick-card>
    </div>
  </section>
</template>

<script>
import WpQuickCard from "./WpQuickCard.vue";

export default {
  name: "WpQuickAccess",
  components: {
    WpQuickCard,
  },
  props: {
    recentDocs: {
      type: Array,
      default() {
        return [];
      },
    },
    platforms: {
      type: Array,
      default() {
        return [];
      },
    },
    recentPaths: {
      type: Array,
      default() {
        return [];
      },
    },
    recentModels: {
      type: Array,
      default() {
        return [];
      },
    },
    loadingMap: {
      type: Object,
      default() {
        return {};
      },
    },
    errorMap: {
      type: Object,
      default() {
        return {};
      },
    },
    formatDateLabel: {
      type: Function,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.wp-quick {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.wp-quick-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.wp-mini-state {
  color: #6b7867;
  font-size: 13px;
}

.wp-mini-list {
  display: grid;
  gap: 10px;
}

.wp-mini-list__item {
  padding: 12px;
  border: 1px solid rgba(214, 225, 208, 0.8);
  border-radius: 14px;
  background: rgba(248, 251, 246, 0.92);
  text-align: left;
  cursor: pointer;
}

.wp-mini-list__title {
  color: #2f3f2a;
  font-size: 13px;
  font-weight: 600;
}

.wp-mini-list__meta {
  margin-top: 5px;
  color: #6a7766;
  font-size: 12px;
  line-height: 1.5;
}

.wp-chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.wp-chip {
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(234, 243, 226, 0.9);
  color: #4f5f4a;
  font-size: 12px;
}

.wp-platform-summary {
  margin-bottom: 10px;
  color: #5f6f5a;
  font-size: 13px;
}

.wp-combo {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.wp-combo__label {
  margin-bottom: 8px;
  color: #576753;
  font-size: 12px;
}

@media (max-width: 1100px) {
  .wp-quick-grid {
    grid-template-columns: 1fr;
  }

  .wp-combo {
    grid-template-columns: 1fr;
  }
}
</style>
