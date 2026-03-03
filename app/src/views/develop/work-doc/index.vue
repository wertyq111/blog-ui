<template>
  <div class="ele-body">
    <el-card shadow="never" v-loading="loading">
      <el-row :gutter="15">
        <!-- 左侧分类树 -->
        <el-col :lg="6" style="margin-bottom: 15px;">
          <div class="ele-table-tool ele-table-tool-default ele-toolbar-actions">
            <div class="ele-table-tool-title">
              <el-button
                class="ele-btn-icon"
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="openCategoryEdit(null)">添加分类
              </el-button>
              <el-button
                :disabled="!currentCategory"
                class="ele-btn-icon"
                icon="el-icon-edit"
                size="small"
                type="warning"
                @click="openCategoryEdit(currentCategory)">修改分类
              </el-button>
              <el-button
                :disabled="!currentCategory"
                class="ele-btn-icon"
                icon="el-icon-delete"
                size="small"
                type="danger"
                @click="removeCategory">删除分类
              </el-button>
            </div>
          </div>
          <div class="doc-tree-group">
            <el-tree
              ref="tree"
              :data="categoryTree"
              :default-expand-all="true"
              :expand-on-click-node="false"
              :props="{label: 'name'}"
              highlight-current
              node-key="id"
              @node-click="onCategoryClick" />
          </div>
        </el-col>

        <!-- 右侧文档列表 -->
        <el-col :lg="18" style="margin-bottom: 15px;">
          <el-form
            :model="where"
            class="ele-form-search"
            label-width="90px"
            @keyup.enter.native="reloadDocs"
            @submit.native.prevent>
            <el-row :gutter="15">
              <el-col :lg="8" :md="12">
                <el-form-item label="标题/内容:">
                  <el-input v-model="where.keyword" placeholder="输入关键词" />
                </el-form-item>
              </el-col>
              <el-col :lg="6" :md="12">
                <el-form-item label="状态:">
                  <el-select v-model="where.status" clearable placeholder="全部">
                    <el-option label="启用" :value="1" />
                    <el-option label="停用" :value="0" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="6" :md="12">
                <el-form-item label="模板:">
                  <el-select v-model="where.template_type" clearable placeholder="全部">
                    <el-option v-for="t in templates" :key="t.value" :label="t.label" :value="t.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="4" :md="12">
                <div class="ele-form-actions">
                  <el-button class="ele-btn-icon" icon="el-icon-search" type="primary" @click="reloadDocs">查询</el-button>
                  <el-button @click="reset">重置</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>

          <ele-pro-table
            ref="table"
            :columns="columns"
            :datasource="url"
            :where="where"
            height="calc(100vh - 420px)">
            <template slot="toolbar">
              <el-button
                class="ele-btn-icon"
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="openEdit(null)">添加文档
              </el-button>
            </template>
            <template slot="title" slot-scope="{row}">
              <el-link type="primary" :underline="false" @click="openPreview(row)">{{ row.title }}</el-link>
              <div class="doc-meta" v-if="row.category">
                <span>分类：{{ row.category.name }}</span>
                <span v-if="row.template_type">模板：{{ templateLabel(row.template_type) }}</span>
              </div>
            </template>
            <template slot="tags" slot-scope="{row}">
              <el-tag v-for="(tag, idx) in (row.tags || [])" :key="idx" size="mini" style="margin-right:6px;">{{ tag }}</el-tag>
            </template>
            <template slot="status" slot-scope="{row}">
              <el-tag :type="row.status === 1 ? 'success' : 'info'" size="mini">{{ row.status === 1 ? '启用' : '停用' }}</el-tag>
            </template>
            <template slot="action" slot-scope="{row}">
              <el-link :underline="false" type="primary" icon="el-icon-document" @click="copyMarkdownLink(row)">复制链接</el-link>
              <el-link :underline="false" type="primary" icon="el-icon-edit" class="ele-action" @click="openEdit(row)">编辑</el-link>
              <el-popconfirm class="ele-action" title="确定要删除此文档吗？" @confirm="remove(row)">
                <el-link slot="reference" :underline="false" icon="el-icon-delete" type="danger">删除</el-link>
              </el-popconfirm>
            </template>
          </ele-pro-table>
        </el-col>
      </el-row>
    </el-card>

    <work-doc-edit
      :data="current"
      :visible.sync="showEdit"
      :categories="categoryList"
      :templates="templates"
      @done="reloadDocs" />

    <work-doc-category-edit
      :data="currentCategoryEdit"
      :visible.sync="showCategoryEdit"
      :categories="categoryList"
      @done="loadCategories" />

    <el-dialog
      :visible.sync="showPreview"
      :fullscreen="previewFullscreen"
      width="80%"
      custom-class="doc-preview-dialog">
      <div slot="title" class="doc-preview-title">
        <div class="doc-preview-name">{{ previewDoc.title }}</div>
        <div class="doc-preview-actions">
          <el-button size="mini" @click="togglePreviewFullscreen">{{ previewFullscreen ? '退出全屏' : '全屏查看' }}</el-button>
          <el-button size="mini" type="primary" @click="copyMarkdownLink(previewDoc)">复制引用链接</el-button>
        </div>
      </div>
      <mavon-editor
        v-model="previewDoc.content"
        :toolbarsFlag="false"
        :subfield="false"
        defaultOpen="preview"
        :editable="false"
        class="doc-preview" />
    </el-dialog>
  </div>
</template>

<script>
import WorkDocEdit from './work-doc-edit.vue';
import WorkDocCategoryEdit from './work-doc-category-edit.vue';
import {mavonEditor} from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';

export default {
  name: 'WorkDoc',
  components: {WorkDocEdit, WorkDocCategoryEdit, mavonEditor},
  data() {
    return {
      loading: false,
      url: '/work-doc/index',
      columns: [
        {
          prop: 'title',
          label: '标题',
          minWidth: 260,
          slot: 'title'
        },
        {
          prop: 'tags',
          label: '标签',
          minWidth: 180,
          slot: 'tags'
        },
        {
          prop: 'priority',
          label: '优先级',
          width: 90,
          align: 'center'
        },
        {
          prop: 'is_pin',
          label: '置顶',
          width: 80,
          align: 'center',
          formatter: (row) => (row.is_pin === 1 ? '是' : '否')
        },
        {
          prop: 'status',
          label: '状态',
          width: 90,
          align: 'center',
          slot: 'status'
        },
        {
          prop: 'updated_at',
          label: '更新时间',
          minWidth: 160,
          align: 'center',
          formatter: (row, column, cellValue) => this.$util.toDateString(cellValue)
        },
        {
          columnKey: 'action',
          label: '操作',
          width: 240,
          align: 'center',
          resizable: false,
          slot: 'action',
          fixed: 'right'
        }
      ],
      where: {
        keyword: '',
        status: null,
        template_type: null,
        category_id: null
      },
      templates: [
        {
          label: '自定义',
          value: 'custom',
          content: ''
        },
        {
          label: '故障排查',
          value: 'troubleshooting',
          content: `# 故障排查

## 现象
- 

## 影响范围
- 

## 排查过程
1. 

## 根因
- 

## 解决方案
- 

## 回归验证
- 

## 后续优化
- `
        },
        {
          label: '方案设计',
          value: 'design',
          content: `# 方案设计

## 背景
- 

## 目标
- 

## 方案概述
- 

## 核心流程
1. 

## 风险与取舍
- 

## 里程碑
- `
        },
        {
          label: '知识点',
          value: 'knowledge',
          content: `# 知识点整理

## 结论/要点
- 

## 解释说明
- 

## 示例
```

```

## 参考资料
- `
        }
      ],
      categoryList: [],
      categoryTree: [],
      currentCategory: null,
      currentCategoryEdit: null,
      showCategoryEdit: false,
      current: null,
      showEdit: false,
      showPreview: false,
      previewDoc: {title: '', content: ''},
      previewFullscreen: false
    };
  },
  mounted() {
    this.loadCategories();
    this.reloadDocs();
    this.checkPreviewFromQuery();
  },
  methods: {
    loadCategories() {
      this.loading = true;
      this.$http.get('/work-doc-category/list', {params: {status: 1}}).then(res => {
        this.loading = false;
        if (res.data.code === 0) {
          this.categoryList = res.data.data || [];
          this.categoryTree = this.$util.toTreeData(this.categoryList, 'id', 'parent_id');
          this.$nextTick(() => {
            if (!this.currentCategory && this.categoryTree.length > 0) {
              this.onCategoryClick(this.categoryTree[0]);
              this.$refs.tree && this.$refs.tree.setCurrentKey(this.categoryTree[0].id);
            }
          });
        } else {
          this.categoryList = [];
          this.categoryTree = [];
        }
      }).catch(() => {
        this.loading = false;
        this.categoryList = [];
        this.categoryTree = [];
      });
    },
    onCategoryClick(node) {
      this.currentCategory = node;
      this.where.category_id = node ? node.id : null;
      this.reloadDocs();
    },
    reloadDocs() {
      if (this.$refs.table) {
        this.$refs.table.reload({where: this.where});
      }
    },
    reset() {
      this.where.keyword = '';
      this.where.status = null;
      this.where.template_type = null;
      this.where.category_id = this.currentCategory ? this.currentCategory.id : null;
      this.reloadDocs();
    },
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    remove(row) {
      this.$confirm('确定要删除此文档吗?', '提示', {type: 'warning'}).then(() => {
        const loading = this.$loading({lock: true});
        this.$http.delete(`/work-doc/${row.id}`).then(res => {
          loading.close();
          if (res.data.code === 0) {
            this.$message.success(res.data.msg || '删除成功');
            this.reloadDocs();
          } else {
            this.$message.error(res.data.msg || '删除失败');
          }
        }).catch(e => {
          loading.close();
          this.$message.error(e.message);
        });
      }).catch(() => {});
    },
    openCategoryEdit(item) {
      this.currentCategoryEdit = item;
      this.showCategoryEdit = true;
    },
    removeCategory() {
      if (!this.currentCategory) return;
      this.$confirm('确定要删除此分类吗?', '提示', {type: 'warning'}).then(() => {
        const loading = this.$loading({lock: true});
        this.$http.delete(`/work-doc-category/${this.currentCategory.id}`).then(res => {
          loading.close();
          if (res.data.code === 0) {
            this.$message.success(res.data.msg || '删除成功');
            this.currentCategory = null;
            this.where.category_id = null;
            this.loadCategories();
            this.reloadDocs();
          } else {
            this.$message.error(res.data.msg || '删除失败');
          }
        }).catch(e => {
          loading.close();
          this.$message.error(e.message);
        });
      }).catch(() => {});
    },
    templateLabel(value) {
      const item = this.templates.find(t => t.value === value);
      return item ? item.label : value;
    },
    copyMarkdownLink(row) {
      if (!row || !row.id) {
        this.$message.error('文档未保存');
        return;
      }
      const url = `${window.location.origin}/develop/work-doc?docId=${row.id}`;
      const text = `[${row.title}](${url})`;
      this.$copyText(text).then(() => {
        this.$message.success('复制成功');
      }, () => {
        this.$message.error('复制失败');
      });
    },
    openPreview(row) {
      if (!row || !row.id) return;
      this.$http.get(`/work-doc/${row.id}`).then(res => {
        if (res.data.code === 0) {
          this.previewDoc = res.data.data;
          this.showPreview = true;
        } else {
          this.$message.error(res.data.msg || '获取详情失败');
        }
      }).catch(e => {
        this.$message.error(e.message || '获取详情失败');
      });
    },
    togglePreviewFullscreen() {
      this.previewFullscreen = !this.previewFullscreen;
    },
    checkPreviewFromQuery() {
      const docId = this.$route && this.$route.query ? this.$route.query.docId : null;
      if (docId) {
        this.openPreview({id: docId});
      }
    }
  }
};
</script>

<style scoped>
.doc-tree-group {
  border: 1px solid hsla(0, 0%, 60%, .15);
  height: calc(100vh - 262px);
  box-sizing: border-box;
  overflow: auto;
}

.doc-tree-group ::v-deep .el-tree-node__content {
  height: 40px;
}

.doc-tree-group ::v-deep .el-tree-node__content > .el-tree-node__expand-icon {
  margin-left: 10px;
}

.doc-meta {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.doc-meta span {
  margin-right: 12px;
}

.doc-preview-dialog ::v-deep .el-dialog__header {
  padding-bottom: 0;
}

.doc-preview-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.doc-preview-name {
  font-size: 18px;
  font-weight: 600;
}

.doc-preview-actions {
  display: flex;
  gap: 8px;
}

.doc-preview ::v-deep .v-note-wrapper {
  border: none;
}

.doc-preview ::v-deep .markdown-body {
  font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
  font-size: 15px;
  line-height: 1.7;
}
</style>
