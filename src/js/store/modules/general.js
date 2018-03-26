const state = {
    options: {
        showNewNodeModal: false,
        showLoadConfigModal: false
    },
    jsonViewer: {
        show: false,
        data: [],
        title: ""
    }
};

const mutations = {
    general_options_showNewNodeModal(state, showModal) { state.options.showNewNodeModal = showModal },
    general_options_showLoadConfigModal(state, showModal) { state.options.showLoadConfigModal = showModal },
    general_jsonViewer(state, jsonViewer) { state.jsonViewer = jsonViewer }
};

const actions = {
    toggleNewNodesModal({commit, state}) {
        commit('general_options_showNewNodeModal', !state.options.showNewNodeModal)
    },
    toggleLoadConfigModal({commit, state}) {
        commit('general_options_showLoadConfigModal', !state.options.showLoadConfigModal)
    },
    showJsonViewer({commit, state}, jsonData) {
        state.jsonViewer.show = true;
        state.jsonViewer.data = jsonData.data;
        state.jsonViewer.title = jsonData.title;
        document.body.style.overflow = 'hidden';
    }
};

export default {
    state,
    mutations,
    actions
}