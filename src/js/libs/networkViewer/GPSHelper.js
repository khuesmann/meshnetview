var utm = require('utm')

module.exports = {
  fixPoint: {
    lat: 0,
    long: 0
  },
  setFixPoint(x, z) {
    if ( this.fixPoint.x == 0 ) this.fixPoint.x = x;
    if ( this.fixPoint.z == 0 ) this.fixPoint.z = z;
  },
  getFixPointXZ() {
    var utmCoordinates = utm.fromLatLon(this.fixPoint.lat, this.fixPoint.long);
    var x = utmCoordinates.easting;
    var z = utmCoordinates.northing;
    return {
      x: x,
      z: z
    }
  },
  gpsToXZ(lat, long) {
    try {
      var utmCoordinates = utm.fromLatLon(parseFloat(lat), parseFloat(long));
    } catch(e) {
      alert("Error! " + e + "Please check your node position type. Page will be reloaded");
      window.location = window.location;
      return;
    }
    var fixPointUtmCoordinates = this.getFixPointXZ();
    var x = utmCoordinates.easting - fixPointUtmCoordinates.x;
    var z = utmCoordinates.northing - fixPointUtmCoordinates.z;
    return {
      x: parseFloat(x),
      z: parseFloat(z)
    };
  },
  getRotation(lat1, long1, lat2, long2) {

  },
};