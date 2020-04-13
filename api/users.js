const express = require("express");
const auth = require("../auth");

module.exports = function users(db) {
  const router = express.Router();
  const usersCollection = db.collection("users");

  // POST
  router.post("/", function (req, res, next) {
    const body = req.body;

    if(!validateRequestBody(req.body, res)) {
      return;
    }

    // POST a new user. Not authenticated.
    usersCollection.findOne({ email: body.email }, (err, userDoc) => {
      if (err) {
        next(err);
      } else if (userDoc) {
        res.json({ message: 'email already exists' }).status(400);
      } else {
        const newUser = {
          createdAt: new Date(),
          email: body.email,
        };

        if (body.displayName) {
          newUser.displayName = body.displayName;
        }

        usersCollection.insertOne(newUser, (err, results) => {
          if (err) {
            next(err);
          } else {
            // now we need to add a new record to the credentials collection
            // with the hashed password.
            // 1. Use bcrypt to hash the password
            // 2. Create and insert a new document in the credentials collection
            // 3. Create a new JWT with { userId: results.ops[0]._id } and add
            // it to the response JSON as a new property called token
            res.json({ data: encodeUser(results.ops[0]) }).status(201);
          }
        });
      }
    });
  });

  // All other API endpoints require authentication - insert the middleware
  // here.
  router.use(auth.authenticate);

  // Param middleware which will automatically be invoked when express parses a
  // route parameter for :userId. This approach is generally far preferable to
  // handling the parameter in each handler that uses it - as it allow us to
  // reduce code duplication and centralize the handling of the parameter.
  router.param("userId", function(req, res, next, userId) {
    try {
      userId = new ObjectId(userId);
    } catch (e) {
      console.warn("Received invalid object ID");
      res.sendStatus(404);
      return;
    }

    // Users can only operate on themselves (PUT / DELETE forbidden to other
    // users).
    if (!user._id.equals(userId) && req.method.toLowerCase() !== "get") {
      res.sendStatus(403);
      return;
    }

    usersCollection.find({ _id: userId }).toArray((err, [ userDoc ]) => {
      if (err) {
        next(err);
      } else if (!userDoc) {
        res.sendStatus(404);
      } else {
        req.params.user = userDoc;
        next();
      }
    });
  });

  // GET all users
  router.get("/", function (req, res) {
    usersCollection.find().toArray((err, userDocs) => {
      res.send({ data: userDocs.map(encodeUser) });
    });
  });

  // GET a user by ID
  router.get("/:userId", function (req, res, next) {
    res.json({ data: encodeUser(req.params.user) });
  });

  // PUT a user
  router.put("/:userId", function (req, res, next) {
    const body = req.body;

    if(!validateRequestBody(req.body, res)) {
      return;
    }

    const newValues = { $set: { displayName: body.displayName, email: body.email } }

    usersCollection.updateOne(req.params.user, newValues, (err, results) => {
      if (err) {
        next(err);
      } else {
        res.json({ data: encodeUser(results.ops[0]) }).status(200);
      }
    });
  });

  // DELETE a user
  router.delete("/:userId", function (req, res, next) {
    usersCollection.deleteOne(req.params.user, (err) => {
      if (err) {
        next(err);
      } else {
        res.sendStatus(200);
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

const validateDisplayName = (name) => {
  return name == null ||  typeof name === 'string';
};

const emailRegEx = /\w+@\w+\.[A-Za-z]{2,3}/;

const validateEmail = (email) => {
  return typeof email === "string" || emailRegEx.test(email);
};

// To this function, we need to add a check that body.password is set.
// It must be an 8 character-long string at a minimum. No additional
// requirements.
const validateRequestBody = (body, res) => {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    res.json({ message: 'body expected to be an object' }).status(400);
    return false;
  } else if(!validateEmail(body.email)) {
    res.json({ message: 'email not valid' }).status(400);
    return false;
  } else if (!validateDisplayName(body.displayName)) {
    res.json({ message: 'display name has to be a string' }).status(400);
    return false;
  } else {
    return true;
  }
}
