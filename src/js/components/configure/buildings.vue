<template>
    <panel id="building">
        <h4 slot="heading"><b><a @click="$store.dispatch('showJsonViewer', {data: raw, title: 'Buildings'})">Buildings</a></b>({{selected.length}} selected)</h4>
        <div class="row" @change="updateMapping()">
            <div class="col-sm-6">
                <div class="form-group">
                    <label>Selected buildings</label>
                    <select v-multi-select multiple v-model="selected" class="form-control">
                        <option v-for="(rawBuilding, index) in raw" :key="rawBuilding.name" :value="rawBuilding">{{ rawBuilding.name }}</option>
                    </select>
                </div>
            </div>
            <div class="col-sm-6">
                <ul>
                    <li v-for="building in selected" :key="building.name" class="m-t-5">
                        <b>{{ building.name }}</b> a.k.a. <input class="form-control" v-model="building.alias">
                        <div>{{building.latitude}}, {{building.longitude}}</div>
                    </li>
                </ul>
            </div>
        </div>

    </panel>
</template>

<script>
    export default {
        computed: {
            raw: {
                get() { return this.$store.state.building.raw }
            },
            mapped: {
                get() { return this.$store.state.building.mapped }
            },
            selected: {
                get() { return this.$store.state.building.selected },
                set(selected) {
                    if ( selected.length > 0 ) {
                        this.$store.commit('building_selected', selected);
                    }
                }
            },
            jsonViewer: {
                get() {return this.$store.state.general.jsonViewer },
                set(newJsonViewer) { this.$store.commit('general_jsonViewer', newJsonViewer) }
            },
            options: {
                get() { return this.$store.state.viewer.options; },
                set(viewerOptions) { this.$store.dispatch('setViewerOptions', viewerOptions) }
            }
        },

        watch: {
            selected(newSelected, oldSelected) {
                if(this.options.rendered == true) {
                    alert(`MeshNetV already rendered ${oldSelected.length} buildings. Sorry, but unfortunately you have to reload MeshNetV to make a change in your building-selection.`);
                }
            }
        },

        methods: {
            updateMapping() {
                this.$store.dispatch('updateMappedBuildings')
            },
            showRaw() {
                this.jsonViewer.show = true;
                this.jsonViewer.data = this.raw;
            }
        }
    }
</script>
