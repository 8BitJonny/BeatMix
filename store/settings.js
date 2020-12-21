export const state = () => ({
  filters: ['commentary', 'instrumental', 'live'],
  yearFilters: [],
});

export const mutations = {
  SET_FILTER(state, filters) {
    state.filters = filters
  },
  ADD_YEAR_FILTER(state, yearFilter) {
    state.yearFilters.push(yearFilter)
  },
  UPDATE_YEAR_FILTER(state, { updateObj, index }) {
    state.yearFilters[index] = Object.assign(state.yearFilters[index], updateObj)
  },
  DELETE_YEAR_FILTER(state, yearFilterIndex) {
    state.yearFilters.splice(yearFilterIndex, 1)
  },
  RESET_YEAR_FILTER(state) {
    state.yearFilters = []
  }
};
