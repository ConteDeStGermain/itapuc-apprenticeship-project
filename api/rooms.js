const express = require("express");

module.exports = function users(db) {
  const router = express.Router();

  const usersCollection = db.collection("rooms");

  // GET
  router.get("/", function (req, res) {
    res.sendStatus(501);
  });

  // POST
  router.post("/", function (req, res, next) {
    res.sendStatus(501);
  });

  // DELETE
  router.delete("/:userId", function (req, res, next) {
    res.sendStatus(501);
  });

  return router;
}

// TODO: Function similar to encodeUser? Maybe?
// function encodeUser(document) {
//   return { 
//     id: document._id,
//     createdAt: document.createdAt,
//     displayName: document.displayName,
//     email: document.email
//   };
// }