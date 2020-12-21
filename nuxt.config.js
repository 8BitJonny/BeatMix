
module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'BeatMix',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Enables Shuffle and Radio for multiple artists in Spotify' },
      { property: 'og:title', content: 'BeatMix - Shuffle Multiple Artists' },
      { property: 'og:description', content: 'BeatMix enables you to shuffle or play the radio of multiple Spotify artists.' },
      { property: 'og:site_name', content: 'BeatMix' },
      { property: 'og:image', content: 'https://beatmix.app/beatmix-og-img.png' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  env: {
    CLIENT_SECRET: process.env.CLIENT_SECRET
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    'vue-multiselect/dist/vue-multiselect.min.css',
    '@/assets/css/ldbtn.min.css',
    '@/assets/css/loading.min.css'
  ],
  purgeCSS: {
    whitelistPatterns: [
      /-(leave|enter|appear)(|-(to|from|active))$/,
      /^(?!(|.*?:)cursor-move).+-move$/,
      /^nuxt-link(|-exact)-active$/,
      /multiselect/,
      /running$/
    ]
  },
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/spotifyAPI', ssr: true },
    { src: '~/plugins/vueNotify', ssr: true }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/tailwindcss',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
