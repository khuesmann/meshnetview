<template>
    <div class="viewer">
        <div class="subnav-wrapper">
            <div class="container">
                <ul class="subnav">
                    <li class="pull-left"><b>{{ $store.state.viewer.timeline.pointOfTime | unixToString }}</b></li>
                    <!--<li class="pull-right">-->
                        <!--<a @click="toggleCamera()"><i class="material-icons">view_headline</i></a>-->
                    <!--</li>-->
                    <li class="pull-right"><a @click="toggleCamera()"><i class="material-icons">3d_rotation</i></a></li>
                </ul>
            </div>
        </div>
        <div class="maxResults" style="position: fixed; top: 120px; left: 20px;" v-if="options.maxResultsExceeded">
            <label>Warning. Too many results. Show <input v-model="options.maxResultCount" size="5"> results at the same time.</label>
        </div>
        <canvas class="viewerCanvas" :id="canvasName"></canvas>
        <shown-results v-if="!options.loading"></shown-results>
        <timeline v-if="!options.loading"></timeline>
        <color-indicator v-if="!options.loading"></color-indicator>
        <node v-for="(node, identifier) in nodes" :key="jsonToKey(node)" :node.sync="node" v-if="options.rendered"></node>
        <div v-if="options.loading" style="position: fixed; top: 100px; left: 0; right: 0; bottom: 0; background-color: white; z-index: 99">
            <div class="container">
                <div class="row">
                    <div class="col-sm-12">
                        loading ...
                    </div>
                </div>
            </div>
        </div>
        <!--<result v-for="(result, index) in $store.state.viewer.results" :key="result.__id" :result="result" v-if="options.rendered"></result>-->
    </div>
</template>

<script>
    import node from './node.vue';
    import result from './result.vue';
    import timeline from './timeline.vue';
    import shownResults from './shownResults.vue';
    import colorIndicator from './colorIndicator.vue';
    import NetworkViewer from '../../libs/networkViewer/NetworkViewer';

    export default {
        data() {
            return {
                canvasName: 'meshNetVCanvas'
            }
        },

        components: {
            node: node,
            result: result,
            timeline: timeline,
            'shown-results': shownResults,
            'color-indicator': colorIndicator
        },

        computed: {
            networkViewer: {
                get() { return this.$store.state.viewer.networkViewer; },
                set(newNetworkViewer) { this.$store.dispatch('setNetworkViewer', newNetworkViewer); }
            },
            options: {
                get() { return this.$store.state.viewer.options; },
                set(viewerOptions) { this.$store.dispatch('setViewerOptions', viewerOptions) }
            },
            meshes: {
                get() { return this.$store.state.viewer.meshes; },
                set(meshes) { this.$store.dispatch('setViewerMeshes', meshes) }
            },
            buildings: {
                get() { return this.$store.state.building.mapped }
            },
            nodes: {
                get() { return this.$store.state.node.mapped }
            },
            shownResults: {
                get() { return [] || this.$store.state.viewer.results }
            },
            insertedNodes: {
                get() { return this.$store.state.viewer.meshes.nodes },
                set(nodes) { this.$store.state.viewer.meshes.nodes = nodes }
            },
            insertedEdges: {
                get() { return this.$store.state.viewer.meshes.edges },
                set(nodes) { this.$store.state.viewer.meshes.edges = nodes }
            }
        },

        mounted() {
            var self = this;
            if ( ! this.options.rendered ) this.render();
        },

        methods: {
            render() {
                var canvas = document.getElementById(this.canvasName);
                this.networkViewer = new NetworkViewer(canvas);
                this.networkViewer.mainScene.render();
                this.options.rendered = true;
                this.addBuildings();
            },
            addBuildings() {
                this.meshes.buildings = this.networkViewer.addBuildings(this.buildings)
            },
            toggleCamera() {
                this.options.radialCamera = ! this.options.radialCamera;
                this.networkViewer.mainScene.toggleCamera();
            },
            addNodes() {
                for ( var identifier in this.nodes ) {
                    if ( ! this.nodes.hasOwnProperty(identifier) ) continue;
                    var node = this.nodes[identifier];
                    switch ( node.positionType ) {
                        case 'room':
                            this.networkViewer.insertNodeByRoom(node)
                    }
                }
            },
            jsonToKey(node) {
                return JSON.stringify(node)
            },
            toggleCamera() {
                this.networkViewer.mainScene.toggleCamera()
            }
        }
    }
</script>
