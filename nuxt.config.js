import colors from 'vuetify/es5/util/colors'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  env: {
    siteName: process.env.SITE_NAME || 'blog.oskn259.com'
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: process.env.npm_package_name || 'oskn259',
    titleTemplate: '%s | oskn259',
    htmlAttrs: {
      lang: 'ja'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || 'oskn259\'s technical blog' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'oskn259 tech blog' },
      { hid: 'og:type', property: 'og:type', content: 'blog' },
      { hid: 'og:url', property: 'og:url', content: 'https://blog.oskn259.com' },
      { hid: 'og:title', property: 'og:title', content: 'blog.oskn259.com' },
      { hid: 'og:description', property: 'og:description', content: 'oskn259\'s tech blog' },
      { hid: 'og:image', property: 'og:image', content: 'https://blog.oskn259.com/favicon.ico' },
      { hid: 'twitter:card', neme: 'twitter:card', content: "summary_large_image" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" } ]

  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vuetify.ts' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/google-analytics',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {
    markdown: {
      prism: {
        theme: 'prism-themes/themes/prism-material-oceanic.css'
      },
      remarkPlugins: []
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      options: {
        customProperties: true
      },
      dark: false,
      themes: {
        light: {
          background: colors.teal.lighten5,
          primary: colors.grey.darken4,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        dark: {
          background: colors.grey.lighten5,
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  googleAnalytics: {
    id: 'UA-187556326-1'
  },

  robots: {
    UserAgent: '*',
    Sitemap: 'https://blog.oskn259.com/sitemap.xml',
  },

  sitemap: {
    path: '/sitemap.xml',
    hostname: 'https://blog.oskn259.com',
    routes: async () => {
      const { $content } = require('@nuxt/content')
      const articles = await $content('articles').only(['path','updatedAt']).fetch()
      return articles.map((article) => ({
        url: article.path,
        priority: 0.8,
        lastmod: article.updatedAt,
      }))
    }
  },
}
