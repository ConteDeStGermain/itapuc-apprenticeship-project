const { MongoClient } = require("mongodb");
const { userSchema, roomSchema, messageSchema } = require("./schema");

module.exports = async function connect() {

  const url = "mongodb://localhost:27017";

  const dbName = "messenger";


  const client = await MongoClient.connect(url, {useUnifiedTopology: true});

  const db = client.db(dbName);

  db.createCollection("users");
  db.createCollection("rooms");
  db.createCollection("messages");
  
  db.command({ collMod: "users", validator: { $jsonSchema: userSchema } });
  db.command({ collMod: "rooms", validator: { $jsonSchema: roomSchema } });
  db.command({ collMod: "messages", validator: { $jsonSchema: messageSchema } });

  return { client, db };
}
