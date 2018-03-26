<template>

</template>

<script>
    export default {
        props: {
            result: {}
        },
        data() {
            return {
                mesh: null
            }
        },
        created() {
            this.insertEdge();
        },
        beforeDestroy() {
            if(this.mesh) {
                this.networkViewer.removeEdge(this.result.__id);
            }
        },
        computed: {
            networkViewer: {
                get() { return this.$store.state.viewer.networkViewer; }
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
        methods: {
            insertEdge() {
                var nodeStart = this.insertedNodes[this.result.nodeStart];
                var nodeEnd = this.insertedNodes[this.result.nodeEnd];
                if(nodeStart && nodeEnd) {
                    this.mesh = this.networkViewer.drawEdge(nodeStart, nodeEnd, this.result.rgb, this.result.width, this.result.__id);
                    this.insertedEdges[this.result.__id] = this.mesh;
                }
            }
        }
    }
</script>
