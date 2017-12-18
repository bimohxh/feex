module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'feex',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  css: [
    'bootstrap/dist/css/bootstrap.css',
    'codemirror/lib/codemirror.css',
    'animate.css',
    '~assets/css/main.css',
    '~assets/css/code-theme.css'
  ],
  router: {
    // 在每页渲染前运行 middleware/user-agent.js 中间件的逻辑
    middleware: ['auth']
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
        const vueLoader = config.module.rules.find((rule) => rule.loader === 'vue-loader')
        vueLoader.options.loaders.sass = 'vue-style-loader!css-loader!sass-loader'
      }
    }
  },
  plugins: ['~/plugins/vue-icon', '~/plugins/icon', '~/plugins/common']
}
