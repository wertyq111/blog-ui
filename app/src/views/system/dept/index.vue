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
            <el-form-item label="部门名称:">
              <el-input
                v-model="where.name"
                clearable
                placeholder="请输入部门名称"/>
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
        :need-page="false"
        :parse-data="parseData"
        :where="where"
        default-expand-all
        height="calc(100vh - 270px)"
        row-key="id">
        <!-- 表头工具栏 -->
        <template slot="toolbar">
          <el-button
            v-if="permission.includes('sys:dept:add')"
            class="ele-btn-icon"
            icon="el-icon-plus"
            size="small"
            type="primary"
            @click="openEdit(null)">添加
          </el-button>
          <el-button
            v-if="permission.includes('sys:dept:expand')"
            class="ele-btn-icon"
            size="small"
            @click="expandAll">展开全部
          </el-button>
          <el-button
            v-if="permission.includes('sys:dept:collapse')"
            class="ele-btn-icon"
            size="small"
            @click="foldAll">折叠全部
          </el-button>
        </template>
        <!-- 标题列 -->
        <template slot="name" slot-scope="{row}">
          <i :class="row.icon"></i> {{ row.name }}
        </template>
        <!-- 类型列 -->
        <template slot="type" slot-scope="{row}">
          <el-tag
            :type="['success', 'primary', 'warning', 'info'][row.type-1]"
            size="mini">
            {{ ['公司', '子公司', '部门', '小组'][row.type - 1] }}
          </el-tag>
        </template>
        <!-- 操作列 -->
        <template slot="action" slot-scope="{row}">
          <el-link
            v-if="permission.includes('sys:dept:addz')"
            :underline="false"
            icon="el-icon-plus"
            type="primary"
            @click="openEdit(null, row.id)">添加
          </el-link>
          <el-link
            v-if="permission.includes('sys:dept:edit')"
            :underline="false"
            icon="el-icon-edit"
            type="primary"
            @click="openEdit(row)">修改
          </el-link>
          <el-popconfirm
            class="ele-action"
            title="确定要删除吗？"
            @confirm="remove(row)">
            <el-link
              v-if="permission.includes('sys:dept:delete')"
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
    <dept-edit
      :data="current"
      :dept-list="deptList"
      :visible.sync="showEdit"
      @done="reload"/>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import DeptEdit from './dept-edit.vue';

export default {
  name: 'SystemDept',
  components: {DeptEdit},
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/dept/index',
      // 表格列配置
      columns: [
        {
          columnKey: 'index',
          type: 'index',
          width: 45,
          align: 'center',
          showOverflowTooltip: true,
          fixed: "left"
        },
        {
          prop: 'name',
          label: '部门名称',
          showOverflowTooltip: true,
          minWidth: 200,
          slot: 'name',
          fixed: "left"
        },
        {
          prop: 'code',
          label: '部门编码',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 110
        },
        {
          prop: 'fullname',
          label: '部门全称',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 200
        },
        {
          prop: 'type',
          label: '类型',
          align: 'center',
          showOverflowTooltip: true,
          width: 100,
          slot: 'type'
        },
        {
          prop: 'sort',
          label: '排序',
          align: 'center',
          showOverflowTooltip: true,
          width: 60
        },
        {
          prop: 'note',
          label: '备注',
          align: 'center',
          showOverflowTooltip: true,
          width: 200
        },
        {
          prop: 'createTime',
          label: '创建时间',
          showOverflowTooltip: true,
          minWidth: 160,
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          prop: 'updateTime',
          label: '更新时间',
          showOverflowTooltip: true,
          minWidth: 160,
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          columnKey: 'action',
          label: '操作',
          width: 190,
          align: 'center',
          resizable: false,
          slot: 'action',
          fixed: "right"
        }
      ],
      // 表格搜索条件
      where: {},
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 全部部门数据
      deptList: []
    };
  },
  methods: {
    /* 解析接口返回数据 */
    parseData(res) {
      res.data = this.$util.toTreeData(res.data, 'id', 'pid');
      this.deptList = res.data;
      return res;
    },
    /* 刷新表格 */
    reload() {
      this.$refs.table.reload({where: this.where});
    },
    /* 重置搜索 */
    reset() {
      this.where = {};
      this.reload();
    },
    /* 显示编辑 */
    openEdit(row, parentId) {
      this.current = Object.assign({
        type: 0,
        pid: parentId
      }, row);
      this.showEdit = true;
    },
    /* 删除 */
    remove(row) {
      if (row.children && row.children.length > 0) {
        this.$message.error('请先删除子节点');
        return;
      }
      const loading = this.$loading({lock: true});
      this.$http.post('/dept/delete', {id: row.id}).then(res => {
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
    /* 展开全部 */
    expandAll() {
      this.$refs.table.data.forEach(d => {
        this.$refs.table.toggleRowExpansion(d, true);
      });
    },
    /* 折叠全部 */
    foldAll() {
      this.$refs.table.data.forEach(d => {
        this.$refs.table.toggleRowExpansion(d, false);
      });
    },
  }
}
</script>

<style scoped>
</style>
