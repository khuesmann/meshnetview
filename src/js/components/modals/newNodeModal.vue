<template>
    <modal v-if="$store.state.general.options.showNewNodeModal" :closeaction="'toggleNewNodesModal'">
        <h4 slot="heading">
            <b>Add new node</b>
        </h4>

        <form class="row" @submit.prevent="addNode($event)">
            <div class="col-sm-6">
                <div class="form-group">
                    <label>
                        Identifier
                        <input v-model="identifier" class="form-control">
                    </label>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label>
                        Building
                        <input v-model="building" class="form-control">
                    </label>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label>
                        Level
                        <input v-model="level" class="form-control">
                    </label>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label>
                        Room
                        <input class="form-control" v-model="room">
                    </label>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label>
                        Latitude
                        <input v-model="latitude" class="form-control">
                    </label>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label>
                        Longitude
                        <input v-model="longitude" class="form-control">
                    </label>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label>
                        IP
                        <input v-model="ip" class="form-control">
                    </label>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label>
                        MAC
                        <input v-model="mac" class="form-control">
                    </label>
                </div>
            </div>
            <div class="col-sm-12">
                <button type="submit" class="btn btn-success pull-right">Add node</button>
            </div>
        </form>

    </modal>
</template>

<script>
    export default {
        props: {
            closeaction: null
        },
        data() {
            return {
                identifier: null,
                building: null,
                level: null,
                room: null,
                latitude: null,
                longitude: null,
                ip: null,
                mac: null
            }
        },
        computed: {
            newNode: {
                get() { return this.$store.state.node.newNode } ,
                set(newNode) { this.$store.commit('node_newNode', newNode); }
            },
            mappings: {
                get() { return this.$store.state.node.mappings },
                set(mapping) { this.$store.commit('node_mapping', mapping) }
            }
        },
        methods: {
            addNode(event) {

                var newNode = {};
                newNode[this.mappings.identifier] = this.identifier;
                newNode[this.mappings.building] = this.building;
                newNode[this.mappings.level] = this.level;
                newNode[this.mappings.room] = this.room;
                newNode[this.mappings.latitude] = this.latitude;
                newNode[this.mappings.longitude] = this.longitude;
                newNode[this.mappings.ip] = [this.ip];
                newNode[this.mappings.mac] = [this.mac];
                this.$store.dispatch('addNewNode', newNode)
                this.$store.dispatch('toggleNewNodesModal')
            }
        }
    }
</script>