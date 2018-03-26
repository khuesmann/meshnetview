<template>
    <div class="panel" :class="classname || 'panel-default'">
        <div class="panel-heading">
            <div class="pull-left">
                <slot name="heading"></slot>
            </div>
            <a class="panel-header-action btn-xs btn-primary"  @click="toggle()">
                <i v-show="!hidden" class="glyphicon glyphicon-chevron-up"></i>
                <i v-show="hidden" class="glyphicon glyphicon-chevron-down"></i>
            </a>
            <slot name="action-button"></slot>
            <div class="clearfix"></div>
        </div>
        <div class="panel-body" v-show="!hidden">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            id: null,
            classname: 'panel-default'
        },
        data() {
            return {
                hidden: false
            }
        },

        mounted() {
            this.setHidden();
        },

        computed: {
            hiddenKey() { return 'panelHidden_' + this.id }
        },

        methods: {
            toggle() {
                this.hidden = ! this.hidden;
                if(this.id) {
                    localStorage.setItem(this.hiddenKey, JSON.stringify(this.hidden));
                }
            },
            setHidden() {
                if(!this.id) return;
                var savedHidden = localStorage.getItem(this.hiddenKey);
                if(savedHidden) this.hidden = JSON.parse(savedHidden);
            }
        }
    }
</script>
