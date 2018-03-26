<template>

</template>

<script>
    export default {
        props: {
            node: {}
        },
        data() {
            return {
                mesh: null
            }
        },
        created() {
            this.insertNode();
        },
        beforeDestroy() {
            if(this.mesh) {
                this.mesh.remove();
                delete this.insertedNodes[this.node.identifier];
                delete this.mesh;
            }
        },
        computed: {
            networkViewer: {
                get() { return this.$store.state.viewer.networkViewer; }
            },
            insertedNodes: {
                get() { return this.$store.state.viewer.meshes.nodes },
                set(nodes) { this.$store.state.viewer.meshes.nodes = nodes }
            }
        },
        methods: {
            insertNode() {
                switch ( this.node.positionType ) {
                    case "":
                        break;
                    case 'room':
                        this.mesh = this.networkViewer.insertNodeByRoom(this.node);
                        if(this.mesh) this.insertedNodes[this.node.identifier] = this.mesh;
                        break;
                    case "gps":
                        this.mesh = this.networkViewer.insertNodeByGPS(this.node.identifier, this.node.building, this.node.level, this.node.latitude, this.node.longitude);
                        if(this.mesh) this.insertedNodes[this.node.identifier] = this.mesh;
                        break;
                    case "gpsRelative":
                        var newLat = (parseFloat(this.node.latitude) + parseFloat(this.node.relativeLatitude));
                        var newLong = (parseFloat(this.node.longitude) + parseFloat(this.node.relativeLongitude));
                        this.mesh = this.networkViewer.insertNodeByGPS(this.node.identifier, this.node.building, this.node.level, newLat, newLong);
                        if(this.mesh) this.insertedNodes[this.node.identifier] = this.mesh;
                        break;
                }
            }
        }
    }
</script>
