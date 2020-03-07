<template>
  <div class="settings-wrapper">
    <div
      v-for="option in options"
      :key="option.value"
    >
      <input
        type="checkbox"
        :id="option.value"
        :value="option.value"
        v-model="checked"
        @change="handleInput"
      >
      <label
        :for="option.value"
      >
        {{option.label}}
      </label>
      <br>
    </div>
  </div>
</template>

<script>
export default {
  name: "settings",
  data() {
    return {
      checked: [],
      options: [
        { label: 'Exlude Live Tracks', value: 'live'},
        { label: 'Exlude Instrumental Tracks', value: 'instrumental'},
        { label: 'Exlude Commentary Tracks', value: 'commentary'}
      ]
    }
  },
  computed: {
    filters() {
      return this.$store.state.filters
    }
  },
  watch: {
    filters(newValue) {
      this.checked = newValue
    }
  },
  mounted() {
    this.checked = this.filters
  },
  methods: {
    handleInput() {
      this.$store.commit('SET_FILTER', this.checked)
    }
  }
}
</script>

<style scoped>
.settings-wrapper {
  bottom: 100%;
  border-radius: 4px;
  border: 1px solid #282323;
  background: #191414;
  box-shadow: 0px 4px 4px #000000;
  @apply select-none text-white text-left whitespace-no-wrap mb-2 p-2 right-0 absolute select-none outline-none
}
</style>
