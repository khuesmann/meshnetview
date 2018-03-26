module.exports = {
    setToOrigin: function(meshObject) {
        var pivot = BABYLON.Matrix.Translation(0.5,0.5,0.5);
        meshObject.setPivotMatrix(pivot);
    },
    
    getFixPoint: function(buildingsData) {
        var fixPoint = null;
        for(var buildingAlias in buildingsData) {
            if(!buildingsData.hasOwnProperty(buildingAlias)) continue;
            var building = buildingsData[buildingAlias];
            if(building.longitude && building.latitude) {
                fixPoint = {
                    x: building.latitude,
                    z: building.longitude
                };
                break;
            }
        }
        return fixPoint;
    },

    getMeshById: function(scene, id) {
        return scene.getMeshByName(id);
    },
    
    getNodeById: function(scene, id, predefined) {
        if(predefined) {
            return scene.getMeshByName(viewerOptions.predefinedNodePrefix + id);
        }
        return scene.getMeshByName(viewerOptions.nodePrefix + id);
    },

    getRoomMeshById: function(scene, id) {
        return this.getMeshById(scene, viewerOptions.roomPrefix + id);
    },

    getNodeMeshById: function(scene, id) {
        return this.getMeshById(scene, viewerOptions.nodePrefix + id);
    },
    
    getFloorMeshById: function(scene, id) {
        return this.getMeshById(scene, viewerOptions.floorPrefix + id);
    },
    
    getColor: function(val, maxval, minval, moreisgood) {
        maxval = maxval || 100;
        minval = minval || 0;
        moreisgood = moreisgood || true;
        
        var intnsty = (val - minval) / (maxval - minval);
        var r, g;
        if (moreisgood) {
            if (intnsty > 0.5) {
                g = 255;
                r = Math.round(2 * (1 - intnsty) * 255);
            } else {
                r = 255;
                g = Math.round(2 * intnsty * 255);
            }

        } else { //lessisgood
            if (intnsty > 0.5) {
                r = 255;
                g = Math.round(2 * (1 - intnsty) * 255);
            } else {
                g = 255;
                r = Math.round(2 * intnsty * 255);
            }
        }
        return {
            r: (255 / r).toString(),
            g: (255 / g).toString(),
            b: 0
        };
    },
    
    getWidth: function(metricValue) {
        var width = 0.0028 * metricValue + 0.02;
        return width;
    },
    
    getLongitudeDistance: function(long1, long2, lat1) {
        long1 = isNaN(long1) ? 0 : long1;
        long2 = isNaN(long2) ? 0 : long2;
        return this.getDistanceBetweenGPS(long1,lat1,long2,lat1);
        //
        long1 = isNaN(long1) ? 0 : long1;
        long2 = isNaN(long2) ? 0 : long2;
        return (long2 - long1) > 0 ? (long2 - long1) / (1/3600) * 20 : (long1 - long2) / (1/3600) * 20;
    },

    getLatitudeDistance: function(lat1, lat2) {
        lat1 = isNaN(lat1) ? 0 : lat1;
        lat2 = isNaN(lat2) ? 0 : lat2;
        return this.getDistanceBetweenGPS(0,lat1,0,lat2);
    },

    getDistanceBetweenGPS: function(longitude1, latitude1, longitude2, latitude2) {
        longitude1 = parseFloat(longitude1);
        longitude2 = parseFloat(longitude2);
        latitude1 = parseFloat(latitude1);
        latitude2 = parseFloat(latitude2);

        var radius = 6378.137; // Radius of earth in KM
        var dLat = (latitude2 - latitude1) * Math.PI / 180;
        var dLon = (longitude2 - longitude1) * Math.PI / 180;
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(latitude1 * Math.PI / 180) * Math.cos(latitude2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = radius * c;
        return d * 1000; // meters
    },

    getGPSRotation: function(lat1, long1,lat2 , long2) {
        if(! (this.isNumeric(long1) && this.isNumeric(lat1) && this.isNumeric(long2) && this.isNumeric(lat2)) ) return 0;
        var gps1 = GPSHelper.gpsToXZ(lat1,long1);
        var gps2 = GPSHelper.gpsToXZ(lat2,long2);
        var fSquare = Math.pow((gps2.z - gps1.z) , 2) + Math.pow((gps2.x - gps1.x), 2);
        var result = Math.acos((gps2.z - gps1.z) / Math.sqrt(fSquare));
        if(gps1.x > gps2.x) result *= -1;
        return result;
    },
    
    isNumeric: function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },

    gpsToXZ: function(lat, long) {

    }
};