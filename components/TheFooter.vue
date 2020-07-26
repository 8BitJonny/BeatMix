<template>
    <div class="footer">
      <a
        href="https://www.producthunt.com/posts/beatmix?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-beatmix"
        target="_blank"
      >
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=187013&theme=light"
          alt="BeatMix - Enables Shuffle and Radio for multiple artists in Spotify | Product Hunt Embed"
          style="width: 250px; height: 54px;"
          width="250px" height="54px"
          class="product-hunt"
        />
      </a>
      <a
        href="https://github.com/8BitJonny/Spotify-Artist-Mixer"
        class="github-logo"
      >
        <img
          src="~/assets/img/GitHub-Mark-Light-120px-plus.png"
          class="h-10"
        />
      </a>
    </div>
</template>

<script>
export default {
  name: 'TheFooter'
}
</script>

<style scoped>
.footer {
  @apply py-6 px-12 fixed bottom-0 right-0 flex items-center
}

.product-hunt {
  @apply pr-8
}

@media screen and (max-width: 600px) {
  .footer {
    display: none
  }
}
</style>
