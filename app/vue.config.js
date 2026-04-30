const CompressionWebpackPlugin = require('compression-webpack-plugin');

const requiredEnv = (name) => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is required`)
  }
  return value
}

const requiredPort = (name) => {
  const value = Number.parseInt(requiredEnv(name), 10)
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer`)
  }
  return value
}

const devServer = process.env.NODE_ENV === 'development'
  ? {
      historyApiFallback: true,
      host: requiredEnv('VUE_APP_DEV_SERVER_HOST'),
      port: requiredPort('VUE_APP_DEV_SERVER_PORT'),
      allowedHosts: ['all'],
      sockHost: requiredEnv('VUE_APP_DEV_SERVER_SOCK_HOST'),
      sockPort: requiredPort('VUE_APP_DEV_SERVER_SOCK_PORT'),
      sockPath: '/sockjs-node',
      // headers: {
      //   'Access-Control-Allow-Origin': '*',
      // },
      // public: 'www.chouy.xyz',
      // hotOnly: false,
      // disableHostCheck: true,
      // https: true,
      // cert: fs.readFileSync(path.join(__dirname, 'ssl/chouy.xyz.crt')),
      // key: fs.readFileSync(path.join(__dirname, 'ssl/chouy.xyz.key'))
    }
  : undefined

module.exports = {
  productionSourceMap: false,
  transpileDependencies: [
    'element-ui',
    'ele-admin',
    'vue-i18n',
    '@google/model-viewer',
    'lit',
    'lit-html',
    'lit-element',
    /@lit\/.*/,
    /@monogrid\/gainmap-js/
  ],
  chainWebpack: (config) => {
    config.plugins.delete('prefetch');
    if (process.env.NODE_ENV !== 'development') {
      // 对超过10kb的文件gzip压缩
      config.plugin('compressionPlugin').use(new CompressionWebpackPlugin({
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: /\.(js|css|html)$/,
        threshold: 10240,
        minRatio: 0.8
      }));
    }
  },
  ...(devServer ? { devServer } : {}),
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          outputStyle: 'expanded'
        }
      }
    }
  }
}
