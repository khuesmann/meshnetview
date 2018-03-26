import Vuex from 'vuex';

import experimentStore from './modules/experiment';
import buildingsStore from './modules/building';
import nodeStore from './modules/node';



export default new Vuex.Store({
  modules: {
    experiment: experimentStore,
    building: buildingsStore,
    node: nodeStore
  }
});