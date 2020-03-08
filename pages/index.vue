<template>
  <div class="content">
    <div class="container">
      <div class="mb-12">
        <h1 class="title">
          <span class="desktop">
            BeatMix - Artist Mixer
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
  methods: {
    getHashParams() {
      let hashParams = {};
      let e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
      while ( e = r.exec(q) ) {
        hashParams[e[1]] = decodeURIComponent(e[2])
      }
      return hashParams;
    }
  },
  mounted: function() {
    // Temporary: Redirect to new domain
    if (window.location.hostname.includes('herokuapp')) {
      window.location = 'https://beatmix.app'
    }

    const storedState = localStorage.getItem('state');

    if (storedState) {
      const { access_token, state, expires_in } = this.getHashParams();

      if (access_token && (state == null || state !== storedState)) {
        console.log('Error during Authentication');
        return;
      }

      this.$store.dispatch('SET_TOKEN', { access_token, expires_in });
      this.$store.dispatch('FETCH_USER');

      localStorage.removeItem('state');
      this.$router.push({
        path: '/'
      })
    }

    if (this.cookies['spotify_auth_token']) {
      this.$store.commit('SET_TOKEN', this.cookies['spotify_auth_token']);
      this.$store.dispatch('FETCH_USER')
    }
  }
}
</script>

<style scoped>

</style>
