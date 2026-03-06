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
            <el-form-item label="平台名称:">
              <el-input v-model="where.name" clearable placeholder="请输入平台名称"/>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <el-form-item label="状态:">
              <el-select v-model="where.status" clearable placeholder="请选择状态">
                <el-option label="启用" :value="1"/>
                <el-option label="禁用" :value="0"/>
              </el-select>
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

      <!-- 数据表格 -->
      <ele-pro-table
        ref="table"
        :columns="columns"
        :datasource="url"
        :where="where"
        height="calc(100vh - 315px)">
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
        <!-- 状态列 -->
        <template slot="status" slot-scope="{row}">
          <el-tag :type="Number(row.status) === 0 ? 'danger' : 'success'" size="mini">
            {{ Number(row.status) === 0 ? '禁用' : '启用' }}
          </el-tag>
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
    <work-platform-edit
      :data="current"
      :visible.sync="showEdit"
      @done="reload"/>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import WorkPlatformEdit from './work-platform-edit.vue';

export default {
  name: 'WorkPlatform',
  components: {WorkPlatformEdit},
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
        {
          prop: 'id',
          label: 'ID',
          width: 60,
          align: 'center',
          showOverflowTooltip: true,
          fixed: "left"
        },
        {
          prop: 'name',
          label: '平台名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 160
        },
        {
          prop: 'sort',
          label: '排序',
          align: 'center',
          showOverflowTooltip: true,
          width: 80
        },
        {
          prop: 'status',
          label: '状态',
          align: 'center',
          width: 80,
          slot: 'status'
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
      where: {},
      current: null,
      showEdit: false
    };
  },
  methods: {
    reload() {
      this.$refs.table.reload({where: this.where});
    },
    reset() {
      this.where = {};
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
    }
  }
}
</script>

<style scoped>
</style>
