<template>
  <div>
    <p class="text-3xl mt-12 -mb-8 ml-4 text-left">Suggestions</p>
    <div class="searchResults">
      <div v-for="suggestion in suggestions">
        <img :src="suggestion.img" width="180" height="180" class="mb-1"/>
        <p>{{ suggestion.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "suggestions",
    data() {
      return {
        suggestions: [
          {
            name: 'AViVA',
            img: 'https://artwork-cdn.7static.com/static/img/sleeveart/00/079/320/0007932086_350.jpg'
          }, {
            name: 'Eminem',
            img: 'https://i.scdn.co/image/56f4762485066b4ef867b96e16775f2b5b4db277'
          }, {
            name: 'The Seige',
            img: 'https://i.scdn.co/image/3e56ba003140ad30e8aa5d35c2db603592d4d690'
          }, {
            name: 'Onk Lou',
            img: 'https://i.scdn.co/image/afb7fb59a35df2e6d8e3e7b7c80ac5fa8b2434a5'
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>
