const { MongoClient } = require('mongodb');

module.exports = {

    getAllAirports: async function () {
        // set up database connection
        const uri = "mongodb+srv://cfcAdmin:ynwa1234@cluster0-ltgiv.mongodb.net/emissions?retryWrites=true&w=majority";
        const client = new MongoClient(uri);
        await client.connect();
<<<<<<< HEAD

        var airportList = await client.db().collection("airportInfo").find().toArray();
=======
        var airportList = await client.db().collection("airportData").find(query).toArray();
        console.log(airportList);
>>>>>>> 07df48cb31ee2f8365a104e7207fb308f6a6aae7
        return airportList;
    }
};

