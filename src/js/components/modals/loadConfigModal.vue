<template>
    <div class="test">
        <modal v-if="$store.state.general.options.showLoadConfigModal" :closeaction="'toggleLoadConfigModal'">
            <h4 slot="heading">
                <b>Load Config</b>
            </h4>

            <table class="table">
                <tr>
                    <th>Experiment</th>
                    <th>&nbsp;</th>
                </tr>
                <tr v-for="experiment in experiments">
                    <td>{{experiment.name}}</td>
                    <td><a v-show="experiment.config && experiment.config != '' && experiment.config != 'null'" @click="loadExperimentConfig(experiment)">load</a></td>
                </tr>
            </table>


        </modal>
    </div>
</template>

<script>
    export default {
        props: {
            closeaction: null
        },
        data() {
            return {
            }
        },
        computed: {
            experiments: {
                get() { return this.$store.state.experiment.all } ,
                set(experiments) { this.$store.commit('experiment_all', experiments); }
            }
        },
        methods: {
            loadExperimentConfig(experiment) {
                this.$store.dispatch('loadPersistedData', experiment.id)
                this.$store.dispatch('toggleLoadConfigModal')
            }
        }
    }
</script>