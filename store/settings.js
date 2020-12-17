export const state = () => ({
  filters: ['commentary', 'instrumental', 'live'],
});

export const mutations = {
  SET_FILTER(state, filters) {
    state.filters = filters
  }
};
