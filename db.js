const { MongoClient } = require("mongodb");

module.exports = async function () {

  const url = "mongodb://localhost:27017";

  // The name of the database we will create in Mongo
  const dbName = "messenger";

  //Connect to the server
  const client = await MongoClient.connect(url);

  // Open a connection to the database
  const db = client.db(dbName);

  // initialize our collections
  db.createCollection("users", {
    validator: {
      // Left as an exercise - see note below
    },
  });

  db.createCollection("rooms", {
    validator: {
      // Left as an exercise - see note below
    },
  });

  db.createCollection("messages", {
    validator: {
      // Left as an exercise - see note below
    },
  });

  return { client, db };
}
