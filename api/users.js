const express = require("express");

module.exports = function users(db) {
  const router = express.Router();

  // You will be able to use this object to access the users collection in
  // Mongo.;w
  const usersCollection = db.collection("users");

  router.get("/", async function (req, res) {
    // 1. Load all users from Mongo
    // 2. Send a response to the client
  });

  router.get("/:userId", async function (req, res) {
    const userId = req.userId;

    // 1. Load the user from the database with the given ID
    // 2. Send the appropriate a response to the client
  });

  router.post("/", async function (req, res) {
    const body = req.body;

    // 1. Validate the body
    // 2. check for a user with the same email address
    // 3. Create the user in Mongo
    // 4. Send the response back
  });

  router.put("/:userId", async function (req, res) {
    const userId = req.userId;

    // 1. Validate the body
    // 2. Load the user from the database with the given ID
    // 3. Send a 404 if it doesn't exist
    // 4. Update the displayName and email of the user in mongo
    // 5. Send the response back
  });

  router.delete("/:userId", async function (req, res) {
    const userId = req.userId;

    // 1. Load the user from the database with the given ID
    // 2. Send a 404 if it doesn't exist
    // 3. Delete the user from mongo
    // 5. Send the response back
  });

  return router;
}
