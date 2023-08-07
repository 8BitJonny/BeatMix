<template>
  <div>
    <div
      v-for="(_, index) in yearFilters"
      class="filter-list-item"
    >
        <select
          required
          :value="yearFilters[index].artist"
          @change="onArtistChange(index, $event.target.value)"
          name="artist"
          class="select artist-select"
        >
          <option selected disabled value="">
            Select Artist
          </option>
          <option value="*">All Artists</option>
          <option
            v-for="artist in artists"
            :value="artist.id">
            {{ artist.name }}
          </option>
        </select>
        <div v-if="yearFilters[index].artist">
          :
          <select
            required
            :value="yearFilters[index].lowerBound"
            @change="onYearChange(index, $event.target.value, 'lowerBound')"
            name="start-year"
            class="select year-select"
          >
            <option value="" disabled selected>
              lower bound
            </option>
            <template v-for="year in yearFilters[index].options">
              <option
                v-if="yearFilters[index].upperBound ? year <= yearFilters[index].upperBound : true"
                :value="year">
                {{ year }}
              </option>
            </template>
          </select>
          -
          <select
            required
            :value="yearFilters[index].upperBound"
            @change="onYearChange(index, $event.target.value, 'upperBound')"
            name="end-year"
            class="select year-select"
          >
            <option value="" disabled selected>
              upper bound
            </option>
            <template v-for="year in yearFilters[index].options">
              <option
                v-if="year >= yearFilters[index].lowerBound"
                :value="year">
                {{ year }}
              </option>
            </template>
          </select>
        </div>
        <button
          @click="() => deleteFilter(index)"
          class="delete-filter-button"
          type="button"
        >
          <img
            src="~/assets/img/icons8-delete.svg"
            height="18px"
            width="18px"
          >
        </button>
    </div>
    <button
      v-if="yearFilters.length < artists.length"
      @click="addFilter"
      class="text-green"
      type="button"
    >
      Add year filter
    </button>
  </div>
</template>

<script>
export default {
  name: 'yearFilter',
  props: {
    artists: {
      type: Array,
      default: []
    }
  },
  computed: {
    yearFilters() {
      return this.$store.state.settings.yearFilters
    }
  },
  methods: {
    addFilter() {
      this.$store.commit('settings/ADD_YEAR_FILTER', {
        options: [],
        upperBound: "",
        lowerBound: "",
        artist: "",
      });
    },
    deleteFilter(index) {
      this.$store.commit('settings/DELETE_YEAR_FILTER', index);
    },
    async onArtistChange(index, artist) {
      this.$store.commit('settings/UPDATE_YEAR_FILTER', {
        index,
        updateObj: {
          artist,
          options: await this.$store.dispatch('spotify/GET_ALBUM_YEAR_SPAN', { artist: { id: artist } }),
          upperBound: this.yearFilters[index].lowerBound = ""
        }
      });
    },
    onYearChange(index, year, property) {
      this.$store.commit('settings/UPDATE_YEAR_FILTER', {
        index,
        updateObj: {
          [property]: year,
        }
      });
    }
  }
}
</script>

<style scoped>
.filter-list-item {
  margin: 0 0 0.6rem;
  display: flex;
}

.select {
  padding: 3px;
  border-radius: 4px;
  background-color: #2E3838;
  /*border: 3px solid #2E3838;*/
  margin: 0 0.25rem;
  /*background-color: transparent;*/
  /*border-width: 3px;*/
  @apply select-none outline-none text-white
}

.select option[disabled] {
  display: none;
}

.artist-select {
  width: 8rem;
}

.year-select {
  width: 5.5rem;
}

.text-green {
  color: #1DB954;
  @apply select-none outline-none mt-2
}

.delete-filter-button {
  transition: 0.70s;
  -webkit-transition: 0.70s;
  -moz-transition: 0.70s;
  -ms-transition: 0.70s;
  -o-transition: 0.70s;
  @apply select-none outline-none
}

.delete-filter-button:hover {
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  transform: rotate(90deg);
}
</style>
