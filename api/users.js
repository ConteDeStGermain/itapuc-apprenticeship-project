const express = require("express");

module.exports = function users(db) {
  const router = express.Router();

  // You will be able to use this object to access the users collection in
  // Mongo.
  const usersCollection = db.collection("users");
  
  router.get("/", function (req, res) {
    // 1. Load all users from Mongo
    // 2. Send a response to the client

    usersCollection.find().toArray((err, userDocs) => {
      res.send({ data: userDocs.map(encodeUser) });
    });
  });

  router.get("/:userId", function (req, res, next) {
    // 1. Load the user from the database with the given ID
    // 2. Send the appropriate a response to the client

    let userId = req.params.userId;

    try {
      userId = new ObjectId(userId);
    } catch {}

    usersCollection.findOne({ _id: userId }, (err, userDoc ) => {
      if (err) {
        next(err);
      } else if (userDoc) {
        res.send({ data: encodeUser(userDoc) });
      } else {
        res.sendStatus(404);
      }
    });
  });

  router.post("/", function (req, res, next) {
    // 1. Validate the body
    // 2. check for a user with the same email address
    // 3. Create the user in Mongo
    // 4. Send the response back

    const body = req.body;

    if (typeof body !== 'object' || body == null || Array.isArray(body)) {
      res.send({ message: 'body expected to be an object' }).status(400);
      return;
    } 

    // need to do some more input validation here

    usersCollection.findOne({ email: body.email }, (err, userDoc) => {
      if (err) {
        next(err);
      } else if (userDoc) {
        res.json({ message: 'email already exists' }).status(400);
      } else {
        usersCollection.insertOne({ createdAt: new Date(), email: body.email, displayName: body.displayName }, (err, newUserDoc) => {
          if (err) {
            next(err);
          }
          res.json({ data: encodeUser(newUserDoc.result) }).status(201);
        });
      }
    });
  });

  router.put("/:userId", function (req, res, next) {
    // 1. Validate the body
    // 2. Load the user from the database with the given ID
    // 3. Send a 404 if it doesn't exist
    // 4. Update the displayName and email of the user in mongo
    // 5. Send the response back

    const userId = req.params.userId;

    const body = req.body;

    if (typeof body !== 'object' || body == null || !Array.isArray(body)) {
      res.json({ message: 'body expected to be an object' }).status(400);
      return;
    }
    // extract a function for validateUserBody(body, res)
    // if (validateUserBody(body, res) {
    //    return;
    // }

    usersCollection.findOne({ _id: userId }, (err, userDoc) => {
      if (err) {
        next(err);
      } else if (!userDoc) {
        res.json({ message: 'The user does not exist' }).status(400);
      } else {
        const newValues = {$set: {displayName: body.displayName, email: body.email }}

        usersCollection.updateOne({ _id: userId }, newValues, (err, newUserDoc) => {
          if (err) {
            next(err);
          } else {
            res.json({ data: encodeUser(newUserDoc.result) }).status(200);
          }
        });
      }
    });
  });

  router.delete("/:userId", function (req, res, next) {
    // 1. Load the user from the database with the given ID
    // 2. Send a 404 if it doesn't exist
    // 3. Delete the user from mongo
    // 5. Send the response back

    const userId = req.params.userId;

    usersCollection.findOne({ _id: userId }, (err, userDoc) => {
      if (err) {
        next(err);
      } else if (!userDoc) {
        res.json({ message: 'The user does not exist' }).status(400);
      } else {
        usersCollection.deleteOne({ _id: userId }, (err) => {
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

function encodeUser(document) {
  return {
    id: document._id,
    createdAt: document.createdAt,
    displayName: document.displayName,
    email: document.email
  };
}
