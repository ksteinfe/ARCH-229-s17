function bin(lat, lon, tmz, startDay, endDay, startHour, endHour) {
    this.lat = lat;
    this.lon = lon;
    this.tmz = tmz;

    this.startDay = startDay;
    this.endDay = endDay;
    this.startHour = startHour;
    this.endHour = endHour;

    this.path = [];

    this.binIsVisible = function () {
        if (sunrise(this.startDay) > this.endHour && sunrise(this.endDay) > this.endHour) return false;
        if (sunset(this.startDay) < this.startHour && sunset(this.endDay) < this.startHour) return false;
        return true;
    }

    this.generateSolarGeo = function () {

        var d0 = this.startDay;
        var d1 = this.endDay;
        var d2 = this.endDay;
        var d3 = this.startDay;
        var dStep = 10; // TODO: implement dynamic scaling

        var h0 = Math.max(this.startHour, sunrise(d0));
        var h1 = Math.max(this.startHour, sunrise(d1));
        var h2 = Math.min(this.endHour, sunset(d2));
        var h3 = Math.min(this.endHour, sunset(d3));
        var hStep = 1 / 3; // TODO: implement dynamic scaling

        var azi = 0;
        var alt = 0;
        var pathData = 0;

        // generate side 0
        for (var d = d0; d < d1; d += dStep) {
            var h = Math.max(this.startHour, sunrise(d));
            azi = solarAzimuth(this.lat, this.lon, this.tmz, d, h);
            alt = solarAltitude(this.lat, this.lon, this.tmz, d, h);
            pathData = { altitude: alt, azimuth: azi };
            this.path.push(pathData);
        }
        // generate side 1
        for (var h = h1; h < h2; h += hStep) {
            var d = d1;
            azi = solarAzimuth(this.lat, this.lon, this.tmz, d, h);
            alt = solarAltitude(this.lat, this.lon, this.tmz, d, h);
            pathData = { altitude: alt, azimuth: azi };
            this.path.push(pathData);

        }
        // generate side 2
        for (var d = d2; d > d3; d -= dStep) {
            var h3 = Math.min(this.endHour, sunset(d3));
            azi = solarAzimuth(this.lat, this.lon, this.tmz, d, h);
            alt = solarAltitude(this.lat, this.lon, this.tmz, d, h);
            pathData = { altitude: alt, azimuth: azi };
            this.path.push(pathData);
        }
        // generate side 3
        for (var h = h3; h > h0; h -= hStep) {
            var d = d3;
            azi = solarAzimuth(this.lat, this.lon, this.tmz, d, h);
            alt = solarAltitude(this.lat, this.lon, this.tmz, d, h);
            pathData = { altitude: alt, azimuth: azi };
            this.path.push(pathData);
        }
    }
}

// returns Hour of sunrise for a given day of the year
sunrise = function (lat, day) {
    var hour = 0;
    var latRad = lat * (Math.PI / 180);
    var decRad = solarDeclination(day, hour);
    var sunriseHourAngle = -Math.tan(latRad) * Math.tan(decRad);

    return 4; //TODO: implement this
}

// returns Hour of sunrise for a given day of the year
sunset = function (lat, day) {
    var hour = 0;
    var latRad = lat * (Math.PI / 180);
    var decRad = solarDeclination(day, hour);
    var sunriseHourAngle = -Math.tan(latRad) * Math.tan(decRad);

    return 20; //TODO: implement this
}


// ************************
// CALCULATING SOLAR ANGLES
// ************************
// returns solar alpha in radians
solarAlpha = function (day, hour) {
    return (2 * Math.PI / 365.25) * (day + hour / 24);
}

// returns solar declination in radians
solarDeclination = function (day, hour) {
    var alpha = solarAlpha(day, hour);
    var decDeg = 0.396372 - 22.91327 * Math.cos(alpha) + 4.02543 * Math.sin(alpha) - 0.387205 * Math.cos(2 * alpha) + 0.051967 * Math.sin(2 * alpha) - 0.154527 * Math.cos(3 * alpha) + 0.084798 * Math.sin(3 * alpha);

    return decDeg * (Math.PI / 180);
}

// returns solar hour angle in radians
solarHourAngle = function (lon, tmz, day, hour) {
    var alpha = solarAlpha(day, hour);
    var tc = 0.004297 + 0.107029 * Math.cos(alpha) - 1.837877 * Math.sin(alpha) - 0.837378 * Math.cos(2 * alpha) - 2.340475 * Math.sin(2 * alpha);

    var hAngDeg = (hour - 12 - tmz) * (360 / 24) + lon + tc;
    if (hAngDeg >= 180) hAngDeg = hAngDeg - 360;
    if (hAngDeg <= -180) hAngDeg = hAngDeg + 360;

    return hAngDeg * (Math.PI / 180);
}

solarAzimuth = function (lat, lon, tmz, day, hour) {
    var decRad = solarDeclination(day, hour);
    var latRad = lat * (Math.PI / 180);
    var hAngRad = solarHourAngle(lon, tmz, day, hour);

    var cosZenith = Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(hAngRad);
    if (cosZenith > 1) cosZenith = 1;
    if (cosZenith < -1) cosZenith = -1;
    var zenRad = Math.acos(cosZenith)

    var cosAzi = (Math.sin(decRad) - Math.sin(latRad) * Math.cos(zenRad)) / (Math.cos(latRad) * Math.sin(zenRad));
    var aziRad = Math.acos(cosAzi);
    if (hAngRad > 0) aziRad = 2 * Math.PI - aziRad;

    return aziRad;
}

solarAltitude = function (lat, lon, tmz, day, hour) {
    var latRad = lat * (Math.PI / 180);
    var decRad = solarDeclination(day, hour);
    var hAngRad = solarHourAngle(lon, tmz, day, hour);

    var cosZenith = Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(hAngRad);
    if (cosZenith > 1) cosZenith = 1;
    if (cosZenith < -1) cosZenith = -1;

    return Math.asin(cosZenith);
}







