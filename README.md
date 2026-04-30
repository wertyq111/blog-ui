# Blog UI

这是当前 blog 工作区的 Vue 2 管理后台前端。仓库根目录负责 Docker 启动，真正的 Vue 应用在 `app/` 目录。

## 当前技术栈

| 项目 | 当前情况 |
| --- | --- |
| 运行镜像 | `node:16.20.0-alpine3.17` |
| 包管理 | npm，使用 `package-lock.json` |
| Vue | `2.6.14` |
| Vue CLI | `4.4.6` |
| Router | `vue-router` 3.5 |
| 状态管理 | Vuex 3.6 |
| UI | Element UI 2.15、EleAdmin 1.6 |
| HTTP | Axios 0.21 |
| 富文本 | Tinymce、mavon-editor |
| 图表和表格 | ECharts、xlsx |
| 3D 模型预览 | `@google/model-viewer` |

## 目录结构

```text
blog-ui
├── compose.yaml          Docker 开发入口，映射 8082 -> 8080
├── README.md             仓库级说明
└── app/
    ├── Dockerfile        Node 16 开发镜像
    ├── package.json      前端依赖和脚本
    ├── package-lock.json npm 锁文件
    ├── public/           静态资源、Tinymce 资源、模型资源
    ├── src/              Vue 应用源码
    ├── vue.config.js     Vue CLI 和 devServer 配置
    └── README.md         app 目录说明
```

## 主要源码路径

| 路径 | 内容 |
| --- | --- |
| `app/src/config/axios-config.js` | Axios 前缀、Token Header、响应处理 |
| `app/src/config/setting.js` | 后台壳层配置、菜单接口、用户接口、主题默认值 |
| `app/src/router/index.js` | 登录/404 静态路由和后端菜单动态路由 |
| `app/src/store` | Vuex 模块 |
| `app/src/layout` | 基于 EleAdmin 的后台布局 |
| `app/src/views` | 业务页面 |
| `app/src/components` | 通用组件 |
| `app/src/styles` | 全局样式 |

## 主要页面模块

| 模块 | 路径 |
| --- | --- |
| 首页 | `app/src/views/dashboard` |
| 系统管理 | `app/src/views/system` |
| 基础数据 | `app/src/views/data` |
| 会员 | `app/src/views/member` |
| 小程序内容 | `app/src/views/mini-program` |
| 开发工作台 | `app/src/views/develop` |
| 烟草业务 | `app/src/views/tobacco` |
| 站点配置 | `app/src/views/config` |
| 登录、用户、异常页 | `app/src/views/login`、`app/src/views/user`、`app/src/views/exception` |

## 环境变量

前端当前没有提交 `.env.example`。代码直接读取这两个变量：

| 环境变量 | 用途 |
| --- | --- |
| `VUE_APP_NAME` | 浏览器标题和布局里的项目名 |
| `VUE_APP_API_BASE_URL` | Axios 接口前缀、模板下载地址、上传示例地址 |

本地开发时在 `app/` 下创建 `.env.development`：

```bash
cd app
cat > .env.development <<'EOF'
VUE_APP_NAME=Blog Admin
VUE_APP_API_BASE_URL=http://localhost:3925/api
EOF
```

远端开发环境使用：

```dotenv
VUE_APP_API_BASE_URL=http://10.10.9.184:3925/api
```

## 本地启动

直接启动 Vue 应用：

```bash
cd app
npm install
npm run serve
```

默认访问地址：

| 目标 | 地址 |
| --- | --- |
| Vue dev server | `http://localhost:8080` |

## Docker 启动

在仓库根目录启动：

```bash
docker compose up --build
```

`compose.yaml` 会构建 `app/Dockerfile`，把 `./app` 挂载到 `/project`，并让容器内的 `node_modules` 独立保留。

容器模式默认访问地址：

| 目标 | 地址 |
| --- | --- |
| Vue dev server | `http://localhost:8082` |

## 常用脚本

脚本都在 `app/` 目录执行：

```bash
npm run serve
npm run build
npm run build:dev
npm run build:test
npm run build:prod
npm run build:preview
npm run build:report
npm run lint
```

## devServer 配置

`app/vue.config.js` 当前固定了这些开发服务配置：

| 配置 | 当前值 |
| --- | --- |
| `host` | `0.0.0.0` |
| `port` | `8080` |
| `allowedHosts` | `['all']` |
| `sockHost` | `192.168.128.2` |
| `sockPort` | `8080` |
| `sockPath` | `/sockjs-node` |

如果热更新连不上，先检查 `sockHost` 是否还是当前开发机地址。

## 后端接口约定

前端要求接口前缀是完整 URL：

```js
axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;
```

后台壳层当前依赖的核心接口：

| 用途 | API 路径 |
| --- | --- |
| 登录 | `/user/login` |
| 当前用户 | `/users/getUserInfo` |
| 动态菜单 | `/index/getMenuList` |

路由会把后端菜单里的组件路径转换为本地 `views` 下的组件：

```js
menuToRoutes(menus, (component) => import('@/views' + component))
```

## 远端验证

当前工作区涉及运行时验证时，以远端环境为准：

| 项目 | 当前值 |
| --- | --- |
| SSH | `ubuntu@10.10.9.184` |
| 前端远端目录 | `/data/personal/projects/blog-ui` |
| 远端页面地址 | `http://10.10.9.184:8082/` |
| 后端 API 前缀 | `http://10.10.9.184:3925/api` |

本地和远端是同一仓库时，用 Git 同步。不要把 macOS `._*` 文件同步到远端。
