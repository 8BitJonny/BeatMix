<template>
  <div class="flex flex-col">
    <div class="searchContainer">
      <div>
        <multiselect
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
          @select="() => { this.options = []; this.success = null }"
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
        <img v-for="result in value" :src="result.images[0].url" width="180" height="180"/>
      </div>
    </div>
    <Suggestions
      v-else
      class="desktop"
    />
    <div v-if="!success && value.length > 0" class="buttonWrapper">
      <button @click="createMixedArtistPlaylist" class="createButton ld-ext-left" :class="{ running: loading }">
        {{ loading ? 'Creating' : 'Create Playlist' }}
        <div class="ld ld-ring ld-spin"></div>
      </button>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import Suggestions from '~/components/suggestions'

export default {
  name: "Search",
  components: {
    Multiselect,
    Suggestions
  },
  data: function () {
    return {
      timer: 0,
      value: [],
      options: [],
      loading: false,
      success: null
    }
  },
  methods: {
    delayedInput: function(event) {
      clearTimeout(this.timer);
      this.timer = 0;

      this.timer = setTimeout(() => {
        if (event === "") {
          this.options = [];
          return
        }

        if (this.$store.state.user.id) {
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
        let albums = await this.getAllAlbums(this.value);

        let tracks = await this.getAllTracks(albums);

        tracks = this.filterOutTracksFromNotWantedArtists(tracks);

        tracks = tracks.map(el => {
          el.duration_ms = Math.floor(el.duration_ms / 1000);
          return el
        });
        tracks = this.filterDuplicates(tracks, ['name', 'duration_ms']);

        let newPlaylist = await this.createPlaylist(this.value.map(artist => artist.name).join(', '));

        await this.addTracksToPlaylist(newPlaylist.data.id, tracks);

        this.loading = false;
        this.success = true;
        this.$notify({
          duration: 3000,
          type: 'success',
          group: 'success',
          text: newPlaylist.data.external_urls.spotify
        });
      } catch(err) {
        this.$notify({
          duration: 7000,
          type: 'error',
          group: 'error',
          text: 'Ups, some network issue occurred. The playlist may be incomplete or not present at all. Try again and if the issue keeps happening contact timon.christiansen@code.berlin'
        });
        console.log("Error: ", err);
        this.loading = false;
      }
    },
    filterDuplicates: function(array, matchProperties) {
      return array.filter((elem, index, self) =>
        index === self.findIndex((t) => (
          this.allEqual(
            matchProperties.map(matcher => elem[matcher] === t[matcher]),
            true
          )
        ))
      )
    },
    async getAllAlbums(artists) {
      let albumPromises = [],
        albumResponses,
        albums = [],
        offset = 0;

      do {
        artists.forEach(artist => {
          albumPromises.push(
            this.$spotifyApi.getArtistAlbums(this.$store.state.token, artist.id, this.$store.state.user.country, offset)
          )
        });
        albumResponses = await Promise.all(albumPromises);
        albumResponses.forEach(albumResponse => albums.push(...albumResponse.data.items));
        offset += 20;
      } while (albumResponses[albumResponses.length - 1].data.next !== null);

      return albums
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
    @apply px-4 py-2 rounded-md
  }
  .buttonWrapper {
    @apply mt-8
  }
  a {
    color: #1DB954;
    text-decoration: underline;
  }
</style>
