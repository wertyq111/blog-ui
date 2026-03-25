<template>
  <div class="ele-body">
    <el-card
      v-loading="loading"
      body-style="padding-bottom: 0;"
      shadow="never">
      <el-row :gutter="15">
        <el-col :lg="6" style="margin-bottom: 15px;">
          <!-- 操作按钮 -->
          <div class="ele-table-tool ele-table-tool-default ele-toolbar-actions">
            <div class="ele-table-tool-title">
              <el-button
                class="ele-btn-icon"
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="openEdit(null)">添加
              </el-button>
              <el-button
                :disabled="!current"
                class="ele-btn-icon"
                icon="el-icon-edit"
                size="small"
                type="warning"
                @click="openEdit(current)">修改
              </el-button>
              <el-button
                :disabled="!current"
                class="ele-btn-icon"
                icon="el-icon-delete"
                size="small"
                type="danger"
                @click="remove">删除
              </el-button>
            </div>
          </div>
          <!-- 机构列表 -->
          <div class="org-tree-group">
            <el-tree
              ref="tree"
              :data="data"
              :default-expand-all="true"
              :expand-on-click-node="false"
              :props="{label: 'organizationName'}"
              highlight-current
              node-key="organizationId"
              @node-click="onNodeClick"/>
          </div>
        </el-col>
        <!-- 用户列表 -->
        <el-col :lg="18" style="margin-bottom: 15px;">
          <org-user-list
            v-if="current"
            :organization-id="current.organizationId"
            :organization-list="data"/>
        </el-col>
      </el-row>
    </el-card>
    <!-- 编辑弹窗 -->
    <org-edit
      :data="editData"
      :organization-list="data"
      :visible.sync="showEdit"
      @done="query"/>
  </div>
</template>

<script>
import OrgUserList from './org-user-list.vue';
import OrgEdit from './org-edit.vue';

export default {
  name: 'SystemOrganization',
  components: {OrgUserList, OrgEdit},
  data() {
    return {
      // 加载状态
      loading: true,
      // 列表数据
      data: [],
      // 选中数据
      current: null,
      // 是否显示表单弹窗
      showEdit: false,
      // 编辑回显数据
      editData: null
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    /* 查询 */
    query() {
      this.loading = true;
      this.$http.get('/sys/organization').then(res => {
        this.loading = false;
        if (res.data.code === 0) {
          this.data = this.$util.toTreeData(res.data.data, 'organizationId', 'parentId');
          this.$nextTick(() => {
            this.onNodeClick(this.data[0]);
          });
        } else {
          this.$message.error(res.data.msg || '获取数据失败');
        }
      }).catch(e => {
        this.loading = false;
        this.$message.error(e.message);
      });
    },
    /* 选择数据 */
    onNodeClick(row) {
      if (row != null) {
        this.current = row;
        this.$refs.tree.setCurrentKey(row.organizationId);
      } else {
        this.current = null;
      }
    },
    /* 显示编辑 */
    openEdit(item) {
      this.editData = Object.assign({}, {
        parentId: this.current.parentId
      }, item);
      this.showEdit = true;
    },
    /* 删除 */
    remove() {
      this.$confirm('确定要删除选中的机构吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({lock: true});
        this.$http.post('/sys/organization/' + this.current.organizationId).then(res => {
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
      }).catch(() => {
      });
    }
  }
}
</script>

<style scoped>
.org-tree-group {
  border: 1px solid hsla(0, 0%, 60%, .15);
  height: calc(100vh - 262px);
  box-sizing: border-box;
  overflow: auto;
}

.org-tree-group ::v-deep .el-tree-node__content {
  height: 40px;
}

.org-tree-group ::v-deep .el-tree-node__content > .el-tree-node__expand-icon {
  margin-left: 10px;
}
</style>
