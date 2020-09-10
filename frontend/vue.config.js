// vue.config.js
module.exports = {
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ],
  devServer: {
    proxy: {
      "/api": {
        target: "http://dev.verinote.net:5022",
        changeOrigin: true,
        logLevel: "debug",
        pathRewrite: {
          "^/api/": "/"
        },
      }
    }
  }
}