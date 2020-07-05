const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3000
const distance = require('google-distance-matrix');
const unirest = require('unirest');
const db = require('./db');

distance.key('AIzaSyBJTYLXHomn5JwCOsxRme-xlTpN5_6uaX4');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/getAirportList', async (req, res) => {
    var list = await db.getNearestAirports();
    console.log(list);
    res.send(list);
});

app.post('/getDistance', (req, res) => {
    var origins = req.body.origins;
    var destinations = req.body.destinations;
    var mode = req.body.mode;
    var vehicle = req.body.vehicle;
    var seatType = req.body.seatType; 
    var totalEmissions;
    var actualDistance;
    var originLatLng = origins[0];
    var destLatLng = destinations[0];


    //when mode is flight, find geodesic distance and calculate emissions
    if(mode == "flight"){
        var airDistance = getGeodesicDistance(originLatLng, destLatLng);
        var flightEmissions = airDistance*getFlightEmissions(seatType);
        res.json(
            {
                distance: airDistance,
                emissions: flightEmissions
            });
            console.log(airDistance, flightEmissions);
        return;
    }

    //use distance matrix when mode is not flight and obtain distance travelled using Maps API
    //use geodesic distance if Maps API doesnt return distance
    distance.matrix(origins, destinations, function (err, distances) {
        distance.mode(mode);
        if(mode === "walking" || mode === "bicycling"){
            vehicle = mode;
        }
        console.log("Origins: ", origins);
        console.log("Destinations: ", destinations);
        if (err) {
            return console.log(err);
        }
        if (!distances) {
            return console.log('no distances');
        }
        if (distances.status == 'OK') {
            for (var i = 0; i < origins.length; i++) {
                for (var j = 0; j < destinations.length; j++) {
                    var origin = distances.origin_addresses[i];
                    var destination = distances.destination_addresses[j];
                    if (distances.rows[0].elements[j].status == 'OK') {
                        actualDistance = distances.rows[i].elements[j].distance.text;
                        totalEmissions = getEmissions(vehicle, parseInt(actualDistance.replace(",", "")));
                        res.json(
                            {
                                ResponseString: 'Distance from ' + origin + ' to ' + destination + ' by ' + mode + ' is ' + actualDistance,
                                distance: actualDistance,
                                emissions: totalEmissions
                            });
                    } else {
                        var geoDesicDistance = getGeodesicDistance(originLatLng, destLatLng);
                        totalEmissions = getEmissions(vehicle, parseInt(geoDesicDistance));
                        res.json(
                            {
                                ResponseString: 'Distance from ' + origin + ' to ' + destination + ' by ' + mode + ' is ' + actualDistance,
                                distance: geoDesicDistance,
                                emissions: totalEmissions
                            });
                    }
                }
            }
        }
    })
}
);

app.get('/getTweets', (req, res) => {

    unirest.get("https://xvgr157zoj:dm2zf85y2v@kakfa-twitter-start-8087333619.us-east-1.bonsaisearch.net:443/tweet-load/_search")
        .header("Accept", "application/json")
        .end(function (result) {
            res.send(result.body);
        });

});

getGeodesicDistance = (originLatLng, destLatLng) =>{
  var  latLng1 = originLatLng.split(",");
    var lat1= latLng1[0];
    var lng1= latLng1[1];

    var latLng2 = destLatLng.split(",");
    var lat2= latLng2[0];
   var  lng2= latLng2[1];

   	
const R = 6371e3; // metres
const φ1 = lat1 * Math.PI/180; // φ, λ in radians
const φ2 = lat2 * Math.PI/180;
const Δφ = (lat2-lat1) * Math.PI/180;
const Δλ = (lng2-lng1) * Math.PI/180;

const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

const d = R * c; // in metres
const distInKm = d/1000;

return distInKm;
    console.log(lat1, lng1, lat2, lng2);
    console.log("distance is ",distInKm);
}

getFlightEmissions = (seatType) =>{
    console.log("inside getFlightEmissions");
    switch(seatType){
        case 'economy': return 116;
        break;

        case 'first class': return 336;
        break;

        case 'premium economy': return 232;
        break;

        case 'business class':return 243 ;
        break;
    }
}
getEmissions = (vehicle, distance) =>{
    console.log("inside getEmissions");
    console.log("distance recd is :" +distance);
    switch(vehicle){
        case 'motorcycle': return distance * 83 ;
        break;
        case 'lorry': return distance * 300;
        break;
        case 'car (diesel)': return distance * 121.5;   
        break;
        case 'car (petrol)': return distance * 123.5;   
        break;
        case 'car (electric)': return distance * 12;
        break;
        case 'bus': return distance * 80;
        break;
        case 'train':return distance * 28;
        break;
        case 'walking':return distance * 3;
        break;
        case 'bicycling': return distance * 21;
        break;
    }
}
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))