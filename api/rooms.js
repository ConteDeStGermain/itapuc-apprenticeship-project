const express = require("express");

module.exports = function rooms(db) {
  const router = express.Router();

  const usersCollection = db.collection("users");
  const roomsCollection = db.collection("rooms");

  // GET
  router.get("/", function (req, res) {
    roomsCollection.find().toArray((err, userDocs) => {
        res.send({ data: userDocs.map(encodeRoom) });
      });
  });

  // POST
  router.post("/", function (req, res, next) {
    const userIds = req.body.participants;

    try { userIds = userIds.map(userId => new ObjectId(userId)); } catch {}

    roomsCollection.insertOne({ createdAt: new Date(), participants: userIds }, (err, results) => {
        if (err) {
          next(err);
          console.log(err);
        } 
       
        // res.json({ data: encodeRoom(results.ops[0]) }).status(201);
      });
  });

  // DELETE
  router.delete("/:userId", function (req, res, next) {
    res.sendStatus(501);
  });

  return router;
}

// TODO: Function similar to encodeUser? Maybe?
function encodeRoom(document) {
  return { 
    id: document._id,
    createdAt: document.createdAt,
    lastMessage: document.lastMessage,
    participants: document.participants
  };
}