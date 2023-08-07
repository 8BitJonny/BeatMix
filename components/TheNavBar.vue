<template>
  <div class="navbar">
    <nuxt-link to="/" class="logo">
      <img src="~/assets/img/Logo.svg"/>
    </nuxt-link>
    <div class="linkList">
      <span v-if="!$store.state.user" @click="login">Login</span>
      <nuxt-link to="/about">About</nuxt-link>
      <span v-if="$store.state.user" @click="logout">Logout</span>
      <nuxt-link to="/imprint">Imprint</nuxt-link>
      <nuxt-link to="/privacy">Privacy</nuxt-link>
      <div v-if="$store.state.user" class="userPicture">
        <img v-if="$store.state.user.image !== 'default'" :src="$store.state.user.image" class="userPicture" alt="">
        <DefaultUserImage v-else class="userPicture"/>
      </div>
    </div>
  </div>
</template>

<script>
import DefaultUserImage from "~/components/defaultUserImage";

export default {
  name: "TheNavBar",
  components: {
    DefaultUserImage
  },
  methods: {
    generateRandomString(length) {
      let text = '';
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text
    },
    login: function() {
      const state = this.generateRandomString(16);
      localStorage.setItem('state', state);

      let url = 'https://accounts.spotify.com/authorize';
      url += '?response_type=token';
      url += '&client_id=' + encodeURIComponent('9af8e00f395c488b9e39f573e06c22ae');
      url += '&redirect_uri=' + encodeURIComponent(this.getBaseUrl());
      url += '&scope=' + encodeURIComponent('user-read-private user-read-email playlist-modify-public');
      url += '&state=' + encodeURIComponent(state);
      window.location = url;

      //location.assign(`/login?redirect_uri=${this.getBaseUrl()}/auth/callback`)
    },
    logout: function() {
      this.$store.dispatch('LOGOUT');
      //location.assign("/logout")
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
