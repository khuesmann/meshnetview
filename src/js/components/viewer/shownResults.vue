<template>
    <div class="timelineInfo" v-if="exerimentId !== null">
        <h4 class="text-right">
            <a class="btn  btn-success btn-xs" v-on:click="hidden=false" v-show="hidden">Show current results ({{
                shownResults.length }})</a>
            <a class="btn  btn-warning btn-xs" v-on:click="hidden=true" v-show="!hidden">Hide current results ({{
                shownResults.length }})</a>
        </h4>
        <div class="well f-s-11" v-show="!hidden">
            <div v-show="shownResults.length == 0">No results shown</div>
            <div class="row">
                <div class="col-sm-12 timelineInfoFilter">
                    <strong>Only show results with ...</strong>
                        <label class="m-t-5">
                        <input type="checkbox" v-model="resultOptions.hasWidth"> width
                    </label>
                    <label class="m-t-5">
                        <input type="checkbox" v-model="resultOptions.hasColor"> color
                    </label>
                    <!--<label class="m-t-5">-->
                        <!--<input type="checkbox" v-model="resultOptions.hasEndNode"> end node-->
                    <!--</label>-->
                    <div class="form-group">
                        <form @change="applyFilters()" class="row">
                            <div class="col-xs-6">
                                <select class="form-control m-t-5" v-model="resultOptions.startNode">
                                    <option :value="null">Start node (all)</option>
                                    <option v-for="node in nodes" :value="node.identifier">{{node.identifier}}</option>
                                </select>
                            </div>
                            <div class="col-xs-6">
                                <select class="form-control m-t-5" v-model="resultOptions.endNode">
                                    <option :value="null">End node (all)</option>
                                    <option v-for="node in nodes" :value="node.identifier">{{node.identifier}}</option>
                                </select>
                            </div>
                        </form>
                    </div>

                    <hr>

                </div>
            </div>

            <div v-for="(result, index) in $store.state.viewer.results" :key="result.__id">
                <div class="row">
                    <div class="col-sm-1">
                        {{ index }}
                    </div>
                    <div class="col-sm-11">
                        <a @click="result.showDetails = !result.showDetails"><b>{{ result.nodeStart }}</b> to <b>{{ result.nodeEnd }}</b></a>
                    </div>
                </div>
                <div class="row" v-if="result.showDetails">
                    <div class="col-sm-1">
                        {{ index }}
                    </div>
                    <div class="col-sm-11">
                        <b>Start Node:</b> {{ result.nodeStart }} <br>
                        <span><b>End Node:</b> {{ result.nodeEnd }} </span> <br>
                        <b>Color metric:</b> {{ result.color.value }} <br>
                        <b>Width metric:</b> {{ result.widthValue }} <br>
                    </div>
                    <div class="col-sm-12">
                        <div class="text-right">
                            <a @click="result.showDetails = true" v-show="!result.showDetails">show</a>
                            <a @click="result.showDetails = false" v-show="result.showDetails">hide</a>
                            <div v-if="result.showDetails">
                                <pre class="text-left f-s-11">{{ result.rawResult }}</pre>
                            </div>
                        </div>
                        </span>
                        <hr>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                hidden: null
            }
        },
        computed: {
            shownResults: {
                get() {
                    return this.$store.state.viewer.results || []
                },
                set(shownResults) { this.$store.state.viewer.results = shownResults }
            },
            unfilteredResults: {
                get() {
                    return this.$store.state.viewer.unfilteredResults || []
                },
                set(unfilteredResults) { this.$store.state.viewer.unfilteredResults = unfilteredResults }
            },
            nodes: {
                get() {
                    return this.$store.state.node.mapped || {}
                },
                set(shownNodes) { this.$store.state.node.mapped = shownNodes }
            },
            resultOptions: {
                get() { return this.$store.state.viewer.resultOptions },
                set(options) { this.$store.state.viewer.resultOptions = options }
            },
            exerimentId: {
                get() { return this.$store.state.experiment.id }
            }
        },
        methods: {
            getResultKey(result) {
                JSON.stringify(result)
            },
            getColorPercent(result) {
                var colorMin = result.color.minVal;
                var colorMax = result.color.maxVal;
                var colorValue = result.color.value;
                return parseInt((1 - ((colorValue - colorMin) / (colorMax - colorMin))) * 10000) / 100
            },
            applyFilters() {
                this.$store.dispatch('applyResultFilters');
            }
        }
    }
</script>
