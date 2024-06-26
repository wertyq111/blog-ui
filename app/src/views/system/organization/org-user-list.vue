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
                  v-model="where.username"
                  clearable
                  placeholder="请输入用户账号"
                  size="small"/>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item>
                <el-input
                  v-model="where.nickname"
                  clearable
                  placeholder="请输入用户名"
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
      <!-- 角色列 -->
      <template slot="roles" slot-scope="{row}">
        <el-tag
          v-for="item in row.roles"
          :key="item.roleId"
          size="mini"
          type="primary">
          {{ item.roleName }}
        </el-tag>
      </template>
      <!-- 状态列 -->
      <template slot="state" slot-scope="{row}">
        <el-switch
          v-model="row.state"
          :active-value="0"
          :inactive-value="1"
          @change="editState(row)"/>
      </template>
      <!-- 操作列 -->
      <template slot="action" slot-scope="{row}">
        <el-link
          :underline="false"
          icon="el-icon-edit"
          type="primary"
          @click="openEdit(row)">修改
        </el-link>
        <el-popconfirm
          class="ele-action"
          title="确定要删除此用户吗？"
          @confirm="remove(row)">
          <el-link
            slot="reference"
            :underline="false"
            icon="el-icon-delete"
            type="danger">删除
          </el-link>
        </el-popconfirm>
      </template>
    </ele-pro-table>
    <!-- 编辑弹窗 -->
    <org-user-edit
      :data="current"
      :organization-id="organizationId"
      :organization-list="organizationList"
      :visible.sync="showEdit"
      @done="reload"/>
  </div>
</template>

<script>
import OrgUserEdit from './org-user-edit.vue';

export default {
  name: 'OrgUserList',
  components: {OrgUserEdit},
  props: {
    // 机构id
    organizationId: Number,
    // 全部机构
    organizationList: Array
  },
  data() {
    return {
      // 表格数据接口
      url: '/sys/user/page',
      // 表格列配置
      columns: [
        {
          columnKey: 'index',
          type: 'index',
          width: 45,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'username',
          label: '用户账号',
          sortable: 'custom',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'nickname',
          label: '用户名',
          sortable: 'custom',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'sexName',
          label: '性别',
          sortable: 'custom',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'phone',
          label: '手机号',
          sortable: 'custom',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          columnKey: 'roles',
          label: '角色',
          showOverflowTooltip: true,
          minWidth: 110,
          slot: 'roles'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          sortable: 'custom',
          showOverflowTooltip: true,
          minWidth: 110,
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          prop: 'state',
          label: '状态',
          align: 'center',
          sortable: 'custom',
          width: 80,
          resizable: false,
          slot: 'state'
        },
        {
          columnKey: 'action',
          label: '操作',
          width: 130,
          align: 'center',
          resizable: false,
          slot: 'action'
        }
      ],
      // 表格搜索条件
      where: {
        organizationId: this.organizationId
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
      this.$http.post('/sys/user/' + row.userId).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message({type: 'success', message: res.data.msg});
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
    editState(row) {
      const loading = this.$loading({lock: true});
      let params = new FormData();
      params.append('state', row.state);
      this.$http.post('/sys/user/state/' + row.userId, params).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message({type: 'success', message: res.data.msg});
        } else {
          row.state = !row.state ? 1 : 0;
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message);
      });
    }
  },
  watch: {
    // 监听机构id变化
    organizationId() {
      this.where.organizationId = this.organizationId;
      this.reload();
    }
  }
}
</script>

<style scoped>
</style>
