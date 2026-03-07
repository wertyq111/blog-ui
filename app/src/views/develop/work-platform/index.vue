<template>
  <div class="ele-body">
    <el-card shadow="never">
      <el-table-draggable :animate="300" handle=".drag-handle" @drop="handleSort">
        <ele-pro-table
          ref="table"
          :columns="columns"
          :datasource="localList"
          height="calc(100vh - 315px)">
          <template slot="toolbar">
            <el-button
              v-if="canOperate"
              class="ele-btn-icon"
              icon="el-icon-plus"
              size="small"
              type="primary"
              @click="openEdit(null)">添加
            </el-button>
            <el-button v-if="canOperate && orderChanged" size="small" type="warning" @click="undoOrder">撤销</el-button>
            <el-button v-if="canOperate && orderChanged" size="small" type="primary" @click="saveOrder" :loading="saving">保存排序</el-button>
          </template>

          <template slot="handle" slot-scope="{row}">
            <i class="el-icon-rank drag-handle" style="cursor:move;margin-left:6px"/>
          </template>

          <template slot="status" slot-scope="{row}">
            <el-tag :type="Number(row.status) === 0 ? 'danger' : 'success'" size="mini">
              {{ Number(row.status) === 0 ? '禁用' : '启用' }}
            </el-tag>
          </template>

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
      </el-table-draggable>
    </el-card>

    <work-platform-edit
      :data="current"
      :visible.sync="showEdit"
      @done="reload"/>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import ElTableDraggable from '@/components/ElTableDraggable.vue';
import WorkPlatformEdit from './work-platform-edit.vue';

export default {
  name: 'WorkPlatformDraggable',
  components: {WorkPlatformEdit, ElTableDraggable},
  computed: {
    ...mapGetters(["permission"]),
    canOperate() {
      return !this.permission || this.permission.length === 0 || this.permission.includes('dev:workPlatform:view');
    }
  },
  data() {
    return {
      url: '/work-platform/index',
      columns: [
        { prop: 'handle', label: '', width: 48, slot: 'handle', fixed: "left" },
        { prop: 'id', label: 'ID', width: 60, align: 'center', showOverflowTooltip: true, fixed: "left" },
        { prop: 'name', label: '平台名称', align: 'center', showOverflowTooltip: true, minWidth: 160 },
        { prop: 'sort', label: '排序', align: 'center', showOverflowTooltip: true, width: 80 },
        { prop: 'status', label: '状态', align: 'center', width: 80, slot: 'status' },
        { prop: 'createTime', label: '创建时间', align: 'center', showOverflowTooltip: true, minWidth: 160, formatter: (row, column, cellValue) => { return this.$util.toDateString(cellValue); } },
        { prop: 'updateTime', label: '更新时间', align: 'center', showOverflowTooltip: true, minWidth: 160, formatter: (row, column, cellValue) => { return this.$util.toDateString(cellValue); } },
        { columnKey: 'action', label: '操作', width: 160, align: 'center', resizable: false, slot: 'action', fixed: "right" }
      ],
      where: {},
      current: null,
      showEdit: false,
      list: [],
      localList: [],
      originalList: [],
      orderChanged: false,
      saving: false,
      page: 1,
      limit: 10,
      total: 0
    };
  },
  mounted() {
    this.loadList();
  },

  methods: {
    async loadList(page = 1, limit = 10) {
      try {
        console.log("cccc");
        const res = await this.$http.get('/work-platform/index', { params: { page, limit } });
        console.log(res)
        // 支持 BaseResource collection 格式：res.data.data.data 或 res.data.data
        const respData = res.data && res.data.data;
        let items = [];
        if (respData) {
          // 当 resource 返回 collection 时，items 可能在 respData.data
          if (Array.isArray(respData.data)) {
            items = respData.data;
            this.pagination = { page: respData.current_page || page, limit: respData.per_page || limit, total: respData.total || items.length };
          } else if (Array.isArray(respData)) {
            items = respData;
          } else if (Array.isArray(res.data)) {
            items = res.data;
          }
        }

        this.localList = items;
        this.originalList = JSON.parse(JSON.stringify(this.localList));
        this.orderChanged = false;
      } catch (e) {
        this.$message.error(e.message || '加载失败');
      }
    },

    reload() {
      this.loadList(this.page, this.limit);
    },
    reset() {
      this.where = {};
      this.page = 1;
      this.reload();
    },
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    remove(row) {
      const loading = this.$loading({lock: true});
      this.$http.delete(`/work-platform/${row.id}`).then(res => {
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
    handleSort(evt) {
      if (!evt) return;
      const { oldIndex, newIndex } = evt;
      if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) return;
      const moved = this.localList.splice(oldIndex, 1)[0];
      if (moved) {
        this.localList.splice(newIndex, 0, moved);
        this.orderChanged = true;
      }
    },
    undoOrder() {
      this.localList = JSON.parse(JSON.stringify(this.originalList));
      this.orderChanged = false;
    },
    async saveOrder() {
      if (!this.orderChanged) return;
      this.saving = true;
      const payload = this.localList.map((item, idx) => ({ id: item.id, sort: (idx + 1) * 10 }));
      try {
        const res = await this.$http.post('/work-platform/reorder', { order: payload });
        if (res.data.code === 0) {
          this.$message.success('排序已保存');
          this.orderChanged = false;
          this.loadList();
        } else {
          this.$message.error(res.data.msg || '保存失败');
        }
      } catch (e) {
        this.$message.error(e.message || '请求失败');
      } finally {
        this.saving = false;
      }
    }
  }
}
</script>

<style scoped>
</style>
