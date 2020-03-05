
module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'BeatMix - Artist Mixer',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Create Spotify playlists with all the tracks from your favorite artists within seconds.' },
      { property: 'og:title', content: 'BeatMix - Spotify Artist Mixer' },
      { property: 'og:description', content: 'Create Spotify playlists with all the tracks from your favorite artists within seconds.' },
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
  buildModules: [
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
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
