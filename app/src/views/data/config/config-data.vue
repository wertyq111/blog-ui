<template>
  <div>
    <!-- 数据表格 -->
    <ele-pro-table
      ref="table"
      :columns="columns"
      :datasource="url"
      :where="where"
      height="calc(100vh - 261px)"
      tool-class="ele-toolbar-form">
      <!-- 表头工具栏 -->
      <template slot="toolbar">
        <el-form
          :model="where"
          class="ele-form-search"
          size="small"
          @keyup.enter.native="reload"
          @submit.native.prevent>
          <el-row :gutter="10">
            <el-col :md="8">
              <el-form-item>
                <el-input
                  v-model="where.name"
                  clearable
                  placeholder="请输入配置项名称"
                  size="small"/>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item>
                <el-input
                  v-model="where.code"
                  clearable
                  placeholder="请输入配置项值"
                  size="small"/>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item>
                <el-button
                  class="ele-btn-icon"
                  icon="el-icon-search"
                  size="small"
                  type="primary"
                  @click="reload">查询
                </el-button>
                <el-button
                  v-if="permission.includes('sys:config:add')"
                  class="ele-btn-icon"
                  icon="el-icon-plus"
                  size="small"
                  type="primary"
                  @click="openEdit(null)">添加
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <!-- 操作列 -->
      <template slot="action" slot-scope="{row}">
        <el-link
          v-if="permission.includes('sys:config:edit')"
          :underline="false"
          icon="el-icon-edit"
          type="primary"
          @click="openEdit(row)">修改
        </el-link>
        <el-popconfirm
          class="ele-action"
          title="确定要删除此配置项吗？"
          @confirm="remove(row)">
          <el-link
            v-if="permission.includes('sys:config:delete')"
            slot="reference"
            :underline="false"
            icon="el-icon-delete"
            type="danger">删除
          </el-link>
        </el-popconfirm>
      </template>
      <!-- 配置类型列 -->
      <template slot="type" slot-scope="{row}">
        <el-tag v-if="row.type === 'readonly'" size="small" type="">只读文本</el-tag>
        <el-tag v-if="row.type === 'number'" size="small" type="success">数字</el-tag>
        <el-tag v-if="row.type === 'text'" size="small" type="success">单行文本</el-tag>
        <el-tag v-if="row.type === 'textarea'" size="small" type="warning">多行文本</el-tag>
        <el-tag v-if="row.type === 'array'" size="small" type="danger">数组</el-tag>
        <el-tag v-if="row.type === 'password'" size="small" type="">密码</el-tag>
        <el-tag v-if="row.type === 'radio'" size="small" type="success">单选框</el-tag>
        <el-tag v-if="row.type === 'checkbox'" size="small" type="info">复选框</el-tag>
        <el-tag v-if="row.type === 'select'" size="small" type="warning">下拉框</el-tag>
        <el-tag v-if="row.type === 'icon'" size="small" type="danger">字体图标</el-tag>
        <el-tag v-if="row.type === 'date'" size="small" type="">日期</el-tag>
        <el-tag v-if="row.type === 'datetime'" size="small" type="success">时间</el-tag>
        <el-tag v-if="row.type === 'image'" size="small" type="info">单张图片</el-tag>
        <el-tag v-if="row.type === 'images'" size="small" type="">多张图片</el-tag>
        <el-tag v-if="row.type === 'file'" size="small" type="success">单个文件</el-tag>
        <el-tag v-if="row.type === 'files'" size="small" type="warning">多个文件</el-tag>
        <el-tag v-if="row.type === 'ueditor'" size="small" type="danger">富文本编辑器</el-tag>
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
    <!-- 编辑弹窗 -->
    <config-data-edit
      :config-id="configId"
      :data="current"
      :visible.sync="showEdit"
      @done="reload"/>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import ConfigDataEdit from './config-data-edit.vue';

export default {
  name: 'ConfigData',
  components: {ConfigDataEdit},
  computed: {
    ...mapGetters(["permission"]),
  },
  props: {
    // 配置id
    configId: Number
  },
  data() {
    return {
      // 表格数据接口
      url: '/configdata/index',
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
          prop: 'title',
          label: '配置项标题',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
        },
        {
          prop: 'code',
          label: '配置编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'type',
          label: '配置类型',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
          slot: 'type',
        },
        {
          prop: 'value',
          label: '配置值',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'status',
          label: '状态',
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
          prop: 'note',
          label: '备注',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'createTime',
          label: '创建时间',
          sortable: 'custom',
          showOverflowTooltip: true,
          minWidth: 160,
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
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          columnKey: 'action',
          label: '操作',
          width: 130,
          align: 'center',
          resizable: false,
          slot: 'action',
          fixed: "right"
        }
      ],
      // 表格搜索条件
      where: {
        configId: this.configId
      },
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false
    };
  },
  methods: {
    /* 刷新表格 */
    reload() {
      this.$refs.table.reload({where: this.where});
    },
    /* 显示编辑 */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    /* 删除 */
    remove(row) {
      const loading = this.$loading({lock: true});
      this.$http.post('/configdata/delete', {id: row.id}).then(res => {
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
    /* 更改状态 */
    editStatus(row) {
      const loading = this.$loading({lock: true});
      let params = Object.assign({
        "id": row.id,
        "status": row.status
      })
      this.$http.post('/configdata/status', params).then(res => {
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
    }
  },
  watch: {
    // 监听配置id变化
    configId() {
      this.where.configId = this.configId;
      this.reload();
    }
  }
}
</script>

<style scoped>
</style>
