window.API_URL_FETCH_BUILDINGS = ENV.API_URL_FETCH_BUILDINGS;
window.API_URL_FETCH_EXPERIMENTS = ENV.API_URL_FETCH_EXPERIMENTS;
window.API_URL_FETCH_EXPERIMENT = ENV.API_URL_FETCH_EXPERIMENT;
window.API_URL_SAVE_CONFIG = ENV.API_URL_SAVE_CONFIG;
window.API_URL_FETCH_CONFIG = ENV.API_URL_FETCH_CONFIG;
window.URL_MESHNETCONF = ENV.URL_MESHNETCONF;

import store from './store/index.js';

Vue.component('panel', require('./components/partials/panel.vue'));
Vue.component('modal', require('./components/partials/modal.vue'));
Vue.component('json-preview', require('./components/partials/jsonPreview.vue'));

Vue.config.debug = true;

import unixToStringFilter from './filters/unixToString';
Vue.filter('unixToString', unixToStringFilter);

import multiSelectDirective from './directives/multiSelectDirective';

Vue.directive('multi-select', multiSelectDirective);

const app = new Vue({
    el: '#app',
    components: {
        configure: require('./components/configure/configure.vue'),
        viewer: require('./components/viewer/viewer.vue')
    },
    store,
    beforeCreate() {
        this.$store.dispatch('loadAllData');
    },
    mounted() {
        $('.hide-on-loading').removeClass('hide-on-loading');
    },
    computed: {
        experimentId: { get() { return this.$store.state.experiment.id } },
        options: {
            get() { return this.$store.state.viewer.options; },
            set(viewerOptions) { this.$store.dispatch('setViewerOptions', viewerOptions) }
        },
        networkViewer: {
            get() { return this.$store.state.viewer.networkViewer }
        }
    },
    methods: {
        showExperiment(rerender) {
            this.$store.dispatch('setLoading', true);
            if ( ! this.options.rendered || rerender ) {
                this.$store.dispatch('prepareAllData');
            }
            else {
                this.$store.dispatch('setLoading', false);
            }
            this.$store.state.viewer.options.show = 'viewer';
            document.body.style.overflow = 'hidden';
        },
        showConfiguration() {
            this.options.show = 'configure';
            document.body.style.overflow = 'scroll';
        },
        persist() {
            this.$store.dispatch('persistData');
        }
    }
});