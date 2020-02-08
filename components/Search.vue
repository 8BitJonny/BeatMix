<template>
  <div>
    <label for="search" class="label">Search</label>
    <input id="search" class="input" ref="input" type="text" placeholder='Press "/" to focus'>
  </div>
</template>

<script>
export default {
  name: "Search",
  mounted() {
    window.addEventListener('keyup', (event) => {
      if (event.key === "/") {
        this.$refs.input.focus();
      }
    })
  }
}
</script>

<style scoped>
  .label {
    @apply text-xl font-semibold mr-2
  }
  .input {
    @apply rounded-md py-1 px-2 text-black
  }
</style>
