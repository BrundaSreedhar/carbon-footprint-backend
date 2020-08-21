const { MongoClient } = require('mongodb');

module.exports = {

    getAllAirports: async function () {
        // set up database connection
        const uri = "mongodb+srv://cfcAdmin:ynwa1234@cluster0-ltgiv.mongodb.net/emissions?retryWrites=true&w=majority";
        const client = new MongoClient(uri);
        await client.connect();

<<<<<<< HEAD
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
        console.log(airportList);
=======
        var airportList = await client.db().collection("airportInfo").find().toArray();
>>>>>>> 3a93fc8ef50ee2ad5dd3a361e1c8f940b840c3dd
        return airportList;
    }
};

