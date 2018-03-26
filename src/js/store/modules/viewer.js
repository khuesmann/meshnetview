import BuildingApi from '../../api/building.js';

import experimentModule from './experiment';
import buildingModule from './building';

const state = {
  networkViewer: null,
  options: {
    show: 'configure',
    loading: true,
    radialCamera: true,
    rendered: false,
    resultType: 'results',
    maxResultCount: 150,
    maxResultsExceeded: false
  },
  timeline: {
    pointOfTime: 0,
    pointOfTimeSequence: 0,
    sequence: 0,
    has_timegaps: false,
    is_sequenced: false,
    playInterval: null
  },
  meshes: {
    buildings: {},
    nodes: {},
    edges: {}
  },
  results: [],
  unfilteredResults: [],
  resultOptions: {
    hasWidth: null,
    hasColor: null,
    hasEndNode: null,
    startNode: null,
    endNode: null
  }
};

const mutations = {
  viewer_networkViewer(state, networkViewer) { state.networkViewer = networkViewer; },
  viewer_options(state, options) { state.options = options; },
  viewer_resultType(state, resultType) { state.options.resultType = resultType; },
  viewer_timeline(state, timeline) { state.timeline = timeline; },
  viewer_meshes(state, meshes) { state.meshes = meshes; },
  viewer_nodes(state, nodes) { state.meshes.nodes = nodes; },
  viewer_loading(state, isLoading) { state.options.loading = isLoading },
  viewer_pointOfTime(state, pointOfTime) { state.timeline.pointOfTime = pointOfTime },
  viewer_pointOfTimeSequence(state, pointOfTimeSequence) { state.timeline.pointOfTimeSequence = pointOfTimeSequence },
  viewer_sequence(state, sequence) { state.timeline.sequence = sequence },
  viewer_results(state, results) {
    if(results.length > state.options.maxResultCount) {
      state.options.maxResultsExceeded = true;
      console.log("You are trying to show more than " +  state.options.maxResultCount +" results at once. This will be to much for your web-browser. Please use filters your shown results to minimize your result output.")
      results = results.slice(0, state.options.maxResultCount);
    }
    state.results = results
  },
  viewer_unfilteredResults(state, unfilteredResults) { state.unfilteredResults = unfilteredResults },
  viewer_pauseTimeline(state) {
    if(state.timeline.playInterval) {
      clearInterval(state.timeline.playInterval);
      state.timeline.playInterval = null;
    }
  },
  viewer_resetExceeded(state) {
    state.options.maxResultsExceeded = false;
  }
};

const actions = {
  setNetworkViewer({commit}, networkViewer) {
    commit('viewer_networkViewer', networkViewer)
  },
  setViewerOptions({commit}, options) {
    commit('viewer_options', options)
  },
  setViewerMeshes({commit}, meshes) {
    commit('viewer_meshes', meshes)
  },
  setLoading({commit}, isLoading) {
    commit('viewer_loading', isLoading)
  },
  setViewerResults({commit, dispatch}, results) {
    commit('viewer_results', results);
    commit('viewer_unfilteredResults', results);
    dispatch('applyResultFilters')
  }
};

export default {
  state,
  mutations,
  actions
}