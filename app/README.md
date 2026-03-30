# 一. 系统技术栈

## 1.1 技术栈

| 名称       | 简介                                |                             文档                             |
| :--------- | :---------------------------------- | :----------------------------------------------------------: |
| Node.js    | JavaScript 运行环境(建议版本16.x.x) |          [https://nodejs.org](https://nodejs.org/)           |
| NPM        | 包管理工具(建议版本8.x.x)           |    [https://www.npmjs.com.cn](https://www.npmjs.com.cn/)     |
| Webpack    | JavaScript 静态模块打包器           | [https://webpack.docschina.org](https://webpack.docschina.org/) |
| ES6        | ECMAScript 6                        |  [https://es6.ruanyifeng.com](https://es6.ruanyifeng.com/)   |
| Vue.js     | 渐进式 JavaScript 框架              |        [https://cn.vuejs.org](https://cn.vuejs.org/)         |
| Vue Router | Vue.js 官方路由管理器               |    [https://router.vuejs.org](https://router.vuejs.org/)     |
| Vuex       | Vue.js 官方状态管理库               |      [https://vuex.vuejs.org](https://vuex.vuejs.org/)       |
| Vue CLI    | Vue.js 官方标准开发工具             |       [https://cli.vuejs.org](https://cli.vuejs.org/)        |
| Axios      | 简洁、易用且高效的 http 库          |     [http://www.axios-js.com](http://www.axios-js.com/)      |
| Sass       | CSS 预处理、扩展语言                |         [https://www.sass.hk](https://www.sass.hk/)          |
| ElementUI  | 网站快速成型桌面端组件库            |    [https://element.eleme.cn](https://element.eleme.cn/)     |
| EleAdmin   | 后台管理模板                        |                    https://eleadmin.com/                     |

## 1.2 安装运行

### 1.2.1 docker 安装
```bash
# 1. 下载项目
$git clone git@github.com:wertyq111/blog-ui.git
  
# 2. 修改后端请求地址 VUE_APP_API_BASE_URL
$cd blog-ui/app
$cp .env.example .env.development
$vi .env.development 
  
# 3. 运行 docker
$docker compose up -d
  
# 4. 查看日志
$docker compose logs -f
```
### 1.2.2 本地安装

```bash

# 1. 下载项目
$git clone git@repo.netsun.com:dev/dev4/blog-ui.git
  
# 2. 修改后端请求地址 VUE_APP_API_BASE_URL
$cd blog-ui/app
$cp .env.example .env.development
$vi .env.development 
  
# 3. 镜像加速--registry
$npm install --registry=https://registry.npmmirror.com

# 4. 安装依赖
$npm install
  
# 5. 运行项目
$npm run serve
```

## 1.3 项目结构

```yaml
|-public                               # 静态资源
|   |-tinymce                          # tinymce 编辑器静态资源
|   |-json
|   |   |-regions-data.json            # 省市区数据
|   |   |-china-provinces.geo.json     # 地图轮廓数据
|   |-favicon.ico                      # favicon 图标
|   |-index.html
|-src
|   |-api                              # 数据接口
|   |-assets                           # 图片等静态资源
|   |-components                       # 公共组件
|   |-config
|   |   |-setting.js                   # 项目全局配置
|   |-lang                             # 多语言配置
|   |   |-en.js                        # 英文语言
|   |   |-zh_CN.js                     # 简体中文语言
|   |   |-zh_TW.js                     # 繁体中文语言
|   |   |-indx.js
|   |-layout                           # 外层布局
|   |   |-components
|   |   |   |-header-tools.vue         # 顶栏右侧区域
|   |   |   |-header-notice.vue        # 顶栏消息通知
|   |   |   |-password-modal.vue       # 修改密码弹窗
|   |   |   |-page-footer.vue          # 全局页脚
|   |   |   |-setting-drawer.vue       # 主题设置抽屉
|   |   |   |-i18n-icon.vue            # 多语言切换组件
|   |   |-index.vue
|   |-router                           # 路由配置
|   |-store                            # 状态管理
|   |   |-modules
|   |   |   |-user.js                  # 登录状态管理，用户信息、菜单、权限、角色
|   |   |   |-theme.js                 # 主题风格相关的状态管理
|   |   |-getters.js
|   |   |-index.js
|   |-styles
|   |   |-index.scss                   # 全局样式
|   |-utils
|   |   |-page-tab-util.js             # 页签 tab 操作方法
|   |   |-permission.js                # 按钮级权限控制
|   |   |-request.js                   # axios 实例
|   |   |-token-util.js                # token 操作方法
|   |   |-iframe-mixin.js              # 内嵌 iframe 页面的混入
|   |   |-echarts-mixin.js             # echarts 页面的混入
|   |-views                            # 页面
|   |   |-dashboard                    # 控制台
|   |   |-system                       # 系统管理
|   |   |   |-user                     # 用户管理
|   |   |   |   |-components           # 页面组件拆分
|   |   |   |   |   |-user-search.vue  # 表格搜索表单
|   |   |   |   |   |-user-edit.vue    # 用户添加、修改弹窗
|   |   |   |   |   |-role-select.vue  # 编辑弹窗中的角色选择下拉框
|   |   |   |   |   |-user-import.vue  # 用户导入弹窗
|   |   |   |   |-index.vue
|   |   |   |-xxxx                     # 其它模块
|   |   |-exception                    # 异常页面
|   |   |-xxxxxx                       # 其它模板页面，不一一列举
|   |-App.vue                          # 入口页面
|   |-main.js                          # 入口 js
|-.env.example                         # 开发环境配置实例
|-.eslintignore                        # eslint 忽略配置
|-.eslintrc.js                         # eslint 配置
|-package.json
|-jsconfig.json
|-vue.config.js
|-babel.config.js
```