const express = require("express");
const { ObjectId } = require("mongodb");
const { encodeMessage, validateBody } = require("./messages");

module.exports = function rooms(db) {
  const router = express.Router();

  const messagesCollection = db.collection("messages");
  const roomsCollection = db.collection("rooms");
  const usersCollection = db.collection("users");

  router.param("roomId", function(req, res, next, roomId) {
    try {
      roomId = new ObjectId(roomId);
    } catch (e) {
      console.warn("Received invalid object ID");
      res.sendStatus(404);
      return;
    }

    roomsCollection.find({ _id: roomId }).toArray((err, [ roomDoc ]) => {
      if (err) {
        next(err);
      } else if (!roomDoc) {
        res.sendStatus(404);
      } else if (roomDoc.participants.every(p => !p.equals(req.user._id))) {
        res.sendStatus(403);
      } else {
        req.room = roomDoc;
        next();
      }
    });
  });

  // GET all rooms
  router.get("/", function (req, res, next) {
    roomsCollection.find({ participants: req.user._id }).toArray((err, roomDocs) => {
        if (err) {
          next(err);
        } else {
          res.send({ data: roomDocs.map(encodeRoom) });
        }
      });
  });

  // POST a room
  router.post("/", function (req, res, next) {
    let userIds = req.body.participants;

    try {
      userIds = userIds.map(userId => new ObjectId(userId));
      userIds.push(new ObjectId(req.user._id));
      const filtered = [];
      for (const userId of userIds) {
        if (!filtered.includes(userId)) {
          filtered.push(userId);
        }
      }
      userIds = filtered;
    } catch(e) { }

    usersCollection.find({ _id: { $in: userIds } }).count((error, count) => {
      if (error) {
        next(error);
      } else if (count !== userIds.length) {
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

  // DELETE a room
  router.delete("/:roomId", function (req, res, next) {
    roomsCollection.deleteOne({ _id: roomId }, (err) => {
      if (err) {
        next(err);
      } else {
        res.sendStatus(200);
      }
    });
  });

  // GET messages for a room
  router.get("/:roomId/messages", function (req, res, next) {
    const { room } = req;

    messagesCollection.find({ roomId: room._id }).toArray((error, messageDocs) => {
      if (error) {
        next(error);
      } else {
        res.send({ data: messageDocs.map(encodeMessage) });
      }
    });
  });

  // POST a message to a room
  router.post("/:roomId/messages", function (req, res, next) {
    const { room, user } = req;

    if (!validateBody(req.body, res)) {
      return;
    }

    const message = {
      createdAt: new Date(),
      authorId: user._id,
      roomId: room._id,
      text: req.body.text
    };

    messagesCollection.insertOne(message, (error, results) => {
      if (error) {
        next(error);
      } else {
        const newMessage = results.ops[0];
        roomsCollection.updateOne(room, { $set: { lastMessage: newMessage._id } }, err => {
          if (err) {
            next(err);
          } else {
            res.json({ data: encodeMessage(newMessage) }).status(201);
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

