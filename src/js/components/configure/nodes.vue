<template>
    <panel id="nodes">
        <!--<json-preview :json="nodes" :hidden="true" :type="'Nodes'"></json-preview>-->

        <h4 slot="heading">
            <b><a @click="$store.dispatch('showJsonViewer', {data: nodes, title: 'Nodes'})">Nodes</a></b> ({{nodes.length}})
        </h4>

        <a slot="action-button" class="panel-header-action btn-xs btn-primary" style="padding: 2px 4px;" @click="$store.dispatch('toggleNewNodesModal')">
            New node
        </a>

        <new-node-modal v-if="$store.state.general.options.showNewNodeModal" :closeaction="'toggleNewNodesModal'"></new-node-modal>

        <div class="well node-well">
            <div class="row">
                <div class="col-sm-3">
                    <div class="form-group">
                        <label>Identifier</label>
                        <select class="form-control" v-model="mappings.identifier">
                            <option value="">- choose -</option>
                            <option v-for="(param, key) in sampleNode" :value="key">{{ key }}</option>
                        </select>
                    </div>
                </div>
                <div class="col-sm-3">
                    <div class="form-group">
                        <label>Building</label>
                        <select class="form-control" v-model="mappings.building">
                            <option value="">- choose -</option>
                            <option v-for="(param, key) in sampleNode" :value="key">{{ key }}</option>
                        </select>
                    </div>
                </div>
                <div class="col-sm-3">
                    <div class="form-group">
                        <label>Floor level</label>
                        <select class="form-control" v-model="mappings.level">
                            <option value="">- choose -</option>
                            <option v-for="(param, key) in sampleNode" :value="key">{{ key }}</option>
                        </select>
                    </div>
                </div>
                <div class="col-sm-3">
                    <div class="form-group">
                        <label>Room</label>
                        <select class="form-control" v-model="mappings.room">
                            <option value="">- choose -</option>
                            <option v-for="(param, key) in sampleNode" :value="key">{{ key }}</option>
                        </select>
                    </div>
                </div>
                <div class="col-sm-3">
                    <div class="form-group">
                        <label>Latitude</label>
                        <select class="form-control" v-model="mappings.latitude">
                            <option value="">- choose -</option>
                            <option v-for="(param, key) in sampleNode" :value="key">{{ key }}</option>
                        </select>
                    </div>
                </div>
                <div class="col-sm-3">
                    <div class="form-group">
                        <label>Longitude</label>
                        <select class="form-control" v-model="mappings.longitude">
                            <option value="">- choose -</option>
                            <option v-for="(param, key) in sampleNode" :value="key">{{ key }}</option>
                        </select>
                    </div>
                </div>
                <div class="col-sm-3">
                    <div class="form-group">
                        <label>IP</label>
                        <select class="form-control" v-model="mappings.ip">
                            <option value="">- choose -</option>
                            <option v-for="(param, key) in sampleNode" :value="key">{{ key }}</option>
                        </select>
                    </div>
                </div>
                <div class="col-sm-3">
                    <div class="form-group">
                        <label>MAC</label>
                        <select class="form-control" v-model="mappings.mac">
                            <option value="">- choose -</option>
                            <option v-for="(param, key) in sampleNode" :value="key">{{ key }}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="node-table-wrapper">
            <table class="table">
                <tr>
                    <th>&nbsp;</th>
                    <th>Identifier</th>
                    <th>Building & <br> Floor level </th>
                    <th>Room</th>
                    <th>Latitude & <br> Longitude</th>
                    <th>IPv4</th>
                    <th>MAC</th>
                    <th>Insert by</th>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td>
                        <div class="row">
                            <div class="col-sm-12">
                                <input class="form-control" v-model="globalNode.building" placeholder="Mass assign building" @input="massAssignBuilding()" v-show="mappings.building">
                            </div>
                        </div>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                        <div>
                            <select class="form-control" v-model="globalNode.positionType" >
                                <option :value="null">- Mass assignment -</option>
                                <option value="gps">GPS (absolute)</option>
                                <option value="gpsRelative">GPS (relative)</option>
                                <option value="room">Room name</option>
                            </select>
                            <div class="form-group m-t-10" v-if="globalNode.positionType == 'gpsRelative'">
                                <label>relative to ...</label>
                                <input v-model="globalNode.relativeLatitude" placeholder="Latitude" class="form-control">
                                <input v-model="globalNode.relativeLongitude" placeholder="Longitude" class="form-control m-t-5">
                            </div>
                        </div>
                    </td>
                </tr>
                <tr v-for="node in nodes" v-bind:class="{'bg-danger': node.hidden}">
                    <td></td>
                    <td>
                        <input v-model="node[mappings.identifier]" class="form-control">
                    </td>
                    <td>
                        <input v-model="node[mappings.building]" class="form-control">
                        <input v-model="node[mappings.level]" class="form-control m-t-5">
                    </td>
                    <td>
                        <input class="form-control" v-model="node[mappings.room]">
                    </td>
                    <td>
                        <input v-model="node[mappings.latitude]" class="form-control">
                        <input v-model="node[mappings.longitude]" class="form-control m-t-5">
                    </td>
                    <td class="node-address">
                        <select multiple class="form-control">
                            <option v-for="ip in node[mappings.ip]" @dblclick="removeIp(node, ip)">{{ ip }}</option>
                        </select>
                        <div class="input-button m-t--1">
                            <input class="form-control"  v-model="node['tmpIp']">
                            <a class="btn btn-xs" @click="addIp(node)"><i class="material-icons">add</i></a>
                        </div>
                    </td>
                    <td class="node-address">
                        <select multiple class="form-control">
                            <option v-for="mac in node[mappings.mac]" @dblclick="removeMac(node, mac)">{{ mac }}</option>
                        </select>
                        <div class="input-button m-t--1">
                            <input class="form-control" v-model="node['tmpMac']">
                            <a class="btn btn-xs" @click="addMac(node)"><i class="material-icons">add</i></a>
                        </div>
                    </td>
                    <td class="node-address">
                        <select class="form-control" v-model="node.positionType" @change="changePositionType(node, node.positionType)">
                            <option :value="null">don't include</option>
                            <option value="gps">GPS</option>
                            <option value="gpsRelative">GPS (relative)</option>
                            <option value="room">Room</option>
                        </select>
                        <div class="form-group m-t-10" v-if="node.positionType == 'gpsRelative'">
                            <label>relative to ...</label>
                            <input v-model="node.relativeLatitude" placeholder="Latitude" class="form-control">
                            <input v-model="node.relativeLongitude" placeholder="Longitude" class="form-control m-t-5">
                        </div>
                    </td>

                </tr>
            </table>
        </div>
    </panel>
</template>

<script>
    import newNodeModal from '../modals/newNodeModal.vue';
    export default {
        data() {
            return {
            }
        },

        components: {
            'new-node-modal': newNodeModal
        },

        computed: {
            sampleNode() {
                if ( !this.experimentData ) return {};
                if ( this.nodes.length == 0 ) return {};
                var node = this.nodes[0] || {};
                node = JSON.parse(JSON.stringify(node));
                delete node['hidden'];
                delete node['positionType'];
                delete node['relativeLatitude'];
                delete node['relativeLongitude'];
                return this.nodes[0];
            },
            globalNode: {
                get() { return this.$store.state.node.global } ,
                set(newNodes) { this.$store.state.node.global = newNodes; }
            },
            experimentData: {
                get() { return this.$store.state.experiment.data }
            },
            nodes: {
                get() { return this.$store.state.node.raw } ,
                set(newNodes) { this.$store.state.node.raw = newNodes; }
            },
            newNode: {
                get() { return this.$store.state.node.newNode } ,
                set(newNode) { this.$store.state.node.newNode = newNode; }
            },
            mapped: { get() { return this.$store.state.node.mapped } },
            mappings: {
                get() { return this.$store.state.node.mappings },
                set(mapping) { this.$store.commit('node_mapping', mapping) }
            },
            showNewNodeModal: {
                get() { return this.$store.state.general.options.showNewNodeModal },
                get(modalVisibility) { this.$store.state.general.options.showNewNodeModal = modalVisibility }
            }
        },
        watch: {
            'mappings.ip'(ipMapping) {
                for(var i = 0; i < this.nodes.length; i++) {
                    var node = this.nodes[i];
                    var ip = node[ipMapping];
                    if( typeof ip === 'string' ) node[ipMapping] = [ip];
                }
            },
            'mappings.mac'(macMapping) {
                for(var i = 0; i < this.nodes.length; i++) {
                    var node = this.nodes[i];
                    var mac = node[macMapping];
                    if( typeof mac === 'string' ) node[macMapping] = [mac];
                }
            },
            'globalNode.positionType'(positintype) {this.massAssignPositionType()},
            'globalNode.relativeLatitude'(positintype) {this.massAssignPositionType()},
            'globalNode.relativeLongitude'(positintype) {this.massAssignPositionType()}
        },
        created() {
            if(this.nodes.length == 0) this.$store.commit('node_raw', this.$store.state.experiment.data.nodes)
        },
        methods: {
            massAssignPositionType() {
                this.$store.dispatch('massAssignNodePositionType', {
                    positionType: this.globalNode.positionType,
                    relativeLatitude: this.globalNode.relativeLatitude,
                    relativeLongitude: this.globalNode.relativeLongitude
                })
            },
            massAssignBuilding() {
                this.$store.dispatch('massAssignNodeBuilding', {
                    building: this.globalNode.building
                })
            },
            updateMappedNodes() {
                this.$store.commit('node_mapped');
            },
            removeMac(node, mac) {
                var index = node[this.mappings.mac].indexOf(mac);
                if(index > -1) {
                    node[this.mappings.mac].splice(index, 1);
                }
            },
            removeIp(node, ip) {
                var index = node[this.mappings.ip].indexOf(ip);
                if(index > -1) {
                    node[this.mappings.ip].splice(index, 1);
                }
            },
            addMac(node) {
                if(node['tmpMac']) {
                    node[this.mappings.mac].push(node['tmpMac']);
                    node['tmpMac'] = '';
                }
            },
            addIp(node) {
                if(node['tmpIp']) {
                    node[this.mappings.ip].push(node['tmpIp']);
                    node['tmpIp'] = '';
                }
            },
            changePositionType(node, type) {
                this.$set(node, type);
            }
        }
    }
</script>