<template>
  <div class="ele-body ele-body-card">
    <!-- 顶部卡片 -->
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
              <el-tag class="ele-tag-round" size="small">
                <i class="el-icon-menu"></i>
              </el-tag>
              <span class="workplace-count-name">项目数</span>
            </div>
            <div class="workplace-count-num">3</div>
          </div>
          <div class="workplace-count-item">
            <div class="workplace-count-header">
              <el-tag class="ele-tag-round" size="small" type="warning">
                <i class="el-icon-finished"></i>
              </el-tag>
              <span class="workplace-count-name">待办项</span>
            </div>
            <div class="workplace-count-num">6 / 24</div>
          </div>
          <div class="workplace-count-item">
            <div class="workplace-count-header">
              <el-tag class="ele-tag-round" size="small" type="success">
                <i class="el-icon-bell"></i>
              </el-tag>
              <span class="workplace-count-name">消息</span>
            </div>
            <div class="workplace-count-num">1,689</div>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 快捷方式 -->
    <el-row :gutter="15">
      <el-col :lg="3" :md="6" :sm="6" :xs="12">
        <el-card body-style="padding: 0;" shadow="hover">
          <router-link class="app-link-block" to="/system/user">
            <i class="app-link-icon el-icon-user"></i>
            <div class="app-link-title">系统用户</div>
          </router-link>
        </el-card>
      </el-col>
      <el-col :lg="3" :md="6" :sm="6" :xs="12">
        <el-card body-style="padding: 0;" shadow="hover">
          <router-link class="app-link-block" to="/system/role">
            <i class="app-link-icon el-icon-data-line" style="color: #95de64;"></i>
            <div class="app-link-title">角色管理</div>
          </router-link>
        </el-card>
      </el-col>
      <el-col :lg="3" :md="6" :sm="6" :xs="12">
        <el-card body-style="padding: 0;" shadow="hover">
          <router-link class="app-link-block" to="/system/menu">
            <i class="app-link-icon el-icon-shopping-cart-2" style="color: #ff9c6e;"></i>
            <div class="app-link-title">菜单管理</div>
          </router-link>
        </el-card>
      </el-col>
      <el-col :lg="3" :md="6" :sm="6" :xs="12">
        <el-card body-style="padding: 0;" shadow="hover">
          <router-link class="app-link-block" to="/member/memberlevel">
            <i class="app-link-icon el-icon-tickets" style="color: #b37feb;"></i>
            <div class="app-link-title">会员等级</div>
          </router-link>
        </el-card>
      </el-col>
      <el-col :lg="3" :md="6" :sm="6" :xs="12">
        <el-card body-style="padding: 0;" shadow="hover">
          <router-link class="app-link-block" to="/member/member">
            <i class="app-link-icon el-icon-bank-card" style="color: #ffd666;"></i>
            <div class="app-link-title">会员管理</div>
          </router-link>
        </el-card>
      </el-col>
      <el-col :lg="3" :md="6" :sm="6" :xs="12">
        <el-card body-style="padding: 0;" shadow="hover">
          <router-link class="app-link-block" to="/develop/work-doc">
            <i class="app-link-icon el-icon-message" style="color: #5cdbd3;"></i>
            <div class="app-link-title">工作文档</div>
          </router-link>
        </el-card>
      </el-col>
      <el-col :lg="3" :md="6" :sm="6" :xs="12">
        <el-card body-style="padding: 0;" shadow="hover">
          <router-link class="app-link-block" to="/develop/convert-path">
            <i class="app-link-icon el-icon-discount" style="color: #ff85c0;"></i>
            <div class="app-link-title">路径转换</div>
          </router-link>
        </el-card>
      </el-col>
      <el-col :lg="3" :md="6" :sm="6" :xs="12">
        <el-card body-style="padding: 0;" shadow="hover">
          <router-link class="app-link-block" to="/user/profile">
            <i class="app-link-icon el-icon-s-operation" style="color: #ffc069;"></i>
            <div class="app-link-title">个人中心</div>
          </router-link>
        </el-card>
      </el-col>
    </el-row>
    <!-- 最新动态、我的任务、本月目标 -->
    <el-row :gutter="15">
      <el-col :lg="8" :md="12">
        <el-card
          body-style="padding: 0;"
          header="更新动态"
          shadow="never">
          <el-scrollbar
            style="height: 318px;"
            viewStyle="padding: 20px 10px;"
            wrapStyle="overflow-x: hidden;">
            <el-timeline
              :reverse="false"
              class="ele-timeline ele-timeline-act">
              <el-timeline-item
                v-for="(act, index) in activities"
                :key="index"
                :timestamp="act.timestamp"
                :type="act.primary ? 'primary' : ''">
                {{ act.title }}
              </el-timeline-item>
            </el-timeline>
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :lg="8" :md="12">
        <el-card
          body-style="padding: 0;"
          class="workplace-table-card"
          header="升级计划"
          shadow="never">
          <el-table-draggable :animate="300" handle=".sort-handle">
            <el-table :data="taskList" :height="318" class="ele-table-default-head">
              <el-table-column align="center" width="38">
                <i class="sort-handle el-icon-_nav ele-text-placeholder"></i>
              </el-table-column>
              <el-table-column label="优先级" width="65">
                <template slot-scope="{row}">
                  <el-tag
                    :type="['danger','warning','primary'][row.priority-1]"
                    class="ele-tag-round"
                    size="mini">
                    {{ row.priority }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="任务名称">
                <template slot-scope="{row}">
                  <el-link
                    :underline="false"
                    type="primary">
                    {{ row.taskName }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column align="center" label="状态" width="70">
                <template slot-scope="{row}">
                  <span
                    :class="['ele-text-warning','ele-text-success','ele-text-info'][row.state]">
                      {{ ['未开始', '进行中', '已完成'][row.state] }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-table-draggable>
        </el-card>
      </el-col>
      <el-col :lg="8" :md="12" class="hidden-md-and-down">
        <el-card header="本月目标" shadow="never">
          <div class="workplace-goal-group">
            <el-progress
              :format="()=>{return ''}"
              :percentage="80"
              :width="170"
              type="dashboard"/>
            <div class="workplace-goal-content">
              <el-tag
                class="ele-tag-round"
                size="large">
                <i class="el-icon-s-data"></i>
              </el-tag>
              <div class="workplace-goal-num">285</div>
            </div>
            <div class="workplace-goal-text">恭喜，本月目标已达标！</div>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="16" :md="24">
        <el-card
          body-style="padding: 12px;"
          class="workplace-table-card"
          header="项目进度"
          shadow="never">
          <el-table :data="projectList" height="358">
            <el-table-column
              align="right"
              min-width="35"
              type="index"
              width="35"/>
            <el-table-column
              label="项目名称"
              min-width="110">
              <template slot-scope="{row}">
                <el-link
                  :underline="false"
                  type="primary">
                  {{ row.projectName }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="开始时间"
              min-width="80"
              prop="startDate"
              width="95"/>
            <el-table-column
              align="center"
              label="结束时间"
              min-width="80"
              prop="endDate"
              width="95"/>
            <el-table-column
              align="center"
              label="状态"
              min-width="60"
              width="70">
              <template slot-scope="{row}">
                <span
                  :class="['ele-text-success','ele-text-danger','ele-text-warning','ele-text-info ele-text-delete'][row.state]">
                    {{ ['进行中', '已延期', '未开始', '已结束'][row.state] }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="进度"
              min-width="100"
              width="160">
              <template slot-scope="{row}">
                <el-progress :percentage="row.progress" class="ele-text-small"/>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :lg="8" :md="12">
        <el-card
          body-style="padding: 19px 0;"
          header="小组成员"
          shadow="never">
          <div
            v-for="(item, index) in userList"
            :key="index"
            class="ele-cell user-list-item">
            <el-avatar :size="42" :src="item.avatar"/>
            <div class="ele-cell-content">
              <div class="ele-cell-title">{{ item.name }}</div>
              <div class="ele-cell-desc">{{ item.desc }}</div>
            </div>
            <el-tag
              :type="['success','danger'][item.state]"
              size="mini">
              {{ ['在线', '离线'][item.state] }}
            </el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="8" :md="12" class="hidden-lg-and-up">
        <el-card
          body-style="padding: 46px 0;"
          header="本月目标"
          shadow="never">
          <div class="workplace-goal-group">
            <el-progress
              :format="()=>{return ''}"
              :percentage="80"
              :width="170"
              type="dashboard"/>
            <div class="workplace-goal-content">
              <el-tag
                class="ele-tag-round"
                size="large">
                <i class="el-icon-s-data"></i>
              </el-tag>
              <div class="workplace-goal-num">285</div>
            </div>
            <div class="workplace-goal-text">恭喜，本月目标已达标！</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Guide from "@/components/guide.vue";

export default {
  name: 'DashboardWorkplace',
  components: {Guide},
  data() {
    return {
      // 最新动态数据
      activities: [
        {
          title: '个人后台管理操作',
          timestamp: '20:30',
          primary: false
        },
        {
          title: '个人后台管理操作',
          timestamp: '19:30',
          primary: false
        },
        {
          title: '个人后台管理操作',
          timestamp: '18:30',
          primary: true
        },
        {
          title: '个人后台管理操作',
          timestamp: '17:30',
          primary: true
        },
        {
          title: '个人后台管理操作',
          timestamp: '16:30',
          primary: true
        },
        {
          title: '个人后台管理操作',
          timestamp: '15:30',
          primary: false
        },
        {
          title: '个人后台管理操作',
          timestamp: '14:30',
          primary: false
        },
        {
          title: '个人后台管理操作',
          timestamp: '12:30',
          primary: false
        },
        {
          title: '个人后台管理操作',
          timestamp: '11:30',
          primary: true
        },
        {
          title: '个人后台管理操作',
          timestamp: '10:30',
          primary: false
        },
        {
          title: '个人后台管理操作',
          timestamp: '09:30',
          primary: false
        },
        {
          title: '个人后台管理操作',
          timestamp: '08:30',
          primary: false
        }
      ],
      // 我的任务数据
      taskList: [
        {
          id: 1,
          priority: 1,
          taskName: '个人后台管理操作',
          state: 0
        },
        {
          id: 2,
          priority: 2,
          taskName: '个人后台管理操作',
          state: 0
        },
        {
          id: 3,
          priority: 2,
          taskName: '个人后台管理操作',
          state: 1
        },
        {
          id: 4,
          priority: 3,
          taskName: '个人后台管理操作',
          state: 1
        },
        {
          id: 5,
          priority: 3,
          taskName: '个人后台管理操作',
          state: 2
        },
        {
          id: 6,
          priority: 3,
          taskName: '个人后台管理操作',
          state: 2
        }
      ],
      // 项目进度数据
      projectList: [
        {
          projectName: '个人后台管理系统',
          state: 1,
          startDate: '2020-01-01',
          endDate: '2020-05-01',
          progress: 60
        },
        {
          projectName: '征信系统',
          state: 1,
          startDate: '2020-06-01',
          endDate: '2020-10-01',
          progress: 0
        },
        {
          projectName: '交易系统',
          state: 2, startDate: '2020-01-01',
          endDate: '2020-03-01',
          progress: 100
        },
        {
          projectName: '办公自动化系统',
          state: 3,
          startDate: '2020-01-01',
          endDate: '2020-03-01',
          progress: 100
        },
        {
          projectName: '融资系统',
          state: 3,
          startDate: '2020-01-01',
          endDate: '2020-03-01',
          progress: 100
        }
      ],
      // 小组成员数据
      userList: [
        {
          name: '白音那木拉',
          desc: '系统架构师、高级研发工程师',
          state: 0,
          avatar: require('@/assets/logo.png')
        },
        {
          name: '张雷',
          desc: 'WEB前端工程师',
          state: 0,
          avatar: require('@/assets/logo.png')
        },
        {
          name: '周许峰',
          desc: 'GO后端工程师',
          state: 0,
          avatar: require('@/assets/logo.png')
        },
        {
          name: '蒋丽萍',
          desc: '产品经理、视觉设计师',
          state: 1,
          avatar: require('@/assets/logo.png')
        },
        {
          name: '金亚仙',
          desc: '测试工程师、运维工程师',
          state: 1,
          avatar: require('@/assets/logo.png')
        }
      ],
      weather: this.getWeatherInfo(),
      weatherIcon: this.getWeatherType('normal'),
      driver: null
    };
  },
  computed: {
    // 当前登录用户信息
    loginUser() {
      return this.$store.state.user.user;
    },
    // 根据当前时间打招呼
    helloPrev() {
      let content = "晚上好"
      let currentHour = new Date().getHours()
      if (currentHour > 6 && currentHour <= 11) {
        content = "早上好"
      } else if (currentHour > 11 && currentHour <= 13) {
        content = "中午好"
      } else if (currentHour > 13 && currentHour <= 18) {
        content = "下午好"
      }

      return content
    },
  },
  watch: {
  },
  methods: {
    // 天气图标
    getWeatherType(name) {
      switch(name) {
        case 'sun':
          return 'el-icon-sunny';
        case 'cloudy':
          return 'el-icon-cloudy';
        case 'party-cloudy':
          return 'el-icon-partly-cloudy';
        case 'lightning':
          return 'el-icon-lightning';
        case 'rain':
          return 'el-icon-light-rain';
        case 'heavy-rain':
          return 'el-icon-heavy-rain';
        case 'snow':
          return 'el-icon-_snow';
        default:
          return 'el-icon-loading';
      }
    },
    // 获取天气信息
    getWeatherInfo() {
      this.$http.get('/weather').then(res => {
        if (res.data.code === 0) {
          let weather = res.data.data;
          if(weather.weather.includes('暴')) {
            this.weatherIcon = this.getWeatherType('heavy-rain');
          } else if(weather.weather.includes('雨')) {
            this.weatherIcon = this.getWeatherType('rain');
          } else if(weather.weather.includes('晴')) {
            this.weatherIcon = this.getWeatherType('sun');
          } else if(weather.weather.includes('雪')) {
            this.weatherIcon = this.getWeatherType('snow');
          } else if(weather.weather.includes('云')) {
            this.weatherIcon = this.getWeatherType('cloudy');
          } else if(weather.weather.includes('阴')) {
            this.weatherIcon = this.getWeatherType('party-cloudy');
          } else if(weather.weather.includes('雷')) {
            this.weatherIcon = this.getWeatherType('lightning');
          }
          this.weather = '当前' + weather.city + '天气' + weather.weather + ', 温度: ' + weather.temperature + '℃'
            + ', 空气湿度: ' + weather.humidity + '%, ' + weather.winddirection + '风, 风力: ' + weather.windpower + '级'
        } else {
          this.weather = res.data.msg;
        }
      }).catch(e => {
        this.weather = e.message;
      });

      return '获取实时天气中...';
    }
  }
}
</script>

<style scoped>
/* 顶部用户信息卡片 */
.workplace-user-card .ele-cell-content {
  overflow: hidden;
}

.workplace-count-group {
  white-space: nowrap;
}

.workplace-count-item {
  padding: 0 5px 0 25px;
  box-sizing: border-box;
  display: inline-block;
  text-align: right;
}

.workplace-count-name {
  padding-left: 8px;
}

.workplace-count-num {
  font-size: 24px;
  margin-top: 6px;
}

@media screen and (max-width: 992px) {
  .workplace-count-item {
    padding: 0 5px 0 10px;
  }
}

@media screen and (max-width: 768px) {
  .workplace-user-card,
  .workplace-count-group {
    display: block;
  }

  .workplace-count-group {
    margin-top: 15px;
    text-align: right;
  }

  .workplace-user-card ::v-deep .el-avatar {
    width: 45px !important;
    height: 45px !important;
  }

  .workplace-user-card h4 {
    font-size: 16px;
  }

  .workplace-user-card h4 + .ele-text-secondary {
    font-size: 12px;
  }

  .workplace-user-card {
    margin: -10px;
  }
}

/* 快捷方式 */
.app-link-block {
  display: block;
  color: inherit;
  padding: 15px 0;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
}

.app-link-block .app-link-icon {
  color: #69c0ff;
  font-size: 30px;
  margin-top: 5px;
}

.app-link-block .app-link-title {
  margin-top: 8px;
}

/* 最新动态时间轴 */
.ele-timeline-act {
  padding-left: 50px;
}

.ele-timeline-act ::v-deep .el-timeline-item__timestamp {
  margin: 0;
  position: absolute;
  top: 3px;
  left: -45px;
}

.ele-timeline-act ::v-deep .el-timeline-item {
  padding-bottom: 19px;
}

.ele-timeline-act ::v-deep .el-timeline-item:last-child {
  padding-bottom: 0;
}

/* 表格 */
.workplace-table-card ::v-deep .el-table tbody > .el-table__row:last-child td {
  border-bottom: none;
}

.workplace-table-card ::v-deep .el-table:before {
  display: none;
}

.workplace-table-card .sort-handle {
  cursor: move;
  font-size: 18px;
  vertical-align: middle;
}

.workplace-table-card ::v-deep .el-table__row.sortable-chosen {
  background-color: hsla(0, 0%, 60%, .1);
}

.workplace-table-card ::v-deep .el-table__row.sortable-chosen td {
  background-color: transparent;
}

/* 本月目标 */
.workplace-goal-group {
  text-align: center;
  position: relative;
  padding: 48px 0;
}

.workplace-goal-group .workplace-goal-content {
  position: absolute;
  top: 90px;
  left: 0;
  width: 100%;
}

.workplace-goal-group .workplace-goal-num {
  font-size: 40px;
  margin-top: 15px;
}

/* 小组成员 */
.user-list-item {
  padding: 13px 18px;
}

.user-list-item + .user-list-item {
  border-top: 1px solid hsla(0, 0%, 60%, .15);
}

.user-list-item .ele-cell-desc {
  margin-top: 5px;
}

/* 小屏幕优化 */
@media screen and (max-width: 768px) {

}
</style>
