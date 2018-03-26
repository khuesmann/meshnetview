<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">

                    <div class="modal-header">
                        <div class="pull-left">
                            <slot name="heading">
                                Header
                            </slot>
                        </div>
                        <button class="btn btn-danger pull-right" @click="close()">
                            Close
                        </button>
                    </div>

                    <div class="modal-body">
                        <slot>
                            default body
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        props: {
            closeaction: null
        },

        data() {
            return {

            }
        },

        methods: {
            close() {
                if(this.closeaction) {
                    this.$store.dispatch(this.closeaction);
                }
            }
        }
    }
</script>
