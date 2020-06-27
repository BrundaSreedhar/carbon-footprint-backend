const { MongoClient } = require('mongodb');

module.exports = {
    connectToDB: async function (index) {
        //TODO : use index 
        const ch = "i";
        const uri = "mongodb+srv://cfcAdmin:ynwa1234@cluster0-ltgiv.mongodb.net/emissions?retryWrites=true&w=majority";
        const client = new MongoClient(uri);

        try {
            await client.connect();
            var query = { $or: [{ iata: { $regex: "/.*" + ch + ".*/" } }, { airport_name: { $regex: "/.*" + ch + ".*/" } }] };
            var airportList = await client.db().collection("airportData").find(query).toArray();
            return airportList;
        } catch (e) {
            return e;
        } finally {
            await client.close();
        }
    }
};
