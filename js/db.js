const { MongoClient } = require('mongodb');

module.exports = {
    getNearestAirports: async function (lat, lon) {
        const R = 6371e3; // earth's mean radius in metres
        const sin = Math.sin, cos = Math.cos, acos = Math.acos;
        const π = Math.PI;

       // latitude, longitude & radius of bounding circle
       // const lat = 3.58;  
       // const lon = 143.66;    
        const radius = Number(500000);

        // set up database connection
        const uri = "mongodb+srv://cfcAdmin:ynwa1234@cluster0-ltgiv.mongodb.net/emissions?retryWrites=true&w=majority";
        const client = new MongoClient(uri);
        await client.connect();

        // query points within first-cut bounding box (Lat & Lon should be indexed for fast query)
        minLat = lat - radius / R * 180 / π
        maxLat = lat + radius / R * 180 / π
        minLon = lon - radius / R * 180 / π / cos(lat * π / 180)
        maxLon = lon + radius / R * 180 / π / cos(lat * π / 180)
        var query = {
            $and: [{
                "lat": {
                    "$lte": maxLat,
                    "$gt": minLat
                }
            },
            {
                "lng": {
                    "$lte": maxLon,
                    "$gt": minLon
                }
            }]
        };

        var airportList = await client.db().collection("airportData").find(query).toArray();
        return airportList;
    }
};
