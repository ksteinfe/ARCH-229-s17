function bin(location, d0, d1, h0, h1) {
    this.loc = location;

    this.startDay = Math.min(d0, d1);
    this.endDay = Math.max(d0, d1);
    this.startHour = Math.min(h0, h1);
    this.endHour = Math.max(h0, h1);

    this.pts = [
        { day: d0, hour: solarTime(this.loc, d0, h0) },
        { day: d0, hour: solarTime(this.loc, d0, h1) },
        { day: d1, hour: solarTime(this.loc, d1, h1) },
        { day: d1, hour: solarTime(this.loc, d1, h0) }];

    // this.pts = [
    //     { day: d0, hour: h0 },
    //     { day: d0, hour: h1 },
    //     { day: d1, hour: h1 },
    //     { day: d1, hour: h0 }];

    this.path = [];
    this.solarPath = [];

    this.isVisible = function () {
        if (sunrise(this.loc.lat, this.startDay) > this.endHour && sunrise(this.loc.lat, this.endDay) > this.endHour) return false;
        if (sunset(this.loc.lat, this.startDay) < this.startHour && sunset(this.loc.lat, this.endDay) < this.startHour) return false;
        return true;
    }

    this.generateSolarPath = function (res) {
        // Interpolate points to form a path
        for (var i = 0; i < this.pts.length; i++) {
            var obj1 = this.pts[i];
            if (i === this.pts.length - 1) obj2 = this.pts[0];
            else obj2 = this.pts[i + 1];

            for (var t = 0; t < 1; t += 1 / res) {
                this.path.push(lerp(obj1, obj2, t));
            }
        }
        this.path.push(this.pts[0]);


        for (var i = 0; i < this.path.length; i++) {
            var sr = sunrise(this.loc.lat, this.path[i].day);
            var ss = sunset(this.loc.lat, this.path[i].day);
            // check path if it is on the boundry
            if (this.path[i].hour < sr) this.path[i].hour = sr;
            if (this.path[i].hour > ss) this.path[i].hour = ss;

            // generate solar geometry for time;
            this.solarPath.push(solarGeo(this.loc, this.path[i]))
        }
    }
}

lerp = function (obj1, obj2, t) {
    var d_t = (1 - t) * obj1.day + t * obj2.day;
    var h_t = (1 - t) * obj1.hour + t * obj2.hour;
    return { day: d_t, hour: h_t }
}

solarGeo = function (loc, time) {
    var lat = loc.lat;
    var lng = loc.lon;
    var tmz = loc.tmz;

    var alpha = dY.solarGeom.calcAlpha(time.day, time.hour);

    //calculate Declination Angle
    var decDeg = 0.396372 - 22.91327 * Math.cos(alpha) + 4.02543 * Math.sin(alpha) - 0.387205 * Math.cos(2 * alpha) + 0.051967 * Math.sin(2 * alpha) - 0.154527 * Math.cos(3 * alpha) + 0.084798 * Math.sin(3 * alpha);
    var decRad = dY.solarGeom.degToRad(decDeg);

    // time correction for solar angle
    var tc = 0.004297 + 0.107029 * Math.cos(alpha) - 1.837877 * Math.sin(alpha) - 0.837378 * Math.cos(2 * alpha) - 2.340475 * Math.sin(2 * alpha);

    // calculate Solar Hour Angle, angle between local longitude and solar noon
    var hAngDeg = (time.hour - 12 - tmz) * (360 / 24) + lng;// + tc;
    if (hAngDeg >= 180) hAngDeg = hAngDeg - 360;
    if (hAngDeg <= -180) hAngDeg = hAngDeg + 360;
    var hAngRad = dY.solarGeom.degToRad(hAngDeg);

    //calc Altitude Angle
    var latRad = dY.solarGeom.degToRad(lat);
    var cosZenith = Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(hAngRad);
    if (cosZenith > 1) cosZenith = 1;
    if (cosZenith < -1) cosZenith = -1;

    var zenRad = Math.acos(cosZenith)
    var altRad = Math.asin(cosZenith)

    //calc Azimuth angle
    var cosAzi = (Math.sin(decRad) - Math.sin(latRad) * Math.cos(zenRad)) / (Math.cos(latRad) * Math.sin(zenRad));
    var aziDeg = dY.solarGeom.radToDeg(Math.acos(cosAzi));
    if (hAngRad > 0) aziDeg = 360 - aziDeg;
    var aziRad = dY.solarGeom.degToRad(aziDeg);

    return {
        altitude: altRad,
        altitudeDeg: dY.solarGeom.radToDeg(altRad),
        azimuth: aziRad,
        azimuthDeg: aziDeg,
        declinationRad: decRad,
        declinationDeg: decDeg,
        hourAngleRad: hAngRad,
        hourAngleDeg: hAngDeg
    }
}

// returns Hour of sunrise for a given day of the year
sunrise = function (lat, day) {
    var hour = 0;
    var latRad = lat * (Math.PI / 180);
    var decRad = solarDeclination(day, hour);
    var w_o = Math.acos(-Math.tan(latRad) * Math.tan(decRad));

    return 12 - w_o * 12 / Math.PI;
}

// returns Hour of sunrise for a given day of the year
sunset = function (lat, day) {
    var hour = 0;
    var latRad = lat * (Math.PI / 180);
    var decRad = solarDeclination(day, hour);
    var sunriseHourAngle = -Math.tan(latRad) * Math.tan(decRad);
    var w_o = Math.acos(-Math.tan(latRad) * Math.tan(decRad));

    return 12 + w_o * 12 / Math.PI;
}

solarTime = function (loc, day, hour) {
    // var b = (day - 81) * 360 / 365.25;
    var b = (day - 81) * 2 * Math.PI / 365.25; // check on degrees:
    var e = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.58 * Math.sin(b)
    var tc = (4 * (15 * loc.tmz - loc.lon) + e) / 60;
    return hour + tc;
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







