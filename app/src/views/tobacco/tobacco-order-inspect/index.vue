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
            <el-form-item label="编号:">
              <el-input
                v-model="where.code"
                clearable
                placeholder="请输入编号"/>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <el-form-item label="名称:">
              <el-input
                v-model="where.name"
                clearable
                placeholder="请输入名称"/>
            </el-form-item>
          </el-col>
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
      </ele-pro-table>
    </el-card>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'TobaccoOrderInspect',
  components: {},
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/tobacco-order-inspect/index',
      // 表格列配置
      columns: [
        {
          columnKey: 'index',
          type: 'index',
          width: 45,
          align: 'center',
          showOverflowTooltip: true,
          fixed: "left"
        },
        {
          prop: 'code',
          label: '客户编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },
        {
          prop: 'name',
          label: '负责人',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
        },
        {
          prop: 'stageName',
          label: '客户分类',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'supplyNumber',
          label: '本轮供货量（不含标签供货及云端万家供货）',
          align: 'center',
          sortable: true,
          showOverflowTooltip: true,
          minWidth: 160,
        },
        {
          prop: 'supplement',
          label: '补供名单',
          align: 'center',
          sortable: true,
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'yun',
          label: '云龙补供',
          align: 'center',
          sortable: true,
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'designated',
          label: '1024',
          align: 'center',
          sortable: true,
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'total',
          label: '合计供货量',
          align: 'center',
          sortable: true,
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'order',
          label: '本轮订货数量',
          align: 'center',
          sortable: true,
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'difference',
          label: '订单量差值',
          align: 'center',
          sortable: true,
          showOverflowTooltip: true,
          minWidth: 80
        }
      ],
      // 表格搜索条件
      where: {
        include: ['code', 'name']
      },
      // 表格选中数据
      selection: [],
      // 是否显示导入弹窗
      showImport: false,
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
  mounted() {},
  methods: {
    /* 刷新表格 */
    reload() {
      this.$refs.table.reload({where: this.where});
    },
    /* 重置搜索 */
    reset() {
      this.where = {};
      this.reload();
    }
  }
}
</script>

<style scoped>
/deep/ .el-date-editor--daterange.ele-fluid .el-range-input {
  width:0;
}
</style>
