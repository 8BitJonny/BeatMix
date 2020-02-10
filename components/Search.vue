<template>
  <div class="flex flex-col">
    <div
      v-if="playlistURL"
      class="mb-12 -mt-8"
    >
      <span>
        Successfully created your Playlist.<br>Look into your Spotify Account or open via this
        <a :href=playlistURL>link</a>.
      </span>
    </div>
    <div v-if="!playlistURL && value.length > 0" class="buttonWrapper">
      <button @click="createPlaylist" class="createButton">Create Playlist</button>
    </div>
    <div class="searchContainer">
      <label
        for="search"
        class="label"
      >
        Search
      </label>

      <div>
        <multiselect
          id="search"
          ref="search"
          label="name"
          class="input"
          track-by="id"
          v-model="value"
          :multiple="true"
          :loading="loading"
          :options="options"
          :closeOnSelect=false
          @select="() => { this.options = []; this.playlistURL = null }"
          @search-change="delayedInput"
          placeholder='Press "/" to focus'
        >
          <p slot="noOptions" class="text-sm">No Artists found</p>
        </multiselect>
      </div>
    </div>
    <div class="searchResults">
      <img v-for="result in value" :src="result.images[0].url" width="180" height="180"/>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: "Search",
  props: {
    userId: String,
  },
  components: {
    Multiselect
  },
  data: function () {
    return {
      timer: 0,
      value: [],
      options: [],
      loading: false,
      playlistURL: null
    }
  },
  methods: {
    delayedInput: function(event) {
      clearTimeout(this.timer);
      this.timer = 0;

      this.timer = setTimeout(() => {
        this.searchArtists.bind(this, event)();
        this.$emit('update', event)
      }, 250)
    },
    searchArtists: function(artistName) {
      if (artistName === "") {
        this.options = [];
        return
      }
      this.loading = true;
      this.$spotifyApi.search(this.cookies['spotify_auth_token'], artistName)
        .then(result => {
          this.loading = false;
          this.options = result.data.artists.items
        })
        .catch(err => {
          this.loading = true;
          console.error(err)
        })
    },
    createPlaylist: async function () {
      try {
        this.playlistURL = null;
        let albumPromises = [],
          albums = [],
          tracks = [];
        this.value.forEach(artist => {
          albumPromises.push(
            this.$spotifyApi.getArtistAlbums(this.cookies['spotify_auth_token'], artist.id)
          )
        });
        const albumResponses = await Promise.all(albumPromises);
        albumResponses.forEach(albumResponse => albums.push(...albumResponse.data.items));

        let trackResponse = await this.$spotifyApi.getSeveralAlbums(this.cookies['spotify_auth_token'], albums.map(album => album.id).slice(0,20));
        trackResponse.data.albums.forEach(albums => tracks.push(...albums.tracks.items));


        tracks = tracks.map(el => {
          el.duration_ms = Math.floor(el.duration_ms / 1000);
          return el
        });
        tracks = this.filterDuplicates(tracks, ['name', 'duration_ms']);

        let newPlaylist = await this.$spotifyApi.createPlaylist(this.cookies['spotify_auth_token'], this.userId, this.value.map(artist => artist.name).join(', '));

        let trackIndex = 0,
          addTrackPromises = [];
        while (trackIndex < tracks.length) {
          const end = Math.max(Math.min(tracks.length - trackIndex, 100), 0);
          const tracksToAdd = tracks.slice(0, end);
          addTrackPromises.push(this.$spotifyApi.addTracksToPlaylist(this.cookies['spotify_auth_token'], newPlaylist.data.id, tracksToAdd.map(track => track.uri)));
          trackIndex += end;
        }

        await Promise.all(addTrackPromises);
        this.playlistURL = newPlaylist.data.external_urls.spotify
      } catch(err) {
        console.log("Error: ", err)
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
    allEqual: (arr, matcher) => arr.every( v => v === matcher )
  },
  computed: {
    cookies: function() {
      const pairs = document.cookie.split(";");
      let cookies = {};
      for (let i=0; i<pairs.length; i++){
        let pair = pairs[i].split("=");
        cookies[(pair[0]+'').trim()] = unescape(pair.slice(1).join('='));
      }
      return cookies;
    }
  },
  mounted() {
    //window.addEventListener('keyup', (event) => {
    //  if (event.key === "/") {
    //    this.$refs.search.focus();
    //  }
    //})
  }
}
</script>

<style>
  .multiselect__tag {
    background-color: #1DB954;
  }
</style>
<style scoped>
  .searchContainer {
    @apply flex justify-center items-center
  }
  .label {
    @apply text-xl font-semibold mr-2
  }
  .input {
    width: 400px;
    @apply rounded-md text-black
  }
  .searchResults {
    max-width: 720px;
    @apply flex flex-wrap justify-center
  }
  .searchResults > * {
    width: 180px;
    height: 180px;
    @apply p-4
  }
  .createButton {
    background-color: #1DB954;
    @apply px-2 py-1 rounded-md
  }
  .buttonWrapper {
    @apply -mt-12 mb-8
  }
  a {
    color: #1DB954;
    text-decoration: underline;
  }
</style>
