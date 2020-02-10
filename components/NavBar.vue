<template>
  <div class="navbar">
    <img src="Spotify.png" class="logo"/>
    <div class="linkList">
      <span>Home</span>
      <span v-if="!userPicture" @click="login">Login</span>
      <span>About</span>
      <span v-if="userPicture" @click="logout">Logout</span>
      <img src="Github.png" class="h-10"/>
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
      location.assign("/login")
    },
    logout: function() {
      location.assign("/logout")
    }
  }
}
</script>

<style scoped>
span {
  @apply font-semibold text-xl
}
.navbar {
  @apply py-6 px-8 flex justify-between
}
.linkList {
  @apply flex justify-center items-center
}
.linkList > * {
  @apply mx-4
}
.logo {
  @apply h-12
}
.userPicture {
  @apply w-12 h-12 rounded-full
}
</style>
