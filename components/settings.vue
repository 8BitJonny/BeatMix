<template>
  <div>
    <div class="relative">
      <button class="settings-button" @click="settingsOpen = true">
        <img
          src="~/assets/img/gear.svg"
          height="18px"
          width="18px"
        >
      </button>
      <div
        v-if="settingsOpen && !bigSettingsModal"
        v-click-outside="closeBothModals"
        class="settings-wrapper"
      >
        <div
          v-for="option in options"
          :key="option.value"
        >
          <input
            type="checkbox"
            :id="option.value"
            :value="option.value"
            v-model="checked"
            @change="handleInput(option.value)"
          >
          <label
            :for="option.value"
          >
            {{option.label}}
          </label>
          <br>
        </div>
        <button
          @click="bigSettingsModal = true"
          class="show_more_settings_button"
        >
          Show more settings
        </button>
      </div>
    </div>
    <div
      v-if="bigSettingsModal"
      class="big-settings-modal"
    >
      <div class="model-overlay" />
      <form class="model-body" @submit.prevent="closeBothModals">
        <h2>Settings</h2>
        <h3>Blacklist</h3>
          <div
            v-for="option in options"
            :key="'2' + option.value"
          >
            <input
              type="checkbox"
              :id="option.value"
              :value="option.value"
              v-model="checked"
              @change="handleInput(option.value)"
            >
            <label
              :for="option.value"
            >
              {{option.label}}
            </label>
            <br>
          </div>
        <h3>Year Filter</h3>
        <YearFilter :artists="artists"/>

        <div class="remaining-height" />
        <div class="modal-footer">
          <button
            class="green-button"
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import vClickOutside from 'v-click-outside'
import YearFilter from '~/components/yearFilter'

export default {
  name: "settings",
  directives: {
    clickOutside: vClickOutside.directive
  },
  components: {
    YearFilter,
  },
  props: {
    artists: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      settingsOpen: false,
      bigSettingsModal: false,
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
      return this.$store.state.settings.filters
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
    handleInput(v) {
      this.$store.commit('settings/SET_FILTER', this.checked);
      umami.trackEvent(this.capitalizeFirstLetter(v), 'settings');
    },
    capitalizeFirstLetter(string) {
      return string.toString().charAt(0).toUpperCase() + string.toString().slice(1);
    },
    closeBothModals() {
      this.settingsOpen = this.bigSettingsModal = false;
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
  box-shadow: 0 4px 4px #000000;
  @apply text-white text-left whitespace-nowrap mb-2 p-2 right-0 absolute select-none outline-none
}

.big-settings-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  @apply absolute inset-0 z-10
}

.big-settings-modal .model-overlay {
  opacity: .3;
  background-color: #4c4f5a;
  @apply absolute h-full w-full z-10
}

.big-settings-modal .model-body {
  border: 1px solid #282323;
  background: #191414;
  box-shadow: 0 4px 4px #000000;
  min-height: 30rem;
  width: 26rem;
  @apply z-20 p-4 text-left rounded-xl relative flex flex-col
}

.big-settings-modal .remaining-height {
  flex-grow: 1;
}

.big-settings-modal .modal-footer {
  bottom: 2rem;
  @apply w-full
}

.green-button {
  background-color: #1DB954;
  @apply rounded-md select-none px-3 py-2 text-white m-auto block
}

.green-button:hover {
  background-color: #168D40;
}

.show_more_settings_button {
  margin: 0.2rem 0 0 1.2rem;
}

h2 {
  @apply text-3xl mb-2 text-center
}

h3 {
  @apply text-xl my-2 underline
}

button {
  color: #1DB954;
}
</style>
