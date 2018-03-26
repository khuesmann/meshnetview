<template>
    <panel :id="type">
        <h4 slot="heading">
            <b><a @click="$store.dispatch('showJsonViewer', {data: results, title: type})">{{this.name}}</a></b> ({{results.length}})
        </h4>

        <a slot="action-button" class="panel-header-action btn-xs btn-primary" style="padding: 2px 4px;" @click="selectResult()">
            select
        </a>

        <div v-if="results.length == 0">
            loading
        </div>

        <div v-if="results.length > 0">
            <!--Start- & end-node mapping -->
            <div class="row">
                <div class="col-sm-12">
                    <h4>Start- & end-node mapping</h4>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label>Start node is determined by</label>
                        <select v-multi-select v-model="mappings.startNode.metric" class="form-control" multiple>
                            <option value="identifier">Node identifier</option>
                            <option v-for="metric in metrics">{{ metric }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>and maps to node's</label>
                        <select v-multi-select v-model="mappings.startNode.mappings" class="form-control" multiple>
                            <option value="identifier">Identifier</option>
                            <option value="latitude">Latitude</option>
                            <option value="longitude">Longitude</option>
                            <option value="building">Building</option>
                            <option value="level">Level</option>
                            <option value="ip">IP</option>
                            <option value="mac">MAC</option>
                            <option value="room">Room</option>
                        </select>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label>End node is determined by</label>
                        <select v-multi-select v-model="mappings.endNode.metric" class="multiselector form-control" multiple >
                            <option value="identifier">Node identifier</option>
                            <option v-for="metric in metrics">{{ metric }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="endNodeMappings">and maps to node's</label>
                        <select v-multi-select v-model="mappings.endNode.mappings" class="multiselector form-control" multiple >
                            <option value="identifier">Identifier</option>
                            <option value="latitude">Latitude</option>
                            <option value="longitude">Longitude</option>
                            <option value="building">Building</option>
                            <option value="level">Level</option>
                            <option value="ip">IP</option>
                            <option value="mac">MAC</option>
                            <option value="room">Room</option>
                        </select>
                    </div>
                </div>
            </div>

            <!--Result mapping-->
            <div class="row">
                <div class="col-sm-12">
                    <h4>Result mapping</h4>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label>Results</label>
                        <!--<multiselect v-model="mappings.result.parameter" :options="[null].concat(resultParameters)" :multiple="false"></multiselect>-->
                        <select v-model="mappings.result.parameter" class="multiselector form-control" >
                            <option :value="null">- please choose -</option>
                            <option v-for="parameter in resultParameters">{{ parameter }}</option>
                        </select>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label>Node's identifier</label>
                        <!--<multiselect v-model="mappings.result.nodeIdentifier" :options="[null].concat(resultParameters)" :multiple="false"></multiselect>-->
                        <select v-model="mappings.result.nodeIdentifier" class="form-control multiselector" >
                            <option :value="null">- please choose -</option>
                            <option v-for="parameter in resultParameters">{{ parameter }}</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label>Start time</label>
                        <!--<multiselect v-model="mappings.result.startTime" :options="[null].concat(resultParameters)" :multiple="false"></multiselect>-->
                        <select v-model="mappings.result.startTime" class="multiselector form-control" >
                            <option :value="null">- please choose -</option>
                            <option v-for="parameter in resultParameters">{{ parameter }}</option>
                        </select>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label>End time</label>
                        <!--<multiselect v-model="mappings.result.endTime" :options="[null, 'startPlusX'].concat(resultParameters)" :multiple="false"></multiselect>-->
                        <select v-model="mappings.result.endTime" class="multiselector form-control" >
                            <option :value="null">- please choose -</option>
                            <option v-for="parameter in resultParameters">{{ parameter }}</option>
                            <option value="startPlusX">Start Time + X</option>
                        </select>
                    </div>
                    <div v-show="mappings.result.endTime == 'startPlusX'">
                        <label>
                            X =
                            <input size="5" v-model="mappings.result.endTimeAdditional" type="number" min="1" style="width: 100px">
                            s
                        </label>
                    </div>
                </div>
            </div>

            <!--Color & width mapping-->
            <div class="row">
                <div class="col-sm-12">
                    <h4>Color & width mapping</h4>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label>Color metric</label>
                        <!--<multiselect v-model="mappings.color.metric" :options="[null].concat(metrics)" :multiple="false"></multiselect>-->
                        <select v-model="mappings.color.metric" class="multiselector form-control" >
                            <option :value="null">- please choose -</option>
                            <option v-for="metric in metrics">{{ metric }}</option>
                        </select>
                        <div class="row m-t-10">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Min value</label>
                                    <input class="form-control" v-model="mappings.color.min" placeholder="Min value">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Max value</label>
                                    <input class="form-control" v-model="mappings.color.max" placeholder="Max value">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label>Used colors (min to max, comma seperated, no spaces)</label>
                                    <input class="form-control" v-model="mappings.color.names" v-on:change="checkColor()" placeholder="Min value">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-sm-6">
                    <div class="form-group">
                        <label>Line width metric</label>
                        <!--<multiselect v-model="mappings.width.metric" :options="[null].concat(metrics)" :multiple="false"></multiselect>-->
                        <select v-model="mappings.width.metric" class="multiselector form-control" >
                            <option :value="null">- plase choose -</option>
                            <option v-for="metric in metrics">{{ metric }}</option>
                        </select>
                        <div class="row  m-t-10">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Min value</label>
                                    <input class="form-control" v-model="mappings.width.min" placeholder="min value">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Max value</label>
                                    <input class="form-control" v-model="mappings.width.max" placeholder="max value">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!--Timeline options-->
            <div class="row">
                <div class="col-sm-12">
                    <h4>Timeline options</h4>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label>Marker</label>
                        <!--<multiselect v-model="mappings.markers" :options="[null].concat(resultParameters)" :multiple="true"></multiselect>-->
                        <select v-multi-select multiple v-model="mappings.markers" class="multiselector form-control" >
                            <option :value="null">- please choose -</option>
                            <option v-for="parameter in resultParameters">{{ parameter }}</option>
                        </select>
                    </div>
                </div>

                <div class="col-sm-6">
                    <div class="form-group">
                        <label>Filter by</label>

                        <!--<multiselect v-model="mappings.filter.parameter" :options="[null].concat(resultParameters)" :multiple="false"></multiselect>-->
                        <select v-model="mappings.filter.parameter" class="multiselector form-control" >
                            <option :value="null">- please choose -</option>
                            <option v-for="parameter in resultParameters" :value="parameter">{{ parameter }}</option>
                        </select>
                    </div>
                    <div class="form-group" v-if="mappings.filter.parameter && mappings.filter.parameter != ''">
                        <label>with value</label>
                        <!--<multiselect v-model="mappings.filter.values" :options="filterPossibilities" :multiple="false"></multiselect>-->
                        <select v-multi-select class="selectpicker form-control" v-model="mappings.filter.values" multiple>
                            <option v-for="possibility in filterPossibilities" :value="possibility">{{ possibility }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </panel>
</template>

<script>
    export default {
        props: {
            type: null,
            name: ""
        },
        data() {
            return {
                correctColors: "green,yellow,red"
            }
        },
        computed: {
            results: {
                get() { return this.$store.state.result[this.type]; },
                set(newResults) { this.$store.state.result[this.type] = newResults; }
            },
            mappings: {
                get() { return this.$store.state.result.mappings[this.type]; },
                set(newResults) { this.$store.state.result.mappings[this.type] = newResults; }
            },
            mapped: {
                get() { return this.$store.state.result.mapped[this.type]; },
                set(newResults) { this.$store.state.result.mapped[this.type] = newResults; }
            },
            metrics: {
                get() { return this.$store.state.result.metrics[this.type]; },
                set(newResults) { this.$store.state.result.metrics[this.type] = newResults; }
            },
            resultParameters: {
                get() {
                    var resultParameters = [];
                    if ( this.results.length > 0 ) {
                        for ( var parameter in this.results[0] ) {
                            if ( ! this.results[0].hasOwnProperty(parameter) ) continue;
                            resultParameters.push(parameter);
                        }
                    }
                    return resultParameters
                }
            },
            filterPossibilities: {
                get() {
                    var possibilities = [];
                    var filterParameter = this.mappings.filter.parameter;
                    this.results.forEach(function (result) {
                        var resultFilterValue = result[filterParameter];
                        if ( possibilities.indexOf(resultFilterValue) < 0 ) {
                            possibilities.push(resultFilterValue);
                        }
                    });
                    return possibilities;
                }
            },
            options: {
                get() { return this.$store.state.viewer.options },
                set(options) { this.$store.state.viewer.options = options }
            },
            nodeMetrics: {
                get() {
                    return ['identifier'].concat(this.metrics);
                }
            },
            nodeParameters: {
                get() {
                    return [
                        { value: 'identifier', display: 'Identifier' },
                        { value: 'latitude', display: 'Latitude' },
                        { value: 'longitude', display: 'Longitude' },
                        { value: 'level', display: 'Level' },
                        { value: 'ip', display: 'IP' },
                        { value: 'mac', display: 'MAC' },
                        { value: 'room', display: 'Room' }
                    ]
                }
            }
        },
        watch: {
            'mappings.color.metric'(colorMetric) {
                var self = this;
                if ( self.mappings.result.parameter ) {
                    var min = 99999999;
                    var max = - 99999999;
                    this.results.forEach(function (result) {
                        if ( result[self.mappings.result.parameter] ) {
                            var measuredResult = JSON.parse(result[self.mappings.result.parameter]);
                            var value = parseFloat(measuredResult[colorMetric]);
                            if ( value > max ) max = value;
                            if ( value < min ) min = value;
                        }
                    });
                    this.mappings.color.min = min;
                    this.mappings.color.max = max;
                }
            },
            'mappings.width.metric': function (widthMetric) {
                var self = this;
                if ( self.mappings.result.parameter ) {
                    var min = 99999999;
                    var max = - 99999999;
                    this.results.forEach(function (result) {
                        if ( result[self.mappings.result.parameter] ) {
                            var measuredResult = JSON.parse(result[self.mappings.result.parameter]);
                            var value = parseFloat(measuredResult[widthMetric]);
                            if ( value > max ) max = value;
                            if ( value < min ) min = value;
                        }
                    });
                    this.mappings.width.min = min;
                    this.mappings.width.max = max;
                }
            },
            'mappings.result.endTimeAdditional': function(endTimeAdditional) {
                if(endTimeAdditional <= 0) {
                    this.mappings.result.endTimeAdditional = 1;
                }
            }
        },
        methods: {
            checkColor() {
                var hasError = false;
                try {
                    chroma.scale(this.mappings.color.names.split(","))
                } catch(exception) {
                    alert(exception);
                    this.mappings.color.names = this.correctColors;
                    hasError = true;
                }
                if(!hasError) this.correctColors = this.mappings.color.names;
                this.mappings.color.names = this.mappings.color.names.replace(" ", "");
            },
            selectResult() {
                this.options.resultType = this.type;
            }
        }
    }
</script>