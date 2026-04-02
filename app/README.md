# Frontend App

`app/` 是当前前端仓库里的实际 Vue 应用目录。仓库根目录的 `compose.yaml` 会以这里作为构建上下文和源码挂载目录。

## 当前技术栈

| 名称 | 当前情况 |
| --- | --- |
| Node.js | 推荐与 Dockerfile 保持一致，优先使用 Node 16 |
| Vue | `2.6.14` |
| Vue CLI | `4.4.6` |
| Element UI | `2.15.3` |
| EleAdmin | `1.6.0` |
| Vue Router | `3.5.2` |
| Vuex | `3.6.2` |
| Axios | `0.21.1` |

## 运行前准备

当前目录没有提交 `.env.example`，但代码依赖以下变量：

- `VUE_APP_NAME`
- `VUE_APP_API_BASE_URL`

先手动创建 `.env.development`：

```bash
cat > .env.development <<'EOF'
VUE_APP_NAME=Blog Admin
VUE_APP_API_BASE_URL=http://localhost:3925/api
EOF
```

## 本地开发

```bash
npm install
npm run serve
```

默认端口：

- `8080`

## Docker 开发

从仓库根目录启动：

```bash
docker compose up --build
```

根目录 compose 默认把页面暴露到：

- `http://localhost:8082`

## 常用脚本

```bash
npm run serve
npm run build
npm run build:dev
npm run build:prod
npm run lint
```

## 目录结构

```text
app
├── public/               Tinymce、模型文件等静态资源
├── src/
│   ├── assets/
│   ├── components/
│   ├── config/
│   ├── layout/
│   ├── plugins/
│   ├── router/
│   ├── store/
│   ├── styles/
│   ├── utils/
│   └── views/
├── Dockerfile
├── package.json
└── vue.config.js
```

## 说明

- `src/config/axios-config.js` 会直接读取 `VUE_APP_API_BASE_URL` 作为接口前缀
- `public/index.html` 和布局标题会读取 `VUE_APP_NAME`
- `vue.config.js` 当前把 devServer 固定在 `0.0.0.0:8080`，并写死了 `sockHost: 192.168.128.2`；如果热更新异常，先检查这里是否需要改成当前开发机地址
