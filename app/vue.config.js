const CompressionWebpackPlugin = require('compression-webpack-plugin');
const fs = require('node:fs')
const path = require('node:path')

module.exports = {
  productionSourceMap: false,
  transpileDependencies: ['element-ui', 'ele-admin', 'vue-i18n'],
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
  devServer: {
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 8080,
    allowedHosts: 'all',
    sockHost: '192.168.128.2',
    sockPort: 8080,
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
  },
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
