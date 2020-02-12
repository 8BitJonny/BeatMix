<template>
  <div>
    <img src="user-silhouette.svg" class="userPicture" alt="">
  </div>
</template>

<script>
export default {
  name: "defaultUserImage"
}
</script>

<style scoped>
.userPicture {
  padding: 3px;
  @apply bg-white rounded-full
}
</style>
