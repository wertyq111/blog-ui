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

      <!-- 转换面板 -->
      <div v-if="convertPanelVisible" class="convert-panel">
        <div class="convert-panel__body">
          <div class="convert-panel__col">
            <div class="convert-panel__label">输入路径 (每行一个)</div>
            <el-input
              v-model="convertInput"
              type="textarea"
              :rows="6"
              placeholder="粘贴或输入需要转换的路径..."
              @input="onConvertInput"/>
          </div>
          <div class="convert-panel__col">
            <div class="convert-panel__label">转换结果</div>
            <el-input
              v-model="convertOutput"
              type="textarea"
              :rows="6"
              readonly/>
          </div>
        </div>
        <div class="convert-panel__footer">
          <el-button size="small" @click="clearConvert">清空</el-button>
          <el-button
            v-if="convertOutput"
            size="small"
            type="primary"
            icon="el-icon-document-copy"
            @click="copyResult">复制结果
          </el-button>
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
          <el-button
            class="ele-btn-icon"
            :icon="convertPanelVisible ? 'el-icon-close' : 'el-icon-sort'"
            size="small"
            :type="convertPanelVisible ? 'warning' : 'primary'"
            @click="toggleConvertPanel">路径转换
          </el-button>
        </template>
        <!-- 网址 -->
        <template slot="url" slot-scope="{row}">
          <el-link :href="row.url" target="_blank" type="primary">{{ row.url }}</el-link>
        </template>
        <!-- 操作列 -->
        <template slot="action" slot-scope="{row}">
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
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import ConvertPathEdit from './convert-path-edit.vue';

export default {
  name: 'ConvertPath',
  components: {ConvertPathEdit},
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
          width: 130,
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
      // 转换面板
      convertPanelVisible: false,
      convertInput: '',
      convertOutput: '',
      allServerPaths: [],
      convertTimer: null
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
    /* 切换转换面板 */
    toggleConvertPanel() {
      this.convertPanelVisible = !this.convertPanelVisible;
      if (this.convertPanelVisible && !this.allServerPaths.length) {
        this.fetchAllServerPaths();
      }
    },
    /* 加载全部项目配置 */
    fetchAllServerPaths() {
      this.$http.get('/server-path/index', {params: {page: 1, per_page: 999}}).then(res => {
        if (res.data.code === 0) {
          this.allServerPaths = res.data.data || [];
        }
      }).catch(() => {
        this.$message.error('加载项目配置失败');
      });
    },
    /* 输入变化时防抖触发转换 */
    onConvertInput() {
      if (this.convertTimer) clearTimeout(this.convertTimer);
      this.convertTimer = setTimeout(() => {
        this.autoConvert();
      }, 300);
    },
    /* 自动转换逻辑 */
    autoConvert() {
      const input = this.convertInput;
      if (!input || !input.trim()) {
        this.convertOutput = '';
        return;
      }
      const lines = input.split('\n');
      const results = lines.map(line => {
        if (!line.trim()) return '';
        // 预处理: 清除中文, | → /
        let processed = line
          .replace(/[\u4e00-\u9fa5]/g, '')
          .replace(/\|/g, '/')
          .trim();
        if (!processed) return '';
        // 匹配项目配置
        for (const item of this.allServerPaths) {
          const sources = this.parseSources(item.sources);
          for (const source of sources) {
            const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            if (new RegExp(escaped).test(processed)) {
              processed = processed.replace(new RegExp(escaped), item.target);
              return processed.replace(/\\/g, '/');
            }
          }
        }
        return processed.replace(/\\/g, '/');
      });
      this.convertOutput = results.filter(Boolean).join(' ');
    },
    /* 解析 sources JSON */
    parseSources(raw) {
      try {
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
      } catch (e) {
        return [];
      }
    },
    /* 复制转换结果 */
    copyResult() {
      if (!this.convertOutput) return;
      this.$copyText(this.convertOutput).then(() => {
        this.$message.success('已复制到剪贴板');
      }, () => {
        this.$message.error('复制失败');
      });
    },
    /* 清空转换 */
    clearConvert() {
      this.convertInput = '';
      this.convertOutput = '';
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
.convert-panel {
  margin: 14px 0 16px;
  padding: 16px;
  border-radius: 8px;
  border: 1px dashed var(--develop-border, rgba(215, 228, 205, 0.86));
  background: var(--develop-panel-bg, rgba(247, 251, 243, 0.6));
}

.convert-panel__body {
  display: flex;
  gap: 16px;
}

.convert-panel__col {
  flex: 1;
  min-width: 0;
}

.convert-panel__label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--develop-text-soft, #5e6e5a);
}

.convert-panel__footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
</style>
