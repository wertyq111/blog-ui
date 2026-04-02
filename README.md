# Blog UI

## 项目概览

当前前端仓库采用“两层结构”：

- 仓库根目录负责容器化开发入口，核心文件是 `compose.yaml`
- 真正的 Vue 应用位于 `app/` 目录

`app/` 目前是一个基于 Vue 2 + Vue CLI 4 的后台管理前端，集成了 Element UI、EleAdmin、Vue Router、Vuex 和 Axios。

## 当前目录说明

```text
blog-ui
├── compose.yaml          Docker 开发入口，映射 8082 -> 8080
├── README.md             仓库级说明
└── app/
    ├── Dockerfile        前端开发镜像
    ├── package.json      前端依赖与脚本
    ├── public/           静态资源
    ├── src/              应用源码
    ├── vue.config.js     Vue CLI / devServer 配置
    └── README.md         app 目录说明
```

## 技术栈

| 名称 | 当前情况 |
| --- | --- |
| Node.js | Dockerfile 当前使用 `16.20.0-alpine3.17` |
| npm | 使用 `package-lock.json`（lockfileVersion 2） |
| Vue | `2.6.14` |
| Vue CLI | `4.4.6` |
| Vue Router | `3.5.2` |
| Vuex | `3.6.2` |
| Element UI | `2.15.3` |
| EleAdmin | `1.6.0` |
| Axios | `0.21.1` |

## 环境变量

当前仓库没有提交可直接复用的 `.env.example`，但代码里已经明确依赖下面两个变量：

- `VUE_APP_NAME`
- `VUE_APP_API_BASE_URL`

本地开发时，先在 `app/` 目录下创建 `.env.development`：

```bash
cd app
cat > .env.development <<'EOF'
VUE_APP_NAME=Blog Admin
VUE_APP_API_BASE_URL=http://localhost:3925/api
EOF
```

如果前端运行在远程主机或 Docker 环境中，请把 `VUE_APP_API_BASE_URL` 改成对应的后端地址。

## 本地启动

```bash
cd app
npm install
npm run serve
```

默认访问地址：

- `http://localhost:8080`

常用脚本：

```bash
npm run serve
npm run build
npm run build:dev
npm run build:prod
npm run lint
```

## Docker 启动

在仓库根目录执行：

```bash
docker compose up --build
```

容器模式下默认访问地址：

- `http://localhost:8082`

`compose.yaml` 当前会把根目录下的 `app/` 挂载进容器，所以改动源码后会直接反映到容器里的开发服务。

## 开发说明

### devServer 当前配置

`app/vue.config.js` 中当前已固定这些关键项：

- `host: 0.0.0.0`
- `port: 8080`
- `allowedHosts: ['all']`
- `sockHost: '192.168.128.2'`
- `sockPort: 8080`

如果你更换了开发机 IP，浏览器热更新连接异常时，优先检查 `sockHost` 是否仍然指向正确地址。

### 接口基地址

`src/config/axios-config.js` 里直接使用：

```js
axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;
```

因此 `VUE_APP_API_BASE_URL` 应该写成完整的 API 前缀，例如：

- `http://localhost:3925/api`
- `http://10.10.9.184:3925/api`

## 主要业务模块

`src/views/` 当前主要包含这些模块：

- `system`：用户、角色、菜单、部门、岗位、日志
- `data`：城市、字典、配置、友情链接
- `member`：会员与会员等级
- `mini-program`：笔记、壁纸、相册等小程序内容
- `develop`：路径转换、模型初始化、日报、文档、平台配置
- `tobacco`：烟草业务相关页面
- `config`：站点配置
- `dashboard`、`login`、`message`、`user`、`exception`

## 代码结构

```text
app
├── public/               Tinymce、模型文件、静态资源
├── src/
│   ├── assets/           图片等资源
│   ├── components/       通用组件
│   ├── config/           axios 与全局设置
│   ├── layout/           后台布局
│   ├── plugins/          插件注册
│   ├── router/           路由配置
│   ├── store/            Vuex 状态管理
│   ├── styles/           全局样式
│   ├── utils/            工具函数
│   └── views/            页面模块
├── package.json
└── vue.config.js
```
