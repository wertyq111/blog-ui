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
            <el-form-item label="职级名称:">
              <el-input
                v-model="where.name"
                clearable
                placeholder="请输入职级名称"/>
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
        :selection.sync="selection"
        :where="where"
        height="calc(100vh - 315px)">
        <!-- 表头工具栏 -->
        <template slot="toolbar">
          <el-button
            v-if="permission.includes('sys:level:add')"
            class="ele-btn-icon"
            icon="el-icon-plus"
            size="small"
            type="primary"
            @click="openEdit(null)">添加
          </el-button>
          <el-button
            v-if="permission.includes('sys:level:dall')"
            class="ele-btn-icon"
            icon="el-icon-delete"
            size="small"
            type="danger"
            @click="removeBatch">删除
          </el-button>
          <el-button
            class="ele-btn-icon"
            icon="el-icon-upload2"
            size="small"
            @click="showImport=true">导入
          </el-button>
          <el-button
            v-if="permission.includes('sys:level:export')"
            class="ele-btn-icon"
            icon="el-icon-download"
            size="small"
            type="success"
            @click="exportExcel">导出
          </el-button>
        </template>
        <!-- 操作列 -->
        <template slot="action" slot-scope="{row}">
          <el-link
            v-if="permission.includes('sys:level:edit')"
            :underline="false"
            icon="el-icon-edit"
            type="primary"
            @click="openEdit(row)">修改
          </el-link>
          <el-popconfirm
            class="ele-action"
            title="确定要删除此职级吗？"
            @confirm="remove(row)">
            <el-link
              v-if="permission.includes('sys:level:delete')"
              slot="reference"
              :underline="false"
              icon="el-icon-delete"
              type="danger">删除
            </el-link>
          </el-popconfirm>
        </template>
        <!-- 状态列 -->
        <template slot="status" slot-scope="{row}">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="2"
            @change="editStatus(row)"/>
        </template>
      </ele-pro-table>
    </el-card>
    <!-- 编辑弹窗 -->
    <level-edit
      :data="current"
      :visible.sync="showEdit"
      @done="reload"/>
    <!-- 导入弹窗 -->
    <level-import
      :visible.sync="showImport"
      @done="reload"/>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import LevelEdit from './level-edit.vue';
import LevelImport from './level-import.vue';

export default {
  name: 'SystemLevel',
  components: {LevelEdit, LevelImport},
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/level/index',
      // 表格列配置
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          fixed: "left"
        },
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
          label: '职级名称',
          showOverflowTooltip: true,
          minWidth: 200,
          align: 'center',
        },
        {
          prop: 'status',
          label: '职级状态',
          sortable: 'custom',
          align: 'center',
          width: 150,
          resizable: false,
          slot: 'status',
        },
        {
          prop: 'sort',
          label: '排序号',
          align: 'center',
          showOverflowTooltip: true,
          width: 100
        },
        {
          prop: 'createTime',
          label: '创建时间',
          sortable: 'custom',
          showOverflowTooltip: true,
          minWidth: 160,
          align: 'center',
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          prop: 'updateTime',
          label: '更新时间',
          sortable: 'custom',
          showOverflowTooltip: true,
          minWidth: 160,
          align: 'center',
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          columnKey: 'action',
          label: '操作',
          width: 150,
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
      // 是否显示导入弹窗
      showImport: false
    };
  },
  methods: {
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
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    /* 删除 */
    remove(row) {
      const loading = this.$loading({lock: true});
      this.$http.post('/level/delete', {id: row.id}).then(res => {
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
    /* 批量删除 */
    removeBatch() {
      if (!this.selection.length) {
        this.$message.error('请至少选择一条数据');
        return;
      }
      this.$confirm('确定要删除选中的职级吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({lock: true});
        this.$http.post('/level/delete', {id: this.selection.map(d => d.id)}).then(res => {
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
      }).catch(() => {
      });
    },
    /* 更改状态 */
    editStatus(row) {
      const loading = this.$loading({lock: true});
      let params = Object.assign({
        "id": row.id,
        "status": row.status
      })
      this.$http.post('/level/status', params).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
        } else {
          row.status = !row.status ? 1 : 2;
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message);
      });
    },
    /* 导出数据Excel */
    exportExcel() {
      let info = JSON.parse(JSON.stringify(this.where));
      this.$http
        .get("/level/exportExcel", info)
        .then((res) => {
          let data = res.data;
          if (data.code == 0) {
            // 下载文件
            window.location.href = data.data;
            this.$message({
              type: "success",
              message: "导出成功",
            });
          } else {
            this.$message.error("导出失败");
          }
        })
    },
  }
}
</script>

<style scoped>
</style>
