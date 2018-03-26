<template>
    <div class="colorIndicatorWrapper">
        <small>{{ mapping.metric }}</small>
        <div class="colorIndicator">
            <div class="colorBars" v-show="!hidden">
                <div v-for="(color, index) in colors" class="color" v-bind:style="{'background-color' : 'rgb(' + parseInt(color[0]) + ',' + parseInt(color[1]) + ',' + parseInt(color[2]) + ')' }">
                    <small v-if="index == 0" class="colorLabel min">{{ mapping.min }}</small>
                    <small v-if="index == 25" class="colorLabel quater">{{ quater }}</small>
                    <small v-if="index == 50" class="colorLabel middle">{{ mid }}</small>
                    <small v-if="index == 75" class="colorLabel threeQuaters">{{ threeQuaters }}</small>
                    <small v-if="index == 99" class="colorLabel max">{{ max }}</small>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
        },
        data() {
            return {
                hidden: false,
                min: 0,
                max: 0,
                mid: 0,
                quater: 0,
                threeQuaters: 0
            }
        },
        computed: {
            resultType: {
                get() { return this.$store.state.viewer.options.resultType }
            },
            mapping: {
                get() { return this.$store.state.result.mappings[this.resultType].color }
            },
            options: {
                get() { return this.$store.state.viewer.options },
                set(options) { this.$store.state.viewer.options = options }
            },
            colors: {
                get() {

                    if(this.options.show == 'configure') return;

                    var colorMappings = this.mapping;
                    if(colorMappings.min == colorMappings.max) colorMappings.max++;

                    // prepare rounding to significant decimal place
                    var significance = 1;
                    var minSignificance = (String(colorMappings.min).split('.')[1] || []).length;
                    var maxSignificance = (String(colorMappings.max).split('.')[1] || []).length;
                    if(significance < minSignificance || significance < maxSignificance) {
                        significance = minSignificance > maxSignificance ? minSignificance : maxSignificance;
                    }
                    var decimalSignificance = Math.pow(10, significance);

                    // define some colors
                    this.min = colorMappings.min;
                    this.max = colorMappings.max;
                    this.mid = math.round(((colorMappings.min + colorMappings.max) / 2) * decimalSignificance) / decimalSignificance;
                    this.quater = math.round(((this.mid) / 2) * decimalSignificance) / decimalSignificance;
                    this.threeQuaters = math.round((this.quater + this.mid) * decimalSignificance) / decimalSignificance;
                    var scale = chroma.scale(this.mapping.names.split(",")).domain([parseFloat(colorMappings.min),parseFloat(colorMappings.max)]);
                    var diff = (colorMappings.max - colorMappings.min) / 100;
                    var colors = [];
                    var i = parseFloat(colorMappings.min);
                    while(i <= parseFloat(colorMappings.max)) {
                        colors.push(scale(i).rgb());
                        i = i + diff;
                    }
                    return colors;
                }
            }
        },
        methods: {

        }
    }
</script>
