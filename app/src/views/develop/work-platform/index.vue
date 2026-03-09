<template>
  <div class="ele-body">
    <el-card shadow="never" id="table_form">
      <el-form
        :model="where"
        class="ele-form-search"
        label-width="90px"
        @keyup.enter.native="reload"
        @submit.native.prevent>
        <el-row :gutter="15">
          <el-col :lg="6" :md="12">
            <el-form-item label="平台名称:">
              <el-input v-model="where.name" clearable placeholder="请输入平台名称" />
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <el-form-item label="状态:">
              <el-select v-model="where.status" clearable placeholder="全部">
                <el-option label="启用" :value="1" />
                <el-option label="禁用" :value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <div class="ele-form-actions">
              <el-button class="ele-btn-icon" icon="el-icon-search" type="primary" @click="reload">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <div class="ele-card-header">
        <el-button
          v-if="canOperate"
          class="ele-btn-icon"
          icon="el-icon-plus"
          size="small"
          type="primary"
          @click="openEdit(null)">添加
        </el-button>
      </div>

      <el-table-draggable :animate="300" handle=".sort-handle" @drop="handleSort">
        <el-table
          ref="table"
          stripe
          border
          size="mini"
          row-key="id"
          :data="localList"
          height="calc(100vh - 365px)">
          <el-table-column align="center" width="38">
            <i class="sort-handle el-icon-_nav ele-text-placeholder"></i>
          </el-table-column>
          <el-table-column align="center" label="平台名称" prop="name" min-width="160" show-overflow-tooltip/>
          <el-table-column align="center" label="排序" prop="sort" width="80">
            <template slot-scope="{$index, row}">
              {{ syncSort(row, $index) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" prop="status" width="80">
            <template slot-scope="{row}">
              <el-tag :type="Number(row.status) === 0 ? 'danger' : 'success'" size="mini">
                {{ Number(row.status) === 0 ? '禁用' : '启用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="创建时间" prop="createTime" min-width="160">
            <template slot-scope="{row}">
              {{ $util.toDateString(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="更新时间" prop="updateTime" min-width="160">
            <template slot-scope="{row}">
              {{ $util.toDateString(row.updateTime) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="160">
            <template slot-scope="{row}">
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
          </el-table-column>
        </el-table>
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
      where: {
        name: '',
        status: null
      },
      current: null,
      showEdit: false,
      list: [],
      localList: [],
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
        const params = {
          page,
          limit,
          'filter[name]': this.where.name || undefined,
          'filter[status]': this.where.status === null || this.where.status === '' ? undefined : this.where.status
        };
        const res = await this.$http.get('/work-platform/index', { params });
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
      } catch (e) {
        this.$message.error(e.message || '加载失败');
      }
    },

    reload() {
      this.loadList(this.page, this.limit);
    },
    reset() {
      this.where = { name: '', status: null };
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
    /* 更新排序值 */
    syncSort(row, index) {
      row.sort = (index + 1) * 10;
      return row.sort;
    },
    /* 处理排序 */
    handleSort(evt) {
      if (!evt) return;
      const { oldIndex, newIndex } = evt;
      if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) return;
      const moved = this.localList.splice(oldIndex, 1)[0];
      if (moved) {
        this.localList.splice(newIndex, 0, moved);
        this.updateSort();
      }
    },
    updateSort() {
      const loading = this.$loading({target: '#table_form', lock: true});
      const payload = this.localList.map((item, idx) => ({ id: item.id, sort: (idx + 1) * 10 }));
      this.$http.post('/work-platform/reorder', { order: payload }).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message.success('排序已保存');
          this.loadList();
        } else {
          this.$message.error(res.data.msg || '保存失败');
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message || '请求失败');
      });
    }
  }
}
</script>

<style scoped>
</style>
