export default function ({ $axios, app }, inject) {
  inject('spotifyApi', new SpotifyAPI($axios))
}

class SpotifyAPI {
  constructor(axios) {
    this.axios = axios;
    this.axios.defaults.baseURL = 'https://api.spotify.com/v1/';
  }
  async search(authToken, artists) {
    return this.axios.get(`/search`, {
      headers: { 'Authorization': 'Bearer ' + authToken },
      params: {
        q: artists,
        type: 'artist',
        limit: 5
      },
      progress: false
    })
  }
  async getArtistAlbums(authToken, artistId, country, offset) {
    return this.axios.get(`/artists/${artistId}/albums`, {
      headers: { 'Authorization': 'Bearer ' + authToken },
      params: {
        country,
        offset,
        limit: 50
      },
      progress: false
    })
  }
  async getSeveralAlbums(authToken, albumIds) {
    return this.axios.get(`/albums`, {
      headers: { 'Authorization': 'Bearer ' + authToken },
      params: {
        ids: albumIds.join(',')
      },
      progress: false
    })
  }
  async createPlaylist(authToken, userId, name) {
    return this.axios.post(`/users/${userId}/playlists`, {
      name
    }, {
      headers: { 'Authorization': 'Bearer ' + authToken },
      progress: false
    })
  }
  async addTracksToPlaylist(authToken, playlistId, trackIds) {
    return this.axios.post(`/playlists/${playlistId}/tracks`, {
      uris: trackIds
    }, {
      headers: { 'Authorization': 'Bearer ' + authToken },
      progress: false
    })
  }
}
