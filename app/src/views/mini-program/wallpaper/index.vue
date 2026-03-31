<template>
  <div class="ele-body develop-page admin-workspace-page admin-workspace-page--wallpaper">
    <el-card shadow="never" class="develop-shell admin-workspace-shell">

      <section class="develop-hero">
        <div class="develop-hero__copy">
          <div class="develop-hero__eyebrow">Mini Program Console</div>
          <div class="develop-hero__title">壁纸管理</div>
          <div class="develop-hero__desc">维护壁纸资源、分类关系与发布信息，统一壁纸内容工作台。</div>
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
            <el-form-item label="分类:">
              <el-select
                v-model="where.classId"
                class="ele-block"
                clearable
                filterable
                placeholder="-请选择分类-"
                size="small">
                <el-option v-for="item in classifies" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <el-form-item label="发布者:">
              <el-input
                v-model="where.nickname"
                clearable
                placeholder="请输入发布者"/>
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
      <!-- 数据表格 -->
      <section class="develop-table-shell">
        <div class="develop-table-shell__header">
          <div>
            <div class="develop-table-shell__title">壁纸列表</div>
            <div class="develop-table-shell__desc">支持分类筛选、标签查看与图片预览。</div>
          </div>
        </div>
      <ele-pro-table
        ref="table"
        :columns="columns"
        :datasource="url"
        :selection.sync="selection"
        :where="where"
        height="calc(100vh - 315px)">
        <!-- 表头工具栏 -->
        <template slot="toolbar">
          <div class="mini-program-toolbar">
            <el-button
              v-if="permission.includes('sys:wallpaper:add')"
              class="ele-btn-icon"
              icon="el-icon-plus"
              size="small"
              type="primary"
              @click="openEdit(null)">添加
            </el-button>
          </div>
        </template>
        <!-- 略缩图 -->
        <template slot="smallPicUrl" slot-scope="{row}">
          <el-image
            class="mini-program-preview"
            style="width: 100px; height: 100px"
            fit="contain"
            :src="row.smallPicUrl"
            :preview-src-list="[row.url]">
          </el-image>
        </template>
        <!-- 标签 -->
        <template slot="tags" slot-scope="{row}">
          <div class="mini-program-tags">
            <el-tag
              v-for="(item, index) in row.tags"
              :key="index"
              type="primary"
              size="mini">
              {{ item }}
            </el-tag>
          </div>
        </template>
        <!-- 评分 -->
        <template slot="score" slot-scope="{row}">
          <div class="mini-program-score">
            <el-rate
              v-model="row.score"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}分" />
          </div>
        </template>
        <!-- 操作列 -->
        <template slot="action" slot-scope="{row}">
          <el-link
            v-if="permission.includes('sys:wallpaper:edit')"
            :underline="false"
            icon="el-icon-edit"
            type="primary"
            @click="openEdit(row)">修改
          </el-link>
          <el-popconfirm
            class="ele-action"
            title="确定要删除此壁纸吗？"
            @confirm="remove(row)">
            <el-link
              v-if="permission.includes('sys:wallpaper:delete')"
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
    <wallpaper-edit
      :data="current"
      :classifies="classifies"
      :visible.sync="showEdit"
      @done="reload"/>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import WallpaperEdit from './wallpaper-edit.vue';

export default {
  name: 'Member',
  components: {WallpaperEdit},
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/wallpaper/index',
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
          prop: 'smallPicUrl',
          label: '壁纸图片',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          slot: 'smallPicUrl'
        },
        {
          prop: 'classify.name',
          label: '壁纸分类',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'nickname',
          label: '发布者',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
        },
        {
          prop: 'tags',
          label: '标签',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
          slot: 'tags'
        },
        {
          prop: 'score',
          label: '评分',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120,
          slot: 'score'
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
        include: ['classify']
      },
      // 壁纸分类
      classifies: [],
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
  mounted() {
    this.getClassifies()
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
      this.$http.delete(`/wallpaper/${row.id}`).then(res => {
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

    /* 获取壁纸分类 */
    getClassifies() {
      this.$http.get('/wallpaper-classify/list').then(res => {
        if (res.data.code === 0) {
          this.classifies = res.data.data
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },

    /* 更改状态 */
    editStatus(row) {
      const loading = this.$loading({lock: true});
      let params = Object.assign({
        "status": row.status
      })
      this.$http.post(`/wallpaper/${row.id}`, params).then(res => {
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
.mini-program-toolbar {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.mini-program-preview ::v-deep .el-image__inner {
  background: #f7f9fc;
  object-fit: contain;
}

.mini-program-tags {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
}

.mini-program-score {
  display: inline-flex;
  justify-content: center;
  width: 100%;
}
</style>
