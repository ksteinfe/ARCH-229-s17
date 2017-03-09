function bin(lat, lon, radius, startDay, endDay, startHour, endHour) {
    // this.lat = lat;
    // this.lon = lon;
    // this.radius;

    this.startDay = startDay;
    this.endDay = endDay;
    this.startHour = startHour;
    this.endHour = endHour;

    this.fill = "none";
    this.stroke = "black";
    this.stroke_width = "1px";

    this.path = [];

    this.generatePath = function () {
        var d0 = this.startDay;
        var d1 = this.endDay;
        var d2 = this.endDay;
        var d3 = this.startDay;
        var dStep = 1; // TODO: implement dynamic scaling

        var h0 = max(this.startHour, sunrise(d0));
        var h1 = max(this.startHour, sunrise(d1));
        var h2 = min(this.startHour, sunset(d2));
        var h3 = min(this.startHour, sunset(d3));
        var hSTep = 0.1; // TODO: implement dynamic scaling

        // generate side 0
        for (var d = d0; d < d1; d += dStep) {

        }
        // generate side 1
        for (var d = d1, h = h1; hour < endHour; h += hStep) {

        }
        // generate side 2
        for (var d = d2, h = h2; day > endDay; d -= dStep) {

        }
        // generate side 3
        for (var d = d3, h = h3; hour > startHour; h -= hStep) {

        }
    }
}

// returns Hour of sunrise for a given day of the year
sunrise = function (day) {
    return 4; //TODO: implement this
}

// returns Hour of sunrise for a given day of the year
sunset = function (day) {
    return 20; //TODO: implement this
}

solarDeclination = function (lat, lon, day, hour) {
    return 0;
}

solarAzimuth = function (lat, lon, day, hour) {
    return 0;
}

solarAltitude = function (lat, lon, day, hour) {
    return 0;
}
