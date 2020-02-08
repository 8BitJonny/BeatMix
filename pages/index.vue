<template>
  <div class="container">
    <div>
      <h1 class="title">
        Spotify Music Mixer
      </h1>
      <Search />
    </div>
  </div>
</template>

<script>
import Search from '~/components/Search.vue'

export default {
  components: {
    Search
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
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}

.title {
  display: block;
  letter-spacing: 1px;
  @apply font-semibold text-6xl mb-16
}
</style>
