export const state = () => ({
  user: null,
  token: null
});

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_TOKEN(state, token) {
    state.token = token
  }
};

export const actions = {
  async FETCH_USER({ commit, state }) {
    await this.$axios.$get('https://api.spotify.com/v1/me',
      { headers: {
          'Authorization': 'Bearer ' + state.token
        }}
    ).then(result => {
      let user = {
        ...result,
        image: result.images.length > 0 ? result.images[0].url : 'default'
      };

      commit('SET_USER', user);
    }).catch(err => {
      if (err.response.data.error.message === 'The access token expired') {
        commit('SET_USER', null);
        commit('SET_TOKEN', null);
      }
    });
  },
  LOGOUT({ commit }) {
    commit('SET_USER', null);
    commit('SET_TOKEN', null);
  }
};
