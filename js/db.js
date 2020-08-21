const { MongoClient } = require('mongodb');

module.exports = {

    getAllAirports: async function () {
        // set up database connection
        const uri = "mongodb+srv://cfcAdmin:ynwa1234@cluster0-ltgiv.mongodb.net/emissions?retryWrites=true&w=majority";
        const client = new MongoClient(uri);
        await client.connect();
        var airportList = await client.db().collection("airportData").find(query).toArray();
        console.log(airportList);
        return airportList;
    }
};

