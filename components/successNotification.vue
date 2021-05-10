<template>
  <div class="vue-notification success">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: "successNotification",
  props: {
    text: String
  }
}
</script>

<style scoped>
.vue-notification.success {
  background: #1DB954;
  text-align: center;
}
</style>
