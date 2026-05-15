<template>
  <div class="ele-body develop-page develop-page--control wp-page">
    <div class="wp-shell">
      <wp-hero
        :greeting="helloPrev"
        :display-name="displayName"
        :today-text="todayText"
        :weather-icon="weatherIcon"
        :weather-text="weatherText"
        @go="goTo" />

      <wp-control-bar
        :value="control"
        :last-updated="lastUpdatedTime"
        @change="handleControlChange" />

      <section v-if="statsError" class="wp-feedback wp-feedback--error wp-glass-card">
        <span>{{ statsError }}</span>
        <el-button size="mini" type="primary" plain @click="loadStats({ force: true })">重试</el-button>
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
          <wp-metric-grid :items="metricCards" />

          <section class="wp-heatmap-row">
            <wp-activity-heatmap
              :cells="heatmapCells"
              :buckets="heatmapBuckets"
              :range="control.range"
              @select-date="openDailyByDate" />
            <wp-streak-panel :metrics="metrics" />
          </section>

          <section class="wp-charts-row">
            <wp-trend-line :data="trend30d" />
            <wp-hour-chart :hour-dist="hourDist" />
            <wp-platform-donut :platform-dist="platformDist" />
          </section>

          <section class="wp-bottom-row">
            <wp-weekday-bar :week-dist="weekDist" />
            <wp-tag-block :tags="tags" />
          </section>

          <wp-recent-logs
            :recent-logs="recentLogs"
            :total-logs="totalLogsValue"
            :week-delta="totalLogsWeekDelta"
            :format-date-label="formatDateLabel"
            :get-log-preview="getLogPreview"
            @navigate="goTo" />
        </section>

        <section v-else-if="control.view === 'platform'" class="wp-platform-view">
          <wp-platform-rank :rank="platformRank" @open-daily="goTo('/develop/work-daily')" />
          <wp-platform-matrix :matrix="platformMatrix" />
        </section>

        <section v-else-if="control.view === 'hour'" class="wp-overview">
          <wp-hour-chart :hour-dist="hourViewDist" />
          <wp-weekday-bar :week-dist="weekViewDist" />
        </section>

        <section v-else class="wp-overview">
          <wp-tag-block :tags="tags" />
        </section>
      </template>

      <wp-quick-access
        :recent-docs="recentDocs"
        :platforms="platforms"
        :platform-dist="platformDist"
        :recent-paths="recentPaths"
        :recent-models="recentModels"
        :loading-map="loadingMap"
        :error-map="errorMap"
        :format-date-label="formatDateLabel"
        @navigate="goTo" />

      <div class="wp-footer-note">保留原有能力，收进第二屏，随时跳转。</div>
    </div>
  </div>
</template>

<script>
import WpActivityHeatmap from "./components/WpActivityHeatmap.vue";
import WpControlBar from "./components/WpControlBar.vue";
import WpHero from "./components/WpHero.vue";
import WpHourChart from "./components/WpHourChart.vue";
import WpMetricGrid from "./components/WpMetricGrid.vue";
import WpPlatformDonut from "./components/WpPlatformDonut.vue";
import WpPlatformMatrix from "./components/WpPlatformMatrix.vue";
import WpPlatformRank from "./components/WpPlatformRank.vue";
import WpQuickAccess from "./components/WpQuickAccess.vue";
import WpRecentLogs from "./components/WpRecentLogs.vue";
import WpStreakPanel from "./components/WpStreakPanel.vue";
import WpTagBlock from "./components/WpTagBlock.vue";
import WpTrendLine from "./components/WpTrendLine.vue";
import WpWeekdayBar from "./components/WpWeekdayBar.vue";

export default {
  name: "DashboardWorkplaceV2",
  components: {
    WpActivityHeatmap,
    WpControlBar,
    WpHero,
    WpHourChart,
    WpMetricGrid,
    WpPlatformDonut,
    WpPlatformMatrix,
    WpPlatformRank,
    WpQuickAccess,
    WpRecentLogs,
    WpStreakPanel,
    WpTagBlock,
    WpTrendLine,
    WpWeekdayBar,
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
      // 5 分钟前端软缓存（避免切 Tab/Range 来回点反复打接口；后端 cache_hit 仍是兜底）
      statsCache: Object.create(null),
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
      return (this.loginUser.member && this.loginUser.member.nickname) || this.loginUser.nickname || this.loginUser.username || "开发者";
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
    hourDist() {
      return (this.overviewData.metrics && this.overviewData.metrics.hour_dist) || [];
    },
    platformDist() {
      return this.overviewData.platform_dist || [];
    },
    weekDist() {
      return (this.overviewData.metrics && this.overviewData.metrics.week_dist) || [];
    },
    tags() {
      return [];
    },
    lastUpdatedTime() {
      return this.overviewData.generated_at || null;
    },
    totalLogsValue() {
      return this.metrics.total_logs && this.metrics.total_logs.value;
    },
    totalLogsWeekDelta() {
      return this.metrics.total_logs && this.metrics.total_logs.delta_7d;
    },
    hourViewDist() {
      const hourData = this.overviewData.hour_dist || this.hourDist;
      return hourData;
    },
    weekViewDist() {
      const weekData = this.overviewData.week_dist || this.weekDist;
      return weekData;
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
      const numeric = (m) => (m && typeof m.value === "number" ? m.value : 0);

      return [
        {
          key: "total_words",
          label: "累计字数",
          value: this.formatNumber(numeric(this.metrics.total_words)),
          numericValue: numeric(this.metrics.total_words),
          unit: "字",
          meta: this.buildDeltaText(this.metrics.total_words && this.metrics.total_words.delta_7d, "本周"),
        },
        {
          key: "total_logs",
          label: "总日志数",
          value: this.formatNumber(numeric(this.metrics.total_logs)),
          numericValue: numeric(this.metrics.total_logs),
          unit: "条",
          meta: this.buildDeltaText(this.metrics.total_logs && this.metrics.total_logs.delta_7d, "本周"),
        },
        {
          key: "total_docs",
          label: "总文档数",
          value: this.formatNumber(numeric(this.metrics.total_docs)),
          numericValue: numeric(this.metrics.total_docs),
          unit: "篇",
          meta: this.buildDeltaText(this.metrics.total_docs && this.metrics.total_docs.delta_7d, "本周"),
        },
        {
          key: "active_days",
          label: "活跃天数",
          value: this.formatNumber(numeric(this.metrics.active_days)),
          numericValue: numeric(this.metrics.active_days),
          unit: "天",
          meta: this.buildDeltaText(this.metrics.active_days && this.metrics.active_days.delta_7d, "近 7 天"),
        },
        {
          key: "current_streak",
          label: "当前连续",
          value: this.formatNumber(numeric(this.metrics.current_streak)),
          numericValue: numeric(this.metrics.current_streak),
          unit: "天",
          meta: (this.metrics.current_streak && this.metrics.current_streak.hint) || "等你写下第一条",
        },
        {
          key: "longest_streak",
          label: "最长连续",
          value: this.formatNumber(longest.value),
          numericValue: typeof longest.value === "number" ? longest.value : 0,
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
      await Promise.all([this.loadStats(), this.loadPlatforms(), this.loadLogs(), this.loadDocs(), this.loadPaths(), this.loadModels()]);
    },
    syncControlFromRoute() {
      const validViews = ["overview", "platform", "hour", "tag"];
      const view = validViews.includes(this.$route.query.view) ? this.$route.query.view : "overview";
      const validRanges = ["all", "30d", "7d", "today"];
      const range = validRanges.includes(this.$route.query.range) ? this.$route.query.range : "all";
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
    async loadStats({ force = false } = {}) {
      const view = this.control.view;
      const range = this.control.range;
      const cacheKey = `${view}:${range}`;
      const FIVE_MIN = 5 * 60 * 1000;
      const cached = this.statsCache[cacheKey];

      // 命中本地软缓存：直接还原数据，跳过 HTTP（spec §5.5）
      if (!force && cached && Date.now() - cached.loadedAt < FIVE_MIN) {
        if (view === "overview") {
          this.overviewData = cached.data;
        } else {
          this.platformData = cached.data;
        }
        this.statsLoading = false;
        this.statsError = "";
        return;
      }

      this.statsLoading = true;
      this.statsError = "";
      try {
        const res = await this.$http.get("/dashboard/stats", {
          params: { view, range },
        });
        if (!res.data || res.data.code !== 0) {
          throw new Error((res.data && res.data.msg) || "工作台统计加载失败");
        }
        const payload = res.data.data || {};
        if (view === "overview") {
          this.overviewData = payload;
        } else {
          this.platformData = payload;
        }
        // 注意：只缓存与当前 view/range 一致的数据，避免后端 race 把过期 response 写入
        if (payload.view === view && payload.range === range) {
          this.$set(this.statsCache, cacheKey, { data: payload, loadedAt: Date.now() });
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
      const temperature = weather.temperature !== undefined && weather.temperature !== null ? `${weather.temperature}℃` : "";
      const scene = this.getWeatherScene(condition);
      const prefix = temperature ? `${city}今天${condition}，现在大约 ${temperature}。` : `${city}今天${condition}。`;

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

<style lang="scss">
@import "./styles/tokens.scss";
@import "./styles/wp-page.scss";
</style>
