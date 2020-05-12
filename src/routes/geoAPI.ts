import express from "express";
const gju = require("geojson-utils")
const router = express.Router();

const gameArea = {
    type: "Polygon",
    coordinates: [
      [
        [12.544240951538086, 55.77594546428934],
        [12.549219131469727, 55.77502825125135],
        [12.568359375, 55.77604201177451],
        [12.578487396240234, 55.7767661102896],
        [12.573423385620117, 55.79467119920912],
        [12.57059097290039, 55.795877445664104],
        [12.544240951538086, 55.77594546428934],
      ],
    ],
  };

/*
 Create a new polygon meant to be used on clients by React Native's MapView which
 requres an object as the one we create below 
 NOTE --> how we swap longitude, latitude values
*/
const polygonForClient = <any>{};
polygonForClient.coordinates = gameArea.coordinates[0].map(point => {
  return {latitude: point[1],longitude: point[0]}
})

//Returns a polygon, representing the gameArea
router.get("/gamearea",(req,res)=>{
  res.json(polygonForClient);
});

router.get('/isuserinarea/:lon/:lat', function(req, res) {
  const lon = req.params.lon;
  const lat = req.params.lat;
  const point = {"type":"Point","coordinates":[lon,lat]}
  let isInside = gju.pointInPolygon(point,gameArea);
  let result = <any>{};
  result.status = isInside;
  let msg = isInside ? "Point was inside the tested polygon":
                       "Point was NOT inside tested polygon";
  result.msg = msg;
  res.json(result);
});

module.exports = router;