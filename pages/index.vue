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
      <Search />
    </div>
  </div>
</template>

<script>
import Search from '~/components/Search.vue'

export default {
  components: {
    Search
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
      this.$store.commit('SET_TOKEN', this.cookies['spotify_auth_token']);
      this.$store.dispatch('FETCH_USER')
    }
  }
}
</script>

<style scoped>

</style>
