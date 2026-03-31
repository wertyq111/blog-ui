<template>
  <div class="ele-body develop-page admin-workspace-page admin-workspace-page--tool develop-page--tool">
    <el-card shadow="never" class="develop-shell admin-workspace-shell">
      <section class="develop-hero">
        <div class="develop-hero__copy">
          <div class="develop-hero__eyebrow">Develop Tooling</div>
          <div class="develop-hero__title">路径转换</div>
          <div class="develop-hero__desc">统一维护项目地址、服务器目标和转换入口，让开发路径切换更清晰、更可追踪。</div>
        </div>
      </section>

      <section class="develop-panel develop-panel--filter">
      <!-- 搜索表单 -->
      <el-form
        :model="where"
        class="ele-form-search develop-form"
        label-width="77px"
        @keyup.enter.native="reload"
        @submit.native.prevent>
        <el-row :gutter="15">
          <el-col :lg="6" :md="12">
            <el-form-item label="项目名称:">
              <el-input
                v-model="where.name"
                clearable
                placeholder="请输入项目名称"/>
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
      </section>

      <section class="develop-table-shell">
      <div class="develop-table-shell__header">
        <div>
          <div class="develop-table-shell__title">转换项目列表</div>
          <div class="develop-table-shell__desc">项目网址、服务器地址和转换动作统一集中到一个工具工作区。</div>
        </div>
      </div>
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
            v-if="permission.includes('sys:convert-path:add')"
            class="ele-btn-icon"
            icon="el-icon-plus"
            size="small"
            type="primary"
            @click="openEdit(null)">添加
          </el-button>
          <el-button
            v-if="permission.includes('sys:convert-path:dall')"
            class="ele-btn-icon"
            icon="el-icon-delete"
            size="small"
            type="danger"
            @click="removeBatch">删除
          </el-button>
        </template>
        <!-- 网址 -->
        <template slot="url" slot-scope="{row}">
          <el-link :href="row.url" target="_blank" type="primary">{{ row.url }}</el-link>
        </template>
        <!-- 操作列 -->
        <template slot="action" slot-scope="{row}">
          <el-link
            v-if="permission.includes('sys:convert-path:convert')"
            :underline="false"
            icon="el-icon-_surveying"
            type="primary"
            @click="openConvert(row)">转换
          </el-link>
          <el-link
            v-if="permission.includes('sys:convert-path:edit')"
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
              v-if="permission.includes('sys:convert-path:delete')"
              slot="reference"
              :underline="false"
              icon="el-icon-delete"
              type="danger">删除
            </el-link>
          </el-popconfirm>
        </template>
      </ele-pro-table>
      </section>
    </el-card>
    <!-- 编辑弹窗 -->
    <convert-path-edit
      :data="current"
      :visible.sync="showEdit"
      @done="reload"/>
    <!-- 转换弹窗 -->
    <convert-server-path
      :data="current"
      :visible.sync="showConvert"
      @done="reload"/>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import ConvertPathEdit from './convert-path-edit.vue';
import ConvertServerPath from './convert-path.vue';

export default {
  name: 'ConvertPath',
  components: {ConvertPathEdit, ConvertServerPath},
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/server-path/index',
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
          prop: 'code',
          label: '项目编码',
          align: 'center',
          showOverflowTooltip: true,
          width: 150,
        },
        {
          prop: 'name',
          label: '项目名称',
          align: 'center',
          showOverflowTooltip: true,
          width: 150,
        },
        {
          prop: 'url',
          label: '网址',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200,
          slot: 'url'
        },
        {
          prop: 'target',
          label: '服务器地址',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'sort',
          label: '排序',
          align: 'center',
          showOverflowTooltip: true,
          width: 50
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
      // 是否显示转换弹窗
      showConvert: false,
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
    /* 显示转换 */
    openConvert(row) {
      this.current = row;
      this.showConvert = true;
    },
    /* 删除 */
    remove(row) {
      const loading = this.$loading({lock: true});
      this.$http.delete(`/server-path/${row.id}`).then(res => {
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
        this.$message.error('请至少选择一条数据')
        return;
      }
      this.$confirm('确定要删除选中的信息吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({lock: true});
        const ids = this.selection.map(d => d.id);
        Promise.all(ids.map(id => this.$http.delete(`/server-path/${id}`))).then(() => {
          loading.close();
          this.$message({type: 'success', message: '删除成功'});
          this.reload();
        }).catch(e => {
          loading.close();
          this.$message.error(e.message);
        });
      }).catch(() => {
      });
    }
  }
}
</script>

<style scoped>
</style>
