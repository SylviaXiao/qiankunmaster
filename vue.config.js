const path = require('path')
const webpack = require('webpack')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const CompressionPlugin = require('compression-webpack-plugin')
const generate = require('@ant-design/colors/lib/generate').default
const { name } = require('./package')

function resolve(dir) {
  return path.join(__dirname, dir)
}
const configureWebpack = () => {
  const plugins = [
    // Ignore all locale files of moment.js
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // 生成仅包含颜色的替换样式（主题色等）
    new ThemeColorReplacer({
      fileName: 'css/theme-colors[hash].css',
      matchColors: getAntdSerials('#1ba97b'), // 主色系列
      // 改变样式选择器，解决样式覆盖问题
      changeSelector(selector) {
        switch (selector) {
          case '.ant-calendar-today .ant-calendar-date':
            return ':not(.ant-calendar-selected-date)' + selector
          case '.ant-btn:focus,.ant-btn:hover':
            return '.ant-btn:focus:not(.ant-btn-primary),.ant-btn:hover:not(.ant-btn-primary)'
          case '.ant-btn.active,.ant-btn:active':
            return '.ant-btn.active:not(.ant-btn-primary),.ant-btn:active:not(.ant-btn-primary)'
          case '.ant-menu-horizontal>.ant-menu-item-active,.ant-menu-horizontal>.ant-menu-item-open,.ant-menu-horizontal>.ant-menu-item-selected,.ant-menu-horizontal>.ant-menu-item:hover,.ant-menu-horizontal>.ant-menu-submenu-active,.ant-menu-horizontal>.ant-menu-submenu-open,.ant-menu-horizontal>.ant-menu-submenu-selected,.ant-menu-horizontal>.ant-menu-submenu:hover':
          case '.ant-menu-horizontal > .ant-menu-item-active,.ant-menu-horizontal > .ant-menu-item-open,.ant-menu-horizontal > .ant-menu-item-selected,.ant-menu-horizontal > .ant-menu-item:hover,.ant-menu-horizontal > .ant-menu-submenu-active,.ant-menu-horizontal > .ant-menu-submenu-open,.ant-menu-horizontal > .ant-menu-submenu-selected,.ant-menu-horizontal > .ant-menu-submenu:hover':
            return '.ant-menu-horizontal > .ant-menu-item-active,.ant-menu-horizontal > .ant-menu-item-open,.ant-menu-horizontal > .ant-menu-item-selected,.ant-menu-horizontal > .ant-menu-item:hover,.ant-menu-horizontal > .ant-menu-submenu-active,.ant-menu-horizontal > .ant-menu-submenu-open,.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-selected,.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu:hover'
          default:
            return selector
        }
      }
    })
  ]
  if (process.env.NODE_ENV === 'production') {
    plugins.push(
      new CompressionPlugin({
        test: /\.js$|\.html$|\.css/,
        threshold: 10240,
        deleteOriginalAssets: false
      })
    )
  }
  return {
    plugins,
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`,
      filename: `[name].[hash].js`,
      chunkFilename: `[name].[hash].js`
    }
  }
}
// vue.config.js
module.exports = {
  /*
    Vue-cli3:
    Crashed when using Webpack `import()` #2463
    https://github.com/vuejs/vue-cli/issues/2463

   */
  publicPath: '/',
  // pages: {
  //   index: {
  //     entry: 'src/main.js',
  //     chunks: ['chunk-vendors', 'chunk-common', 'index']
  //   }
  // },

  configureWebpack: configureWebpack(),

  chainWebpack: config => {
    config.resolve.alias.set('@$', resolve('src'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
    /* svgRule.oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
    */
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */

          'primary-color': '#1BA97B',
          'link-color': '#1BA97B'
          // 'border-radius-base': '4px'
        },
        javascriptEnabled: true
      },
      postcss: {
        plugins: [
          require('postcss-pxtorem')({
            rootValue: 100, // 换算的基数
            propList: ['*']
          })
        ]
      }
    }
  },

  devServer: {
    // development server port 8000
    port: 4445,
    // 微应用的 devTools 中开启开启 hot、disableHostCheck
    hot: true,
    disableHostCheck: true,
    overlay: {
      warnings: false,
      errors: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      // '/api': {
      //   // target: 'https://mock.ihx.me/mock/5baf3052f7da7e07e04a5116/antd-pro',
      //   target: 'https://mock.ihx.me/mock/5baf3052f7da7e07e04a5116/antd-pro',
      //   ws: false,
      //   changeOrigin: true
      // }
      '/task': {
        target: 'http://192.168.0.93:8080', //后台接口的服务地址
        changeOrigin: true, //changes the origin of the host header to the target URL 设置是否将host更换为代理url
        ws: true, //websocket是否代理
        secure: false, //true/false, if you want to verify the SSL Certs，https协议的情况下为true
        pathRewrite: { //object/function, rewrite target's url path. Object-keys will be used as RegExp to match paths. 重写url路径
            '^/task': '' //需要代理的路径
        }
     }
    }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: false,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: [],

  // 构建时开启多进程处理 babel 编译
  parallel: require('os').cpus().length > 1
}

function getAntdSerials(color) {
  // 淡化（即less的tint）
  const lightens = new Array(9).fill().map((t, i) => {
    return ThemeColorReplacer.varyColor.lighten(color, i / 10)
  })
  const colorPalettes = generate(color)
  return lightens.concat(colorPalettes)
}
