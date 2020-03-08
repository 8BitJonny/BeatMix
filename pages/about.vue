<template>
  <div class="content">
    <div class="container">
      <div class="mb-12">
        <h1 class="title">
          <span class="desktop">
            BeatMix - About
          </span>
        </h1>
        <p class="subtitle">
          Enables Shuffle and Radio for multiple artists in Spotify
        </p><br><br>
        <p class="text-left">
          A few weeks ago I noticed that Spotify is still lacking some important
          features that have been long requested by the community:
          - being able to shuffle multiple artists
          - being able to play the radio of multiple artists
          <br><br>

          BeatMix is here to finally solve these problems! 🕺🏻 💃🏻
          <br><br>
          The Web App allows you to enter up to 8 artists and it will fetch
          all the tracks from all the artists, filter them and put them into a new playlist
          for you to enjoy all day long. And everything just takes a few seconds after
          which you can switch back to Spotify where your new playlist is already awaiting you.
          <br><br>
          Why filtered?
          By default live versions, commentary versions and instrumental versions
          are ignored because they are special versions of tracks that are already
          added to the playlist. But you are welcome to toggle each of those individually if,
          for example, you are a big fan of the live versions like me.
          <br><br>
          And when you are done hearing the playlist up and down,
          try out the Spotify radio function of the playlist. This radio is now fully
          trimmed to give you the best track suggestions based on the artists you entered.
          So, I hope you enjoy my little side project and that it helps you create
          lots of awesome Spotify playlist! 🎧🕺🏻
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
