const express = require("express");
const { ObjectId } = require("mongodb");

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
    let userIds = req.body.participants;

    try { userIds = userIds.map(userId => new ObjectId(userId)); } catch(e) {console.log('Try Catch: ' + e)}

    usersCollection.findOne({ _id: userIds[0]}, (err, userDoc) => {
      if (err) {
        next(err);
      } else if (!userDoc) {
        res.sendStatus(404);
        return;
      }
    });

    usersCollection.findOne({ _id: userIds[1]}, (err, userDoc) => {
      if (err) {
        next(err);
      } else if (!userDoc) {
        res.sendStatus(404);
        return;
      } 
    });
    
    roomsCollection.insertOne({ createdAt: new Date(), participants: userIds }, (err, results) => {
        if (err) {
          next(err);
        } 
        res.json({ data: encodeRoom(results.ops[0]) }).status(201);
      });
  });

  // DELETE
  router.delete("/:roomId", function (req, res, next) {
    let roomId = req.params.roomId;

    roomId = new ObjectId(roomId);

    roomsCollection.findOne({ _id: roomId }, (err, userDoc) => {
      if (err) {
        next(err);
      } else if (!userDoc) {
        res.json({ message: 'The room does not exist' }).status(400);
      } else {
        usersCollection.deleteOne({ _id: roomId }, (err) => {
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