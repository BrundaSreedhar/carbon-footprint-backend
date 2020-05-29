const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3000
const distance = require('google-distance-matrix')

distance.key('AIzaSyBJTYLXHomn5JwCOsxRme-xlTpN5_6uaX4');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/getDistance', (req, res) => {
    var origins = req.body.origins;
    var destinations = req.body.destinations;
    var mode = req.body.mode;
    var vehicle = req.body.vehicle;
    var totalEmissions;
    distance.mode(mode);
    var actualDistance;
    distance.matrix(origins, destinations, function (err, distances) {
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
                        if(mode === "walking" || mode === "bicycling"){
                            vehicle=mode;
                        }
                        totalEmissions = getEmissions(vehicle, parseInt(actualDistance));
                        console.log(vehicle);
                        console.log(actualDistance);
                        console.log(totalEmissions);
                        res.json(
                            {
                                ResponseString: 'Distance from ' + origin + ' to ' + destination + ' by ' + mode + ' is ' + actualDistance,
                                distance: actualDistance,
                                emissions: totalEmissions
                            });
                    } else {
                        res.send(destination + ' is not reachable by ' + mode + ' from ' + origin);
                    }
                }
            }
        }
    })
}
);


getEmissions = (vehicle, distance) =>{
    console.log("inside getEmissions");
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