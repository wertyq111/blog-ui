<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form
        :model="where"
        class="ele-form-search"
        label-width="77px"
        @keyup.enter.native="query"
        @submit.native.prevent>
        <el-row :gutter="15">
          <el-col :lg="6" :md="12">
            <el-form-item label="城市名称:">
              <el-input
                v-model="where.name"
                clearable
                placeholder="请输入城市名称"/>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <div class="ele-form-actions">
              <el-button
                class="ele-btn-icon"
                icon="el-icon-search"
                type="primary"
                @click="query">查询
              </el-button>
              <el-button @click="reset">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- 数据表格 -->
      <el-table ref="table" v-loading="loading" :data="data" :load="load" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" border
                default-expand-all height="calc(100vh - 215px)" highlight-current-row
                lazy
                row-key="id">
        <el-table-column align="center" fixed="left" label="编号" type="index" width="60"/>
        <el-table-column label="城市名称" min-width="200" show-overflow-tooltip>
          <template slot-scope="{row}">{{ row.name }}</template>
        </el-table-column>
        <el-table-column align="center" label="城市等级" width="100px">
          <template slot-scope="{row}">
            <el-tag :type="['primary','success','warning'][row.level-1]" size="mini">
              {{ ['省份', '城市', '县区'][row.level - 1] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="城市编码" min-width="100" prop="citycode"/>
        <el-table-column align="center" label="地里编码" min-width="100" prop="adcode"/>
        <el-table-column align="center" label="经度" min-width="100" prop="lng"/>
        <el-table-column align="center" label="纬度" min-width="100" prop="lat"/>
        <el-table-column align="center" label="排序" prop="sort" width="60px"/>
        <el-table-column align="center" label="创建时间" min-width="160" prop="createTime" show-overflow-tooltip>
          <template slot-scope="{row}">{{ row.createTime | toDateString }}</template>
        </el-table-column>
        <el-table-column :resizable="false" align="center" fixed="right" label="操作" width="190px">
          <template slot-scope="{row}">
            <el-link v-if="permission.includes('sys:city:addz')" :underline="false" icon="el-icon-plus" type="primary"
                     @click="openEdit(null, row.id)">添加
            </el-link>
            <el-link v-if="permission.includes('sys:city:edit')" :underline="false" icon="el-icon-edit" type="primary"
                     @click="openEdit(row)">修改
            </el-link>
            <el-popconfirm class="ele-action" title="确定要删除此城市吗？" @confirm="remove(row)">
              <el-link v-if="permission.includes('sys:city:delete')" slot="reference" :underline="false" icon="el-icon-delete"
                       type="danger">删除
              </el-link>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 编辑弹窗 -->
    <city-edit
      :data="current"
      :visible.sync="showEdit"
      @done="query"/>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import CityEdit from './city-edit.vue';

export default {
  name: 'SystemCity',
  components: {CityEdit},
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      loading: true,  // 加载状态
      data: [],  // 列表数据
      // 表格搜索条件
      where: {},
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    /* 查询 */
    query() {
      this.loading = true;
      this.$http.get('/city/index', {params: this.where}).then(res => {
        this.loading = false;
        if (res.data.code === 0) {
          this.data = this.$util.toTreeData(res.data.data, 'id', 'pid');
        } else {
          this.$message.error(res.data.msg || '获取数据失败');
        }
      }).catch(e => {
        this.loading = false;
        this.$message.error(e.message);
      });
    },
    /**
     * 异步加载数据
     */
    load(tree, treeNode, resolve) {
      this.where['pid'] = tree.id;
      this.$http.get('/city/index', {params: this.where}).then(res => {
        if (res.data.code === 0) {
          resolve(res.data.data)
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 重置搜索 */
    reset() {
      this.where = {};
      this.query();
    },
    /* 显示编辑 */
    openEdit(row, parentId) {
      this.current = Object.assign({
        level: 1,
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
      this.$http.post('/city/delete', {id: row.id}).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          this.query();
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
