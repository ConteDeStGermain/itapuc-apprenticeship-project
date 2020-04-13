const { ObjectId } = require("mongodb");

/**
 * This function returns a middleware which will extract the User information
 * from the request. The information about the user is passed in via the
 * Authorization header, like this:
 *
 * Authorization: <User Info>
 *
 * The current implementation simply reads the unencoded ID of the user from the
 * header. When we add proper authentication, the user will pass an encoded
 * string called a JSON web token, which we will have the ability to decode and
 * obtain the user's ID. The login API will return a JSON web token, which is
 * how authentication works.
 *
 * This middleware allows for no authorization header to be present, in which
 * case it simply continues (i.e. it calls next()).
 *
 * If an Authorization header is present, we need to make sure the user exists.
 * If the user is found, we assign the user object to the req as req.user.
 * Otherwise, we respond with 401 (not authorized).
 */
module.exports.session = function session(db) {
  const usersCollection = db.collection("users");

  return function(req, res, next) {
    // Get the user info from the request
    parseUser(req, function (puErr, puResult) {
      if (puErr) {
        next(puErr);
      } else if (!puResult) {
        // If no user information couldbe found on the request, pass control to
        // the next middleware in the chain.
        next();
      } else {
        // Lookup the user
        lookupUser(usersCollection, puResult.userId, function(luErr, luResult) {
          if (luErr) {
            next(luErr);
          } else if (luResult) {
            // A user was found, add it to the req and continue handling the
            // request.
            req.user = luResult;
            next();
          } else {
            // No user was found, respond with a 401
            res.sendStatus(401);
          }
        });
      }
    });
  }
}

/**
 * This middleware simply ensures that req.user is set (i.e. that the request is
 * authenticated).
 */
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
