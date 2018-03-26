import BuildingApi from '../../api/building.js';

const state = {
  raw: [],
  selected: [],
  mapped: {}
};

const mutations = {
  building_raw(state, raw) {
    state.raw = raw;
  },
  building_selected(state, selected) {
    state.selected = selected;
  },
  building_mapped(state) {
    var mapped = {};
    for ( var i = 0; i < state.selected.length; i++ ) {
      let building = state.selected[i];
      if ( building.alias == '' )  building.alias = building.name;
      mapped[building.alias] = building;
    }
    state.mapped = mapped;
  },
  building_data(state, data) {
    state.data = data;
  }
};

const actions = {
  fetchBuildings({ commit }) {
    BuildingApi.fetch(response => {
      commit('building_raw', response);
    })
  },
  setSelectedBuildings({ commit, state }, buildings) {
    var selectedBuildings = [];
    buildings.forEach((building) => {
      var rawBuilding = state.raw.filter((rawBuilding) => { return rawBuilding.id === building.id })[0];
      if(rawBuilding) {
        rawBuilding.alias = building.alias;
        selectedBuildings.push(rawBuilding)
      }
    });
    commit('building_selected', selectedBuildings);
    commit('building_mapped', selectedBuildings);
  },
  updateMappedBuildings({ commit }, buildings) {
    commit('building_mapped', buildings);
  }
};

export default {
  state,
  mutations,
  actions
}