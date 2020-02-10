<template>
  <div class="navbar">
    <nuxt-link to="/">
      <img src="Spotify.png" class="logo"/>
    </nuxt-link>
    <div class="linkList">
      <nuxt-link to="/">Home</nuxt-link>
      <span v-if="!userPicture" @click="login">Login</span>
      <span>About</span>
      <span v-if="userPicture" @click="logout">Logout</span>
      <a href="https://github.com/8BitJonny/Spotify-Artist-Mixer">
        <img src="Github.png" class="h-10"/>
      </a>
      <img v-if="userPicture" :src="userPicture" class="userPicture" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  props: {
    userPicture: String,
  },
  methods: {
    login: function() {
      location.assign(`/login?redirect_uri=${this.getBaseUrl()}/auth/callback`)
    },
    logout: function() {
      location.assign("/logout")
    },
    getBaseUrl() {
      return `${window.location.protocol}//${window.location.host}`
    }
  }
}
</script>

<style scoped>
.navbar {
  @apply py-6 px-8 flex justify-between
}
.linkList {
  @apply flex justify-center items-center
}
.linkList > * {
  @apply mx-4
}
.linkList > a, span {
  @apply font-semibold text-xl cursor-pointer
}
.linkList > a:hover, span:hover {
  @apply underline
}
.logo {
  @apply h-12
}
.userPicture {
  @apply w-12 h-12 rounded-full
}
</style>
