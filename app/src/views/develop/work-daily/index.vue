<template>
  <div class="ele-body develop-page develop-page--daily work-daily-page">
    <el-card shadow="never" class="daily-page-card">
      <section class="develop-hero">
        <div class="develop-hero__copy">
          <div class="develop-hero__eyebrow">Develop Workspace</div>
          <div class="develop-hero__title">工作日常</div>
          <div class="develop-hero__desc">统一记录平台日报、导入 Markdown 和生成周报月报年报，作为 develop 栏目的日常工作台。</div>
        </div>
        <div class="develop-hero__meta">
          <div class="develop-hero__meta-card">
            <span class="develop-hero__meta-label">平台数</span>
            <strong>{{ platforms.length }}</strong>
          </div>
          <div class="develop-hero__meta-card">
            <span class="develop-hero__meta-label">模型数</span>
            <strong>{{ reportModelOptions.length }}</strong>
          </div>
        </div>
      </section>

      <div class="daily-toolbar-grid">
        <section class="daily-panel">
          <div class="daily-panel__head">
            <div>
              <div class="daily-panel__title">筛选日志</div>
              <div class="daily-panel__desc">按平台、日期和关键字快速定位日报记录。</div>
            </div>
          </div>
          <el-form
            :model="where"
            class="ele-form-search daily-form daily-form--inline daily-form--filter"
            label-width="77px"
            @keyup.enter.native="reload"
            @submit.native.prevent>
            <el-row :gutter="15" class="daily-form__row">
              <el-col :lg="8" :md="12" class="daily-form__col daily-form__col--platform">
                <el-form-item label="平台:">
                  <el-select v-model="where.platform_id" clearable placeholder="请选择平台">
                    <el-option v-for="item in platforms" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" :md="12" class="daily-form__col daily-form__col--range">
                <el-form-item class="el-col-24" label="日期范围:">
                  <el-date-picker
                    v-model="dateRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="6" class="daily-form__col daily-form__col--search">
                <el-form-item class="el-col-20" label="内容搜索:">
                  <el-input
                    v-model="where.content"
                    placeholder="请输入关键字"
                    @keyup.enter.native="reload">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="daily-form__col daily-form__col--actions">
                <div class="daily-form__actions">
                  <el-button
                    class="ele-btn-icon"
                    icon="el-icon-search"
                    type="primary"
                    @click="reload">查询
                  </el-button>
                  <el-button @click="reset">重置</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </section>

        <section class="daily-panel daily-panel--accent">
          <div class="daily-panel__head">
            <div>
              <div class="daily-panel__title">报表导出</div>
              <div class="daily-panel__desc">按报表类型选择时间范围，并指定总结模型导出 Markdown。</div>
            </div>
          </div>
          <el-form class="ele-form-search daily-form daily-form--inline daily-form--report" label-width="70px">
            <el-row :gutter="15" class="daily-form__row">
              <el-col :lg="8" :md="12" class="daily-form__col daily-form__col--report-type">
                <el-form-item class="col-col-lg-12" label="报表类型:">
                  <el-select v-model="reportType" placeholder="请选择报表类型" style="width: 100%">
                    <el-option label="月报" value="month"/>
                    <el-option label="周报" value="week"/>
                    <el-option label="年报" value="year"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8" class="daily-form__col daily-form__col--report-model">
                <el-form-item class="el-col-lg-24" label="总结模型:">
                  <el-select
                    v-model="reportModel"
                    :loading="reportModelLoading"
                    clearable
                    filterable
                    placeholder="默认使用环境配置模型"
                    style="width: 100%">
                    <el-option
                      v-for="item in reportModelOptions"
                      :key="item"
                      :label="item"
                      :value="item"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="reportType==='month'" :lg="8" :md="12" class="daily-form__col daily-form__col--report-period">
                <el-form-item label="月份:">
                  <el-date-picker v-model="reportMonth" type="month" placeholder="选择月份" style="width: 100%"/>
                </el-form-item>
              </el-col>
              <el-col v-if="reportType==='week'" :lg="12" :md="12" class="daily-form__col daily-form__col--report-period daily-form__col--report-period-wide">
                <el-form-item label="日期范围:">
                  <el-date-picker v-model="reportRange" type="daterange" range-separator="至"
                                  start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%"/>
                </el-form-item>
              </el-col>
              <el-col v-if="reportType==='year'" :lg="8" :md="12" class="daily-form__col daily-form__col--report-period">
                <el-form-item label="年份:">
                  <el-date-picker v-model="reportYear" type="year" placeholder="选择年份" style="width: 100%"/>
                </el-form-item>
              </el-col>
              <el-col :lg="8" :md="12" class="daily-form__col daily-form__col--report-import">
                <el-form-item label="导入年份:">
                  <el-date-picker v-model="importYear" type="year" placeholder="选择年份" style="width: 100%"/>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="daily-form__col daily-form__col--report-actions">
                <div class="daily-form__actions daily-form__actions--report">
                  <el-button type="success" class="ele-btn-icon daily-btn daily-btn--primary" icon="el-icon-download" @click="exportReport">导出</el-button>
                  <el-upload
                    action="/work-daily/import"
                    :show-file-list="false"
                    :http-request="handleImport"
                    accept=".md,.markdown">
                    <el-button type="primary" class="ele-btn-icon daily-btn daily-btn--primary" icon="el-icon-upload2">导入Markdown</el-button>
                  </el-upload>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </section>
      </div>

      <!-- 数据表格 -->
      <section class="daily-table-shell">
        <ele-pro-table
          ref="table"
          :columns="columns"
          :datasource="url"
          :where="where"
          class="daily-table"
          height="calc(100vh - 500px)">
          <!-- 表头工具栏 -->
          <template slot="toolbar">
            <div class="daily-table-toolbar">
              <div class="daily-table-toolbar__left">
                <el-button
                  v-if="canOperate"
                  class="ele-btn-icon daily-btn daily-btn--primary"
                  icon="el-icon-plus"
                  size="small"
                  type="primary"
                  @click="openEdit(null)">添加
                </el-button>
              </div>
              <div class="daily-table-toolbar__right">
                <el-tooltip content="刷新列表" placement="top">
                  <el-button
                    circle
                    class="daily-table-toolbar__icon"
                    icon="el-icon-refresh"
                    size="mini"
                    @click="reload" />
                </el-tooltip>
                <el-tooltip content="重置筛选" placement="top">
                  <el-button
                    circle
                    class="daily-table-toolbar__icon"
                    icon="el-icon-delete"
                    size="mini"
                    @click="reset" />
                </el-tooltip>
              </div>
            </div>
          </template>
          <!-- 内容列 -->
          <template slot="content" slot-scope="{ row }">
            <div class="daily-content-list">
              <div
                v-for="(p, idx) in getRowPlatforms(row)"
                :key="idx"
                class="daily-content-item">
                <div class="daily-content-item__platform">{{ p.platformName || p.platform_name || findPlatformName(p.platformId || p.platform_id) }}</div>
                <el-popover placement="top" width="520" trigger="hover">
                  <div class="daily-markdown-preview">
                    <mavon-editor
                      :value="p.content || ''"
                      :externalLink="mavonExternalLink"
                      :toolbarsFlag="false"
                      :subfield="false"
                      defaultOpen="preview"
                      :editable="false"
                      :navigation="false"
                      :boxShadow="false" />
                  </div>
                  <div slot="reference" class="daily-content-brief">{{ truncateText(p.content, 200) }}</div>
                </el-popover>
              </div>
            </div>
          </template>
          <!-- 操作列 -->
          <template slot="action" slot-scope="{row}">
            <div class="daily-action-group">
              <el-button
                v-if="canOperate"
                class="daily-btn daily-btn--primary is-mini"
                icon="el-icon-edit"
                size="mini"
                type="primary"
                @click="openEdit(row)">编辑
              </el-button>
              <el-popconfirm
                class="ele-action"
                title="确定要删除此信息吗？"
                @confirm="remove(row)">
                <el-button
                  v-if="canOperate"
                  slot="reference"
                  class="daily-btn daily-btn--danger is-mini"
                  icon="el-icon-delete"
                  size="mini"
                  type="danger">删除
                </el-button>
              </el-popconfirm>
            </div>
          </template>
        </ele-pro-table>
      </section>
    </el-card>

    <!-- 编辑弹窗 -->
    <work-daily-edit
      :data="current"
      :visible.sync="showEdit"
      :platforms="platforms"
      :findPlatformName="findPlatformName"
      :mavon-external-link="mavonExternalLink"
      @done="reload" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import WorkDailyEdit from "./work-daily-edit.vue";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import mavonLocalAssets from "@/utils/mavon-local-assets";

export default {
  name: "WorkDaily",
  components: { WorkDailyEdit, mavonEditor },
  computed: {
    ...mapGetters(["permission"]),
    canOperate() {
      return (
        !this.permission ||
        this.permission.length === 0 ||
        this.permission.includes("dev:workDaily:view")
      );
    },
  },
  data() {
    return {
      mavonExternalLink: mavonLocalAssets,
      url: "/work-daily/index",
      columns: [
        {
          prop: "id",
          label: "ID",
          width: 60,
          align: "center",
          showOverflowTooltip: true,
          fixed: "left",
        },
        {
          prop: "logDate",
          label: "日期",
          align: "center",
          showOverflowTooltip: true,
          width: 120,
        },
        {
          prop: "content",
          label: "内容",
          align: "left",
          minWidth: 320,
          slot: "content",
        },
        {
          prop: "createTime",
          label: "创建时间",
          align: "center",
          showOverflowTooltip: true,
          minWidth: 160,
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          },
        },
        {
          prop: "updateTime",
          label: "更新时间",
          align: "center",
          showOverflowTooltip: true,
          minWidth: 160,
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          },
        },
        {
          columnKey: "action",
          label: "操作",
          width: 160,
          align: "center",
          resizable: false,
          slot: "action",
          fixed: "right",
        },
      ],
      where: {
        platform_id: null,
        start_date: null,
        end_date: null,
        content: "",
      },
      dateRange: [],
      platforms: [],
      current: null,
      showEdit: false,
      reportType: "month",
      reportModel: "",
      reportModelOptions: [],
      reportModelLoading: false,
      reportMonth: null,
      reportRange: [],
      reportYear: null,
      importYear: new Date(),
    };
  },
  created() {
    this.fetchPlatforms();
    this.fetchReportModels();
  },
  methods: {
    reload() {
      this.where.start_date =
        this.dateRange && this.dateRange.length
          ? this.formatDate(this.dateRange[0])
          : null;
      this.where.end_date =
        this.dateRange && this.dateRange.length
          ? this.formatDate(this.dateRange[1])
          : null;
      this.$refs.table.reload({ where: this.where });
    },
    reset() {
      this.where = { platform_id: null, start_date: null, end_date: null, content: "" };
      this.dateRange = [];
      this.reload();
    },
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    remove(row) {
      const loading = this.$loading({ lock: true });
      this.$http
        .delete(`/work-daily/${row.id}`)
        .then((res) => {
          loading.close();
          if (res.data.code === 0) {
            this.$message.success(res.data.msg);
            this.reload();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((e) => {
          loading.close();
          this.$message.error(e.message);
        });
    },
    fetchPlatforms() {
      this.$http
        .get("/work-platform/list", { params: { status: 1 } })
        .then((res) => {
          if (res.data.code === 0) {
            this.platforms = res.data.data || [];
          } else {
            this.platforms = [];
          }
        })
        .catch(() => {
          this.platforms = [];
        });
    },
    fetchReportModels() {
      this.reportModelLoading = true;
      this.$http
        .get("/work-daily/report/models")
        .then((res) => {
          this.reportModelLoading = false;
          if (res.data.code === 0 && res.data.data) {
            this.reportModelOptions = res.data.data.models || [];
            this.reportModel = res.data.data.currentModel || "";
          } else {
            this.reportModelOptions = [];
            this.reportModel = "";
          }
        })
        .catch(() => {
          this.reportModelLoading = false;
          this.reportModelOptions = [];
          this.reportModel = "";
        });
    },
    findPlatformName(id) {
      const targetId = Number(id);
      const p = this.platforms.find((x) => Number(x.id) === targetId);
      return p ? p.name : "";
    },
    getRowPlatforms(row) {
      const content = row && row.content ? row.content : null;

      if (content && Array.isArray(content.platforms)) {
        return content.platforms;
      }
      if (Array.isArray(content)) {
        return content;
      }
      return [];
    },
    truncateText(md, len) {
      const plain = (md || "")
        .replace(/[#>*_`~[\]()!-]/g, " ")
        .replace(/\n+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (plain.length <= len) {
        return plain;
      }
      return plain.slice(0, len) + "...";
    },
    exportReport() {
      if (this.reportType === "month") {
        if (!this.reportMonth) {
          this.$message.error("请选择月份");
          return;
        }
        const month = this.formatMonth(this.reportMonth);
        const params = { month };
        if (this.reportModel) {
          params.model = this.reportModel;
        }
        this.downloadReport(
          "/work-daily/report/month",
          params,
          `牛马日常月报-${month}.md`
        );
        return;
      }
      if (this.reportType === "week") {
        if (!this.reportRange || this.reportRange.length < 2) {
          this.$message.error("请选择日期范围");
          return;
        }
        const start = this.formatDate(this.reportRange[0]);
        const end = this.formatDate(this.reportRange[1]);
        const params = { start_date: start, end_date: end };
        if (this.reportModel) {
          params.model = this.reportModel;
        }
        this.downloadReport(
          "/work-daily/report/week",
          params,
          `牛马日常周报-${start}-${end}.md`
        );
        return;
      }
      if (this.reportType === "year") {
        if (!this.reportYear) {
          this.$message.error("请选择年份");
          return;
        }
        const year = this.formatYear(this.reportYear);
        const params = { year };
        if (this.reportModel) {
          params.model = this.reportModel;
        }
        this.downloadReport(
          "/work-daily/report/year",
          params,
          `牛马日常年报-${year}.md`
        );
      }
    },
    handleImport(request) {
      const formData = new FormData();
      formData.append("file", request.file);
      if (this.importYear) {
        formData.append("year", this.formatYear(this.importYear));
      }
      this.$http
        .post("/work-daily/import", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.success(`导入成功，共 ${res.data.data.count || 0} 条`);
            this.reload();
            request.onSuccess && request.onSuccess(res.data);
          } else {
            this.$message.error(res.data.msg || "导入失败");
            request.onError && request.onError(res.data);
          }
        })
        .catch((e) => {
          this.$message.error(e.message || "导入失败");
          request.onError && request.onError(e);
        });
    },
    downloadReport(url, params, filename) {
      this.$http
        .get(url, { params, responseType: "blob" })
        .then((res) => {
          const blob = new Blob([res.data], {
            type: "text/markdown;charset=utf-8",
          });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = filename;
          link.click();
          window.URL.revokeObjectURL(link.href);
        })
        .catch((e) => {
          this.$message.error(e.message || "导出失败");
        });
    },
    formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      const y = d.getFullYear();
      const m = (d.getMonth() + 1).toString().padStart(2, "0");
      const day = d.getDate().toString().padStart(2, "0");
      return `${y}-${m}-${day}`;
    },
    formatMonth(date) {
      if (!date) return "";
      const d = new Date(date);
      const y = d.getFullYear();
      const m = (d.getMonth() + 1).toString().padStart(2, "0");
      return `${y}-${m}`;
    },
    formatYear(date) {
      if (!date) return "";
      const d = new Date(date);
      return `${d.getFullYear()}`;
    },
  },
};
</script>

<style scoped>
.daily-toolbar-grid {
  display: grid;
  gap: 22px;
  margin-bottom: 24px;
}

.daily-panel {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(104, 186, 255, 0.22);
  border-radius: 24px;
  padding: 22px 22px 10px;
  background:
    radial-gradient(circle at top right, rgba(52, 157, 255, 0.16), transparent 32%),
    linear-gradient(180deg, rgba(16, 27, 41, 0.92) 0%, rgba(11, 20, 32, 0.9) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 18px 38px rgba(2, 9, 19, 0.34),
    0 0 0 1px rgba(55, 168, 255, 0.04),
    0 0 28px rgba(29, 148, 255, 0.18);
}

.daily-panel--accent {
  background:
    radial-gradient(circle at top right, rgba(43, 167, 255, 0.26), transparent 28%),
    radial-gradient(circle at bottom left, rgba(53, 232, 220, 0.1), transparent 26%),
    linear-gradient(180deg, rgba(18, 32, 48, 0.95) 0%, rgba(12, 24, 38, 0.92) 100%);
}

.daily-panel__head {
  margin-bottom: 14px;
}

.daily-panel__title {
  color: #eef7ff;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.daily-panel__desc {
  color: rgba(185, 212, 239, 0.76);
  font-size: 12px;
  line-height: 1.6;
  margin-top: 4px;
}

.daily-form {
  margin-bottom: 0;
}

.daily-form__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-end;
  align-items: center;
  min-height: 42px;
}

.daily-form ::v-deep .el-form-item {
  margin-bottom: 16px;
}

.daily-form--inline ::v-deep .daily-form__row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}

.daily-form--inline ::v-deep .daily-form__col {
  float: none;
}

.daily-form--inline ::v-deep .daily-form__col--platform {
  flex: 0.9 1 220px;
  max-width: 260px;
}

.daily-form--inline ::v-deep .daily-form__col--range {
  flex: 1.3 1 360px;
  min-width: 300px;
}

.daily-form--inline ::v-deep .daily-form__col--search {
  flex: 1.15 1 320px;
  min-width: 260px;
}

.daily-form--inline ::v-deep .daily-form__col--report-type {
  flex: 0 0 190px;
  max-width: 190px;
}

.daily-form--inline ::v-deep .daily-form__col--report-model {
  flex: 1.35 1 420px;
  min-width: 360px;
  max-width: 520px;
}

.daily-form--inline ::v-deep .daily-form__col--report-period {
  flex: 0 0 158px;
  max-width: 158px;
}

.daily-form--inline ::v-deep .daily-form__col--report-period-wide {
  flex: 1 1 260px;
  max-width: 300px;
}

.daily-form--inline ::v-deep .daily-form__col--report-import {
  flex: 0 0 142px;
  max-width: 142px;
}

.daily-form--inline ::v-deep .daily-form__col--report-actions {
  flex: 0 0 auto;
  margin-left: auto;
}

.daily-form--report ::v-deep .el-form-item {
  display: flex;
  align-items: center;
}

.daily-form--report ::v-deep .el-form-item__label {
  width: auto !important;
  padding: 0 10px 0 0;
  line-height: 42px;
  white-space: nowrap;
}

.daily-form--report ::v-deep .el-form-item__content {
  flex: 1;
  min-width: 0;
  margin-left: 0 !important;
}

.daily-form--report ::v-deep .daily-form__actions {
  gap: 6px;
}

.daily-form__actions--report {
  flex-wrap: nowrap;
  justify-content: flex-end;
  gap: 12px;
  min-height: 42px;
}

.daily-form__actions--report ::v-deep .el-upload {
  display: inline-flex;
}

.daily-form--report ::v-deep .el-button {
  padding-left: 12px;
  padding-right: 12px;
}

.daily-form ::v-deep .el-form-item__label {
  color: rgba(226, 240, 255, 0.88);
  font-weight: 600;
}

.daily-form ::v-deep .el-input__inner,
.daily-form ::v-deep .el-range-editor.el-input__inner,
.daily-form ::v-deep .el-date-editor.el-input__inner {
  border-radius: 14px;
  min-height: 42px;
  background: rgba(8, 15, 26, 0.7);
  border: 1px solid rgba(97, 160, 224, 0.2);
  color: #eef6ff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.daily-form ::v-deep .el-button {
  border-radius: 14px;
}

.daily-form ::v-deep .el-input__inner::placeholder {
  color: rgba(152, 181, 214, 0.56);
}

.daily-form ::v-deep .el-range-editor .el-range-input,
.daily-form ::v-deep .el-date-editor .el-range-separator,
.daily-form ::v-deep .el-input__icon,
.daily-form ::v-deep .el-range__icon,
.daily-form ::v-deep .el-range__close-icon {
  color: rgba(178, 210, 240, 0.7);
}

.daily-page-card {
  border: 1px solid rgba(87, 157, 219, 0.2);
  border-radius: 28px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(10, 18, 30, 0.8) 0%, rgba(8, 14, 24, 0.82) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 26px 48px rgba(3, 8, 19, 0.3);
}

.daily-page-card ::v-deep .el-card__body {
  padding: 24px;
}

.daily-table-shell {
  position: relative;
  margin-top: 6px;
  border: 1px solid rgba(87, 175, 255, 0.32);
  border-radius: 28px;
  padding: 18px;
  background:
    radial-gradient(circle at top right, rgba(44, 152, 255, 0.2), transparent 28%),
    linear-gradient(180deg, rgba(16, 28, 42, 0.94) 0%, rgba(11, 20, 32, 0.96) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 0 0 1px rgba(66, 181, 255, 0.05),
    0 0 32px rgba(28, 146, 255, 0.28),
    0 24px 44px rgba(2, 9, 19, 0.28);
}

.daily-table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.daily-table-toolbar__left,
.daily-table-toolbar__right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.daily-table-toolbar__icon {
  width: 34px;
  height: 34px;
  padding: 0;
  border: 1px solid rgba(102, 164, 226, 0.2);
  background: rgba(10, 18, 29, 0.72);
  color: rgba(214, 232, 249, 0.92);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.daily-table {
  background: transparent;
}

.daily-table ::v-deep .ele-pro-table {
  background: transparent;
}

.daily-table ::v-deep .ele-pro-table-main {
  background: transparent;
}

.daily-table ::v-deep .el-table,
.daily-table ::v-deep .el-table__expanded-cell,
.daily-table ::v-deep .el-table tr,
.daily-table ::v-deep .el-table th,
.daily-table ::v-deep .el-table td {
  background: transparent;
}

.daily-table ::v-deep .el-table::before {
  display: none;
}

.daily-table ::v-deep .el-table th.is-leaf,
.daily-table ::v-deep .el-table td {
  border-bottom: 1px solid rgba(82, 132, 188, 0.12);
}

.daily-table ::v-deep .el-table th > .cell {
  color: rgba(232, 244, 255, 0.92);
  font-size: 14px;
  font-weight: 700;
}

.daily-table ::v-deep .el-table thead tr {
  background: rgba(21, 33, 48, 0.9);
}

.daily-table ::v-deep .el-table thead th {
  height: 44px;
  background: rgba(21, 33, 48, 0.86);
}

.daily-table ::v-deep .el-table tbody tr {
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.daily-table ::v-deep .el-table tbody tr:hover > td {
  background: rgba(30, 54, 79, 0.68) !important;
}

.daily-table ::v-deep .el-table tbody tr.current-row > td,
.daily-table ::v-deep .el-table tbody tr:first-child > td {
  background: rgba(42, 74, 110, 0.58);
  box-shadow: inset 0 1px 0 rgba(113, 196, 255, 0.18), inset 0 -1px 0 rgba(113, 196, 255, 0.18);
}

.daily-table ::v-deep .el-table .cell {
  color: rgba(229, 241, 255, 0.88);
}

.daily-content-list {
  display: grid;
  gap: 10px;
}

.daily-content-item {
  display: grid;
  gap: 6px;
}

.daily-content-item__platform {
  color: #f0f7ff;
  font-size: 14px;
  font-weight: 700;
}

.daily-action-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.daily-btn {
  border: none;
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.daily-btn.is-mini {
  min-width: 72px;
}

.daily-btn--primary {
  background: linear-gradient(135deg, #0ea5ff 0%, #1468ff 100%);
  box-shadow:
    0 10px 22px rgba(12, 124, 255, 0.26),
    0 0 18px rgba(13, 158, 255, 0.22);
}

.daily-btn--danger {
  background: linear-gradient(135deg, rgba(255, 120, 146, 0.28) 0%, rgba(170, 38, 76, 0.42) 100%);
  color: #ffd7df;
  box-shadow: 0 8px 18px rgba(180, 46, 84, 0.18);
}

.text-ellipsis {
  display: inline-block;
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.daily-content-brief {
  max-width: 420px;
  color: rgba(210, 227, 244, 0.82);
  font-size: 13px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.daily-markdown-preview {
  max-height: 400px;
  overflow: auto;
}

.daily-markdown-preview ::v-deep .v-note-wrapper {
  min-height: auto;
  box-shadow: none !important;
  background: rgba(9, 15, 26, 0.92);
  border: 1px solid rgba(95, 153, 214, 0.18);
}

.daily-markdown-preview ::v-deep .v-note-op {
  display: none !important;
}

.daily-markdown-preview ::v-deep .v-note-panel {
  min-height: auto;
}

.daily-markdown-preview ::v-deep .v-show-content {
  min-height: auto;
  padding: 12px 14px;
  background: rgba(9, 15, 26, 0.94);
  color: rgba(230, 242, 255, 0.9);
}

.daily-markdown-preview ::v-deep .v-show-content,
.daily-markdown-preview ::v-deep .v-show-content p,
.daily-markdown-preview ::v-deep .v-show-content li,
.daily-markdown-preview ::v-deep .v-show-content blockquote,
.daily-markdown-preview ::v-deep .v-show-content span {
  color: inherit;
}

.daily-table ::v-deep .el-pagination {
  color: rgba(221, 237, 252, 0.82);
}

.daily-table ::v-deep .btn-prev,
.daily-table ::v-deep .btn-next,
.daily-table ::v-deep .el-pager li {
  border-radius: 10px;
  background: rgba(11, 20, 32, 0.78);
  color: rgba(215, 233, 251, 0.8);
}

.daily-table ::v-deep .el-pager li.active {
  background: linear-gradient(135deg, #0ea5ff 0%, #1468ff 100%);
  color: #ffffff;
}

@media (max-width: 991px) {
  .daily-page-card ::v-deep .el-card__body {
    padding: 18px;
  }

  .daily-panel {
    padding: 18px 18px 8px;
  }

  .daily-table-shell {
    padding: 14px;
  }

  .daily-table-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .daily-table-toolbar__left,
  .daily-table-toolbar__right {
    justify-content: space-between;
  }
}

@media (max-width: 1366px) {
  .daily-form--inline ::v-deep .daily-form__actions {
    justify-content: flex-start;
  }

  .daily-form--inline ::v-deep .daily-form__col--report-model {
    min-width: 300px;
  }

  .daily-form--inline ::v-deep .daily-form__col--report-actions {
    flex-basis: 100%;
    margin-left: 0;
  }

  .daily-form__actions--report {
    justify-content: flex-start;
  }
}
</style>
