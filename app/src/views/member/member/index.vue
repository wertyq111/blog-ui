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
            <el-form-item label="账号:">
              <el-input
                v-model="where.username"
                clearable
                placeholder="请输入账号"/>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <el-form-item label="昵称:">
              <el-input
                v-model="where.nickname"
                clearable
                placeholder="请输入昵称"/>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <el-form-item label="性别:">
              <el-select
                v-model="where.gender"
                class="ele-fluid"
                clearable
                placeholder="请选择性别">
                <el-option label="男" value="1"/>
                <el-option label="女" value="2"/>
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
        :selection.sync="selection"
        :where="where"
        height="calc(100vh - 315px)">
        <!-- 性别列 -->
        <template slot="gender" slot-scope="{row}">
          <el-tag
            :type="['success', 'primary', 'warning'][row.gender-1]"
            size="mini">
            {{ ['男', '女', '保密'][row.gender - 1] }}
          </el-tag>
        </template>
        <!-- 头像 -->
        <template slot="avatar" slot-scope="{row}">
          <el-avatar :size="25" :src="row.avatar" shape="square"/>
        </template>
        <!-- 设备类型列 -->
        <template slot="device" slot-scope="{row}">
          <el-tag
            :type="['primary','success','warning', 'danger', 'info'][row.device-1]"
            size="mini">
            {{ ['苹果', '安卓', 'WAP站', 'PC站', '后台'][row.device - 1] }}
          </el-tag>
        </template>
        <!-- 注册来源列 -->
        <template slot="source" slot-scope="{row}">
          <el-tag
            :type="['primary','success','warning', 'danger', 'info'][row.source-1]"
            size="mini">
            {{ ['APP注册', '小程序注册', '网站注册', 'WAP站注册', '马甲会员'][row.source - 1] }}
          </el-tag>
        </template>
        <!-- 状态列 -->
        <template slot="status" slot-scope="{row}">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="2"
            @change="editStatus(row)"/>
        </template>
        <!-- 操作列 -->
        <template slot="action" slot-scope="{row}">
          <el-link
            v-if="permission.includes('sys:member:edit')"
            :underline="false"
            icon="el-icon-edit"
            type="primary"
            @click="openEdit(row)">修改
          </el-link>
          <el-popconfirm
            class="ele-action"
            title="确定要删除此会员吗？"
            @confirm="remove(row)">
            <el-link
              v-if="permission.includes('sys:member:delete')"
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
    <member-edit
      :data="current"
      :visible.sync="showEdit"
      @done="reload"/>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import MemberEdit from './member-edit.vue';

export default {
  name: 'Member',
  components: {MemberEdit},
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/members/index',
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
          prop: 'user.username',
          label: '会员账号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },
        {
          prop: 'realname',
          label: '会员姓名',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
        },
        {
          prop: 'nickname',
          label: '会员昵称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          columnKey: 'avatar',
          label: '头像',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 60,
          slot: 'avatar'
        },
        {
          prop: 'gender',
          label: '性别',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 60,
          slot: 'gender'
        },
        {
          prop: 'device',
          label: '设备类型',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
          slot: 'device'
        },
        {
          prop: 'source',
          label: '注册来源',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
          slot: 'source'
        },
        {
          prop: 'status',
          label: '状态',
          align: 'center',
          width: 80,
          resizable: false,
          slot: 'status',
        },
        {
          prop: 'createTime',
          label: '注册时间',
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
          width: 130,
          align: 'center',
          resizable: false,
          slot: 'action',
          fixed: "right"
        }
      ],
      // 表格搜索条件
      where: {
        include: ['user']
      },
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
      console.log(this.$refs.table.data)
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
      this.$http.delete(`/members/${row.id}`).then(res => {
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
        "status": row.status
      })
      this.$http.post(`/members/${row.id}`, params).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message({type: 'success', message: res.data.msg});
        } else {
          row.status = !row.status ? 1 : 2;
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
