<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <load-config-modal :closeaction="'toggleLoadConfigModal'"></load-config-modal>

                <h1>
                    Configure Experiment
                    <div class="btn-group pull-right" v-if="experimentId">
                        <a @click="$store.dispatch('toggleLoadConfigModal')" class="btn btn-xs btn-success ">Load configuration</a>
                        <a @click="forget()" class="btn btn-xs btn-warning ">Forget configuration</a>
                    </div>
                </h1>
            </div>
            <div class="col-sm-6">
                <configure-experiments class="panel-primary"></configure-experiments>
            </div>
            <div class="col-sm-6">
                <configure-buildings class="panel-primary"></configure-buildings>
            </div>
            <div class="col-sm-12">
                <configure-nodes v-if="$store.state.experiment.data.nodes" class="panel-primary"></configure-nodes>
            </div>
            <div class="col-sm-6">
                <configure-results v-if="$store.state.node.raw.length > 0" type="results" name="Results" :class="{'panel-primary': options.resultType == 'results'}"></configure-results>
            </div>
            <div class="col-sm-6">
                <configure-results v-if="$store.state.node.raw.length > 0" type="scan_results" name="Scan Results" :class="{'panel-primary': options.resultType == 'scan_results'}"></configure-results>
            </div>
        </div>
    </div>
</template>

<script>
    import loadConfigModal from '../modals/loadConfigModal.vue';

    export default {
        components: {
            'configure-experiments': require('./experiments.vue'),
            'configure-buildings': require('./buildings.vue'),
            'configure-nodes': require('./nodes.vue'),
            'configure-results': require('./results.vue'),
            'load-config-modal': loadConfigModal
        },
        computed: {
            options: {
                get() { return this.$store.state.viewer.options },
                set(options) { this.$store.state.viewer.options = options }
            },
            experimentId: { get() { return this.$store.state.experiment.id } }
        },
        methods: {
            forget() {
                if(confirm("Forget this configuration?") == true) {
                    this.$store.dispatch('forgetData');

                }
            }
        }
    }
</script>
