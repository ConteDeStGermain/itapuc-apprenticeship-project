const express = require("express");
const { ObjectId } = require("mongodb");

module.exports = function rooms(db) {
  const router = express.Router();

  const usersCollection = db.collection("users");
  const roomsCollection = db.collection("rooms");

  // GET
  router.get("/", function (req, res) {
    roomsCollection.find().toArray((err, roomDocs) => {
        res.send({ data: roomDocs.map(encodeRoom) });
      });
  });

  // POST
  router.post("/", function (req, res, next) {
    let userIds = req.body.participants;

    try { userIds = userIds.map(userId => new ObjectId(userId)); } catch(e) {console.log('Try Catch: ' + e)}
 
    usersCollection.find({ _id: {$in: userIds } }, (error, userDocs) => {
      if (error) {
        next(error);
      } else if (userDocs.length !== userIds.length) {
        res.json({ message: "Invalid user IDs" }).status(400);
      } else {
        roomsCollection.insertOne({ createdAt: new Date(), participants: userIds }, (err, results) => {
          if (err) {
            next(err);
          } else {
            res.json({ data: encodeRoom(results.ops[0]) }).status(201);
          }
        });
      }
    });

  });

  // DELETE
  router.delete("/:roomId", function (req, res, next) {
    let roomId = req.params.roomId;

    try {roomId = new ObjectId(roomId);} catch(e) {console.log('Delete function: ' + e)}

    roomsCollection.findOne({ _id: roomId }, (err, roomDoc) => {
      if (err) {
        next(err);
      } else if (!roomDoc) {
        res.json({ message: 'The room does not exist' }).status(404);
      } else {
        roomsCollection.deleteOne({ _id: roomId }, (err) => {
          if (err) {
            next(err);
          } else {
            res.sendStatus(200);
          }
        });
      }
    });
  });

  return router;
}

function encodeRoom(document) {
  return { 
    id: document._id,
    createdAt: document.createdAt,
    lastMessage: document.lastMessage,
    participants: document.participants
  };
}