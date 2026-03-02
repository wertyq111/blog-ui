<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form
        :model="where"
        class="ele-form-search"
        label-width="77px"
        @keyup.enter.native="reload"
        @submit.native.prevent>
        <el-row :gutter="15">
          <el-col :lg="6" :md="12">
            <el-form-item label="平台:">
              <el-select v-model="where.platform_id" clearable placeholder="请选择平台">
                <el-option v-for="item in platforms" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12">
            <el-form-item label="日期范围:">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%"/>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <div class="ele-form-actions">
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

      <!-- 报表导出 -->
      <el-form class="ele-form-search" label-width="77px">
        <el-row :gutter="15">
          <el-col :lg="6" :md="12">
            <el-form-item label="报表类型:">
              <el-select v-model="reportType" placeholder="请选择报表类型" style="width: 100%">
                <el-option label="月报" value="month"/>
                <el-option label="周报" value="week"/>
                <el-option label="年报" value="year"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="reportType==='month'" :lg="6" :md="12">
            <el-form-item label="月份:">
              <el-date-picker v-model="reportMonth" type="month" placeholder="选择月份" style="width: 100%"/>
            </el-form-item>
          </el-col>
          <el-col v-if="reportType==='week'" :lg="8" :md="12">
            <el-form-item label="日期范围:">
              <el-date-picker v-model="reportRange" type="daterange" range-separator="至"
                              start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%"/>
            </el-form-item>
          </el-col>
          <el-col v-if="reportType==='year'" :lg="6" :md="12">
            <el-form-item label="年份:">
              <el-date-picker v-model="reportYear" type="year" placeholder="选择年份" style="width: 100%"/>
            </el-form-item>
          </el-col>
          <el-col :lg="2" :md="4">
            <el-button type="success" class="ele-btn-icon" icon="el-icon-download" @click="exportReport">导出</el-button>
          </el-col>
          <el-col :lg="4" :md="8">
            <el-form-item label="导入年份:">
              <el-date-picker v-model="importYear" type="year" placeholder="选择年份" style="width: 100%"/>
            </el-form-item>
          </el-col>
          <el-col :lg="4" :md="8">
            <el-upload
              :show-file-list="false"
              :http-request="handleImport"
              accept=".md,.markdown">
              <el-button type="primary" class="ele-btn-icon" icon="el-icon-upload2">导入Markdown</el-button>
            </el-upload>
          </el-col>
        </el-row>
      </el-form>

      <!-- 数据表格 -->
      <ele-pro-table
        ref="table"
        :columns="columns"
        :datasource="url"
        :where="where"
        height="calc(100vh - 420px)">
        <!-- 表头工具栏 -->
        <template slot="toolbar">
          <el-button
            v-if="canOperate"
            class="ele-btn-icon"
            icon="el-icon-plus"
            size="small"
            type="primary"
            @click="openEdit(null)">添加
          </el-button>
        </template>
        <!-- 内容列（按平台展示，每个平台标题 + HTML 截断预览，鼠标悬停显示完整） -->
        <template slot="content" slot-scope="{row}">
          <div>
            <div v-for="(p, idx) in (row.content && row.content.platforms ? row.content.platforms : [])" :key="idx" style="margin-bottom:8px">
              <div style="font-weight:600">{{ p.platform_name || findPlatformName(p.platform_id) }}</div>
              <el-popover placement="top" width="520" trigger="hover">
                <div style="max-height:400px; overflow:auto" v-html="renderMarkdown(p.content)"></div>
                <div slot="reference" v-html="truncateHtml(p.content, 200)"></div>
              </el-popover>
            </div>
          </div>
        </template>
        <!-- 操作列 -->
        <template slot="action" slot-scope="{row}">
          <el-link
            v-if="canOperate"
            :underline="false"
            icon="el-icon-edit"
            type="primary"
            @click="openEdit(row)">修改
          </el-link>
          <el-popconfirm
            class="ele-action"
            title="确定要删除此信息吗？"
            @confirm="remove(row)">
            <el-link
              v-if="canOperate"
              slot="reference"
              :underline="false"
              icon="el-icon-delete"
              type="danger">删除
            </el-link>
          </el-popconfirm>
        </template>
      </ele-pro-table>
    </el-card>

    <!-- 编辑弹窗 -->
    <work-daily-edit
      :data="current"
      :visible.sync="showEdit"
      :platforms="platforms"
      @done="reload"/>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import WorkDailyEdit from './work-daily-edit.vue';

export default {
  name: 'WorkDaily',
  components: {WorkDailyEdit},
  computed: {
    ...mapGetters(["permission"]),
    canOperate() {
      return !this.permission || this.permission.length === 0 || this.permission.includes('dev:workDaily:view');
    }
  },
  data() {
    return {
      url: '/work-daily/index',
      columns: [
        {
          prop: 'id',
          label: 'ID',
          width: 60,
          align: 'center',
          showOverflowTooltip: true,
          fixed: "left"
        },
        {
          prop: 'logDate',
          label: '日期',
          align: 'center',
          showOverflowTooltip: true,
          width: 120
        },
        {
          prop: 'content',
          label: '内容',
          align: 'left',
          showOverflowTooltip: true,
          minWidth: 320,
          slot: 'content'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 160,
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          prop: 'updateTime',
          label: '更新时间',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 160,
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          columnKey: 'action',
          label: '操作',
          width: 160,
          align: 'center',
          resizable: false,
          slot: 'action',
          fixed: "right"
        }
      ],
      where: {
        platform_id: null,
        start_date: null,
        end_date: null
      },
      dateRange: [],
      platforms: [],
      current: null,
      showEdit: false,
      reportType: 'month',
      reportMonth: null,
      reportRange: [],
      reportYear: null,
      importYear: new Date()
    };
  },
  created() {
    this.fetchPlatforms();
  },
  methods: {
    reload() {
      this.where.start_date = this.dateRange && this.dateRange.length ? this.formatDate(this.dateRange[0]) : null;
      this.where.end_date = this.dateRange && this.dateRange.length ? this.formatDate(this.dateRange[1]) : null;
      this.$refs.table.reload({where: this.where});
    },
    reset() {
      this.where = {platform_id: null, start_date: null, end_date: null};
      this.dateRange = [];
      this.reload();
    },
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    remove(row) {
      const loading = this.$loading({lock: true});
      this.$http.delete(`/work-daily/${row.id}`).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          this.reload();
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message);
      });
    },
    fetchPlatforms() {
      this.$http.get('/work-platform/list', {params: {status: 1}}).then(res => {
        if (res.data.code === 0) {
          this.platforms = res.data.data || [];
        } else {
          this.platforms = [];
        }
      }).catch(() => {
        this.platforms = [];
      });
    },
    findPlatformName(id) {
      const p = this.platforms.find(x => x.id === id);
      return p ? p.name : '';
    },
    // crude markdown -> HTML renderer using existing mavon if available, or simple escape
    renderMarkdown(md) {
      try {
        // mavon editor provides global converter in some setups; fallback to simple replace
        if (window.marked) {
          return window.marked(md || '');
        }
        return (md || '').replace(/\n/g, '<br/>');
      } catch (e) {
        return (md || '').replace(/\n/g, '<br/>');
      }
    },
    truncateHtml(md, len) {
      // convert to plain text then truncate, but return as HTML-escaped text
      const tmp = document.createElement('div');
      tmp.innerHTML = this.renderMarkdown(md || '');
      const text = tmp.textContent || tmp.innerText || '';
      if (text.length <= len) {
        return this.renderMarkdown(md || '');
      }
      const sub = text.slice(0, len) + '...';
      // escape and wrap in <div>
      const esc = sub.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return '<div>' + esc + '</div>';
    },
    exportReport() {
      if (this.reportType === 'month') {
        if (!this.reportMonth) {
          this.$message.error('请选择月份');
          return;
        }
        const month = this.formatMonth(this.reportMonth);
        this.downloadReport('/work-daily/report/month', {month}, `牛马日常月报-${month}.md`);
        return;
      }
      if (this.reportType === 'week') {
        if (!this.reportRange || this.reportRange.length < 2) {
          this.$message.error('请选择日期范围');
          return;
        }
        const start = this.formatDate(this.reportRange[0]);
        const end = this.formatDate(this.reportRange[1]);
        this.downloadReport('/work-daily/report/week', {start_date: start, end_date: end}, `牛马日常周报-${start}-${end}.md`);
        return;
      }
      if (this.reportType === 'year') {
        if (!this.reportYear) {
          this.$message.error('请选择年份');
          return;
        }
        const year = this.formatYear(this.reportYear);
        this.downloadReport('/work-daily/report/year', {year}, `牛马日常年报-${year}.md`);
      }
    },
    handleImport(request) {
      const formData = new FormData();
      formData.append('file', request.file);
      if (this.importYear) {
        formData.append('year', this.formatYear(this.importYear));
      }
      this.$http.post('/work-daily/import', formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      }).then(res => {
        if (res.data.code === 0) {
          this.$message.success(`导入成功，共 ${res.data.data.count || 0} 条`);
          this.reload();
          request.onSuccess && request.onSuccess(res.data);
        } else {
          this.$message.error(res.data.msg || '导入失败');
          request.onError && request.onError(res.data);
        }
      }).catch(e => {
        this.$message.error(e.message || '导入失败');
        request.onError && request.onError(e);
      });
    },
    downloadReport(url, params, filename) {
      this.$http.get(url, {params, responseType: 'blob'}).then(res => {
        const blob = new Blob([res.data], {type: 'text/markdown;charset=utf-8'});
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(link.href);
      }).catch(e => {
        this.$message.error(e.message || '导出失败');
      });
    },
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const y = d.getFullYear();
      const m = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      return `${y}-${m}-${day}`;
    },
    formatMonth(date) {
      if (!date) return '';
      const d = new Date(date);
      const y = d.getFullYear();
      const m = (d.getMonth() + 1).toString().padStart(2, '0');
      return `${y}-${m}`;
    },
    formatYear(date) {
      if (!date) return '';
      const d = new Date(date);
      return `${d.getFullYear()}`;
    }
  }
}
</script>

<style scoped>
  .text-ellipsis {
    display: inline-block;
    max-width: 260px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
