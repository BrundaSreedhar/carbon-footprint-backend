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
    //these are request variables - TODO
    //var origins = ['Mumbai'];
    var origins = req.body.origins;
    var destinations = req.body.destinations;
    var mode = req.body.mode;
    //var destinations = ['Mysore'];
    //TODO - set mode from req
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
                        res.json(
                            {
                                ResponseString: 'Distance from ' + origin + ' to ' + destination + ' by ' + mode + ' is ' + actualDistance,
                                distance: actualDistance
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

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))