import ResultAPI from '../../api/result.js';
import ExperimentMapper from '../../helpers/ExperimentMapper';

const state = {
    scan_results: [],
    results: [],
    loading: {
        results: true,
        scan_results: true
    },
    mappings: {
        scan_results: {
            startNode: {
                metric: [],
                mappings: []
            },
            endNode: {
                metric: [],
                mappings: []
            },
            color: {
                metric: null,
                min: null,
                max: null,
                names: 'green,yellow,red'
            },
            width: {
                metric: null,
                min: null,
                max: null
            },
            result: {
                parameter: null,
                nodeIdentifier: null,
                startTime: null,
                endTime: null,
                endTimeAdditional: 10
            },
            markers: [],
            filter: {
                parameter: null,
                values: []
            }
        },
        results: {
            startNode: {
                metric: [],
                mappings: []
            },
            endNode: {
                metric: [],
                mappings: []
            },
            color: {
                metric: null,
                min: null,
                max: null,
                names: 'green,yellow,red'
            },
            width: {
                metric: null,
                min: null,
                max: null
            },
            result: {
                parameter: null,
                nodeIdentifier: null,
                startTime: null,
                endTime: null,
                endTimeAdditional: 0
            },
            markers: [],
            filter: {
                parameter: null,
                values: []
            }
        }
    },
    mapped: {
        results: [],
        scan_results: []
    },
    chronological: {
        results: [],
        scan_results: []
    },
    filledChronological: {
        results: [],
        scan_results: []
    },
    metrics: {
        results: [],
        scan_results: []
    }
};

const mutations = {
    result_scan_results(state, scan_results) {
        state.scan_results = scan_results;
    },
    result_results(state, results) {
        state.results = results;
    },
    result_mappings(state, mappings) {
        state.mappings = mappings;
    },
    result_metrics(state, metrics) {
        state.metrics = metrics;
    },
    result_mapped(state, data) {
        var nodes = data.mappedNodes;
        var rawResults = data.rawResults;
        var resultMapping = data.resultMapping;
        var type = data.type;
        var experimentMapper = new ExperimentMapper(rawResults, resultMapping, nodes);
        var results = experimentMapper.getMappedResults();
        if(!results) return;
        state.mapped[type] = results.mappedResults;
        state.chronological[type] = results.chronologicalResults;
    }
};

const actions = {
    fetchResults({ commit, dispatch }, experimentId) {
        ResultAPI.fetch(experimentId, response => {
            commit('result_scan_results', response.scan_results);
            commit('result_results', response.results);
            commit('result_metrics', response.metrics);
            dispatch('setLoading', false);
        });
    }
};

export default {
    state,
    mutations,
    actions
}