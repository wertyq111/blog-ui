<template>
  <div class="ele-body develop-page develop-page--control wp-page">
    <div class="wp-shell">
      <section class="wp-hero">
        <div class="wp-hero__copy">
          <div class="wp-hero__eyebrow">DEVELOP WORKSPACE</div>
          <h1 class="wp-hero__title">{{ helloPrev }}，{{ displayName }}</h1>
          <p class="wp-hero__desc">
            {{ todayText }}
          </p>
          <div class="wp-hero__weather">
            <i :class="weatherIcon"></i>
            <span>{{ weatherText }}</span>
          </div>
        </div>
        <div class="wp-hero__actions">
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

      <wp-control-bar
        :value="control"
        @change="handleControlChange" />

      <section v-if="statsError" class="wp-feedback wp-feedback--error">
        <span>{{ statsError }}</span>
        <el-button size="mini" type="primary" plain @click="loadStats">重试</el-button>
      </section>

      <template v-else-if="statsLoading">
        <section class="wp-skeleton-grid">
          <div v-for="item in 8" :key="item" class="wp-skeleton wp-skeleton--tile"></div>
        </section>
        <section class="wp-skeleton-board">
          <div class="wp-skeleton wp-skeleton--panel"></div>
          <div class="wp-skeleton wp-skeleton--panel"></div>
        </section>
      </template>

      <template v-else>
        <section v-if="control.view === 'overview'" class="wp-overview">
          <div class="wp-metric-grid">
            <button
              v-for="item in metricCards"
              :key="item.key"
              :class="['wp-metric', { 'wp-metric--accent': item.accent, 'wp-metric--interactive': item.action }]"
              type="button"
              @click="item.action && item.action()">
              <div class="wp-metric__label">{{ item.label }}</div>
              <div class="wp-metric__value">
                <span>{{ item.value }}</span>
                <small v-if="item.unit">{{ item.unit }}</small>
              </div>
              <div class="wp-metric__meta">{{ item.meta }}</div>
            </button>
          </div>

          <section class="wp-overview-main">
            <wp-activity-heatmap
              :cells="heatmapCells"
              :buckets="heatmapBuckets"
              :range="control.range"
              @select-date="openDailyByDate" />
            <div class="wp-overview-side">
              <wp-trend-line :data="trend30d" />
              <section class="wp-quip">
                <div class="wp-quip__eyebrow">今日小结</div>
                <div class="wp-quip__text">{{ insightQuip }}</div>
              </section>
            </div>
          </section>
        </section>

        <section v-else class="wp-platform-view">
          <section class="wp-rank">
            <div class="wp-section-head">
              <div>
                <div class="wp-section-head__eyebrow">平台贡献排行</div>
                <div class="wp-section-head__desc">按当前范围内的累计字数排序。</div>
              </div>
            </div>
            <div v-if="!platformRank.length" class="wp-empty-card">
              还没有平台贡献数据。
            </div>
            <div v-else class="wp-rank-list">
              <button
                v-for="item in platformRank"
                :key="item.platform_id || item.name"
                class="wp-rank-item"
                type="button"
                @click="goTo('/develop/work-daily')">
                <div class="wp-rank-item__head">
                  <div class="wp-rank-item__title">
                    <span class="wp-rank-item__badge">{{ item.rank }}</span>
                    <span>{{ item.name || '未绑定平台' }}</span>
                  </div>
                  <div class="wp-rank-item__value">{{ formatNumber(item.words) }} 字</div>
                </div>
                <div class="wp-rank-item__bar">
                  <span
                    class="wp-rank-item__fill"
                    :style="{ width: `${Math.max(item.percent || 0, 4)}%` }"></span>
                </div>
                <div class="wp-rank-item__meta">
                  <span>{{ formatNumber(item.logs) }} 条日志</span>
                  <span>{{ formatPercent(item.percent) }}</span>
                </div>
              </button>
            </div>
          </section>

          <wp-platform-matrix :matrix="platformMatrix" />
        </section>
      </template>

      <section class="wp-quick">
        <div class="wp-section-head">
          <div>
            <div class="wp-section-head__eyebrow">快速入口</div>
            <div class="wp-section-head__desc">最近日志、文档、平台和配置摘要都保留在这里。</div>
          </div>
        </div>
        <div class="wp-quick-grid">
          <section class="wp-quick-card">
            <div class="wp-quick-card__head">
              <span>最近日志</span>
              <el-link :underline="false" type="primary" @click="goTo('/develop/work-daily')">查看全部</el-link>
            </div>
            <div v-if="errorMap.logs" class="wp-mini-state">{{ errorMap.logs }}</div>
            <div v-else-if="loadingMap.logs" class="wp-mini-state">日志加载中...</div>
            <div v-else-if="!recentLogs.length" class="wp-mini-state">还没有工作日志。</div>
            <div v-else class="wp-mini-list">
              <button
                v-for="item in recentLogs"
                :key="item.id || item.logDate || item.createTime"
                class="wp-mini-list__item"
                type="button"
                @click="goTo('/develop/work-daily')">
                <div class="wp-mini-list__title">{{ formatDateLabel(item.logDate || item.createTime) }}</div>
                <div class="wp-mini-list__meta">{{ getLogPreview(item) }}</div>
              </button>
            </div>
          </section>

          <section class="wp-quick-card">
            <div class="wp-quick-card__head">
              <span>最近文档</span>
              <el-link :underline="false" type="primary" @click="goTo('/develop/work-doc')">查看全部</el-link>
            </div>
            <div v-if="errorMap.docs" class="wp-mini-state">{{ errorMap.docs }}</div>
            <div v-else-if="loadingMap.docs" class="wp-mini-state">文档加载中...</div>
            <div v-else-if="!recentDocs.length" class="wp-mini-state">还没有开发文档。</div>
            <div v-else class="wp-mini-list">
              <button
                v-for="item in recentDocs"
                :key="item.id || item.title"
                class="wp-mini-list__item"
                type="button"
                @click="goTo('/develop/work-doc')">
                <div class="wp-mini-list__title">{{ item.title || '未命名文档' }}</div>
                <div class="wp-mini-list__meta">
                  {{ item.source || '未设置来源' }} · {{ formatDateLabel(item.updated_at || item.updateTime || item.createTime) }}
                </div>
              </button>
            </div>
          </section>

          <section class="wp-quick-card">
            <div class="wp-quick-card__head">
              <span>启用平台</span>
              <el-link :underline="false" type="primary" @click="goTo('/develop/work-platform')">平台管理</el-link>
            </div>
            <div v-if="errorMap.platforms" class="wp-mini-state">{{ errorMap.platforms }}</div>
            <div v-else-if="loadingMap.platforms" class="wp-mini-state">平台加载中...</div>
            <div v-else-if="!platforms.length" class="wp-mini-state">当前没有启用的平台。</div>
            <div v-else>
              <div class="wp-platform-summary">{{ platforms.length }} 个启用平台</div>
              <div class="wp-chip-list">
                <span
                  v-for="item in platforms"
                  :key="item.id || item.name"
                  class="wp-chip">
                  {{ item.name }}
                </span>
              </div>
            </div>
          </section>

          <section class="wp-quick-card">
            <div class="wp-quick-card__head">
              <span>路径与模型</span>
              <el-link :underline="false" type="primary" @click="goTo('/develop/convert-path')">进入工具</el-link>
            </div>
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
                    @click="goTo('/develop/convert-path')">
                    <div class="wp-mini-list__title">{{ item.name || item.code }}</div>
                    <div class="wp-mini-list__meta">{{ item.code || '未配置编码' }}</div>
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
                    @click="goTo('/develop/init-model')">
                    <div class="wp-mini-list__title">{{ item.name || item.code }}</div>
                    <div class="wp-mini-list__meta">{{ item.code || '未配置编码' }}</div>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import WpActivityHeatmap from "./components/WpActivityHeatmap.vue";
import WpControlBar from "./components/WpControlBar.vue";
import WpPlatformMatrix from "./components/WpPlatformMatrix.vue";
import WpTrendLine from "./components/WpTrendLine.vue";

const BOOK_POOL = [
  { name: "《小王子》", words: 21000 },
  { name: "《老人与海》", words: 27000 },
  { name: "《动物农场》", words: 30000 },
  { name: "《哈利波特 1》", words: 77000 },
  { name: "《三体 1》", words: 210000 },
  { name: "《围城》", words: 220000 },
  { name: "《红楼梦》", words: 730000 },
];

export default {
  name: "DashboardWorkplace",
  components: {
    WpActivityHeatmap,
    WpControlBar,
    WpPlatformMatrix,
    WpTrendLine,
  },
  data() {
    return {
      control: {
        view: "overview",
        range: "all",
      },
      statsLoading: true,
      statsError: "",
      overviewData: {},
      platformData: {},
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
    todayText() {
      const now = new Date();
      const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
      return `今天是 ${now.getFullYear()} 年 ${now.getMonth() + 1} 月 ${now.getDate()} 日 · ${weekdays[now.getDay()]}，先看清楚这段时间的产出，再决定今天要把力气花在哪。`;
    },
    metrics() {
      return this.overviewData.metrics || {};
    },
    heatmapBuckets() {
      return (this.overviewData.heatmap && this.overviewData.heatmap.buckets) || [0, 200, 800, 2000];
    },
    heatmapCells() {
      return (this.overviewData.heatmap && this.overviewData.heatmap.cells) || [];
    },
    trend30d() {
      return this.overviewData.trend_30d || [];
    },
    platformRank() {
      return this.platformData.rank || [];
    },
    platformMatrix() {
      return this.platformData.matrix || { months: [], rows: [], buckets: [0, 500, 2000, 5000] };
    },
    metricCards() {
      const favorite = this.metrics.favorite_platform || {};
      const longest = this.metrics.longest_streak || {};
      const peakHour = this.metrics.peak_hour || {};

      return [
        {
          key: "total_words",
          label: "累计字数",
          value: this.formatNumber(this.metrics.total_words && this.metrics.total_words.value),
          unit: "字",
          meta: this.buildDeltaText(this.metrics.total_words && this.metrics.total_words.delta_7d, "本周"),
        },
        {
          key: "total_logs",
          label: "总日志数",
          value: this.formatNumber(this.metrics.total_logs && this.metrics.total_logs.value),
          unit: "条",
          meta: this.buildDeltaText(this.metrics.total_logs && this.metrics.total_logs.delta_7d, "本周"),
        },
        {
          key: "total_docs",
          label: "总文档数",
          value: this.formatNumber(this.metrics.total_docs && this.metrics.total_docs.value),
          unit: "篇",
          meta: this.buildDeltaText(this.metrics.total_docs && this.metrics.total_docs.delta_7d, "本周"),
        },
        {
          key: "active_days",
          label: "活跃天数",
          value: this.formatNumber(this.metrics.active_days && this.metrics.active_days.value),
          unit: "天",
          meta: this.buildDeltaText(this.metrics.active_days && this.metrics.active_days.delta_7d, "近 7 天"),
        },
        {
          key: "current_streak",
          label: "当前连续",
          value: this.formatNumber(this.metrics.current_streak && this.metrics.current_streak.value),
          unit: "天",
          meta: (this.metrics.current_streak && this.metrics.current_streak.hint) || "等你写下第一条",
        },
        {
          key: "longest_streak",
          label: "最长连续",
          value: this.formatNumber(longest.value),
          unit: "天",
          meta: longest.start ? `${longest.start} 至 ${longest.end}` : "还没攒出连续记录",
        },
        {
          key: "peak_hour",
          label: "高产时段",
          value: peakHour.hour === null || peakHour.hour === undefined ? "—" : `${peakHour.hour}时`,
          unit: peakHour.label || "",
          meta: peakHour.label ? `${peakHour.label}最有产出` : "还没攒出节奏",
        },
        {
          key: "favorite_platform",
          label: "主力平台",
          value: favorite.name || "—",
          unit: "",
          meta: favorite.words ? `${this.formatNumber(favorite.words)} 字 · ${this.formatPercent(favorite.percent)}` : "还没有平台贡献数据",
          accent: !!favorite.words,
          action: favorite.words ? this.openPlatformView : null,
        },
      ];
    },
    insightQuip() {
      const totalWords = Number(this.metrics.total_words && this.metrics.total_words.value);
      if (!totalWords) {
        return "你的写作旅程还没开始，今天这第一笔就很关键。";
      }
      if (totalWords < BOOK_POOL[0].words) {
        return `你已经写下约 ${Math.round((totalWords / BOOK_POOL[0].words) * 100)}% 一本${BOOK_POOL[0].name}。`;
      }
      const candidates = BOOK_POOL.filter((item) => {
        const ratio = totalWords / item.words;
        return ratio >= 1 && ratio <= 50;
      });
      const target = candidates.length ? candidates[totalWords % candidates.length] : BOOK_POOL[BOOK_POOL.length - 1];
      const times = (totalWords / target.words).toFixed(totalWords / target.words >= 10 ? 0 : 1);
      return `按现在的累计字数，你已经写了约 ${times} 本${target.name}。`;
    },
  },
  created() {
    this.syncControlFromRoute();
    this.loadDashboard();
    this.getWeatherInfo();
  },
  watch: {
    "$route.query"() {
      const changed = this.syncControlFromRoute();
      if (changed) {
        this.loadStats();
      }
    },
  },
  methods: {
    async loadDashboard() {
      await Promise.all([
        this.loadStats(),
        this.loadPlatforms(),
        this.loadLogs(),
        this.loadDocs(),
        this.loadPaths(),
        this.loadModels(),
      ]);
    },
    syncControlFromRoute() {
      const view = this.$route.query.view === "platform" ? "platform" : "overview";
      const range = ["all", "30d", "7d"].includes(this.$route.query.range) ? this.$route.query.range : "all";
      const next = { view, range };
      const changed = next.view !== this.control.view || next.range !== this.control.range;
      this.control = next;
      return changed;
    },
    handleControlChange(next) {
      if (!next || (next.view === this.control.view && next.range === this.control.range)) {
        return;
      }
      this.$router.replace({
        path: this.$route.path,
        query: Object.assign({}, this.$route.query, next),
      });
    },
    async loadStats() {
      this.statsLoading = true;
      this.statsError = "";
      try {
        const res = await this.$http.get("/dashboard/stats", {
          params: {
            view: this.control.view,
            range: this.control.range,
          },
        });
        if (!res.data || res.data.code !== 0) {
          throw new Error((res.data && res.data.msg) || "工作台统计加载失败");
        }
        if (this.control.view === "overview") {
          this.overviewData = res.data.data || {};
        } else {
          this.platformData = res.data.data || {};
        }
      } catch (error) {
        this.statsError = this.resolveErrorMessage(error, "工作台统计加载失败");
      } finally {
        this.statsLoading = false;
      }
    },
    async loadPlatforms() {
      this.setLoading("platforms", true);
      this.setError("platforms", "");
      try {
        const res = await this.$http.get("/work-platform/list", {
          params: { status: 1 },
        });
        this.platforms = this.extractCollection(res);
      } catch (error) {
        this.platforms = [];
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
          params: { page: 1, limit: 5 },
        });
        this.recentLogs = this.extractCollection(res).slice(0, 5);
      } catch (error) {
        this.recentLogs = [];
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
          params: { page: 1, limit: 5 },
        });
        this.recentDocs = this.extractCollection(res).slice(0, 5);
      } catch (error) {
        this.recentDocs = [];
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
          params: { page: 1, limit: 3 },
        });
        this.recentPaths = this.extractCollection(res).slice(0, 3);
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
          params: { page: 1, limit: 3 },
        });
        this.recentModels = this.extractCollection(res).slice(0, 3);
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
    openDailyByDate(date) {
      this.$router.push({
        path: "/develop/work-daily",
        query: { date },
      });
    },
    openPlatformView() {
      this.handleControlChange({
        view: "platform",
        range: this.control.range,
      });
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
    getLogPreview(item) {
      const platforms = this.normalizePlatforms(item ? item.content : null);
      const preview = platforms
        .map((platform) => this.truncateText(platform.content || "", 54))
        .filter(Boolean)
        .join(" / ");

      return preview || "暂无日志摘要";
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
      return String(value).slice(5, 10);
    },
    formatNumber(value) {
      const target = Number(value || 0);
      return target.toLocaleString();
    },
    formatPercent(value) {
      const target = Number(value || 0);
      return `${target.toFixed(target >= 10 ? 0 : 1)}%`;
    },
    buildDeltaText(value, suffix) {
      const target = Number(value || 0);
      if (!target) {
        return `+0 ${suffix}`;
      }
      return `+${this.formatNumber(target)} ${suffix}`;
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

<style lang="scss" scoped>
.wp-page {
  min-height: 100%;
  padding-bottom: 32px;
  background:
    radial-gradient(circle at top left, rgba(240, 246, 236, 0.95), rgba(247, 250, 245, 0.92) 36%, rgba(248, 250, 247, 0.96) 100%);
}

.wp-shell {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1320px;
  margin: 0 auto;
}

.wp-hero,
.wp-feedback,
.wp-quip,
.wp-rank,
.wp-quick-card {
  border: 1px solid rgba(214, 225, 208, 0.9);
  background: rgba(255, 255, 255, 0.72);
  box-shadow:
    0 24px 40px -30px rgba(84, 106, 74, 0.42),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(150%);
}

.wp-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 28px;
  border-radius: 30px;
}

.wp-hero__copy {
  flex: 1;
  min-width: 0;
}

.wp-hero__eyebrow {
  color: #7a8574;
  font-size: 12px;
  line-height: 1.4;
  letter-spacing: 0.1em;
}

.wp-hero__title {
  margin: 12px 0 0;
  color: #1f2a1a;
  font-size: 40px;
  line-height: 1.05;
  font-weight: 700;
}

.wp-hero__desc {
  max-width: 720px;
  margin: 14px 0 0;
  color: #5c6b57;
  font-size: 14px;
  line-height: 1.8;
}

.wp-hero__weather {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(240, 246, 236, 0.92);
  color: #586753;
  font-size: 12px;
  line-height: 1.6;
}

.wp-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-end;
}

.wp-feedback {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border-radius: 22px;
}

.wp-feedback--error {
  color: #b44e34;
}

.wp-skeleton-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.wp-skeleton-board {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(320px, 1fr);
  gap: 16px;
}

.wp-skeleton {
  border-radius: 24px;
  background: linear-gradient(90deg, rgba(234, 243, 226, 0.95), rgba(246, 249, 243, 0.98), rgba(234, 243, 226, 0.95));
  background-size: 240px 100%;
  animation: wp-skeleton 1.8s linear infinite;
}

.wp-skeleton--tile {
  height: 144px;
}

.wp-skeleton--panel {
  height: 280px;
}

.wp-overview,
.wp-platform-view,
.wp-quick {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.wp-metric-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.wp-metric {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  min-height: 148px;
  padding: 22px;
  border: 1px solid rgba(214, 225, 208, 0.9);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow:
    0 24px 40px -30px rgba(84, 106, 74, 0.42),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(150%);
  text-align: left;
  cursor: default;
}

.wp-metric--accent {
  background: linear-gradient(180deg, rgba(245, 225, 213, 0.88), rgba(255, 255, 255, 0.76));
}

.wp-metric--interactive {
  cursor: pointer;
}

.wp-metric__label {
  color: #7a8574;
  font-size: 12px;
  line-height: 1.4;
  letter-spacing: 0.08em;
}

.wp-metric__value {
  color: #1f2a1a;
  font-size: 34px;
  line-height: 1;
  font-weight: 700;
}

.wp-metric__value small {
  margin-left: 6px;
  color: #6e7a69;
  font-size: 14px;
  font-weight: 500;
}

.wp-metric__meta {
  color: #5c6b57;
  font-size: 13px;
  line-height: 1.6;
}

.wp-overview-main {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(320px, 1fr);
  gap: 16px;
}

.wp-overview-side {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.wp-quip {
  padding: 22px;
  border-radius: 24px;
}

.wp-quip__eyebrow,
.wp-section-head__eyebrow {
  color: #6e7a69;
  font-size: 12px;
  line-height: 1.4;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.wp-quip__text,
.wp-section-head__desc {
  margin-top: 8px;
  color: #5c6b57;
  font-size: 14px;
  line-height: 1.7;
}

.wp-rank {
  padding: 22px;
  border-radius: 24px;
}

.wp-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.wp-rank-list {
  display: grid;
  gap: 14px;
  margin-top: 18px;
}

.wp-rank-item {
  padding: 16px;
  border: 1px solid rgba(224, 233, 219, 0.88);
  border-radius: 18px;
  background: rgba(248, 250, 247, 0.95);
  text-align: left;
  cursor: pointer;
}

.wp-rank-item__head,
.wp-rank-item__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.wp-rank-item__title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #24311f;
  font-size: 15px;
  font-weight: 600;
}

.wp-rank-item__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: #f5e1d5;
  color: #d17b5c;
  font-size: 12px;
  font-weight: 700;
}

.wp-rank-item__value,
.wp-rank-item__meta {
  color: #6d7968;
  font-size: 12px;
}

.wp-rank-item__bar {
  height: 10px;
  margin: 14px 0 10px;
  border-radius: 999px;
  background: rgba(224, 233, 219, 0.9);
  overflow: hidden;
}

.wp-rank-item__fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #d17b5c 0%, #7bb069 100%);
}

.wp-quick-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.wp-quick-card {
  min-height: 280px;
  padding: 20px;
  border-radius: 24px;
}

.wp-quick-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  color: #24311f;
  font-size: 16px;
  font-weight: 600;
}

.wp-mini-list {
  display: grid;
  gap: 10px;
}

.wp-mini-list__item {
  padding: 12px 14px;
  border: 1px solid rgba(224, 233, 219, 0.88);
  border-radius: 16px;
  background: rgba(248, 250, 247, 0.95);
  text-align: left;
  cursor: pointer;
}

.wp-mini-list__title {
  color: #24311f;
  font-size: 14px;
  font-weight: 600;
}

.wp-mini-list__meta,
.wp-mini-state,
.wp-platform-summary,
.wp-combo__label {
  color: #6d7968;
  font-size: 12px;
  line-height: 1.6;
}

.wp-platform-summary {
  margin-bottom: 12px;
}

.wp-chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.wp-chip {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(234, 243, 226, 0.96);
  color: #486540;
  font-size: 12px;
}

.wp-combo {
  display: grid;
  gap: 16px;
}

.wp-empty-card {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  margin-top: 18px;
  border-radius: 18px;
  background: rgba(240, 246, 236, 0.92);
  color: #7e8a79;
  font-size: 14px;
  text-align: center;
}

@keyframes wp-skeleton {
  0% {
    background-position: -240px 0;
  }
  100% {
    background-position: calc(100% + 240px) 0;
  }
}

@media (max-width: 1100px) {
  .wp-skeleton-grid,
  .wp-metric-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .wp-overview-main,
  .wp-skeleton-board,
  .wp-quick-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .wp-shell {
    gap: 16px;
  }

  .wp-hero {
    flex-direction: column;
    padding: 22px 18px;
  }

  .wp-hero__title {
    font-size: 32px;
  }

  .wp-hero__actions {
    width: 100%;
    justify-content: flex-start;
  }

  .wp-metric-grid {
    grid-template-columns: 1fr;
  }

  .wp-quick-card,
  .wp-rank {
    padding: 18px;
  }
}
</style>
