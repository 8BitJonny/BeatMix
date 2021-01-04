export const state = () => ({
  albums: {},
});

export const mutations = {
  SET_ALBUMS(state, { artist, albums }) {
    state.albums[artist.id] = albums
  },
  PUSH_ALBUMS(state, { artist, albums }) {
    if (!state.albums[artist.id]) {
      state.albums[artist.id] = albums
    } else {
      state.albums[artist.id].push(...albums)
    }
  }
};

export const actions = {
  async FETCH_ALBUMS({ commit, rootState }, { artist }) {
    commit('SET_ALBUMS', { artist, albums: [] });
    let albumResponse;
    let offset = 0;
    do {
      albumResponse = await this.$spotifyApi.getArtistAlbums(rootState.token, artist.id, rootState.user.country, offset);
      commit('PUSH_ALBUMS', { artist, albums: albumResponse.data.items });
      offset += 50;
    } while (albumResponse.data.next !== null);
  },
  GET_ALBUM_YEAR_SPAN({ state }, { artist: { id } }) {
    const getReleaseYear = album => album.release_date.split('-')[0];
    const getAllAlbums = _ => Object.keys(state.albums).flatMap(artistID => state.albums[artistID]);
    const getArtistAlbums = artistID => state.albums[artistID];

    const albums = id === '*'
     ? getAllAlbums()
     : getArtistAlbums(id);

    const albumReleaseDates = albums.map(getReleaseYear);
    const minYear = Math.min(...albumReleaseDates);
    const maxYear = Math.max(...albumReleaseDates);
    return [...Array(maxYear - minYear + 1).keys()].map(year => minYear + year);
  }
};
