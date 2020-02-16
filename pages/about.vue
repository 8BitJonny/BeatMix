<template>
  <div class="content">
    <div class="container">
      <div class="mb-12">
        <h1 class="title">
          <span class="desktop">
            Fusify - About
          </span>
        </h1>
        <p class="subtitle">
          Your favourite artists in one playlist within seconds.
        </p><br><br>
        <p class="text-left">
          I spent a lot of time on Spotify. This year even more than ever and that's when I got the idea for Fusify.
          <br><br>

          Did you ever had the luck of discovering an artist which you can listen to all day long because they don't really have
          any song that you don't like? This amazing feeling when you can just open Spotify, get on the artists profile and click shuffle
          without having to worry if you like the songs that come up.
          <br><br>

          The only thing better than this is to be able to shuffle between multiple of your favourite artists and all their songs.
          And this is exactly what Fusify enables you to do. Connect with your Spotify account, search for your beloved artists and
          create a playlist with all their songs within seconds.
          <br><br>

          Have fun, <br>
          Timon

          <br><br>
          P.S. Any Feedback is highly appreciated via timon.christiansen@code.berlin
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "about"
  }
</script>

<style scoped>
@media (max-width: 640px) {
  p {
    @apply px-4
  }
}

@media (min-width: 640px) {
  .container {
    max-width: 800px;
  }
}
</style>
