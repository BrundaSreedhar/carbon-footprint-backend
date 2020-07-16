const { MongoClient } = require('mongodb');

module.exports = {

    getAirport : async function(index){
  // set up database connection
    var text = "^.*" + index + ".*$";
     const uri = "mongodb+srv://cfcAdmin:ynwa1234@cluster0-ltgiv.mongodb.net/emissions?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    await client.connect();
    
        var query = {
            $or : [
                {
                    "iata" : { $regex : text   ,  $options: 'i' } 
                },
                {
                    "city" : { $regex :  text ,  $options: 'i' } 
                },
                {
                    "airport_name": { $regex : text ,  $options: 'i' } 
                }
            ]
        };

        var airportList = await client.db().collection("airportInfo").find(query).toArray();
        console.log(airportList);
        return airportList;

}
};

