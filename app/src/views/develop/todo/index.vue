<template>
  <div class="ele-body develop-page admin-workspace-page admin-workspace-page--todo develop-page--todo todo-page">
    <el-card shadow="never" class="develop-shell todo-page-card admin-workspace-shell">
      <section class="develop-hero">
        <div class="develop-hero__copy">
          <div class="develop-hero__eyebrow">Develop Workspace</div>
          <div class="develop-hero__title">待办列表</div>
          <div class="develop-hero__desc">统一管理开发任务与待办事项，支持状态跟踪、优先级管理和平台关联。</div>
        </div>
        <div class="develop-hero__meta">
          <div class="develop-hero__meta-card">
            <span class="develop-hero__meta-label">总计</span>
            <strong>{{ statistics.total }}</strong>
          </div>
          <div class="develop-hero__meta-card todo-meta-card--pending">
            <span class="develop-hero__meta-label">待办</span>
            <strong>{{ statistics.pending }}</strong>
          </div>
          <div class="develop-hero__meta-card todo-meta-card--progress">
            <span class="develop-hero__meta-label">进行中</span>
            <strong>{{ statistics.inProgress }}</strong>
          </div>
          <div class="develop-hero__meta-card todo-meta-card--done">
            <span class="develop-hero__meta-label">已完成</span>
            <strong>{{ statistics.completed }}</strong>
          </div>
        </div>
      </section>

      <div class="todo-toolbar-grid">
        <section class="develop-panel daily-panel">
          <div class="daily-panel__head">
            <div>
              <div class="daily-panel__title">筛选待办</div>
              <div class="daily-panel__desc">按状态、优先级、关键词和截止日期快速定位待办事项。</div>
            </div>
          </div>
          <el-form
            :model="where"
            class="ele-form-search develop-form daily-form daily-form--inline daily-form--filter"
            label-width="77px"
            @keyup.enter.native="reload"
            @submit.native.prevent>
            <el-row :gutter="15" class="daily-form__row">
              <el-col :lg="5" :md="8" class="daily-form__col todo-form__col--status">
                <el-form-item label="状态:">
                  <el-select v-model="where.status" clearable placeholder="全部状态">
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="5" :md="8" class="daily-form__col todo-form__col--priority">
                <el-form-item label="优先级:">
                  <el-select v-model="where.priority" clearable placeholder="全部优先级">
                    <el-option v-for="item in priorityOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="5" :md="8" class="daily-form__col todo-form__col--keyword">
                <el-form-item label="关键词:">
                  <el-input v-model="where.keyword" placeholder="请输入关键字" />
                </el-form-item>
              </el-col>
              <el-col :span="12" :md="12" class="daily-form__col todo-form__col--range">
                <el-form-item class="el-col-24" label="截止日期:">
                  <el-date-picker
                    v-model="dateRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width: 100%" />
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
      </div>

      <!-- 数据表格 -->
      <section class="develop-table-shell daily-table-shell">
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
          <!-- 标题列 -->
          <template slot="title" slot-scope="{ row }">
            <div class="todo-title-cell">
              <span :class="{'todo-title--done': row.status === 2}">{{ row.title }}</span>
              <div v-if="row.tags && row.tags.length" class="todo-tags-inline">
                <el-tag v-for="(tag, idx) in row.tags" :key="idx" size="mini" effect="plain" class="todo-tag">{{ tag }}</el-tag>
              </div>
            </div>
          </template>
          <!-- 状态列 -->
          <template slot="status" slot-scope="{ row }">
            <el-tag :type="statusTagType(row.status)" size="small" effect="dark" class="todo-status-tag">
              {{ statusLabel(row.status) }}
            </el-tag>
          </template>
          <!-- 优先级列 -->
          <template slot="priority" slot-scope="{ row }">
            <el-tag :type="priorityTagType(row.priority)" size="small" effect="dark" class="todo-priority-tag">
              {{ priorityLabel(row.priority) }}
            </el-tag>
          </template>
          <!-- 截止日期列 -->
          <template slot="dueDate" slot-scope="{ row }">
            <span :class="{'todo-overdue': isOverdue(row)}">{{ row.dueDate || '-' }}</span>
          </template>
          <!-- 平台列 -->
          <template slot="platform" slot-scope="{ row }">
            <span>{{ row.platform ? row.platform.name : '-' }}</span>
          </template>
          <!-- 操作列 -->
          <template slot="action" slot-scope="{row}">
            <div class="daily-action-group">
              <el-dropdown v-if="canOperate" trigger="click" size="small" @command="(cmd) => quickStatus(row, cmd)">
                <el-button class="daily-btn daily-btn--primary is-mini" icon="el-icon-switch-button" size="mini" type="primary">状态</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="item in statusOptions" :key="item.value" :command="item.value" :disabled="row.status === item.value">
                    {{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button
                v-if="canOperate"
                class="daily-btn daily-btn--primary is-mini"
                icon="el-icon-edit"
                size="mini"
                type="warning"
                @click="openEdit(row)">编辑
              </el-button>
              <el-popconfirm
                class="ele-action"
                title="确定要删除此待办吗？"
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
    <todo-edit
      :data="current"
      :visible.sync="showEdit"
      :platforms="platforms"
      @done="onEditDone" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TodoEdit from "./todo-edit.vue";

export default {
  name: "TodoIndex",
  components: { TodoEdit },
  computed: {
    ...mapGetters(["permission"]),
    canOperate() {
      return (
        !this.permission ||
        this.permission.length === 0 ||
        this.permission.includes("dev:todo:view")
      );
    },
  },
  data() {
    return {
      url: "/todo/index",
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
          prop: "title",
          label: "标题",
          minWidth: 240,
          slot: "title",
        },
        {
          prop: "status",
          label: "状态",
          width: 100,
          align: "center",
          slot: "status",
        },
        {
          prop: "priority",
          label: "优先级",
          width: 90,
          align: "center",
          slot: "priority",
        },
        {
          prop: "dueDate",
          label: "截止日期",
          width: 120,
          align: "center",
          slot: "dueDate",
        },
        {
          prop: "platform",
          label: "平台",
          width: 120,
          align: "center",
          slot: "platform",
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
          columnKey: "action",
          label: "操作",
          width: 260,
          align: "center",
          resizable: false,
          slot: "action",
          fixed: "right",
        },
      ],
      where: {
        status: null,
        priority: null,
        keyword: "",
        start_date: null,
        end_date: null,
      },
      dateRange: [],
      platforms: [],
      current: null,
      showEdit: false,
      statistics: {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
      },
      statusOptions: [
        { label: "待办", value: 0 },
        { label: "进行中", value: 1 },
        { label: "已完成", value: 2 },
        { label: "已取消", value: 3 },
      ],
      priorityOptions: [
        { label: "低", value: 0 },
        { label: "中", value: 1 },
        { label: "高", value: 2 },
        { label: "紧急", value: 3 },
      ],
    };
  },
  created() {
    this.fetchPlatforms();
    this.fetchStatistics();
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
      this.where = { status: null, priority: null, keyword: "", start_date: null, end_date: null };
      this.dateRange = [];
      this.reload();
    },
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    onEditDone() {
      this.reload();
      this.fetchStatistics();
    },
    remove(row) {
      const loading = this.$loading({ lock: true });
      this.$http
        .delete(`/todo/${row.id}`)
        .then((res) => {
          loading.close();
          if (res.data.code === 0) {
            this.$message.success(res.data.msg || "删除成功");
            this.reload();
            this.fetchStatistics();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((e) => {
          loading.close();
          this.$message.error(e.message);
        });
    },
    quickStatus(row, status) {
      const loading = this.$loading({ lock: true });
      this.$http
        .post(`/todo/status/${row.id}`, { status })
        .then((res) => {
          loading.close();
          if (res.data.code === 0) {
            this.$message.success("状态更新成功");
            this.reload();
            this.fetchStatistics();
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
    fetchStatistics() {
      this.$http
        .get("/todo/statistics")
        .then((res) => {
          if (res.data.code === 0 && res.data.data) {
            this.statistics = res.data.data;
          }
        })
        .catch(() => {});
    },
    statusLabel(val) {
      const item = this.statusOptions.find((o) => o.value === val);
      return item ? item.label : "未知";
    },
    statusTagType(val) {
      const map = { 0: "info", 1: "warning", 2: "success", 3: "danger" };
      return map[val] || "info";
    },
    priorityLabel(val) {
      const item = this.priorityOptions.find((o) => o.value === val);
      return item ? item.label : "未知";
    },
    priorityTagType(val) {
      const map = { 0: "", 1: "info", 2: "warning", 3: "danger" };
      return map[val] || "";
    },
    isOverdue(row) {
      if (!row.dueDate || row.status === 2 || row.status === 3) return false;
      return new Date(row.dueDate) < new Date(new Date().toDateString());
    },
    formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      const y = d.getFullYear();
      const m = (d.getMonth() + 1).toString().padStart(2, "0");
      const day = d.getDate().toString().padStart(2, "0");
      return `${y}-${m}-${day}`;
    },
  },
};
</script>

<style scoped>
.todo-toolbar-grid {
  display: grid;
  gap: 22px;
  margin-bottom: 24px;
}

.todo-meta-card--pending strong { color: #e6a23c; }
.todo-meta-card--progress strong { color: #409eff; }
.todo-meta-card--done strong { color: #67c23a; }

.todo-title-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.todo-title--done {
  text-decoration: line-through;
  opacity: 0.6;
}

.todo-tags-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.todo-tag {
  border-radius: 6px;
}

.todo-status-tag,
.todo-priority-tag {
  border-radius: 8px;
  min-width: 52px;
  text-align: center;
}

.todo-overdue {
  color: #f56c6c;
  font-weight: 600;
}

.daily-panel {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(31, 35, 41, .08);
  border-radius: 14px;
  padding: 22px 22px 10px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
  box-shadow: 0 6px 18px rgba(36, 50, 74, .06);
}

.daily-panel__head {
  margin-bottom: 14px;
}

.daily-panel__title {
  color: #24324a;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.daily-panel__desc {
  color: #728197;
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

.daily-form--inline ::v-deep .todo-form__col--status,
.daily-form--inline ::v-deep .todo-form__col--priority {
  flex: 0 0 180px;
  max-width: 200px;
}

.daily-form--inline ::v-deep .todo-form__col--keyword {
  flex: 1 1 220px;
  max-width: 280px;
}

.daily-form--inline ::v-deep .todo-form__col--range {
  flex: 1.3 1 360px;
  min-width: 300px;
}

.daily-form ::v-deep .el-form-item__label {
  color: #24324a;
  font-weight: 600;
}

.daily-form ::v-deep .el-input__inner,
.daily-form ::v-deep .el-range-editor.el-input__inner,
.daily-form ::v-deep .el-date-editor.el-input__inner {
  border-radius: 10px;
  min-height: 42px;
}

.daily-form ::v-deep .el-button {
  border-radius: 10px;
}

.todo-page-card {
  border: 1px solid rgba(31, 35, 41, .08);
  border-radius: 14px;
  overflow: hidden;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
  box-shadow: 0 8px 24px rgba(36, 50, 74, .06);
}

.todo-page-card ::v-deep .el-card__body {
  padding: 24px;
}

.daily-table-shell {
  position: relative;
  margin-top: 6px;
  border: 1px solid rgba(31, 35, 41, .08);
  border-radius: 14px;
  padding: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
  box-shadow: 0 6px 18px rgba(36, 50, 74, .06);
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
  border: 1px solid rgba(31, 35, 41, .08);
  background: #fff;
  color: #5f6b7a;
  box-shadow: 0 2px 6px rgba(36, 50, 74, .06);
}

.daily-table-toolbar__icon:hover {
  background: #eef4ff;
  border-color: rgba(52, 120, 246, .26);
  color: #3478f6;
}

.daily-action-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.daily-btn {
  border-radius: 10px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.daily-btn.is-mini {
  min-width: 56px;
}

.daily-form ::v-deep .el-range-editor .el-range-input {
  background: transparent;
}

@media (max-width: 991px) {
  .todo-page-card ::v-deep .el-card__body {
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
}
</style>
