<template>
    <panel id="experiment">
        <h4 slot="heading"><b><a @click="$store.dispatch('showJsonViewer', {data: $store.state.experiment.data.general, title: 'Experiment'})">Experiment</a></b></h4>
        <div class="row">
            <div class="col-sm-12" v-if="$store.state.experiment.id == null">
                Please select an experiment:
                <ul>
                    <li v-for="experiment in experiments"><a :href="'/?experimentId=' + experiment.id">{{experiment.name}}</a></li>
                </ul>
            </div>
            <div class="col-sm-12" v-if="$store.state.experiment.data.general">
                <label>General information</label>
                <pre>{{$store.state.experiment.data.general}}</pre>
            </div>
        </div>
    </panel>
</template>

<script>
    import persist from '../../api/persist.js';
    export default {
        computed: {
            id: {
                get() { return this.$store.state.experiment.id }
            },
            experiments: {
                get() { return this.$store.state.experiment.all }
            }
        },

        data() {
            return {
                showPreview: false
            }
        }
    }
</script>
