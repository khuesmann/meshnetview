import BuildingApi from '../../api/building.js';

import experimentModule from './experiment';
import buildingModule from './building';

const state = {
    raw: [],
    mapped: {},
    mappings: {
        identifier: "",
        building: "",
        level: "",
        room: "",
        latitude: "",
        longitude: "",
        ip: "",
        mac: ""
    },
    global: {
        positionType: null,
        relativeLatitude: null,
        relativeLongitude: null,
        building: null
    },
    newNode: {}
};

const mutations = {
    node_raw(state, nodes) { state.raw = nodes; },
    node_global(state, nodes) { state.global = nodes; },
    node_mappings(state, nodes) { state.mappings = nodes; },
    node_newNode(state, newNode) { state.newNode = newNode; },
    node_mapped(state, mapped) {
        var mappedNodes = mapped;
        if ( ! mappedNodes ) {
            mappedNodes = {};
            var mappings = state.mappings;
            var rawNodes = state.raw;
            if ( ! mappings.identifier ) return;
            for ( var i = 0; i < rawNodes.length; i ++ ) {
                var node = rawNodes[i];
                mappedNodes[node[mappings.identifier]] = {
                    identifier: node[mappings.identifier],
                    building: node[mappings.building],
                    level: node[mappings.level],
                    room: node[mappings.room],
                    latitude: node[mappings.latitude],
                    longitude: node[mappings.longitude],
                    ip: node[mappings.ip],
                    mac: node[mappings.mac],
                    hidden: node['hidden'],
                    positionType: node['positionType'],
                    relativeLatitude: node['relativeLatitude'],
                    relativeLongitude: node['relativeLongitude']
                }
            }
        }
        state.mapped = mappedNodes;
    }
};

const actions = {
    updateNodeMapping({ commit }, mapping) {
        commit('node_mappings_' + mapping.key, mapping.value);
    },
    massAssignNodePositionType({ commit, state }, massAssignment) {
        var rawNodes = state.raw;
        for ( var i = 0; i < rawNodes.length; i ++ ) {
            rawNodes[i]['positionType'] = massAssignment.positionType;
            rawNodes[i]['relativeLatitude'] = massAssignment.relativeLatitude;
            rawNodes[i]['relativeLongitude'] = massAssignment.relativeLongitude;
        }
        commit('node_raw', rawNodes);
    },
    massAssignNodeBuilding({ commit, state }, massAssignment) {
        var rawNodes = state.raw;
        var mappings = state.mappings;
        for ( var i = 0; i < rawNodes.length; i ++ ) {
            rawNodes[i][mappings.building] = massAssignment.building;
        }
        commit('node_raw', rawNodes);
    },
    updateMappedNodes({ commit }) {
        commit('node_mapped');
    },
    addNewNode({commit, state}, newNode) {
        var rawNodes = state.raw;
        rawNodes = state.raw.concat([newNode]);
        commit('node_raw', state.raw.concat([newNode]));
    }
};

export default {
    state,
    mutations,
    actions
}