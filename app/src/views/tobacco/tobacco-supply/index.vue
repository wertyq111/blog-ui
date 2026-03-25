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
          <el-col :lg="5" :md="12">
            <el-form-item label="结单日期:" prop="settle_date">
              <el-date-picker
                v-model="where.settle_date"
                type="daterange"
                class="ele-fluid"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"/>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <div class="ele-form-actions">
              <el-button
                class="ele-btn-icon"
                icon="el-icon-search"
                type="primary"
                @click="reload(); getStatistics()">查询
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
        :summary-method="getSummaries"
        show-summary
        height="calc(100vh - 315px)">
        <!-- 表头工具栏 -->
        <template slot="toolbar">
          <el-button
            v-if="permission.includes('sys:tobacco-supply:import')"
            class="ele-btn-icon"
            icon="el-icon-upload2"
            size="small"
            @click="showImport=true">导入
          </el-button>
        </template>
      </ele-pro-table>
    </el-card>
    <!-- 导入弹窗 -->
    <import-excel
      :visible.sync="showImport"
      :title="'导入供货限量表'"
      :target="'tobacco-supply'"
      @done="reload"/>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import ImportExcel from "@/components/ImportExcel.vue";

export default {
  name: 'TobaccoSupply',
  components: {ImportExcel},
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/tobacco-supply/index',
      // 表格列配置
      columns: [],
      // 表格搜索条件
      where: {
        include: ['code', 'name']
      },
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示导入弹窗
      showImport: false,
      // 统计值填充
      statisticsFill: {},
      // 统计值
      statisticsData: {},
      // 快捷日期范围选择
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    };
  },
  mounted() {
    this.getStatistics(); // 查询统计信息
    this.getColumns(); //获取动态列
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
    /* 查询统计信息 */
    getStatistics() {
      this.$http.get('/tobacco-supply/statistics', {params: this.where}).then(res => {
        if (res.data.code === 0) {
          this.statisticsData = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 合计 */
    getSummaries(param) {
      const { columns } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'; //可以改合计行的名称
          return;
        }
        if (this.statisticsFill[column.label]) {
          sums[index] = this.statisticsData[this.statisticsFill[column.label]];
        } else {
          sums[index] = '--';
        }
      });

      return sums; //返回sums数组,sums数组中各项就会显示在合计行的各列中
    },
    /* 表格合并行 */
    objectSpanMethod({rowIndex, columnIndex}) {
      // 合并最后一行前 4 列
      let lastRow = this.$refs.table.data.length - 1;
      console.log(lastRow)
      if (rowIndex === lastRow) {
        if (columnIndex === 1) {
          return [1, 3];
        } else if (columnIndex >= 2 && columnIndex < 4) {
          return [0, 0];
        }
      }
    },
    /* 获取动态列 */
    getColumns() {
      const loading = this.$loading({target: '.ele-pro-table', lock: true});
      this.$http.get('/tobacco-supply/getColumns', {params: this.where}).then(res => {
        if (res.data.code === 0) {
          // 清空统计值填充
          this.statisticsFill = {}

          // 清空列
          //this.columns.splice(0, this.columns.length)

          res.data.data.forEach(column => {
            // 动态列添加
            this.columns.push(column)
            // 统计值填充增加
            if(column.isStatistic) {
              this.$set(this.statisticsFill, column.label, column.prop);
            }
          })

          // 初始化表格工具栏列设置
          this.$nextTick(() => {
            this.$refs.table.$refs.toolbar.initColumnList()
          })
          loading.close();
        } else {
          this.$message.error(res.data.msg);
          loading.close();
        }
      }).catch(e => {
        this.$message.error(e.message);
        loading.close();
      });
    },
  }
}
</script>

<style scoped>
/deep/ .el-date-editor--daterange.ele-fluid .el-range-input {
  width:0;
}
</style>
