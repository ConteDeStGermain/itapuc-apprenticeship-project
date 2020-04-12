const bodyParser = require("body-parser");
const connect = require("./db");
const express = require("express");
const morgan = require("morgan");
const users = require("./api/users");
const rooms = require("./api/rooms");
const messages = require("./api/messages");
const auth = require("./auth");

// Entry point or our application
async function main() {
  try {
    const app = express();
    const { db, client } = await connect();

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Global middleware
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Log all requests and responses to console
    app.use(morgan('tiny'));

    // Parse request body as json (ContentType: application/json)
    app.use(bodyParser.json());

    // Extract the user's session information from the request if present
    app.use(auth.session(db));

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Route middleware
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    app.use("/users", users(db));
    app.use("/rooms", auth.authenticate, rooms(db));
    app.use("/messages", auth.authenticate, messages(db));

    // Handle all unhandled routes with a 404
    app.use("*", function (req, res) {
      res.sendStatus(404);
    });

    // Avoid sending stack traces with express by using error-handling middleware
    app.use(function middleware(error, req, res, next ) {
      res.send(process.env.NODE_ENV === 'debug' ? error: null).status(500);
      console.error(error);
    });

    const server = app.listen(8082, () => {
      console.log('Server is listening on port 8082')
    });

    return { server, client };
  } catch(error) {
    console.log(error);
  }
}

main().then(({ server, client }) => {
  process.on("SIGTERM", shutDown);
  process.on("SIGINT", shutDown);

  function shutDown () {
    console.log("Received kill signal, shutting down gracefully");
    server.close();
    client.close();
    process.exit(0);
  }
});
