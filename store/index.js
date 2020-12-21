export const state = () => ({
  user: null,
  token: null,
  timeout: null
});

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_TIMEOUT(state, timeout) {
    state.timeout = timeout
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
  LOGOUT({ commit, dispatch }) {
    commit('SET_USER', null);
    commit('SET_TOKEN', null);
    dispatch('SET_TIMEOUT', null)
  },
  SET_TOKEN({ commit, state, dispatch }, { access_token, expires_in }) {
    commit('SET_TOKEN', access_token);
    const timeout = setTimeout(() => {
      dispatch('LOGOUT')
    }, expires_in * 1000);
    dispatch('SET_TIMEOUT', timeout)
  },
  SET_TIMEOUT({ commit, state }, timeout) {
    const oldTimout = state.timeout;
    if (oldTimout !== null) clearTimeout(oldTimout);

    commit('SET_TIMEOUT', timeout)
  }
};
