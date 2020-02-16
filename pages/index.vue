<template>
  <div class="content">
    <div class="container">
      <div class="mb-12">
        <h1 class="title">
          <span class="desktop">
            Fusify - Artist Mixer
          </span>
        </h1>
        <p class="subtitle">
          Your favourite artists in one playlist within seconds.
        </p>
      </div>
      <Search
        @click="checkAuth"
      />
    </div>
  </div>
</template>

<script>
import Search from '~/components/Search.vue'

export default {
  components: {
    Search
  },
  methods: {
    checkAuth: function() {
      if (!this.cookies['spotify_auth_token']) {
        location.assign(`/login?redirect_uri=${this.getBaseUrl()}/auth/callback`)
      }
    },
    getBaseUrl() {
      return `${window.location.protocol}//${window.location.host}`
    }
  },
  computed: {
    cookies: function() {
      const pairs = document.cookie.split(";");
      let cookies = {};
      for (let i=0; i<pairs.length; i++){
        let pair = pairs[i].split("=");
        cookies[(pair[0]+'').trim()] = unescape(pair.slice(1).join('='));
      }
      return cookies;
    }
  },
  mounted: function() {
    if (this.cookies['spotify_auth_token']) {
      console.log(this);
      this.$store.commit('SET_TOKEN', this.cookies['spotify_auth_token']);
      this.$store.dispatch('FETCH_USER')
    }
  }
}
</script>

<style scoped>

</style>
