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
            <div class="doc-tree-toolbar">
              <div class="doc-tree-toolbar__title">分类目录</div>
              <div class="doc-tree-toolbar__tips">拖到节点上可变成子目录，拖到节点前后可调整同级顺序或移回上级。</div>
            </div>
            <div
              class="doc-tree-root-drop"
              :class="{'is-active': rootDropActive}"
              @dragover.prevent="onRootDropZoneOver"
              @dragenter.prevent="onRootDropZoneEnter"
              @dragleave="onRootDropZoneLeave"
              @drop.prevent="onRootDrop">
              拖到这里提升为一级目录
            </div>
            <el-tree
              ref="tree"
              :data="categoryTree"
              :default-expand-all="true"
              :expand-on-click-node="false"
              :draggable="true"
              :empty-text="loading ? '分类加载中...' : '暂无分类'"
              :props="{label: 'name'}"
              :allow-drag="allowCategoryDrag"
              :allow-drop="allowCategoryDrop"
              highlight-current
              node-key="id"
              @node-click="onCategoryClick"
              @node-drag-start="onCategoryDragStart"
              @node-drag-end="onCategoryDragEnd"
              @node-drop="onCategoryDrop">
              <div slot-scope="{ node, data }" class="doc-tree-node">
                <div class="doc-tree-node__main">
                  <i :class="resolveCategoryIcon(data, node)" class="doc-tree-node__folder" />
                  <span class="doc-tree-node__label">{{ data.name }}</span>
                </div>
                <div class="doc-tree-node__meta">
                  <span>Lv{{ node.level }}</span>
                  <span v-if="data.children && data.children.length">{{ data.children.length }}项</span>
                </div>
              </div>
            </el-tree>
          </div>
        </el-col>

        <!-- 右侧文档列表 -->
        <el-col :lg="18" style="margin-bottom: 15px;">
          <div class="doc-panel">
            <div class="doc-panel__header">
              <div class="doc-panel__title">
                <div class="doc-panel__heading">文档列表</div>
                <div class="doc-panel__desc">
                  <i :class="currentCategory ? resolveCategoryIcon(currentCategory) : 'el-icon-collection-tag'" />
                  <span>{{ currentCategory ? currentCategory.name : '全部分类文档' }}</span>
                  <span class="doc-panel__dot">·</span>
                  <span>支持标题、标签、模板与项目来源统一管理</span>
                </div>
              </div>
            </div>

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
              height="calc(100vh - 456px)">
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
                <div class="doc-table-title">
                  <el-link type="primary" :underline="false" @click="openPreview(row)">{{ row.title }}</el-link>
                  <div class="doc-meta">
                    <span v-if="row.category">分类：{{ row.category.name }}</span>
                    <span v-if="row.template_type">模板：{{ templateLabel(row.template_type) }}</span>
                    <span v-if="row.source">项目来源：{{ row.source }}</span>
                  </div>
                </div>
              </template>
              <template slot="tags" slot-scope="{row}">
                <el-tag v-for="(tag, idx) in (row.tags || [])" :key="idx" size="mini" style="margin-right:6px;">{{ tag }}</el-tag>
              </template>
              <template slot="status" slot-scope="{row}">
                <el-tag :type="row.status === 1 ? 'success' : 'info'" size="mini">{{ row.status === 1 ? '启用' : '停用' }}</el-tag>
              </template>
              <template slot="action" slot-scope="{row}">
                <div class="doc-action-group">
                  <el-tooltip content="复制引用链接" placement="top">
                    <el-button
                      class="doc-icon-button"
                      circle
                      icon="el-icon-document-copy"
                      size="mini"
                      type="primary"
                      @click="copyMarkdownLink(row)" />
                  </el-tooltip>
                  <el-tooltip content="编辑文档" placement="top">
                    <el-button
                      class="doc-icon-button"
                      circle
                      icon="el-icon-edit"
                      size="mini"
                      type="warning"
                      @click="openEdit(row)" />
                  </el-tooltip>
                  <el-popconfirm title="确定要删除此文档吗？" @confirm="remove(row)">
                    <el-tooltip slot="reference" content="删除文档" placement="top">
                      <el-button
                        class="doc-icon-button"
                        circle
                        icon="el-icon-delete"
                        size="mini"
                        type="danger" />
                    </el-tooltip>
                  </el-popconfirm>
                </div>
              </template>
            </ele-pro-table>
          </div>
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
      :category-tree="categoryTree"
      @done="loadCategories" />

    <app-dialog
      :visible.sync="showPreview"
      :fullscreen="previewFullscreen"
      :show-close="false"
      width="80%"
      custom-class="doc-preview-dialog">
      <div slot="title" class="doc-preview-title">
        <div class="doc-preview-name">
          <div class="doc-preview-name__text">{{ previewDoc.title }}</div>
          <div class="doc-preview-meta">
            <div v-if="previewDoc.category" class="doc-preview-meta__item">
              <i :class="resolveCategoryIcon(previewDoc.category)" />
              <span>{{ previewDoc.category.name }}</span>
            </div>
            <div v-if="previewDoc.template_type" class="doc-preview-meta__item">
              <i class="el-icon-notebook-1" />
              <span>{{ templateLabel(previewDoc.template_type) }}</span>
            </div>
            <div v-if="previewDoc.source" class="doc-preview-meta__item">
              <i class="el-icon-s-grid" />
              <span>{{ previewDoc.source }}</span>
            </div>
            <div v-if="previewDoc.updated_at" class="doc-preview-meta__item">
              <i class="el-icon-time" />
              <span>{{ $util.toDateString(previewDoc.updated_at) }}</span>
            </div>
          </div>
        </div>
        <div class="doc-preview-actions">
          <el-tooltip :content="previewFullscreen ? '退出全屏' : '全屏查看'" placement="top">
            <el-button
              class="doc-icon-button"
              circle
              icon="el-icon-full-screen"
              size="mini"
              @click="togglePreviewFullscreen" />
          </el-tooltip>
          <el-tooltip content="复制引用链接" placement="top">
            <el-button
              class="doc-icon-button"
              circle
              icon="el-icon-document-copy"
              size="mini"
              type="primary"
              @click="copyMarkdownLink(previewDoc)" />
          </el-tooltip>
          <el-tooltip content="关闭详情" placement="top">
            <el-button
              class="doc-icon-button"
              circle
              icon="el-icon-close"
              size="mini"
              @click="showPreview = false" />
          </el-tooltip>
        </div>
      </div>
      <div class="doc-preview-shell">
        <div class="doc-preview-hero">
          <div class="doc-preview-hero__eyebrow">Work Doc</div>
          <div class="doc-preview-hero__summary">
            <span>{{ previewDoc.source || '未设置项目来源' }}</span>
            <span class="doc-preview-hero__divider">/</span>
            <span>{{ previewDoc.category ? previewDoc.category.name : '未分类' }}</span>
          </div>
          <div v-if="previewDoc.tags && previewDoc.tags.length" class="doc-preview-hero__tags">
            <el-tag
              v-for="(tag, index) in previewDoc.tags"
              :key="index"
              effect="plain"
              size="mini"
              class="doc-preview-hero__tag">
              {{ tag }}
            </el-tag>
          </div>
        </div>
        <mavon-editor
          v-model="previewDoc.content"
          :toolbarsFlag="false"
          :subfield="false"
          defaultOpen="preview"
          :editable="false"
          class="doc-preview" />
      </div>
    </app-dialog>
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
          width: 120,
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
          content: '# 故障排查\n\n## 现象\n- \n\n## 影响范围\n- \n\n## 排查过程\n1. \n\n## 根因\n- \n\n## 解决方案\n- \n\n## 回归验证\n- \n\n## 后续优化\n- '
        },
        {
          label: '方案设计',
          value: 'design',
          content: '# 方案设计\n\n## 背景\n- \n\n## 目标\n- \n\n## 方案概述\n- \n\n## 核心流程\n1. \n\n## 风险与取舍\n- \n\n## 里程碑\n- '
        },
        {
          label: '知识点',
          value: 'knowledge',
          content: '# 知识点整理\n\n## 结论/要点\n- \n\n## 解释说明\n- \n\n## 示例\n```\n\n```\n\n## 参考资料\n- '
        }
      ],
      categoryList: [],
      categoryTree: [],
      categorySnapshot: {},
      categoryDragSnapshot: [],
      draggingCategoryId: null,
      rootDropActive: false,
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
      const keepCategoryId = this.currentCategory ? this.currentCategory.id : null;
      this.loading = true;
      this.$http.get('/work-doc-category/list', {params: {status: 1}}).then(res => {
        this.loading = false;
        if (res.data.code === 0) {
          this.categoryList = this.normalizeCategoryList(res.data.data || []);
          this.rebuildCategoryTree();
          this.$nextTick(() => {
            const targetCategory = this.findCategoryById(keepCategoryId) || this.categoryTree[0] || null;
            if (targetCategory) {
              this.onCategoryClick(targetCategory);
              this.$refs.tree && this.$refs.tree.setCurrentKey(targetCategory.id);
            } else {
              this.currentCategory = null;
              this.where.category_id = null;
            }
          });
        } else {
          this.categoryList = [];
          this.categoryTree = [];
          this.categorySnapshot = {};
        }
      }).catch(() => {
        this.loading = false;
        this.categoryList = [];
        this.categoryTree = [];
        this.categorySnapshot = {};
      });
    },
    normalizeCategory(item) {
      const normalized = Object.assign({}, item);
      const parentId = Number(normalized.parent_id !== undefined ? normalized.parent_id : (normalized.parentId || 0));
      normalized.parent_id = parentId;
      normalized.parentId = parentId;
      normalized.icon = normalized.icon || '';
      normalized.sort = Number(normalized.sort || 0);
      if (Array.isArray(normalized.children) && normalized.children.length) {
        normalized.children = this.normalizeCategoryList(normalized.children);
      } else {
        delete normalized.children;
      }
      return normalized;
    },
    normalizeCategoryList(list) {
      return (list || []).map(item => this.normalizeCategory(item));
    },
    rebuildCategoryTree() {
      const normalizedList = this.normalizeCategoryList(this.categoryList);
      this.categoryList = normalizedList;
      this.categoryTree = this.$util.toTreeData(normalizedList, 'id', 'parent_id');
      this.categorySnapshot = this.createCategorySnapshot(normalizedList);
    },
    createCategorySnapshot(list) {
      return (list || []).reduce((result, item) => {
        result[item.id] = {
          parentId: Number(item.parent_id || 0),
          sort: Number(item.sort || 0)
        };
        return result;
      }, {});
    },
    findCategoryById(id, nodes) {
      const treeNodes = nodes || this.categoryTree;
      if (!id || !treeNodes || !treeNodes.length) {
        return null;
      }
      for (let i = 0; i < treeNodes.length; i++) {
        const item = treeNodes[i];
        if (item.id === id) {
          return item;
        }
        if (item.children && item.children.length) {
          const target = this.findCategoryById(id, item.children);
          if (target) {
            return target;
          }
        }
      }
      return null;
    },
    resolveCategoryIcon(data, node) {
      if (data && data.icon) {
        return data.icon;
      }
      return node && node.expanded ? 'el-icon-folder-opened' : 'el-icon-folder';
    },
    onCategoryClick(node) {
      this.currentCategory = node;
      this.where.category_id = node ? node.id : null;
      this.reloadDocs();
    },
    allowCategoryDrag() {
      return !this.loading;
    },
    allowCategoryDrop(draggingNode, dropNode, type) {
      if (!draggingNode || !dropNode || !draggingNode.data || !dropNode.data) {
        return false;
      }
      if (draggingNode.data.id === dropNode.data.id) {
        return false;
      }
      if (this.isCategoryInBranch(draggingNode.data, dropNode.data.id)) {
        return false;
      }
      return ['inner', 'before', 'after'].indexOf(type) !== -1;
    },
    onCategoryDragStart(draggingNode) {
      this.categoryDragSnapshot = this.cloneCategoryTree(this.categoryTree);
      this.draggingCategoryId = draggingNode && draggingNode.data ? draggingNode.data.id : null;
      this.rootDropActive = false;
    },
    onCategoryDragEnd() {
      this.rootDropActive = false;
      this.draggingCategoryId = null;
    },
    cloneCategoryTree(nodes) {
      return JSON.parse(JSON.stringify(nodes || []));
    },
    isCategoryInBranch(node, targetId) {
      if (!node) {
        return false;
      }
      if (node.id === targetId) {
        return true;
      }
      if (!node.children || !node.children.length) {
        return false;
      }
      return node.children.some(child => this.isCategoryInBranch(child, targetId));
    },
    onRootDropZoneOver() {
      if (this.draggingCategoryId) {
        this.rootDropActive = true;
      }
    },
    onRootDropZoneEnter() {
      if (this.draggingCategoryId) {
        this.rootDropActive = true;
      }
    },
    onRootDropZoneLeave(event) {
      const currentTarget = event.currentTarget;
      const relatedTarget = event.relatedTarget;
      if (currentTarget && relatedTarget && currentTarget.contains(relatedTarget)) {
        return;
      }
      this.rootDropActive = false;
    },
    findNodeContainer(nodes, targetId, parentChildren, parentNode) {
      const currentNodes = nodes || [];
      for (let i = 0; i < currentNodes.length; i++) {
        const item = currentNodes[i];
        if (item.id === targetId) {
          return {
            index: i,
            nodes: currentNodes,
            node: item,
            parentChildren: parentChildren || null,
            parentNode: parentNode || null
          };
        }
        if (item.children && item.children.length) {
          const found = this.findNodeContainer(item.children, targetId, item.children, item);
          if (found) {
            return found;
          }
        }
      }
      return null;
    },
    moveCategoryTreeNode(tree, draggingId, dropId, dropType) {
      const nextTree = this.cloneCategoryTree(tree);
      const dragging = this.findNodeContainer(nextTree, draggingId);
      if (!dragging) {
        return nextTree;
      }
      const draggingNode = dragging.node;
      dragging.nodes.splice(dragging.index, 1);

      const drop = this.findNodeContainer(nextTree, dropId);
      if (!drop) {
        return nextTree;
      }

      if (dropType === 'inner') {
        drop.node.children = drop.node.children || [];
        drop.node.children.push(draggingNode);
        return nextTree;
      }

      const targetNodes = drop.nodes;
      const insertIndex = dropType === 'before' ? drop.index : drop.index + 1;
      targetNodes.splice(insertIndex, 0, draggingNode);
      return nextTree;
    },
    async persistCategoryTree(nextTree) {
      this.categoryTree = nextTree;
      const nextCategoryList = this.flattenCategoryTree(nextTree);
      const changedItems = nextCategoryList.filter(item => {
        const previous = this.categorySnapshot[item.id] || {};
        return Number(previous.parentId || 0) !== Number(item.parent_id || 0) ||
          Number(previous.sort || 0) !== Number(item.sort || 0);
      });

      this.categoryList = nextCategoryList;
      this.categorySnapshot = this.createCategorySnapshot(nextCategoryList);
      this.categoryDragSnapshot = [];

      if (!changedItems.length) {
        this.rootDropActive = false;
        this.draggingCategoryId = null;
        return;
      }

      const loading = this.$loading({
        lock: true,
        text: '正在保存分类顺序...'
      });

      try {
        for (let i = 0; i < changedItems.length; i++) {
          const item = changedItems[i];
          await this.$http.post(`/work-doc-category/${item.id}`, {
            parent_id: item.parent_id,
            sort: item.sort
          });
        }
        this.$message.success('分类结构已更新');
        this.rebuildCategoryTree();
        if (this.currentCategory) {
          const current = this.findCategoryById(this.currentCategory.id);
          if (current) {
            this.currentCategory = current;
            this.where.category_id = current.id;
            this.$nextTick(() => {
              this.$refs.tree && this.$refs.tree.setCurrentKey(current.id);
            });
          }
        }
      } catch (e) {
        this.$message.error(e.message || '分类排序保存失败');
        this.loadCategories();
      } finally {
        this.rootDropActive = false;
        this.draggingCategoryId = null;
        loading.close();
      }
    },
    async onRootDrop() {
      if (!this.draggingCategoryId) {
        this.rootDropActive = false;
        return;
      }
      const sourceTree = this.categoryDragSnapshot && this.categoryDragSnapshot.length
        ? this.categoryDragSnapshot
        : this.categoryTree;
      const nextTree = this.moveCategoryToRoot(sourceTree, this.draggingCategoryId);
      await this.persistCategoryTree(nextTree);
    },
    moveCategoryToRoot(tree, draggingId) {
      const nextTree = this.cloneCategoryTree(tree);
      const dragging = this.findNodeContainer(nextTree, draggingId);
      if (!dragging) {
        return nextTree;
      }
      const draggingNode = dragging.node;
      dragging.nodes.splice(dragging.index, 1);
      nextTree.push(draggingNode);
      return nextTree;
    },
    async onCategoryDrop(draggingNode, dropNode, dropType) {
      const sourceTree = this.categoryDragSnapshot && this.categoryDragSnapshot.length
        ? this.categoryDragSnapshot
        : this.categoryTree;
      const nextTree = this.moveCategoryTreeNode(sourceTree, draggingNode.data.id, dropNode.data.id, dropType);
      await this.persistCategoryTree(nextTree);
    },
    flattenCategoryTree(nodes, parentId) {
      const currentParentId = parentId || 0;
      let result = [];
      (nodes || []).forEach((item, index) => {
        const normalized = this.normalizeCategory(item);
        normalized.parent_id = currentParentId;
        normalized.parentId = currentParentId;
        normalized.sort = (index + 1) * 10;
        const children = normalized.children && normalized.children.length ? normalized.children : [];
        delete normalized.children;
        result.push(normalized);
        if (children.length) {
          result = result.concat(this.flattenCategoryTree(children, normalized.id));
        }
      });
      return result;
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
  border-radius: 12px;
  background: linear-gradient(180deg, #fbfcff 0%, #f6f8fb 100%);
}

.doc-tree-toolbar {
  padding: 14px 16px 10px;
  border-bottom: 1px solid rgba(31, 35, 41, .08);
  background: rgba(255, 255, 255, .78);
  position: sticky;
  top: 0;
  z-index: 1;
  backdrop-filter: blur(8px);
}

.doc-tree-toolbar__title {
  font-size: 15px;
  font-weight: 600;
  color: #24324a;
}

.doc-tree-toolbar__tips {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.5;
  color: #6b778c;
}

.doc-tree-root-drop {
  margin: 10px 12px 2px;
  padding: 10px 12px;
  border: 1px dashed rgba(52, 120, 246, .28);
  border-radius: 10px;
  background: rgba(52, 120, 246, .04);
  color: #5d6b82;
  font-size: 12px;
  text-align: center;
  transition: all .2s ease;
}

.doc-tree-root-drop.is-active {
  border-color: #3478f6;
  background: rgba(52, 120, 246, .12);
  color: #1f5ed6;
}

.doc-tree-group ::v-deep .el-tree-node__content {
  height: 46px;
  margin: 4px 10px;
  border-radius: 10px;
}

.doc-tree-group ::v-deep .el-tree-node__content > .el-tree-node__expand-icon {
  margin-left: 10px;
}

.doc-tree-group ::v-deep .el-tree-node.is-current > .el-tree-node__content {
  background: rgba(52, 120, 246, .12);
}

.doc-tree-group ::v-deep .el-tree-node__content:hover {
  background: rgba(52, 120, 246, .08);
}

.doc-tree-group ::v-deep .el-tree-node__drop-inner {
  background: #3478f6;
}

.doc-tree-group ::v-deep .el-tree-node.is-drop-inner > .el-tree-node__content {
  background: rgba(52, 120, 246, .12);
}

.doc-tree-node {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.doc-tree-node__main {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: move;
}

.doc-tree-node__folder {
  color: #d7a542;
  font-size: 16px;
}

.doc-tree-node__label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 500;
  color: #24324a;
}

.doc-tree-node__meta {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #7c889b;
  font-size: 11px;
}

.doc-panel {
  min-height: calc(100vh - 206px);
  border: 1px solid rgba(31, 35, 41, .08);
  border-radius: 14px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
  padding: 14px 16px 6px;
}

.doc-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.doc-panel__heading {
  font-size: 18px;
  font-weight: 700;
  color: #24324a;
}

.doc-panel__desc {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
  font-size: 12px;
  color: #728197;
}

.doc-panel__desc i {
  color: #3478f6;
}

.doc-panel__dot {
  color: #b7c0cc;
}

.doc-table-title {
  min-width: 0;
}

.doc-meta {
  font-size: 12px;
  color: #7f8a9b;
  margin-top: 5px;
  line-height: 1.6;
}

.doc-meta span {
  margin-right: 12px;
}

.doc-preview-dialog ::v-deep .el-dialog__header {
  padding: 18px 22px 10px;
  border-bottom: 1px solid rgba(31, 35, 41, .08);
  background:
    radial-gradient(circle at top left, rgba(52, 120, 246, .12), transparent 42%),
    linear-gradient(180deg, #fbfcff 0%, #f3f7fc 100%);
}

.doc-preview-dialog ::v-deep .el-dialog {
  overflow: hidden;
  border-radius: 18px;
  background: #f6f8fb;
}

.doc-preview-dialog ::v-deep .el-dialog__body {
  padding: 0;
}

.doc-preview-dialog ::v-deep .el-dialog__headerbtn {
  top: 18px;
  right: 18px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid rgba(31, 35, 41, .08);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 18px rgba(36, 50, 74, .08);
  transition: all .2s ease;
}

.doc-preview-dialog ::v-deep .el-dialog__headerbtn .el-dialog__close {
  color: #5f6b7a;
  font-size: 14px;
  font-weight: 700;
}

.doc-preview-dialog ::v-deep .el-dialog__headerbtn:hover {
  background: #eef4ff;
  border-color: rgba(52, 120, 246, .26);
  box-shadow: 0 10px 20px rgba(52, 120, 246, .12);
  transform: translateY(-1px);
}

.doc-preview-dialog ::v-deep .el-dialog__headerbtn:hover .el-dialog__close {
  color: #2f6bff;
}

.doc-preview-title {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.doc-preview-name {
  min-width: 0;
}

.doc-preview-name__text {
  font-size: 20px;
  font-weight: 700;
  color: #24324a;
  line-height: 1.4;
}

.doc-preview-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  margin-top: 8px;
}

.doc-preview-meta__item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, .72);
  border: 1px solid rgba(31, 35, 41, .08);
  color: #617089;
  font-size: 12px;
}

.doc-preview-meta__item i {
  color: #3478f6;
}

.doc-preview-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.doc-action-group {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.doc-icon-button {
  box-shadow: none;
}

.doc-icon-button.el-button--mini.is-circle {
  padding: 6px;
}

.doc-preview-shell {
  padding: 20px 22px 24px;
  background:
    linear-gradient(180deg, rgba(244, 248, 253, .95) 0%, rgba(248, 250, 252, 1) 100%);
}

.doc-preview-hero {
  margin-bottom: 16px;
  padding: 16px 18px;
  border-radius: 16px;
  background:
    linear-gradient(135deg, rgba(52, 120, 246, .1), rgba(28, 180, 140, .08));
  border: 1px solid rgba(52, 120, 246, .12);
}

.doc-preview-hero__eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: #2f6bff;
}

.doc-preview-hero__summary {
  margin-top: 8px;
  color: #52627c;
  font-size: 13px;
}

.doc-preview-hero__divider {
  margin: 0 8px;
  color: #9aa8bb;
}

.doc-preview-hero__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.doc-preview-hero__tag {
  border-radius: 999px;
  border-color: rgba(52, 120, 246, .18);
  background: rgba(255, 255, 255, .75);
}

.doc-preview ::v-deep .v-note-wrapper {
  border: 1px solid rgba(31, 35, 41, .08);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(36, 50, 74, .08);
}

.doc-preview ::v-deep .v-note-panel {
  background: transparent;
}

.doc-preview ::v-deep .v-note-show {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(252, 253, 255, 1) 100%);
}

.doc-preview ::v-deep .v-show-content {
  padding: 26px 30px 34px !important;
}

.doc-preview ::v-deep .markdown-body {
  font-family: "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", sans-serif;
  font-size: 15px;
  line-height: 1.85;
  color: #263449;
}

.doc-preview ::v-deep .markdown-body h1,
.doc-preview ::v-deep .markdown-body h2,
.doc-preview ::v-deep .markdown-body h3 {
  color: #1f2f46;
  letter-spacing: .01em;
}

.doc-preview ::v-deep .markdown-body h2 {
  margin-top: 1.8em;
  padding-left: 12px;
  border-left: 4px solid #3478f6;
}

.doc-preview ::v-deep .markdown-body blockquote {
  color: #52627c;
  background: rgba(52, 120, 246, .05);
  border-left-color: #7ea8ff;
  border-radius: 0 12px 12px 0;
  padding: 10px 14px;
}

.doc-preview ::v-deep .markdown-body code {
  color: #bf4a3f;
  background: rgba(191, 74, 63, .08);
  border-radius: 6px;
  padding: 2px 6px;
}

.doc-preview ::v-deep .markdown-body pre {
  background: #17212f;
  border-radius: 14px;
  padding: 16px 18px;
}

.doc-preview ::v-deep .markdown-body pre code {
  color: #dbe7ff;
  background: transparent;
  padding: 0;
}
</style>
