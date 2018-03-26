export default class ExperimentMapper {

    constructor (results, resultMappings, nodes) {
        this.results = results;
        this.resultMappings = resultMappings;
        this.nodes = nodes;
        this.scale = {};
        this.preparedNodes = this.getPreparedNodes();
    }

    getPreparedNodes () {
        var preparedNodes = {};
        var startNodeMappings = this.resultMappings.startNode.mappings;
        var endNodeMappings = this.resultMappings.endNode.mappings;
        var allMappings = startNodeMappings.concat(endNodeMappings);
        for ( var nodeIdentifier in this.nodes ) {
            if ( !this.nodes.hasOwnProperty(nodeIdentifier) ) continue;
            var node = this.nodes[nodeIdentifier];
            if ( !preparedNodes[node.identifier] ) preparedNodes[node.identifier] = [];
            allMappings.forEach((nodeMapping) => {
                var mappingValue = node[nodeMapping];
                if ( typeof mappingValue == 'object' ) {
                    for(var i in mappingValue) {
                        if(!mappingValue.hasOwnProperty(i)) continue;
                        var mappingVal = mappingValue[i];
                        if ( mappingVal && preparedNodes[node.identifier].indexOf(mappingVal) < 0 ) preparedNodes[node.identifier].push(mappingVal.toLowerCase());
                    }
                }
                else {
                    if ( preparedNodes[node.identifier].indexOf(mappingValue) < 0 ) preparedNodes[node.identifier].push(mappingValue.toLowerCase());
                }
            });
        }
        return preparedNodes;
    }

    applyFilter(rawResult) {
        if(!this.resultMappings.filter.parameter || this.resultMappings.filter.parameter == '') return true;
        var resultValue = rawResult[this.resultMappings.filter.parameter];
        if(!resultValue) return false;
        for(var i = 0; i < this.resultMappings.filter.values.length; i++) {
            var filterValue = this.resultMappings.filter.values[i];
            if(String(resultValue) == String(filterValue)) return true;
        }
        return false;
    }

    getMappedResults () {
        var mappedResults = [];
        var chronologicalResults = {};
        var filledChronologicalResults = {};
        if ( this.resultMappings.result.parameter ) {
            var startTime = 0;
            var endTime = 0;
            var id = 0;
            for(var i = 0 ; i < this.results.length ; i++) {
                var result = this.results[i];
                if(!this.applyFilter(result)) continue;
                var mappedResult = this.mapResult(result);
                if(!mappedResult.nodeStart || !mappedResult.nodeEnd) {
                    continue;
                }
                mappedResult['__id'] = id;
                id++;
                mappedResults.push(mappedResult);
                if(!chronologicalResults[mappedResult.startTime]) chronologicalResults[mappedResult.startTime] = [];
                chronologicalResults[mappedResult.startTime].push(mappedResult);
                if(startTime == 0 || startTime > mappedResult.startTime) startTime = mappedResult.startTime;
                if(endTime == 0 || endTime < mappedResult.endTime) endTime = mappedResult.endTime;
            }
            for(var timestamp = startTime; timestamp <= endTime; timestamp++) {
                var results = chronologicalResults[timestamp] || [];
                var prevResults = filledChronologicalResults[timestamp-1] || [];
                prevResults.forEach((prevResult) => {
                    if(parseInt(prevResult.startTime) <= timestamp && parseInt(prevResult.endTime) >= timestamp) {
                        results.push(prevResult);
                    }
                });
                if(results.length != 0) {
                    filledChronologicalResults[timestamp] = results;
                }
            }
        }
        else {
            return console.log("'Result Mappings > Results' not set.");
        }

        return {
            mappedResults: mappedResults,
            chronologicalResults: filledChronologicalResults
        };
    }

    mapResult (result) {
        var measuredResults = JSON.parse(result[this.resultMappings.result.parameter]);
        var startNode = this.mapResultNode(result, measuredResults, this.resultMappings.startNode);
        var endNode = this.mapResultNode(result, measuredResults, this.resultMappings.endNode);
        return {
            nodeStart: startNode,
            nodeEnd: endNode,
            width: this.getWidth(measuredResults),
            widthValue: this.getWidth(measuredResults, true),
            startTime: this.getStartTime(result),
            endTime: this.getEndTime(result),
            rawResult: result,
            rgb: this.getRGB(measuredResults),
            color: this.getColor(measuredResults),
            markers: this.getMarkers(result),
            showDetails: false
        };
    }

    getStartTime (result) {
        if ( !this.resultMappings.result.startTime ) return null;
        return moment(result[this.resultMappings.result.startTime]).unix();
    }

    getEndTime (result) {
        if ( !this.resultMappings.result.endTime ) return null;
        var date = moment(result[this.resultMappings.result.endTime]).unix();
        if ( this.resultMappings.result.endTime == 'startPlusX' ) {
            if ( this.resultMappings.result.startTime && this.resultMappings.result.endTimeAdditional ) {
                date = moment(result[this.resultMappings.result.startTime]).unix() + this.resultMappings.result.endTimeAdditional;
            }
        }
        return parseInt(date);
    }

    getColor (measuredResults) {
        var colorMappings = this.resultMappings.color;
        var colorValue = measuredResults[colorMappings.metric];
        return {
            value: Math.round(colorValue * 100) / 100,
            minVal: colorMappings.min,
            maxVal: colorMappings.max
        }
    }

    mapResultNode (result, measuredResults, nodeMappings) {
        var nodeDeterminators = nodeMappings.metric;
        var determinationMappings = {};
        for ( var i = 0; i < nodeDeterminators.length; i++ ) {
            var determinationMetric = nodeDeterminators[i];
            var determinationValue = null;
            if ( determinationMetric == 'identifier' ) {
                determinationValue = result[this.resultMappings.result.nodeIdentifier];
                if ( this.nodes[determinationValue] ) return this.nodes[determinationValue].identifier;
            }
            else {
                if ( measuredResults.hasOwnProperty(determinationMetric) ) {
                    determinationMappings[determinationMetric] = measuredResults[determinationMetric];
                }
            }
        }
        // return this.getNodeByMetricMappings(determinationMappings, nodeDeterminatorMappings);
        return this.getNodeByMetricMappings(determinationMappings);
    }

    getNodeByMetricMappings (mappings) {
        if ( !$.isEmptyObject(mappings) ) {
            for(var nodeIdentifier in this.preparedNodes) {
                if(!this.preparedNodes.hasOwnProperty(nodeIdentifier)) continue;
                var nodeMetricValues = this.preparedNodes[nodeIdentifier];
                for(var metric in mappings) {
                    if(!mappings.hasOwnProperty(metric)) continue;
                    var metricValue = mappings[metric];
                    metricValue = metricValue.toLowerCase();
                    if(nodeMetricValues.indexOf(metricValue) > -1) return nodeIdentifier;
                }
            }
        }
        return null;
    }

    getRGB (measuredResults) {
        var colorMappings = this.resultMappings.color;
        if ( colorMappings.min == colorMappings.max ) colorMappings.max++;
        var colorValue = measuredResults[colorMappings.metric];
        if ( !this.resultMappings.color.names ) this.resultMappings.color.names = "green,yellow,red";
        if ( $.isEmptyObject(this.scale) ) this.scale = chroma.scale(this.resultMappings.color.names.split(",")).domain([colorMappings.min, colorMappings.max]);
        var colors = this.scale(colorValue).rgb();
        return [parseInt(colors[0]), parseInt(colors[1]), parseInt(colors[2])]
    }

  /**
   * Get width of result
   * @param measuredResult
   * @param valueOnly
   * @returns {*}
   */
    getWidth (measuredResult, valueOnly) {
        var widthMappings = this.resultMappings.width;
        widthMappings.max = parseFloat(widthMappings.max);
        widthMappings.min = parseFloat(widthMappings.min);
        if ( widthMappings.metric == '' || !widthMappings.metric ) return null;
        var widthValue = measuredResult[widthMappings.metric];
        if ( valueOnly ) return widthValue;
        if(widthMappings.max > widthMappings.min) {
            if ( widthValue > widthMappings.max ) return 1;
            if ( widthValue < widthMappings.min ) return 100;
            var m = (1 - 100) / (widthMappings.max - widthMappings.min);
            var c = 100 - m * widthMappings.min;
            var widthMetric = m * widthValue + c;
            return Math.round(widthMetric * 100) / 100;
        }
        else {
            if ( widthValue > widthMappings.min ) return 1;
            if ( widthValue < widthMappings.max ) return 100;
            var m = (1 - 100) / (widthMappings.max - widthMappings.min);
            var widthMetric = m * widthValue + 0;
            return Math.round(widthMetric * 100) / 100;

        }
    }

    getMarkers (result) {
        var markerValues = [];
        if ( this.resultMappings.markers && this.resultMappings.markers.length > 0 ) {
            this.resultMappings.markers.forEach(function (markerMapping) {
                markerValues.push(markerMapping + "|||" + result[markerMapping]);
            });
        }
        return markerValues;
    }
}