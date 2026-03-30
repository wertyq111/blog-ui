<template>
  <div class="ele-body develop-page develop-page--control">
    <el-card shadow="never" class="develop-shell workplace-shell">
      <section class="develop-hero workplace-hero">
        <div class="develop-hero__copy workplace-hero__copy">
          <div class="develop-hero__eyebrow">Develop Workspace</div>
          <div class="workplace-hero__title-row">
            <div>
              <div class="develop-hero__title">
                {{ helloPrev }}，{{ displayName }}
              </div>
              <div class="develop-hero__desc">
                这里集中查看开发日志、文档、平台来源与配置工具，优先处理今天要推进的开发工作。
              </div>
              <div class="workplace-hero__weather">
                <i :class="weatherIcon"></i>
                <span>{{ weatherText }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="workplace-hero__actions">
          <el-button
            class="ele-btn-icon"
            icon="el-icon-edit-outline"
            type="primary"
            @click="goTo('/develop/work-daily')">
            写日志
          </el-button>
          <el-button
            class="ele-btn-icon"
            icon="el-icon-document-add"
            @click="goTo('/develop/work-doc')">
            新建文档
          </el-button>
          <el-button
            class="ele-btn-icon"
            icon="el-icon-_surveying"
            @click="goTo('/develop/convert-path')">
            路径转换
          </el-button>
        </div>
      </section>

      <section class="develop-panel workplace-overview">
        <div
          v-for="item in overviewCards"
          :key="item.key"
          class="workplace-overview__item">
          <div class="workplace-overview__label">
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
          </div>
          <div class="workplace-overview__value">{{ item.value }}</div>
          <div class="workplace-overview__hint">{{ item.hint }}</div>
        </div>
      </section>

      <section class="workplace-layout">
        <div class="workplace-main">
          <section class="develop-panel workplace-panel">
            <div class="workplace-panel__header">
              <div>
                <div class="workplace-panel__title">最近工作日志</div>
                <div class="workplace-panel__desc">追踪最近的开发记录、所属平台与摘要内容。</div>
              </div>
              <el-link :underline="false" type="primary" @click="goTo('/develop/work-daily')">查看全部</el-link>
            </div>
            <div v-if="errorMap.logs" class="workplace-state workplace-state--error">
              <span>{{ errorMap.logs }}</span>
              <el-button size="mini" type="primary" plain @click="goTo('/develop/work-daily')">进入工作日常</el-button>
            </div>
            <div v-else-if="loadingMap.logs" class="workplace-state">日志加载中...</div>
            <div v-else-if="!recentLogs.length" class="workplace-state">
              <span>还没有工作日志，先记录今天的推进内容。</span>
              <el-button size="mini" type="primary" plain @click="goTo('/develop/work-daily')">去写日志</el-button>
            </div>
            <div v-else class="workplace-log-list">
              <article
                v-for="item in recentLogs"
                :key="item.id || item.logDate || item.createTime"
                class="workplace-log-item">
                <div class="workplace-log-item__head">
                  <div class="workplace-log-item__date">{{ formatDateLabel(item.logDate || item.createTime) }}</div>
                  <div class="workplace-log-item__platforms">
                    <span
                      v-for="(name, index) in getLogPlatformNames(item)"
                      :key="name + index"
                      class="workplace-chip">
                      {{ name }}
                    </span>
                  </div>
                </div>
                <div class="workplace-log-item__content">{{ getLogPreview(item) }}</div>
              </article>
            </div>
          </section>

          <section class="develop-panel workplace-panel">
            <div class="workplace-panel__header">
              <div>
                <div class="workplace-panel__title">最近更新文档</div>
                <div class="workplace-panel__desc">快速进入最近维护的开发文档、模板和项目来源。</div>
              </div>
              <el-link :underline="false" type="primary" @click="goTo('/develop/work-doc')">查看全部</el-link>
            </div>
            <div v-if="errorMap.docs" class="workplace-state workplace-state--error">
              <span>{{ errorMap.docs }}</span>
              <el-button size="mini" type="primary" plain @click="goTo('/develop/work-doc')">进入工作文档</el-button>
            </div>
            <div v-else-if="loadingMap.docs" class="workplace-state">文档加载中...</div>
            <div v-else-if="!recentDocs.length" class="workplace-state">
              <span>还没有文档内容，先沉淀一份开发资料。</span>
              <el-button size="mini" type="primary" plain @click="goTo('/develop/work-doc')">去写文档</el-button>
            </div>
            <div v-else class="workplace-doc-list">
              <article
                v-for="item in recentDocs"
                :key="item.id || item.title"
                class="workplace-doc-item">
                <div class="workplace-doc-item__title">{{ item.title || '未命名文档' }}</div>
                <div class="workplace-doc-item__meta">
                  <span>{{ item.category && item.category.name ? item.category.name : '未分类' }}</span>
                  <span>{{ item.source || '未设置项目来源' }}</span>
                  <span>{{ formatDateLabel(item.updated_at || item.updateTime || item.createTime) }}</span>
                </div>
              </article>
            </div>
          </section>
        </div>

        <div class="workplace-side">
          <section class="develop-panel workplace-panel">
            <div class="workplace-panel__header">
              <div>
                <div class="workplace-panel__title">项目来源 / 平台概览</div>
                <div class="workplace-panel__desc">已启用的平台会直接影响日志归属、文档来源与工作范围。</div>
              </div>
              <el-link :underline="false" type="primary" @click="goTo('/develop/work-platform')">平台管理</el-link>
            </div>
            <div v-if="errorMap.platforms" class="workplace-state workplace-state--error">
              <span>{{ errorMap.platforms }}</span>
              <el-button size="mini" type="primary" plain @click="goTo('/develop/work-platform')">进入工作平台</el-button>
            </div>
            <div v-else-if="loadingMap.platforms" class="workplace-state">平台加载中...</div>
            <div v-else-if="!platforms.length" class="workplace-state">
              <span>当前没有启用的平台来源。</span>
              <el-button size="mini" type="primary" plain @click="goTo('/develop/work-platform')">添加平台</el-button>
            </div>
            <div v-else>
              <div class="workplace-platform-summary">
                <div class="workplace-platform-summary__count">{{ platforms.length }}</div>
                <div class="workplace-platform-summary__text">个启用平台正在为日志与文档提供项目来源。</div>
              </div>
              <div class="workplace-platform-list">
                <span
                  v-for="item in platforms"
                  :key="item.id || item.name"
                  class="workplace-chip workplace-chip--strong">
                  {{ item.name }}
                </span>
              </div>
            </div>
          </section>

          <section class="develop-panel workplace-panel">
            <div class="workplace-panel__header">
              <div>
                <div class="workplace-panel__title">开发工具箱</div>
                <div class="workplace-panel__desc">日常开发、知识沉淀、配置维护与转换工具统一从这里进入。</div>
              </div>
            </div>
            <div class="workplace-tool-list">
              <router-link
                v-for="item in tools"
                :key="item.path"
                :to="item.path"
                class="workplace-tool-item">
                <div class="workplace-tool-item__icon">
                  <i :class="item.icon"></i>
                </div>
                <div class="workplace-tool-item__body">
                  <div class="workplace-tool-item__title">{{ item.title }}</div>
                  <div class="workplace-tool-item__desc">{{ item.desc }}</div>
                </div>
              </router-link>
            </div>
          </section>

          <section class="develop-panel workplace-panel">
            <div class="workplace-panel__header">
              <div>
                <div class="workplace-panel__title">配置与转换摘要</div>
                <div class="workplace-panel__desc">聚合查看最近维护的路径转换项目与模型初始化配置。</div>
              </div>
            </div>
            <div class="workplace-summary-grid">
              <div class="workplace-summary-card">
                <div class="workplace-summary-card__head">
                  <span>路径转换</span>
                  <el-link :underline="false" type="primary" @click="goTo('/develop/convert-path')">全部</el-link>
                </div>
                <div v-if="errorMap.paths" class="workplace-state workplace-state--error">
                  <span>{{ errorMap.paths }}</span>
                </div>
                <div v-else-if="loadingMap.paths" class="workplace-state">路径项目加载中...</div>
                <div v-else-if="!recentPaths.length" class="workplace-state">暂无路径转换项目。</div>
                <div v-else class="workplace-mini-list">
                  <div
                    v-for="item in recentPaths"
                    :key="item.id || item.code"
                    class="workplace-mini-list__item">
                    <div class="workplace-mini-list__title">{{ item.name || item.code }}</div>
                    <div class="workplace-mini-list__meta">{{ item.code || '未配置编码' }}</div>
                  </div>
                </div>
              </div>

              <div class="workplace-summary-card">
                <div class="workplace-summary-card__head">
                  <span>模型初始化</span>
                  <el-link :underline="false" type="primary" @click="goTo('/develop/init-model')">全部</el-link>
                </div>
                <div v-if="errorMap.models" class="workplace-state workplace-state--error">
                  <span>{{ errorMap.models }}</span>
                </div>
                <div v-else-if="loadingMap.models" class="workplace-state">模型配置加载中...</div>
                <div v-else-if="!recentModels.length" class="workplace-state">暂无模型初始化配置。</div>
                <div v-else class="workplace-mini-list">
                  <div
                    v-for="item in recentModels"
                    :key="item.id || item.code"
                    class="workplace-mini-list__item">
                    <div class="workplace-mini-list__title">{{ item.name || item.code }}</div>
                    <div class="workplace-mini-list__meta">{{ item.code || '未配置编码' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "DashboardWorkplace",
  data() {
    return {
      overview: {
        platformCount: 0,
        logCount: 0,
        docCount: 0,
        toolCount: 5,
      },
      recentLogs: [],
      recentDocs: [],
      platforms: [],
      recentPaths: [],
      recentModels: [],
      loadingMap: {
        logs: true,
        docs: true,
        platforms: true,
        paths: true,
        models: true,
      },
      errorMap: {
        logs: "",
        docs: "",
        platforms: "",
        paths: "",
        models: "",
      },
      weatherText: "正在整理今天天气提醒...",
      weatherIcon: "el-icon-sunny",
      tools: [
        {
          title: "工作日常",
          desc: "记录日报并生成周报、月报与年报。",
          icon: "el-icon-date",
          path: "/develop/work-daily",
        },
        {
          title: "工作文档",
          desc: "维护分类、模板文档与项目来源。",
          icon: "el-icon-document-copy",
          path: "/develop/work-doc",
        },
        {
          title: "工作平台",
          desc: "统一管理项目来源与启用状态。",
          icon: "el-icon-s-grid",
          path: "/develop/work-platform",
        },
        {
          title: "路径转换",
          desc: "集中维护项目编码、网址与服务器地址。",
          icon: "el-icon-_surveying",
          path: "/develop/convert-path",
        },
        {
          title: "模型初始化",
          desc: "统一管理框架模板与初始化配置。",
          icon: "el-icon-s-operation",
          path: "/develop/init-model",
        },
      ],
    };
  },
  computed: {
    loginUser() {
      return this.$store.state.user.user || {};
    },
    displayName() {
      return (
        (this.loginUser.member && this.loginUser.member.nickname) ||
        this.loginUser.nickname ||
        this.loginUser.username ||
        "开发者"
      );
    },
    helloPrev() {
      let content = "晚上好";
      const currentHour = new Date().getHours();

      if (currentHour > 6 && currentHour <= 11) {
        content = "早上好";
      } else if (currentHour > 11 && currentHour <= 13) {
        content = "中午好";
      } else if (currentHour > 13 && currentHour <= 18) {
        content = "下午好";
      }

      return content;
    },
    overviewCards() {
      return [
        {
          key: "platformCount",
          label: "启用平台数",
          value: this.overview.platformCount,
          hint: "当前参与开发记录的平台来源",
          icon: "el-icon-s-grid",
        },
        {
          key: "logCount",
          label: "最近日志数",
          value: this.overview.logCount,
          hint: "工作日常列表中的累计记录",
          icon: "el-icon-date",
        },
        {
          key: "docCount",
          label: "文档总数",
          value: this.overview.docCount,
          hint: "开发文档与模板沉淀总量",
          icon: "el-icon-document",
        },
        {
          key: "toolCount",
          label: "开发工具数",
          value: this.overview.toolCount,
          hint: "可直接进入的 develop 工作模块",
          icon: "el-icon-s-tools",
        },
      ];
    },
  },
  created() {
    this.loadDashboard();
    this.getWeatherInfo();
  },
  methods: {
    async loadDashboard() {
      await Promise.all([
        this.loadPlatforms(),
        this.loadLogs(),
        this.loadDocs(),
        this.loadPaths(),
        this.loadModels(),
      ]);
    },
    async loadPlatforms() {
      this.setLoading("platforms", true);
      this.setError("platforms", "");
      try {
        const res = await this.$http.get("/work-platform/list", {
          params: { status: 1 },
        });
        const items = this.extractCollection(res);
        this.platforms = items;
        this.overview.platformCount = items.length;
      } catch (error) {
        this.platforms = [];
        this.overview.platformCount = 0;
        this.setError("platforms", this.resolveErrorMessage(error, "平台概览加载失败"));
      } finally {
        this.setLoading("platforms", false);
      }
    },
    async loadLogs() {
      this.setLoading("logs", true);
      this.setError("logs", "");
      try {
        const res = await this.$http.get("/work-daily/index", {
          params: { page: 1, limit: 6 },
        });
        this.recentLogs = this.extractCollection(res).slice(0, 6);
        this.overview.logCount = this.extractTotal(res, this.recentLogs.length);
      } catch (error) {
        this.recentLogs = [];
        this.overview.logCount = 0;
        this.setError("logs", this.resolveErrorMessage(error, "工作日志加载失败"));
      } finally {
        this.setLoading("logs", false);
      }
    },
    async loadDocs() {
      this.setLoading("docs", true);
      this.setError("docs", "");
      try {
        const res = await this.$http.get("/work-doc/index", {
          params: { page: 1, limit: 6 },
        });
        this.recentDocs = this.extractCollection(res).slice(0, 6);
        this.overview.docCount = this.extractTotal(res, this.recentDocs.length);
      } catch (error) {
        this.recentDocs = [];
        this.overview.docCount = 0;
        this.setError("docs", this.resolveErrorMessage(error, "开发文档加载失败"));
      } finally {
        this.setLoading("docs", false);
      }
    },
    async loadPaths() {
      this.setLoading("paths", true);
      this.setError("paths", "");
      try {
        const res = await this.$http.get("/server-path/index", {
          params: { page: 1, limit: 4 },
        });
        this.recentPaths = this.extractCollection(res).slice(0, 4);
      } catch (error) {
        this.recentPaths = [];
        this.setError("paths", this.resolveErrorMessage(error, "路径转换摘要加载失败"));
      } finally {
        this.setLoading("paths", false);
      }
    },
    async loadModels() {
      this.setLoading("models", true);
      this.setError("models", "");
      try {
        const res = await this.$http.get("/init-model/index", {
          params: { page: 1, limit: 4 },
        });
        this.recentModels = this.extractCollection(res).slice(0, 4);
      } catch (error) {
        this.recentModels = [];
        this.setError("models", this.resolveErrorMessage(error, "模型配置摘要加载失败"));
      } finally {
        this.setLoading("models", false);
      }
    },
    extractCollection(res) {
      const body = res && res.data ? res.data : {};
      if (Object.prototype.hasOwnProperty.call(body, "code") && body.code !== 0) {
        throw new Error(body.msg || "请求失败");
      }
      const payload = body.data;
      return this.unwrapCollection(payload);
    },
    unwrapCollection(payload) {
      if (Array.isArray(payload)) {
        return payload;
      }
      if (!payload || typeof payload !== "object") {
        return [];
      }
      if (Array.isArray(payload.data)) {
        return payload.data;
      }
      if (payload.data && Array.isArray(payload.data.data)) {
        return payload.data.data;
      }
      if (Array.isArray(payload.records)) {
        return payload.records;
      }
      return [];
    },
    extractTotal(res, fallback) {
      const body = res && res.data ? res.data : {};
      const payload = body.data;
      if (payload && typeof payload.total === "number") {
        return payload.total;
      }
      if (payload && payload.data && typeof payload.data.total === "number") {
        return payload.data.total;
      }
      return fallback;
    },
    resolveErrorMessage(error, fallback) {
      return (error && error.message) || fallback;
    },
    setLoading(key, value) {
      this.$set(this.loadingMap, key, value);
    },
    setError(key, value) {
      this.$set(this.errorMap, key, value);
    },
    goTo(path) {
      this.$router.push(path);
    },
    normalizePlatforms(content) {
      let resolved = content;
      if (typeof resolved === "string") {
        try {
          resolved = JSON.parse(resolved);
        } catch (e) {
          resolved = null;
        }
      }
      if (resolved && Array.isArray(resolved.platforms)) {
        return resolved.platforms;
      }
      if (Array.isArray(resolved)) {
        return resolved;
      }
      return [];
    },
    getLogPlatformNames(item) {
      const platforms = this.normalizePlatforms(item ? item.content : null);
      const names = platforms
        .map((platform) => {
          if (platform.platformName) {
            return platform.platformName;
          }
          if (platform.platform_name) {
            return platform.platform_name;
          }
          if (platform.platformId || platform.platform_id) {
            return this.findPlatformName(platform.platformId || platform.platform_id);
          }
          return "";
        })
        .filter(Boolean);

      return names.length ? names.slice(0, 3) : ["未绑定平台"];
    },
    getLogPreview(item) {
      const platforms = this.normalizePlatforms(item ? item.content : null);
      const preview = platforms
        .map((platform) => this.truncateText(platform.content || "", 72))
        .filter(Boolean)
        .join(" / ");

      return preview || "暂无日志摘要";
    },
    findPlatformName(id) {
      const targetId = Number(id);
      const match = (this.platforms || []).find((item) => Number(item.id) === targetId);
      return match ? match.name : "";
    },
    truncateText(value, limit) {
      const plain = (value || "")
        .replace(/[#>*_`~[\]()-]/g, " ")
        .replace(/\n+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (!plain) {
        return "";
      }
      if (plain.length <= limit) {
        return plain;
      }
      return plain.slice(0, limit) + "...";
    },
    formatDateLabel(value) {
      if (!value) {
        return "--";
      }
      if (this.$util && typeof this.$util.toDateString === "function") {
        return this.$util.toDateString(value, "MM-dd");
      }
      return String(value);
    },
    getWeatherType(name) {
      switch (name) {
        case "sun":
          return "el-icon-sunny";
        case "cloudy":
          return "el-icon-cloudy";
        case "partly-cloudy":
          return "el-icon-partly-cloudy";
        case "lightning":
          return "el-icon-lightning";
        case "rain":
          return "el-icon-light-rain";
        case "heavy-rain":
          return "el-icon-heavy-rain";
        case "snow":
          return "el-icon-_snow";
        default:
          return "el-icon-sunny";
      }
    },
    getWeatherScene(weatherText) {
      if (!weatherText) {
        return { icon: "sun", tip: "天气平稳，适合专注推进今天的开发任务。" };
      }
      if (weatherText.includes("暴")) {
        return { icon: "heavy-rain", tip: "雨势偏强，出门记得带伞，也留意路上时间。" };
      }
      if (weatherText.includes("雨")) {
        return { icon: "rain", tip: "今天有雨，出门别忘了带伞，通勤也可以稍微提前一点。" };
      }
      if (weatherText.includes("雷")) {
        return { icon: "lightning", tip: "雷雨天气，注意出行安全，室内办公更安心。" };
      }
      if (weatherText.includes("雪")) {
        return { icon: "snow", tip: "天气偏冷，记得保暖，今天适合把事情稳稳推进。" };
      }
      if (weatherText.includes("雾") || weatherText.includes("霾")) {
        return { icon: "cloudy", tip: "能见度一般，出门慢一点，今天也适合把事情稳稳落下来。" };
      }
      if (weatherText.includes("阴")) {
        return { icon: "partly-cloudy", tip: "天气有点阴，但很适合静下心来处理复杂任务。" };
      }
      if (weatherText.includes("云")) {
        return { icon: "cloudy", tip: "云层较多，节奏放稳一点，按计划推进就很好。" };
      }
      if (weatherText.includes("晴")) {
        return { icon: "sun", tip: "天气不错，保持节奏，把今天的关键事项逐个完成。" };
      }
      return { icon: "sun", tip: "天气状态稳定，祝你今天开发顺利。" };
    },
    formatWeatherMessage(weather) {
      const city = weather.city || "你所在的城市";
      const condition = weather.weather || "天气稳定";
      const temperature =
        weather.temperature !== undefined && weather.temperature !== null
          ? `${weather.temperature}℃`
          : "";
      const scene = this.getWeatherScene(condition);
      const prefix = temperature
        ? `${city}今天${condition}，现在大约 ${temperature}。`
        : `${city}今天${condition}。`;

      return {
        icon: this.getWeatherType(scene.icon),
        text: `${prefix}${scene.tip}`,
      };
    },
    getWeatherInfo() {
      this.$http
        .get("/weather")
        .then((res) => {
          if (res.data.code === 0 && res.data.data) {
            const weather = this.formatWeatherMessage(res.data.data);
            this.weatherIcon = weather.icon;
            this.weatherText = weather.text;
          } else {
            this.weatherIcon = this.getWeatherType("sun");
            this.weatherText = "天气信息暂时没取到，今天也记得照顾好自己和开发节奏。";
          }
        })
        .catch(() => {
          this.weatherIcon = this.getWeatherType("sun");
          this.weatherText = "天气服务暂时不可用，先专注手头任务，出门前记得看一眼天气。";
        });
    },
  },
};
</script>

<style scoped>
.workplace-shell {
  padding: 0;
}

.workplace-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 8px 8px 28px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.workplace-hero__copy {
  flex: 1;
  min-width: 0;
}

.workplace-hero__title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.workplace-hero__weather {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 8px 12px;
  border-radius: 999px;
  background: #f8fafc;
  border: 1px solid rgba(148, 163, 184, 0.16);
  color: #475569;
  font-size: 12px;
  line-height: 1.6;
}

.workplace-hero__weather i {
  color: #2563eb;
  font-size: 14px;
}

.workplace-hero__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.workplace-overview {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 22px;
  padding: 0;
  background: transparent;
  box-shadow: none;
}

.workplace-overview__item {
  padding: 18px 20px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid rgba(148, 163, 184, 0.18);
  min-height: 120px;
}

.workplace-overview__label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 13px;
}

.workplace-overview__label i {
  font-size: 15px;
  color: #2563eb;
}

.workplace-overview__value {
  margin-top: 14px;
  color: #0f172a;
  font-size: 34px;
  line-height: 1;
  font-weight: 700;
}

.workplace-overview__hint {
  margin-top: 12px;
  color: #94a3b8;
  font-size: 12px;
  line-height: 1.6;
}

.workplace-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.95fr);
  gap: 18px;
  margin-top: 18px;
}

.workplace-main,
.workplace-side {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.workplace-panel {
  padding: 18px 20px;
  background: #fff;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 18px;
}

.workplace-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.workplace-panel__title {
  color: #0f172a;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.3;
}

.workplace-panel__desc {
  margin-top: 6px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
}

.workplace-log-list,
.workplace-doc-list,
.workplace-tool-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.workplace-log-item,
.workplace-doc-item,
.workplace-mini-list__item {
  padding: 14px 16px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid rgba(148, 163, 184, 0.14);
}

.workplace-log-item__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.workplace-log-item__date {
  color: #0f172a;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}

.workplace-log-item__platforms {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
}

.workplace-log-item__content {
  margin-top: 10px;
  color: #475569;
  font-size: 13px;
  line-height: 1.7;
}

.workplace-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  min-height: 26px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.08);
  color: #1d4ed8;
  font-size: 12px;
}

.workplace-chip--strong {
  background: #eff6ff;
}

.workplace-doc-item__title,
.workplace-mini-list__title {
  color: #0f172a;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.5;
}

.workplace-doc-item__meta,
.workplace-mini-list__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
  color: #64748b;
  font-size: 12px;
  line-height: 1.6;
}

.workplace-platform-summary {
  display: flex;
  align-items: center;
  gap: 14px;
}

.workplace-platform-summary__count {
  color: #0f172a;
  font-size: 38px;
  font-weight: 700;
  line-height: 1;
}

.workplace-platform-summary__text {
  color: #475569;
  font-size: 13px;
  line-height: 1.7;
}

.workplace-platform-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.workplace-tool-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 0;
  color: inherit;
  text-decoration: none;
  border-top: 1px solid rgba(148, 163, 184, 0.12);
}

.workplace-tool-item:first-child {
  padding-top: 0;
  border-top: none;
}

.workplace-tool-item__icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.workplace-tool-item__body {
  min-width: 0;
}

.workplace-tool-item__title {
  color: #0f172a;
  font-size: 14px;
  font-weight: 700;
}

.workplace-tool-item__desc {
  margin-top: 6px;
  color: #64748b;
  font-size: 12px;
  line-height: 1.6;
}

.workplace-summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.workplace-summary-card {
  padding: 14px 16px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid rgba(148, 163, 184, 0.14);
}

.workplace-summary-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  color: #0f172a;
  font-size: 13px;
  font-weight: 700;
}

.workplace-state {
  min-height: 116px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 12px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.7;
}

.workplace-state--error {
  color: #b91c1c;
}

@media (max-width: 1200px) {
  .workplace-overview {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .workplace-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .workplace-hero,
  .workplace-panel__header,
  .workplace-log-item__head {
    flex-direction: column;
  }

  .workplace-hero {
    padding-bottom: 22px;
  }

  .workplace-hero__title-row {
    flex-direction: column;
  }

  .workplace-hero__actions,
  .workplace-log-item__platforms {
    width: 100%;
    justify-content: flex-start;
  }

  .workplace-overview {
    grid-template-columns: 1fr;
  }

  .workplace-summary-grid {
    grid-template-columns: 1fr;
  }

  .workplace-panel,
  .workplace-overview__item {
    padding: 16px;
  }
}
</style>
