<template>
  <div class="content">
    <NavBar :userPicture="user.image" />
    <div class="container">
      <h1 class="title">
        Spotify Music Mixer
      </h1>
      <Search
        @click="checkAuth"
        :userId="user.id"
      />
    </div>
  </div>
</template>

<script>
import Search from '~/components/Search.vue'
import NavBar from '~/components/NavBar.vue'

export default {
  data: () => {
    return {
      user: {
        image: null,
        id: null
      }
    }
  },
  components: {
    Search,
    NavBar
  },
  methods: {
    checkAuth: function() {
      if (!this.cookies['spotify_auth_token']) {
        location.assign("/login")
      }
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
      this.$axios.$get('https://api.spotify.com/v1/me',
        { headers: {
          'Authorization': 'Bearer ' + this.cookies['spotify_auth_token']
        }}
      ).then(result => {
        this.user.image = result.images[0].url;
        this.user.id = result.id;
      }).catch(err => {
        if (err.response.data.error.message === 'The access token expired') {
          location.assign("/refreshToken")
        }
      })
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css" />
<style>
@import url('https://fonts.googleapis.com/css?family=Montserrat&display=swap');

body {
  background-color: #191414;
  font-family: 'Montserrat', sans-serif;
  @apply text-white
}

.container {
  @apply flex-auto flex flex-col items-center text-center mx-auto my-16
}
.content {
  @apply min-h-screen flex flex-col
}

.title {
  display: block;
  letter-spacing: 1px;
  @apply font-semibold text-6xl mb-16
}
</style>
