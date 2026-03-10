<template>
  <div class="ele-body ele-body-card">
    <!-- 顶部欢迎卡片 -->
    <el-card body-style="padding: 20px;" shadow="never">
      <div class="ele-cell workplace-user-card">
        <div class="ele-cell-content ele-cell">
          <el-avatar :size="68" :src="loginUser.avatar"/>
          <div class="ele-cell-content">
            <h4 class="ele-elip">
              {{ helloPrev }},
              {{ loginUser.nickname }}，
              祝你生活愉快!
              <guide :show="true" />
            </h4>
            <div class="ele-text-secondary ele-elip" style="margin-top: 8px;">
              <i :class="weatherIcon"></i>
              <span :title="weather"><s/><s/>{{ weather }}</span>
            </div>
          </div>
        </div>
        <div class="workplace-count-group">
          <div class="workplace-count-item">
            <div class="workplace-count-header">
              <el-tag class="ele-tag-round" size="small" effect="dark" color="#409EFF">
                <i class="el-icon-chat-dot-round"></i>
              </el-tag>
              <span class="workplace-count-name">今日会话</span>
            </div>
            <div class="workplace-count-num">{{ chatStats.todayChats }}</div>
          </div>
          <div class="workplace-count-item">
            <div class="workplace-count-header">
              <el-tag class="ele-tag-round" size="small" effect="dark" color="#67C23A">
                <i class="el-icon-message"></i>
              </el-tag>
              <span class="workplace-count-name">消息总量</span>
            </div>
            <div class="workplace-count-num">{{ chatStats.totalMessages.toLocaleString() }}</div>
          </div>
          <div class="workplace-count-item">
            <div class="workplace-count-header">
              <el-tag class="ele-tag-round" size="small" effect="dark" color="#E6A23C">
                <i class="el-icon-user-solid"></i>
              </el-tag>
              <span class="workplace-count-name">活跃用户</span>
            </div>
            <div class="workplace-count-num">{{ chatStats.activeUsers }}</div>
          </div>
          <div class="workplace-count-item">
            <div class="workplace-count-header">
              <el-tag class="ele-tag-round" size="small" effect="dark" color="#F56C6C">
                <i class="el-icon-bell"></i>
              </el-tag>
              <span class="workplace-count-name">待回复</span>
            </div>
            <div class="workplace-count-num">{{ chatStats.pendingReplies }}</div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 快捷入口 -->
    <el-row :gutter="15">
      <el-col :lg="3" :md="6" :sm="6" :xs="12" v-for="(link, index) in quickLinks" :key="index">
        <el-card body-style="padding: 0;" shadow="hover">
          <router-link class="app-link-block" :to="link.path">
            <i class="app-link-icon" :class="link.icon" :style="{color: link.color}"></i>
            <div class="app-link-title">{{ link.title }}</div>
          </router-link>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域第一行：消息趋势 + 项目分布 -->
    <el-row :gutter="15">
      <el-col :lg="16" :md="24">
        <el-card header="📈 消息趋势统计" shadow="never" :body-style="{padding: '15px'}">
          <div ref="messageTrendChart" style="height: 320px;"></div>
        </el-card>
      </el-col>
      <el-col :lg="8" :md="24">
        <el-card header="📊 项目状态分布" shadow="never" :body-style="{padding: '15px'}">
          <div ref="projectPieChart" style="height: 320px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域第二行：团队活跃度 + 消息类型 + 实时会话 -->
    <el-row :gutter="15">
      <el-col :lg="8" :md="12">
        <el-card header="🎯 团队成员活跃度" shadow="never" :body-style="{padding: '15px'}">
          <div ref="teamRadarChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
      <el-col :lg="8" :md="12">
        <el-card header="💬 消息类型分布" shadow="never" :body-style="{padding: '15px'}">
          <div ref="messageTypeChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
      <el-col :lg="8" :md="24">
        <el-card header="🔥 实时会话热度" shadow="never" :body-style="{padding: '15px'}">
          <div ref="conversationHeatChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 动态与任务 -->
    <el-row :gutter="15">
      <el-col :lg="8" :md="12">
        <el-card header="📝 最新动态" shadow="never" :body-style="{padding: 0}">
          <el-scrollbar style="height: 360px;" viewStyle="padding: 20px 10px;" wrapStyle="overflow-x: hidden;">
            <el-timeline :reverse="false" class="ele-timeline ele-timeline-act">
              <el-timeline-item
                v-for="(act, index) in activities"
                :key="index"
                :timestamp="act.timestamp"
                :type="act.type || ''"
                :icon="act.icon">
                <div class="timeline-content">
                  <div class="timeline-title">{{ act.title }}</div>
                  <div class="timeline-desc" v-if="act.desc">{{ act.desc }}</div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :lg="8" :md="12">
        <el-card header="✅ 待办任务" shadow="never" :body-style="{padding: 0}">
          <div class="task-list" style="height: 360px; overflow-y: auto;">
            <div v-for="(task, index) in taskList" :key="index" class="task-item">
              <div class="task-checkbox">
                <el-checkbox v-model="task.completed" @change="toggleTask(task)">
                  <span :class="{'task-completed': task.completed}">{{ task.taskName }}</span>
                </el-checkbox>
              </div>
              <div class="task-meta">
                <el-tag :type="task.priorityType" size="mini" effect="plain">{{ task.priorityLabel }}</el-tag>
                <span class="task-deadline" v-if="task.deadline">
                  <i class="el-icon-time"></i> {{ task.deadline }}
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="8" :md="24">
        <el-card header="👥 在线成员" shadow="never" :body-style="{padding: '10px 0'}">
          <div style="height: 360px; overflow-y: auto;">
            <div v-for="(item, index) in userList" :key="index" class="ele-cell user-list-item">
              <div class="avatar-wrapper">
                <el-avatar :size="42" :src="item.avatar"/>
                <span class="online-status" :class="item.state === 0 ? 'online' : 'offline'"></span>
              </div>
              <div class="ele-cell-content">
                <div class="ele-cell-title">{{ item.name }}</div>
                <div class="ele-cell-desc">
                  <span v-if="item.currentTask">
                    <i class="el-icon-loading" v-if="item.state === 0"></i>
                    {{ item.currentTask }}
                  </span>
                  <span v-else>{{ item.desc }}</span>
                </div>
              </div>
              <el-tag :type="item.state === 0 ? 'success' : 'info'" size="mini" effect="dark">
                {{ item.state === 0 ? '在线' : '离线' }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 项目进度表格 -->
    <el-row :gutter="15">
      <el-col :span="24">
        <el-card header="🚀 项目进度概览" shadow="never">
          <div ref="projectGanttChart" style="height: 280px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Guide from "@/components/guide.vue";
import * as echarts from 'echarts';

export default {
  name: 'DashboardWorkplace',
  components: {Guide},
  data() {
    return {
      // 聊天统计数据
      chatStats: {
        todayChats: 128,
        totalMessages: 15890,
        activeUsers: 45,
        pendingReplies: 8
      },
      // 快捷入口
      quickLinks: [
        { title: '系统用户', path: '/system/user', icon: 'el-icon-user', color: '#409EFF' },
        { title: '角色管理', path: '/system/role', icon: 'el-icon-data-line', color: '#67C23A' },
        { title: '菜单管理', path: '/system/menu', icon: 'el-icon-menu', color: '#E6A23C' },
        { title: '消息中心', path: '/message/chat', icon: 'el-icon-chat-dot-round', color: '#F56C6C' },
        { title: '数据分析', path: '/data/analysis', icon: 'el-icon-data-analysis', color: '#909399' },
        { title: '通知公告', path: '/message/notice', icon: 'el-icon-bell', color: '#5cdbd3' },
        { title: '任务看板', path: '/task/board', icon: 'el-icon-s-order', color: '#ff85c0' },
        { title: '个人中心', path: '/user/profile', icon: 'el-icon-s-operation', color: '#ffc069' }
      ],
      // 图表实例
      charts: {},
      // 动态数据
      activities: [
        { title: '新用户注册', desc: '用户 zhangsan 刚刚完成注册', timestamp: '20:30', type: 'primary', icon: 'el-icon-user' },
        { title: '收到新消息', desc: '来自客服系统的3条未读消息', timestamp: '20:15', type: 'success', icon: 'el-icon-message' },
        { title: '项目进度更新', desc: '交易系统进度达到 85%', timestamp: '19:45', type: 'warning', icon: 'el-icon-s-data' },
        { title: '任务完成', desc: '"接口文档编写" 任务已标记完成', timestamp: '19:20', type: 'success', icon: 'el-icon-check' },
        { title: '团队通知', desc: '明天上午10点团队例会', timestamp: '18:30', type: 'primary', icon: 'el-icon-bell' },
        { title: '代码提交', desc: '周许峰提交了 5 个 commit', timestamp: '17:45', type: 'info', icon: 'el-icon-upload2' },
        { title: '系统警告', desc: 'API 响应时间超过阈值', timestamp: '16:20', type: 'danger', icon: 'el-icon-warning' }
      ],
      // 任务数据
      taskList: [
        { id: 1, priority: 1, priorityType: 'danger', priorityLabel: '紧急', taskName: '修复生产环境 Bug', deadline: '今天', completed: false },
        { id: 2, priority: 2, priorityType: 'warning', priorityLabel: '高', taskName: '优化数据库查询性能', deadline: '明天', completed: false },
        { id: 3, priority: 2, priorityType: 'warning', priorityLabel: '高', taskName: '完成周报撰写', deadline: '周五', completed: true },
        { id: 4, priority: 3, priorityType: 'primary', priorityLabel: '中', taskName: '更新 API 接口文档', deadline: '', completed: false },
        { id: 5, priority: 3, priorityType: 'primary', priorityLabel: '中', taskName: 'Code Review', deadline: '', completed: true },
        { id: 6, priority: 4, priorityType: 'info', priorityLabel: '低', taskName: '整理项目文档', deadline: '', completed: false }
      ],
      // 小组成员数据
      userList: [
        { name: '白音那木拉', desc: '系统架构师', state: 0, avatar: require('@/assets/logo.png'), currentTask: '设计微服务架构' },
        { name: '张雷', desc: 'WEB前端工程师', state: 0, avatar: require('@/assets/logo.png'), currentTask: '开发仪表盘页面' },
        { name: '周许峰', desc: 'GO后端工程师', state: 0, avatar: require('@/assets/logo.png'), currentTask: '优化API性能' },
        { name: '蒋丽萍', desc: '产品经理', state: 1, avatar: require('@/assets/logo.png'), currentTask: '' },
        { name: '金亚仙', desc: '测试工程师', state: 1, avatar: require('@/assets/logo.png'), currentTask: '' },
        { name: '李明', desc: '运维工程师', state: 0, avatar: require('@/assets/logo.png'), currentTask: '部署CI/CD流程' }
      ],
      weather: this.getWeatherInfo(),
      weatherIcon: this.getWeatherType('normal')
    };
  },
  computed: {
    loginUser() {
      return this.$store.state.user.user;
    },
    helloPrev() {
      let content = "晚上好";
      let currentHour = new Date().getHours();
      if (currentHour > 6 && currentHour <= 11) {
        content = "早上好";
      } else if (currentHour > 11 && currentHour <= 13) {
        content = "中午好";
      } else if (currentHour > 13 && currentHour <= 18) {
        content = "下午好";
      }
      return content;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initCharts();
    });
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    Object.values(this.charts).forEach(chart => chart.dispose());
  },
  methods: {
    // 初始化所有图表
    initCharts() {
      this.initMessageTrendChart();
      this.initProjectPieChart();
      this.initTeamRadarChart();
      this.initMessageTypeChart();
      this.initConversationHeatChart();
      this.initProjectGanttChart();
    },

    // 消息趋势折线图
    initMessageTrendChart() {
      const chart = echarts.init(this.$refs.messageTrendChart);
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } }
        },
        legend: {
          data: ['私聊消息', '群聊消息', '系统通知'],
          bottom: 0
        },
        grid: {
          left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: { type: 'value' },
        series: [
          {
            name: '私聊消息',
            type: 'line',
            smooth: true,
            stack: 'Total',
            areaStyle: { opacity: 0.3 },
            emphasis: { focus: 'series' },
            data: [120, 132, 101, 134, 90, 230, 210],
            itemStyle: { color: '#409EFF' }
          },
          {
            name: '群聊消息',
            type: 'line',
            smooth: true,
            stack: 'Total',
            areaStyle: { opacity: 0.3 },
            emphasis: { focus: 'series' },
            data: [220, 182, 191, 234, 290, 330, 310],
            itemStyle: { color: '#67C23A' }
          },
          {
            name: '系统通知',
            type: 'line',
            smooth: true,
            stack: 'Total',
            areaStyle: { opacity: 0.3 },
            emphasis: { focus: 'series' },
            data: [150, 232, 201, 154, 190, 330, 410],
            itemStyle: { color: '#E6A23C' }
          }
        ]
      };
      chart.setOption(option);
      this.charts.messageTrend = chart;
    },

    // 项目状态饼图
    initProjectPieChart() {
      const chart = echarts.init(this.$refs.projectPieChart);
      const option = {
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        legend: { orient: 'vertical', left: 'left', top: 'center' },
        series: [
          {
            name: '项目状态',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: { show: false, position: 'center' },
            emphasis: {
              label: { show: true, fontSize: 20, fontWeight: 'bold' }
            },
            labelLine: { show: false },
            data: [
              { value: 3, name: '进行中', itemStyle: { color: '#409EFF' } },
              { value: 1, name: '已延期', itemStyle: { color: '#F56C6C' } },
              { value: 2, name: '未开始', itemStyle: { color: '#E6A23C' } },
              { value: 5, name: '已完成', itemStyle: { color: '#67C23A' } }
            ]
          }
        ]
      };
      chart.setOption(option);
      this.charts.projectPie = chart;
    },

    // 团队活跃度雷达图
    initTeamRadarChart() {
      const chart = echarts.init(this.$refs.teamRadarChart);
      const option = {
        tooltip: {},
        legend: { data: ['团队平均', '我'], bottom: 0 },
        radar: {
          indicator: [
            { name: '代码提交', max: 100 },
            { name: 'Code Review', max: 100 },
            { name: '文档编写', max: 100 },
            { name: 'Bug 修复', max: 100 },
            { name: '会议参与', max: 100 },
            { name: '知识分享', max: 100 }
          ]
        },
        series: [{
          name: '活跃度对比',
          type: 'radar',
          data: [
            {
              value: [85, 70, 60, 75, 90, 65],
              name: '团队平均',
              itemStyle: { color: '#409EFF' },
              areaStyle: { opacity: 0.3 }
            },
            {
              value: [90, 85, 75, 80, 85, 70],
              name: '我',
              itemStyle: { color: '#67C23A' },
              areaStyle: { opacity: 0.3 }
            }
          ]
        }]
      };
      chart.setOption(option);
      this.charts.teamRadar = chart;
    },

    // 消息类型分布环形图
    initMessageTypeChart() {
      const chart = echarts.init(this.$refs.messageTypeChart);
      const option = {
        tooltip: { trigger: 'item' },
        series: [
          {
            name: '消息类型',
            type: 'pie',
            radius: ['30%', '60%'],
            roseType: 'radius',
            itemStyle: { borderRadius: 8 },
            data: [
              { value: 40, name: '文本消息', itemStyle: { color: '#409EFF' } },
              { value: 30, name: '图片', itemStyle: { color: '#67C23A' } },
              { value: 20, name: '文件', itemStyle: { color: '#E6A23C' } },
              { value: 15, name: '语音', itemStyle: { color: '#F56C6C' } },
              { value: 10, name: '表情', itemStyle: { color: '#909399' } }
            ],
            label: {
              formatter: '{b}\n{c}条 ({d}%)'
            }
          }
        ]
      };
      chart.setOption(option);
      this.charts.messageType = chart;
    },

    // 会话热度柱状图
    initConversationHeatChart() {
      const chart = echarts.init(this.$refs.conversationHeatChart);
      const option = {
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'value', boundaryGap: [0, 0.01] },
        yAxis: {
          type: 'category',
          data: ['凌晨', '早上', '上午', '中午', '下午', '晚上']
        },
        series: [
          {
            name: '活跃会话数',
            type: 'bar',
            data: [12, 45, 120, 80, 150, 95],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
              ])
            }
          }
        ]
      };
      chart.setOption(option);
      this.charts.conversationHeat = chart;
    },

    // 项目甘特图
    initProjectGanttChart() {
      const chart = echarts.init(this.$refs.projectGanttChart);
      const data = [
        { name: '个人后台管理系统', value: [0, 60, '进行中'] },
        { name: '征信系统', value: [1, 0, '已延期'] },
        { name: '交易系统', value: [2, 100, '已完成'] },
        { name: '办公自动化系统', value: [3, 100, '已完成'] },
        { name: '融资系统', value: [4, 100, '已完成'] }
      ];
      const option = {
        tooltip: {
          formatter: function(params) {
            return params.marker + params.name + ': ' + params.value[2] + ' (' + params.value[1] + '%)';
          }
        },
        grid: { left: '15%', right: '10%', top: '5%', bottom: '5%' },
        xAxis: {
          type: 'value',
          min: 0,
          max: 100,
          axisLabel: { formatter: '{value}%' }
        },
        yAxis: {
          type: 'category',
          data: data.map(item => item.name),
          axisLabel: { interval: 0 }
        },
        series: [
          {
            type: 'bar',
            data: data.map(item => ({
              value: item.value[1],
              name: item.name,
              itemStyle: {
                color: item.value[1] === 100 ? '#67C23A' : 
                       item.value[2] === '已延期' ? '#F56C6C' : '#409EFF'
              }
            })),
            label: {
              show: true,
              position: 'right',
              formatter: '{c}%'
            },
            barWidth: '50%'
          }
        ]
      };
      chart.setOption(option);
      this.charts.projectGantt = chart;
    },

    // 响应窗口大小变化
    handleResize() {
      Object.values(this.charts).forEach(chart => chart.resize());
    },

    // 切换任务状态
    toggleTask(task) {
      this.$message.success(`任务"${task.taskName}"已${task.completed ? '完成' : '恢复'}！`);
    },

    // 天气图标
    getWeatherType(name) {
      const icons = {
        'sun': 'el-icon-sunny',
        'cloudy': 'el-icon-cloudy',
        'party-cloudy': 'el-icon-partly-cloudy',
        'lightning': 'el-icon-lightning',
        'rain': 'el-icon-light-rain',
        'heavy-rain': 'el-icon-heavy-rain',
        'snow': 'el-icon-_snow',
        'normal': 'el-icon-loading'
      };
      return icons[name] || icons['normal'];
    },

    // 获取天气信息
    getWeatherInfo() {
      this.$http.get('/weather').then(res => {
        if (res.data.code === 0) {
          let weather = res.data.data;
          this.weatherIcon = this.getWeatherType(this.parseWeather(weather.weather));
          this.weather = `当前${weather.city}天气${weather.weather}, 温度: ${weather.temperature}℃, 湿度: ${weather.humidity}%, ${weather.winddirection}风${weather.windpower}级`;
        } else {
          this.weather = res.data.msg;
        }
      }).catch(e => {
        this.weather = e.message;
      });
      return '获取实时天气中...';
    },

    parseWeather(weatherStr) {
      if (weatherStr.includes('暴')) return 'heavy-rain';
      if (weatherStr.includes('雨')) return 'rain';
      if (weatherStr.includes('晴')) return 'sun';
      if (weatherStr.includes('雪')) return 'snow';
      if (weatherStr.includes('云')) return 'cloudy';
      if (weatherStr.includes('阴')) return 'party-cloudy';
      if (weatherStr.includes('雷')) return 'lightning';
      return 'normal';
    }
  }
};
</script>

<style scoped>
/* 顶部用户信息卡片 */
.workplace-user-card .ele-cell-content { overflow: hidden; }

.workplace-count-group { white-space: nowrap; }

.workplace-count-item {
  padding: 0 5px 0 25px;
  box-sizing: border-box;
  display: inline-block;
  text-align: right;
}

.workplace-count-name { padding-left: 8px; font-size: 12px; color: #666; }

.workplace-count-num {
  font-size: 28px;
  font-weight: 600;
  margin-top: 6px;
  color: #303133;
}

@media screen and (max-width: 992px) {
  .workplace-count-item { padding: 0 5px 0 10px; }
}

@media screen and (max-width: 768px) {
  .workplace-user-card, .workplace-count-group { display: block; }
  .workplace-count-group {
    margin-top: 15px;
    text-align: right;
  }
  .workplace-user-card ::v-deep .el-avatar {
    width: 45px !important;
    height: 45px !important;
  }
  .workplace-user-card h4 { font-size: 16px; }
  .workplace-user-card h4 + .ele-text-secondary { font-size: 12px; }
  .workplace-user-card { margin: -10px; }
}

/* 快捷方式 */
.app-link-block {
  display: block;
  color: inherit;
  padding: 15px 0;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;
}
.app-link-block:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.app-link-block .app-link-icon {
  font-size: 30px;
  margin-top: 5px;
}
.app-link-block .app-link-title { margin-top: 8px; font-size: 13px; }

/* 最新动态时间轴 */
.ele-timeline-act { padding-left: 50px; }
.ele-timeline-act ::v-deep .el-timeline-item__timestamp {
  margin: 0;
  position: absolute;
  top: 3px;
  left: -45px;
}
.ele-timeline-act ::v-deep .el-timeline-item { padding-bottom: 19px; }
.ele-timeline-act ::v-deep .el-timeline-item:last-child { padding-bottom: 0; }

.timeline-content .timeline-title {
  font-weight: 500;
  color: #303133;
}
.timeline-content .timeline-desc {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

/* 任务列表 */
.task-list { padding: 10px 0; }
.task-item {
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
}
.task-item:last-child { border-bottom: none; }
.task-checkbox { margin-bottom: 8px; }
.task-checkbox .task-completed {
  text-decoration: line-through;
  color: #999;
}
.task-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 24px;
}
.task-deadline {
  font-size: 12px;
  color: #909399;
}

/* 小组成员 */
.user-list-item { padding: 12px 20px; }
.user-list-item + .user-list-item { border-top: 1px solid hsla(0, 0%, 60%, .15); }
.user-list-item .ele-cell-desc { margin-top: 5px; font-size: 12px; }

.avatar-wrapper { position: relative; display: inline-block; }
.online-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #fff;
}
.online-status.online { background-color: #67C23A; }
.online-status.offline { background-color: #909399; }

/* 卡片间距 */
.el-row { margin-bottom: 15px; }
.el-row:last-child { margin-bottom: 0; }
</style>
