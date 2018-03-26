import ExperimentAPI from '../../api/experiment.js';

const state = {
  id: null,
  data: {},
  all: []
};

const mutations = {
  experiment_id(state, id) { state.id = id;},
  experiment_data(state, data) { state.data = data; },
  experiment_data_nodes(state, nodes) {
    var experimentData = state.data;
    experimentData['nodes'] = nodes
  },
  experiment_all(state, experiments) {
    state.all = experiments
  }
};

const actions = {
  fetchExperimentData({ commit, dispatch }, experimentId) {
    ExperimentAPI.fetchData(experimentId, response => {
      commit('experiment_data', response)
      commit('result_scan_results', response.scan_results);
      commit('result_results', response.results);
      commit('result_metrics', response.metrics);
      dispatch('setLoading', false);
      dispatch('loadPersistedData', experimentId);
    });
    commit('experiment_id', experimentId);
  },
  setExperimentDataNodes({ commit, state }, nodes) {
    var experimentData = state.data;
    experimentData['nodes'] = nodes;
    commit('experiment_data', experimentData);
  },
  fetchAllExperiments({commit, dispatch}) {
    ExperimentAPI.fetchAll(response => {
      commit('experiment_all', response)
    })
  }
};

export default {
  state,
  mutations,
  actions
}