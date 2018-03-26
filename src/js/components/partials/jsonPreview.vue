<style>
    .ajaxPreview {
        position: fixed;
        top: 50px;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 3;
        background-color: rgba(255,255,255,0.95)
    }
</style>
<template>
    <div v-if="jsonViewer.show" class="ajaxPreview">
        <div class="container">
            <div class="row">
                <div class="col-sm-12">
                    <h1>Raw preview of {{ jsonViewer.title }} <a class="btn btn-danger pull-right" v-on:click="toggle()">close</a>
                    </h1>
                </div>
                <div class="col-sm-12">
                    <div class="pull-left">
                        Show results from <input type="number" v-model="from"> to <input type="number" v-model="to">
                        (total: {{ json.length }}; limited to <input v-model="limit" size="8"> entries at the same time)
                    </div>
                </div>
                <div class="col-sm-12" v-bind:style="{'height': calculatedHeight + 'px'}">
                    <div class="m-t-10" style="overflow: scroll; width: 100%; padding-bottom:300px;" v-bind:style="{'height': calculatedHeight + 'px'}">
                        <pre v-for="json in shownJson">{{ json }}</pre>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data: function() {
            return {
                from: 0,
                to: 100,
                search: "",
                limit: 2500
            }
        },
        computed: {
            jsonViewer: {
                get() {return this.$store.state.general.jsonViewer},
                set(newJsonViewer) {this.$store.commit('general_jsonViewer', newJsonViewer)}
            },
            json() { return this.jsonViewer.data || [] },
            shownJson: function() {
                var self = this;
                var from = this.from;
                var to = this.to;
                if((this.to - this.from) > this.limit) {
                    this.from = to - this.limit;
                }
                return this.json.slice(this.from, this.to);
            },
            calculatedHeight: function() {
                return window.innerHeight;
            }
        },
        methods: {
            toggle: function() {
                this.jsonViewer.show = ! this.jsonViewer.show;
                this.jsonViewer.data = [];
                document.body.style.overflow = 'scroll';
            }
        }
    }
</script>
