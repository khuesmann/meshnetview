import Vuex from 'vuex';

import experimentModule from './modules/experiment.js';
import buildingsModule from './modules/building.js';
import nodeModule from './modules/node';
import viewerModule from './modules/viewer';
import resultModule from './modules/result';
import generalModule from './modules/general'

import PersistAPI from '../api/persist';
import ExperimentMapper from '../helpers/ExperimentMapper';

export default new Vuex.Store({

    modules: {
        experiment: experimentModule,
        building: buildingsModule,
        node: nodeModule,
        viewer: viewerModule,
        result: resultModule,
        general: generalModule
    },

    actions: {
        loadAllData({ commit, state, dispatch }) {
            dispatch('fetchBuildings');
            dispatch('fetchAllExperiments');
            var experimentId = getParameterByName('experimentId');
            if ( experimentId ) {
                dispatch('fetchExperimentData', experimentId);
            }
            else {
                state.viewer.options.loading = false;
            }
        },
        persistData({ commit, state }) {
            if(state.experiment.id === null) return;
            var buildings = [];
            state.building.selected.forEach((building) => { buildings.push({ id: building.id, alias: building.alias }) });
            var dataToPersist = {
                selectedBuildings: buildings,
                nodes: state.node,
                results: {
                    mappings: state.result.mappings
                },
                options: {
                    resultType: state.viewer.options.resultType,
                    globalNode: state.node.global
                }
            };
            PersistAPI.set(state.experiment.id, dataToPersist)
        },
        forgetData({state}) {
            PersistAPI.set(state.experiment.id, null, () => {
                window.location = window.location;
            })

        },
        loadPersistedData({ commit, state, dispatch }, experimentId) {
            var loadedExperimentId = state.experiment.id;
            var callback = (response) => {
                if(!response) return;
                if(response.selectedBuildings) {
                    dispatch('setSelectedBuildings', response.selectedBuildings);
                }
                if(response && response != '') {
                    if(response.nodes) {
                        if(loadedExperimentId == experimentId && response.nodes.raw) commit('node_raw', response.nodes.raw);
                        commit('node_mappings', response.nodes.mappings);
                    }
                    if(response.results) {
                        commit('result_mappings', response.results.mappings);
                    }
                    if(response.options) {
                        commit('node_global', response.options.globalNode);
                        commit('viewer_resultType', response.options.resultType);
                    }
                }
            };
            PersistAPI.get(experimentId, callback);
        },
        mapResults({ commit, state, dispatch }, type) {
            var nodes = state.node.mapped;
            var rawResults = state.result[type];
            var resultMapping = state.result.mappings[type];
            var experimentMapper = new ExperimentMapper(rawResults, resultMapping, nodes);
            commit('result_mapped', experimentMapper.getMappedResults());
            dispatch('setLoading', false);
        },
        prepareAllData({commit, state, dispatch}, callback) {
            dispatch('persistData');
            dispatch('setViewerResults', []);
            commit('node_mapped', []);
            commit('viewer_nodes', {});
            commit('viewer_pauseTimeline');
            commit('viewer_resetExceeded');
            document.body.dispatchEvent(new CustomEvent('reset-networkviewer'));
            setTimeout(function() {
                if(state.experiment.id) {
                    commit('node_mapped');
                    commit('result_mapped', {
                        mappedNodes: state.node.mapped,
                        rawResults: state.result[state.viewer.options.resultType],
                        resultMapping: state.result.mappings[state.viewer.options.resultType],
                        type: state.viewer.options.resultType
                    });
                }

                dispatch('setLoading', false)
            }, 0);
            if(callback) callback();
        },
        applyResultFilters({commit, state}) {
            var shownResults = [];
            state.viewer.unfilteredResults.forEach(function(result) {
                var addResult = true;
                if(state.viewer.resultOptions.hasColor) {
                    if(isNaN(result.color.value)) addResult = false;
                }
                if(state.viewer.resultOptions.hasWidth) {
                    if(isNaN(result.width)) addResult = false;
                }
                if(state.viewer.resultOptions.hasEndNode) {
                    if(result.nodeEnd == null) addResult = false;
                }
                if(state.viewer.resultOptions.startNode) {
                    if(result.nodeStart != state.viewer.resultOptions.startNode) addResult = false;
                }
                if(state.viewer.resultOptions.endNode) {
                    if(result.nodeEnd != state.viewer.resultOptions.endNode) addResult = false;
                }
                if(addResult) shownResults.push(result)
            });
            commit('viewer_results', shownResults)
        }
    }
});