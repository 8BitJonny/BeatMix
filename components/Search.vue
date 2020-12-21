<template>
  <div class="flex flex-col">
    <div class="searchContainer">
      <div>
        <multiselect
          :max="12"
          id="search"
          ref="search"
          label="name"
          class="input"
          track-by="id"
          v-model="value"
          :multiple="true"
          :options="options"
          :hideSelected="true"
          :closeOnSelect=false
          @select="onSelect"
          @search-change="delayedInput"
          placeholder='Select your beloved artists'
        >
          <p slot="noOptions" class="text-sm">No Artists found</p>
        </multiselect>
      </div>
    </div>
    <div v-if="value.length > 0">
      <p class="text-3xl mt-12 -mb-8 ml-4 text-left">Your selected Artists</p>
      <div class="searchResults">
        <template
          v-for="result in value"
        >
          <img
            v-if="result.images[0]"
            :src="result.images[0].url"
            width="180"
            height="180"
          />
          <div
            v-else
            class="fallback-artist"
          >
            <img src="~/assets/img/music-disc.png" class="userPicture" alt="">
            <p>{{ result.name }}</p>
          </div>
        </template>
      </div>
    </div>
    <Suggestions
      v-else
      class="desktop"
    />
    <div v-if="!success && value.length > 0" class="buttonWrapper">
      <div class="createButton">
        <button @click="createMixedArtistPlaylist" class="ld-ext-left" :class="{ running: loading }">
          {{ loading ? 'Creating' : 'Create Playlist' }}
          <div class="ld ld-ring ld-spin"></div>
        </button>
        <settings :artists="value" />
      </div>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import Suggestions from '~/components/suggestions'
import Settings from '~/components/settings'

export default {
  name: "Search",
  components: {
    Multiselect,
    Suggestions,
    Settings
  },
  data: function () {
    return {
      timer: 0,
      value: [],
      options: [],
      loading: false,
      success: null,
      settingsOpen: false
    }
  },
  methods: {
    onSelect: function(artist) {
      this.options = [];
      this.success = null;
      this.$store.dispatch('spotify/FETCH_ALBUMS', { artist })
    },
    delayedInput: function(event) {
      clearTimeout(this.timer);
      this.timer = 0;

      this.timer = setTimeout(() => {
        if (event === "") {
          this.options = [];
          return
        }

        if (this.$store.state.user) {
          this.searchArtists.bind(this, event)();
          this.$emit('update', event)
        } else {
          this.$notify({
            duration: 3000,
            type: 'error',
            group: 'error',
            text: 'You need to login with your Spotify account first.'
          })
        }

      }, 250)
    },
    searchArtists: function(artistName) {
      this.$spotifyApi.search(this.$store.state.token, artistName)
        .then(result => {
          this.options = result.data.artists.items
        })
        .catch(console.error)
    },
    createMixedArtistPlaylist: async function () {
      try {
        this.loading = true;
        const albumsPerArtist = this.$store.state.spotify.albums;

        let allAlbums = Object
          .keys(albumsPerArtist)
          .flatMap(artistID => this.applyYearFilter(artistID, albumsPerArtist[artistID]));

        let tracks = await this.getAllTracks(allAlbums);
        tracks = this.filterOutTracksFromNotWantedArtists(tracks);
        tracks.forEach(track => (track.duration_ms = Math.floor(track.duration_ms / 1000)));
        tracks = this.filterDuplicates(tracks, ['name', 'duration_ms']);
        tracks = this.removeBlacklistedTrackTypes(tracks);

        let newPlaylist = await this.createPlaylist(this.value.map(artist => artist.name).join(', '));
        await this.addTracksToPlaylist(newPlaylist.data.id, tracks);

        this.$store.commit('settings/RESET_YEAR_FILTER');
        this.loading = false;
        this.success = true;
        this.$notify({
          duration: 5000,
          type: 'success',
          group: 'success',
          text: 'Successfully created your Playlist,\n check into your Spotify Account to enjoy it.'
        });
      } catch(err) {
        this.$notify({
          duration: 9000,
          type: 'error',
          group: 'error',
          text: 'Ups, some network issue occurred. Try again and if it keeps happening contact timon.christiansen@code.berlin'
        });
        console.log("Error: ", err);
        this.loading = false;
      }
    },
    applyYearFilter(artistID, albums) {
      const getReleaseYear = album => album.release_date.split('-')[0];
      const findFilter = condition => this.$store.state.settings.yearFilters.find(condition);
      const findDirectArtistFilter = artistID => findFilter(filter => filter.artist === artistID);
      const findCatchAllYearFilter = _ => findFilter(filter => filter.artist === `*`);
      const findApplicableYearFilter = artistID => findDirectArtistFilter(artistID) || findCatchAllYearFilter() || null;

      const yearFilter = findApplicableYearFilter(artistID);
      if (!yearFilter) return albums;

      return albums.filter(album => {
        const releaseYear = getReleaseYear(album);
        return releaseYear >= yearFilter.lowerBound
          && releaseYear <= yearFilter.upperBound;
      });
    },
    filterDuplicates(array, matchProperties) {
      return array.filter((elem, index, self) =>
        index === self.findIndex((t) => (
          this.allEqual(
            matchProperties.map(matcher => elem[matcher] === t[matcher]),
            true
          )
        ))
      )
    },
    async getAllTracks(albums) {
      let trackPromises = [],
        tracks = [];
      while (albums.length > 0) {
        const end = Math.max(Math.min(albums.length, 20), 0);
        const albumsToAdd = albums.splice(0, end);
        trackPromises.push(this.$spotifyApi.getSeveralAlbums(this.$store.state.token, albumsToAdd.map(album => album.id)));
      }

      let trackResponses = await Promise.all(trackPromises);

      trackResponses.forEach(trackResponse =>
        trackResponse.data.albums.forEach(albums => tracks.push(...albums.tracks.items))
      );
      return tracks;
    },
    filterOutTracksFromNotWantedArtists(tracks) {
      return tracks.filter(track =>
        track.artists.some(artist =>
          this.value.some(v =>
            v.id === artist.id
          )
        )
      );
    },
    async createPlaylist(name) {
      return await this.$spotifyApi.createPlaylist(this.$store.state.token, this.$store.state.user.id, name);
    },
    removeBlacklistedTrackTypes(tracks) {
      const regex = this.$store.state.settings.filters
        .map(filter => {
          switch (filter) {
            case 'live':
              return '((?:[\\(-][\\w /]*)Live)';
            case 'instrumental':
              return '((?:[\\(-][\\w /]*)Instrumental)';
            case 'commentary':
              return '((?:[\\(-][\\w ]*)Commentary|Commentary(?:\\:))'
          }
        })
        .join('|');

      if (regex === '') return tracks;

      const blacklist = new RegExp(regex,'i');
      return tracks.filter(track => !blacklist.test(track.name))
    },
    async addTracksToPlaylist(playlistID, tracks) {
      let addTrackPromises = [];
      while (tracks.length > 0) {
        const end = Math.max(Math.min(tracks.length, 100), 0);
        const tracksToAdd = tracks.splice(0, end);
        addTrackPromises.push(this.$spotifyApi.addTracksToPlaylist(this.$store.state.token, playlistID, tracksToAdd.map(track => track.uri)));
      }

      return await Promise.all(addTrackPromises);
    },
    allEqual: (arr, matcher) => arr.every( v => v === matcher )
  },
  mounted() {
    if (!localStorage.getItem('notifiedAboutYearFilter') &&
      new Date().getTime() < new Date('01.02.2020').getTime()) {
      localStorage.setItem('notifiedAboutYearFilter', 'true');
      this.$notify({
        duration: 60000,
        type: 'success',
        group: 'success',
        text: 'Hey, good news! Now you also have the ability to filter the artists tracks by years. Just open the settings during playlist creation and get started. Have fun and enjoy!'
      });
    }

    setTimeout(() => {
      document.querySelector('.searchContainer input').focus();
    }, 200);

    window.addEventListener('keyup', (event) => {
      if (event.key === "/" && !this.$refs.search.isOpen) {
        document.querySelector('.searchContainer input').focus();
      }
    })
  }
}
</script>

<style>
  .multiselect__tag {
    background-color: #1DB954;
  }
  .searchResults {
    width: 848px;
    @apply flex flex-wrap justify-start mt-8
  }
  .searchResults > * {
    width: 180px;
    height: 180px;
    box-shadow: 0 4px 4px #000000;
    @apply m-4
  }
  .createButton .settings-button {
    @apply px-3 py-3 select-none outline-none
  }
  .createButton .settings-button:hover {
    background-color: #168D40;
    @apply rounded-r-md
  }
  @media (max-width: 1000px) {
    .searchResults {
      width: 636px;
    }
  }
  @media (max-width: 750px) {
    .searchResults {
      width: 424px;
    }
    .input {
      width: 300px !important;
    }
  }
  @media (max-width: 500px) {
    .searchResults {
      width: 212px;
    }
    .input {
      width: 200px !important;
    }
  }
</style>
<style scoped>
  .searchContainer {
    @apply flex justify-center items-center
  }
  .input {
    width: 500px;
    @apply rounded-md text-black
  }
  .createButton {
    background-color: #1DB954;
    @apply rounded-md inline-flex select-none
  }
  .createButton > button:hover {
    background-color: #168D40;
    @apply rounded-l-md
  }
  .createButton > button:nth-child(1) {
    @apply px-4 py-2 select-none outline-none font-bold
  }
  .buttonWrapper {
    @apply mt-8
  }
  a {
    color: #1DB954;
    text-decoration: underline;
  }
  .fallback-artist {
    background-color: #282828;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 11.25rem;
    height: 11.25rem;
    padding: 1rem
  }

  .fallback-artist img {
    margin-bottom: 1rem;
    height: 4rem;
  }
</style>
