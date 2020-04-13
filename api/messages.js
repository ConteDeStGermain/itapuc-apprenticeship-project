const express = require("express");
const { ObjectId } = require("mongodb");

module.exports = function messages(db) {
  const router = express.Router();

  const messagesCollection = db.collection("messages");

  router.param("messageId", function(req, res, next, messageId) {
    try {
      messageId = new ObjectId(messageId);
    } catch (e) {
      console.warn("Received invalid object ID");
      res.sendStatus(404);
      return;
    }

    messagesCollection.find({ _id: messageId }).toArray((err, [ messageDoc ]) => {
      if (err) {
        next(err);
      } else if (!messageDoc) {
        res.sendStatus(404);
      } else if (!req.user._id.equals(messageDoc.authorId)) {
        res.sendStatus(403);
      } else {
        req.message = messageDoc;
        next();
      }
    });
  });

  // GET
  router.get("/:messageId", function(req, res) {
    res.json({ data: encodeMessage(req.message) });
  });

  // PUT
  router.put("/:messageId", function(req, res, next) {
    if (!validateBody(req.body, res)) {
      return;
    }

    const updates = { $set: { text: req.body.text } };

    messagesCollection.updateOne(req.message, updates, (err, result) => {
      if (err) {
        next(err);
      } else {
        res.json({ data: encodeMessage(results.ops[0]) }).status(200);
      }
    });
  });

  // DELETE
  router.delete("/:messageId", function(req, res, next) {
    messagesCollection.deleteOne(req.message, err => {
      if (err) {
        next(err);
      } else {
        res.sendStatus(200);
      }
    });
  });

  return router;
};

function encodeMessage(document) {
  return {
    id: document._id,
    createdAt: document.createdAt,
    authorId: document.authorId,
    roomId: document.roomId,
    text: document.text
  };
};

function validateBody(body, res) {
  if (typeof body !== "object" || body === null) {
    res.json({ message: "request body must be a JSON object" }).status(400);
    return false;
  } else if (typeof body.text !== "string" || body.text === "") {
    res.json({ message: "body.text required" }).status(400);
    return false;
  }
  return true;
};

module.exports.encodeMessage = encodeMessage;
module.exports.validateBody = validateBody;
