<template>
  <div class="vue-notification success">
    Successfully created your Playlist,<br>
    check into your Spotify Account to enjoy it.
  </div>
</template>

<script>
export default {
  name: "successNotification"
}
</script>

<style scoped>
.vue-notification.success {
  background: #1DB954;
  text-align: center;
}
</style>
