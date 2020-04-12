const { ObjectId } = require("mongodb");

module.exports.session = function session(db) {
  const usersCollection = db.collection("users");
  return function(req, res, next) {
    parseUser(req, function (puErr, puResult) {
      if (puErr) {
        next(puErr);
      } else if (!puResult) {
        next();
      } else {
        lookupUser(usersCollection, puResult.userId, function(luErr, luResult) {
          if (luErr) {
            next(luErr);
          } else {
            req.user = luResult;
            next();
          }
        });
      }
    });
  }
}

module.exports.authenticate = function authenticate(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

function parseUser(req, cb) {
  const authHeaderValue = req.get("Authorization");
  if (authHeaderValue) {
    // TODO replace this with JWT decoding
    cb(null, { userId: req.get("Authorization") });
  } else {
    cb(null, null);
  }
}

function lookupUser(usersCollection, userId, cb) {
  try {
    userId = new ObjectId(userId);
    usersCollection.findOne({ _id: userId }, cb);
  } catch (e) {
    console.warn("Received invalid object ID");
    cb(null, null);
    return;
  }
};
