const { ObjectId } = require("mongodb");
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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

module.exports.login = function login(db) {
  const usersCollection = db.collection("users");
  const credentialsCollection = db.collection("credentials");

  return function loginHandler(req, res, next) {
    // 1. Extract the email and password from the request body
    // 1a. If email and password not provided (or not strings), return 400
    // 2. Lookup the user by email
    // 2a. If user not found, return 401
    // 3. Lookup the hashed password by userId
    // 3a. If password not found, return 401
    // 4. Use bcrypt.compare to check the provided password
    // 4a. If password comparison fails, return 401
    // 4b. If password comparison succeeds, create a JWT with { userId: user._id }
    // res.json({ data: user, token: jwt });
    let bodyEmail = req.body.email;
    let bodyPassword = req.body.password;

    if (typeof bodyEmail !== "string"){
      res.json({ message: "email required" }).status(400);
      return;
    } else if (typeof bodyPassword !== "string"){
      res.json({ message: "password required" }).status(400);
      return;
    }
    
    usersCollection.findOne({ email: bodyEmail }, (err, user) => {
      if (err) {
        next(err);
      } else if (!user) {
        res.sendStatus(401);
      } else {
        credentialsCollection.findOne({ userId: user._id }, (err, credential) => {
          if (err) {
            next(err);
          } else if (!credential) {
            res.sendStatus(401);
          } else {
            bcrypt.compare(bodyPassword, credential.hashedPassword, (err, result) => {
                if (err) {
                  next(err);
                } else if (!result) {
                  res.sendStatus(401);
                } else {
                  res.json({ data: user, token: createJwt(user)});
                }
            });
          }
        })
      }
    })

  }
}

module.exports.createJwt = createJwt;

function parseUser(req, cb) {
  const authHeaderValue = req.get("Authorization");
  if (authHeaderValue) {
    // 1. replace this with jwt.verify
    jwt.verify(authHeaderValue, 'shhhhh', cb);
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

function createJwt(user) {
  return jwt.sign({ userId: user._id }, 'shhhhh');
};