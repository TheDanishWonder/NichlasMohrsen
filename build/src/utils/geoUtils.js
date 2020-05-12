"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
According to this calculator one Degree of latitude (at lattitude:55.772780384609256 )
corresponds to 111337.6487 meters, so one meter corresponds to 1/111337.6487 degrees
http://www.csgnetwork.com/degreelenllavcalc.html

const latInside = 55.772780384609256 + ((DISTANCE_TO_CENTER - 1) / 111337.6487)
const latOutside = 55.772780384609256 + ((DISTANCE_TO_CENTER + 1) / 111337.6487)
*/
function getLatitudeInside(latitude, radius) {
    return latitude + ((radius - 1) / 111337.6487);
}
exports.getLatitudeInside = getLatitudeInside;
function getLatitudeOutside(latitude, radius) {
    return latitude + ((radius + 1) / 111337.6487);
}
exports.getLatitudeOutside = getLatitudeOutside;
function positionCreator(lon, lat, userName, name, dateInFuture) {
    let date = new Date();
    if (dateInFuture) {
        date = new Date("2022-09-25T20:40:21.899Z");
    }
    var position = {
        userName, name, lastUpdated: date,
        location: {
            type: "Point",
            coordinates: [lon, lat]
        }
    };
    return position;
}
exports.positionCreator = positionCreator;
//# sourceMappingURL=geoUtils.js.map