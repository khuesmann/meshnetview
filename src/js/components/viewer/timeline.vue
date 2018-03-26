<template>
    <div class="timeline" v-if="exerimentId !== null">
        <div class="row m-b-10">
            <div class="col-sm-12">
                <div class="control-btns">
                    <div class="btn-group btn-group-xs">
                        <a class="btn btn-primary" @click="decrement()"> <i class="material-icons">fast_rewind</i> </a>
                        <a class="btn btn-primary" @click="play()" v-if="playInterval === null">
                            <i class="material-icons">play_arrow</i> </a>
                        <a class="btn btn-primary" @click="pause()" v-if="playInterval != null">
                            <i class="material-icons">pause</i> </a>
                        <a class="btn btn-primary" @click="increment()"> <i class="material-icons">fast_forward</i> </a>
                    </div>
                    <div v-if="timelineOptions.is_sequenced">
                        {{ sequence + 1 }} / {{ sequencedResults.length }}
                    </div>
                </div>
                <div class="range-slider">
                    <input @input="changeRange()" v-if="mode == 'timeline_chronologic'" v-model="pointOfTimeSequence" type="range" :min="0" :max="chronologicalResultKeys.length - 1" :disabled="chronologicalResultKeys.length - 1 < 0">
                    <input @input="changeRange()" v-if="mode == 'timeline_gaps'" v-model="pointOfTime" type="range" :min="chronologicalResultKeys[0]" :max="chronologicalResultKeys[chronologicalResultKeys.length - 1]" :disabled="chronologicalResultKeys[chronologicalResultKeys.length - 1] < 0">
                    <input @input="changeRange()" v-if="mode == 'timeline_sequenced'" v-model="sequence" type="range" :min="0" :max="sequencedResults.length - 1" :disabled="sequencedResults.length - 1 < 0">
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-sm-2">
                <input class="" size="5" v-model="playSpeed"> ms/interval
            </div>
            <div class="col-sm-1" v-if="this.mode != 'timeline_sequenced'">
                <label><input type="checkbox" v-model="timelineOptions.has_timegaps">
                    has time gaps</label>
            </div>
            <div class="col-sm-1" v-if="this.mode == 'timeline_gaps'">
                <input class="" size="4" v-model="secondsPerStep"> s / step
            </div>
            <div class="col-sm-1">
                <label><input type="checkbox" v-model="timelineOptions.is_sequenced"> sequenced</label>
            </div>
            <div class="col-sm-8">
                <div v-for="(markerValues, markerName) in markers"><b>{{markerName}}: </b> <span v-for="(markerValue, index) in markerValues">{{markerValue}}<span v-if="index < markerValues.length - 1">;</span> </span> </div>
            </div>

        </div>
    </div>

</template>

<script>
    export default {
        props: {
            type: null
        },
        data() {
            return {
                playSpeed: 1000,
                secondsPerStep: 1
            }
        },
        computed: {
            networkViewer: {
                get() { return this.$store.state.viewer.networkViewer; },
                set(newNetworkViewer) { this.$store.dispatch('setNetworkViewer', newNetworkViewer); }
            },
            resultType: {
                get() { return this.$store.state.viewer.options.resultType }
            },
            sequencedResults: {
                get() { return this.$store.state.result.mapped[this.resultType] || [] }
            },
            chronologicalResults: {
                get() { return this.$store.state.result.chronological[this.resultType] || {} }
            },
            playInterval: {
                get() { return this.$store.state.viewer.timeline.playInterval },
                set(playInterval) { this.$store.state.viewer.timeline.playInterval = playInterval }
            },
            chronologicalResultKeys: {
                get() {
                    return Object.keys(this.chronologicalResults).sort(function (a, b) { return a - b })
                }
            },
            timelineOptions: {
                get() { return this.$store.state.viewer.timeline },
                set(options) { this.$store.commit('viewer_timeline', options) }
            },
            pointOfTime: {
                get() { return parseInt(this.timelineOptions.pointOfTime) },
                set(pointOfTime) { this.$store.commit('viewer_pointOfTime', parseInt(pointOfTime)) }
            },
            pointOfTimeSequence: {
                get() { return parseInt(this.timelineOptions.pointOfTimeSequence) },
                set(pointOfTimeSequence) { this.$store.commit('viewer_pointOfTimeSequence', parseInt(pointOfTimeSequence)) }
            },
            sequence: {
                get() { return parseInt(this.timelineOptions.sequence) },
                set(sequence) { this.$store.commit('viewer_sequence', sequence) }
            },
            mode: {
                get() {
                    if ( ! this.timelineOptions.is_sequenced && ! this.timelineOptions.has_timegaps ) {
                        return 'timeline_chronologic'
                    }
                    else if ( ! this.timelineOptions.is_sequenced && this.timelineOptions.has_timegaps ) {
                        return 'timeline_gaps'
                    }
                    else if ( this.timelineOptions.is_sequenced ) {
                        return 'timeline_sequenced'
                    }
                }
            },
            shownResults: {
                get() { return this.$store.state.viewer.results },
                set(shownResults) {
                    this.$store.dispatch('setViewerResults', shownResults)
                }
            },
            meshes: {
                get() { return this.$store.state.viewer.meshes },
                set(newMeshes) { this.$store.commit('viewer_meshes', newMeshes) }
            },
            insertedNodes: {
                get() { return this.meshes.nodes },
                set(nodes) { this.meshes.nodes = nodes }
            },
            insertedEdges: {
                get() { return this.meshes.edges },
                set(edges) { this.meshes.edges = edges }
            },
            exerimentId: {
                get() { return this.$store.state.experiment.id }
            },
            markers: {
                get() {
                    var finalMarkers = {};
                    for(var i = 0; i < this.shownResults.length; i++) {
                        var shownResult = this.shownResults[i];
                        if(shownResult.markers.length > 0) {
                            for(var j = 0; j < shownResult.markers.length; j++) {
                                var markerArray = shownResult.markers[j].split('|||');
                                if(!finalMarkers[markerArray[0]]) finalMarkers[markerArray[0]] = [];
                                if(finalMarkers[markerArray[0]].indexOf(markerArray[1]) < 0) finalMarkers[markerArray[0]].push(markerArray[1]);
                            }
                        }
                    }
                    return finalMarkers;
                }
            }
        },
        watch: {
            '$store.state.viewer.results'(shownResults) {
                var self = this;
                this.removeEdges();
                shownResults.forEach(function(result) {
                    self.showResult(result);
                })
            }
        },
        mounted() {
            this.pointOfTime = this.chronologicalResultKeys[0];
        },
        methods: {
            changeRange() {
                switch ( this.mode ) {
                    case 'timeline_chronologic':
                        var timestamp = this.chronologicalResultKeys[this.pointOfTimeSequence];
                        this.pointOfTime = timestamp;
                        this.$store.dispatch('setViewerResults', this.chronologicalResults[timestamp] || []);
                        break;
                    case 'timeline_gaps':
                        this.$store.dispatch('setViewerResults', this.chronologicalResults[this.pointOfTime] || []);
                        break;
                    case 'timeline_sequenced':
                        var result = this.sequencedResults[this.sequence];
                        this.pointOfTime = result.startTime;
                        this.$store.dispatch('setViewerResults', result ? [result] : []);
                        break;
                }
            },
            increment() {
                switch ( this.mode ) {
                    case 'timeline_chronologic':
                        if ( this.pointOfTimeSequence < this.chronologicalResultKeys.length - 1 ) {
                            this.pointOfTimeSequence ++;
                            this.pointOfTime = this.chronologicalResultKeys[this.pointOfTimeSequence];
                        }
                        break;
                    case 'timeline_gaps':
                        if ( this.pointOfTime < this.chronologicalResultKeys[this.chronologicalResultKeys.length - 1] ) {
                            this.pointOfTime += parseInt(this.secondsPerStep);
                        }
                        break;
                    case 'timeline_sequenced':
                        if ( this.pointOfTimeSequence < this.sequencedResults.length - 1 ) {
                            this.sequence ++;
                            this.pointOfTime = this.sequencedResults[this.sequence];
                        }
                        break;
                }
                this.changeRange()
            },
            decrement() {
                switch ( this.mode ) {
                    case 'timeline_chronologic':
                        if ( this.pointOfTimeSequence > 0 ) this.pointOfTimeSequence --;
                        break;
                    case 'timeline_gaps':
                        if ( this.pointOfTime > this.chronologicalResultKeys[0] ) this.pointOfTime -= parseInt(this.secondsPerStep);
                        break;
                    case 'timeline_sequenced':
                        if ( this.pointOfTimeSequence > 0 ) this.sequence --;
                        break;
                }
                this.changeRange()
            },

            play(speed, reverse) {
                if(reverse) {
                    this.playInterval = setInterval(this.decrement, speed || this.playSpeed)
                }
                else {
                    this.playInterval = setInterval(this.increment, speed || this.playSpeed)
                }
            },

            pause() {
                clearInterval(this.playInterval);
                this.playInterval = null;
            },

            showResult(result) {
                var nodeStart = this.insertedNodes[result.nodeStart];
                var nodeEnd = this.insertedNodes[result.nodeEnd];
                if ( nodeStart && nodeEnd ) {
                    this.insertedEdges[result.__id] = this.networkViewer.drawEdge(nodeStart, nodeEnd, result.rgb, result.width, result.__id);
                }
            },
            removeEdges() {
                for(var edgeId in this.insertedEdges) {
                    if(!this.insertedEdges.hasOwnProperty(edgeId)) continue;
                    var edge = this.insertedEdges[edgeId];
                    edge.remove();
                    delete this.insertedEdges[edgeId];
                }
            }
        }
    }
</script>
