<template>
  <div class="navbar">
    <nuxt-link to="/" class="logo">
      <img src="Logo.svg"/>
    </nuxt-link>
    <div class="linkList">
      <nuxt-link to="/">Home</nuxt-link>
      <span v-if="!userPicture" @click="login">Login</span>
      <span>About</span>
      <span v-if="userPicture" @click="logout">Logout</span>
      <a href="https://github.com/8BitJonny/Spotify-Artist-Mixer" class="githubLogo">
        <img src="GitHub.png" class="h-10"/>
      </a>
      <div v-if="userPicture" class="userPicture">
        <img v-if="userPicture !== 'default'" :src="userPicture" class="userPicture" alt="">
        <DefaultUserImage v-else class="userPicture"/>
      </div>
    </div>
  </div>
</template>

<script>
import DefaultUserImage from "~/components/defaultUserImage";

export default {
  name: "NavBar",
  props: {
    userPicture: String,
  },
  components: {
    DefaultUserImage
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
  width: 148px;
}
.userPicture {
  @apply w-12 h-12 rounded-full
}
@media (max-width: 500px) {
  .logo {
    max-width: fit-content;
    width: 80vw;
    margin: 0 0 2.5rem 0;
  }
  .navbar {
    flex-wrap: wrap;
    justify-content: center;
  }
  .linkList {
    width: 80vw;
  }
  .githubLogo, .userPicture {
    display: none;
    margin: 0;
  }
}
</style>
