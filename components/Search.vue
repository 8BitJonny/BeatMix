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
          :loading="loading"
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
    <div v-else class="desktop">
      <p class="text-3xl mt-12 -mb-8 ml-4 text-left">Suggestions</p>
      <div class="searchResults">
        <div v-for="suggestion in suggestions">
          <img :src="suggestion.img" width="180" height="180"/>
          <p>{{ suggestion.name }}</p>
        </div>
      </div>
    </div>
    <div v-if="!success && value.length > 0" class="buttonWrapper">
      <button @click="createPlaylist" class="createButton">Create Playlist</button>
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
      success: null,
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

        if (this.userId) {
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

        let trackPromises = [];
        while (albums.length > 0) {
          const end = Math.max(Math.min(albums.length, 20), 0);
          const albumsToAdd = albums.splice(0, end);
          trackPromises.push(this.$spotifyApi.getSeveralAlbums(this.cookies['spotify_auth_token'], albumsToAdd.map(album => album.id)));
        }

        let trackResponses = await Promise.all(trackPromises);

        trackResponses.forEach(trackResponse =>
          trackResponse.data.albums.forEach(albums => tracks.push(...albums.tracks.items))
        );

        //Filter out the tracks which don't have any of the artists that are in the searchQuery
        tracks = tracks.filter(track =>
          track.artists.some(artist =>
            this.value.some(v =>
              v.id === artist.id
            )
          )
        );

        tracks = tracks.map(el => {
          el.duration_ms = Math.floor(el.duration_ms / 1000);
          return el
        });
        tracks = this.filterDuplicates(tracks, ['name', 'duration_ms']);

        let newPlaylist = await this.$spotifyApi.createPlaylist(this.cookies['spotify_auth_token'], this.userId, this.value.map(artist => artist.name).join(', '));

        let addTrackPromises = [];
        while (tracks.length > 0) {
          const end = Math.max(Math.min(tracks.length, 100), 0);
          const tracksToAdd = tracks.splice(0, end);
          addTrackPromises.push(this.$spotifyApi.addTracksToPlaylist(this.cookies['spotify_auth_token'], newPlaylist.data.id, tracksToAdd.map(track => track.uri)));
        }

        await Promise.all(addTrackPromises);

        this.success = true;
        this.$notify({
          duration: 3000,
          type: 'success',
          group: 'success',
          text: newPlaylist.data.external_urls.spotify
        });
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
</style>
<style scoped>
  .searchContainer {
    @apply flex justify-center items-center
  }
  .label {
    @apply text-xl font-semibold mr-2
  }
  .input {
    width: 500px;
    @apply rounded-md text-black
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
