const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 端口
  devServer: {
    port: 8081,
  },
})
