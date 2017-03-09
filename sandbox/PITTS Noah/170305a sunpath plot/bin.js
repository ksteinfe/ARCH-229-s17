function bin(lat, lon, tmz, startDay, endDay, startHour, endHour) {
    this.lat = lat;
    this.lon = lon;
    this.timezone = tmz;

    this.startDay = startDay;
    this.endDay = endDay;
    this.startHour = startHour;
    this.endHour = endHour;

    this.path = [];

    this.generateSolarGeo = function () {
        // short circuit bin out of view
        if (sunrise(startDay) > endHour && sunrise(endDay) > endHour) return false;
        if (sunset(startDay) < startHour && sunset(endDay) < startHour) return false;

        var d0 = this.startDay;
        var d1 = this.endDay;
        var d2 = this.endDay;
        var d3 = this.startDay;
        var dStep = 1; // TODO: implement dynamic scaling

        var h0 = Math.max(this.startHour, sunrise(d0));
        var h1 = Math.max(this.startHour, sunrise(d1));
        var h2 = Math.min(this.startHour, sunset(d2));
        var h3 = Math.min(this.startHour, sunset(d3));
        var hSTep = 0.1; // TODO: implement dynamic scaling


        // generate side 0
        for (var d = d0; d < d1; d += dStep) {
            var data = {
                altitude: solarAltitude(this.lat, this.lon, d, h),
                azimuth: solarAzimuth(lat, lon, d, h)
            };
            this.path.push(data);
        }
        // generate side 1
        for (var d = d1, h = h1; hour < endHour; h += hStep) {
            var data = {
                altitude: solarAltitude(this.lat, this.lon, d, h),
                azimuth: solarAzimuth(lat, lon, d, h)
            };
            this.path.push(data);
        }
        // generate side 2
        for (var d = d2; day > endDay; d -= dStep) {
            var data = {
                altitude: solarAltitude(this.lat, this.lon, d, h),
                azimuth: solarAzimuth(lat, lon, d, h)
            };
            this.path.push(data);
        }
        // generate side 3
        for (var d = d3, h = h3; hour > startHour; h -= hStep) {
            var data = {
                altitude: solarAltitude(this.lat, this.lon, d, h),
                azimuth: solarAzimuth(lat, lon, d, h)
            };
            this.path.push(data);
        }
        return true;
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
    return 0;  //TODO: implement this
}

solarAzimuth = function (lat, lon, day, hour) {
    return 0;  //TODO: implement this
}

solarAltitude = function (lat, lon, day, hour) {
    return 0;  //TODO: implement this
}
