<template>
  <div class="content">
    <NavBar :userPicture="user.image" />
    <div class="container">
      <h1 class="title">
        Spotify Music Mixer
      </h1>
      <Search
        @click="checkAuth"
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
        image: null
      }
    }
  },
  components: {
    Search,
    NavBar
  },
  methods: {
    checkAuth: () => {
      location.assign("/login")
    }
  },
  computed: {
    cookies: () => {
      const pairs = document.cookie.split(";");
      let cookies = {};
      for (let i=0; i<pairs.length; i++){
        let pair = pairs[i].split("=");
        cookies[(pair[0]+'').trim()] = unescape(pair.slice(1).join('='));
      }
      return cookies;
    }
  },
  mounted() {
    if (this.cookies['spotify_auth_token']) {
      this.$axios.$get('https://api.spotify.com/v1/me',
        { headers: {
          'Authorization': 'Bearer ' + this.cookies['spotify_auth_token']
        }}
      ).then(result => {
        this.user.image = result.images[0].url
        //console.log(this.user.image)
      })
    }
  }
}
</script>

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
