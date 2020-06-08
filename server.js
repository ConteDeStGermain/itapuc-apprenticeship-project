const bodyParser = require("body-parser");
const { Server } = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const connect = require("./db");
const express = require("express");
const morgan = require("morgan");
const users = require("./api/users");
const rooms = require("./api/rooms");
const messages = require("./api/messages");
const auth = require("./auth");

const port = process.env.PORT || 8082;
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
const dbName = process.env.MONGO_DB || "messenger";

// Entry point or our application
async function main() {
  try {
    const app = express();
    const server = Server(app);
    const io = socketIO(server);
    const { db, client } = await connect(mongoUri, dbName);

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Global middleware
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Log all requests and responses to console
    app.use(morgan("tiny"));

    // Parse request body as json (ContentType: application/json)
    app.use(bodyParser.json());

    // Extract the user's session information from the request if present
    app.use(auth.session(db));

    app.use(cors());
    app.disable("etag");

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Route middleware
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    app.post("/login", auth.login(db));
    // user API has one unsecured route (POST)
    app.use("/users", users(db));
    // rooms and messages are all secured (they require a user to be logged in).
    // We can pass the authenticate middleware to app.use before the router, and
    // it will route the call through the middleware first before the router.
    // The effect is that all routes in the rooms and messages APIs will need to
    // have passed through the authenticate middleware before they can be
    // called.
    app.use("/rooms", auth.authenticate, rooms(db, io));
    app.use("/messages", auth.authenticate, messages(db));

    app.use(express.static("dist"));

    // Handle all unhandled routes with a 404
    app.use("*", function (req, res) {
      res.sendStatus(404);
    });

    // Avoid sending stack traces with express by using error-handling middleware
    app.use(function middleware(error, req, res, next) {
      res.send(process.env.NODE_ENV === "debug" ? error : null).status(500);
      console.error(error);
    });

    server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Configure socket.io handler
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    io.use(auth.socketSession(db));

    io.on("connection", function handleConnection(socket) {
      console.log("Joining: " + socket.user._id.toString());
      socket.join(socket.user._id.toString());
    });

    return { server, client };
  } catch (error) {
    console.log(error);
  }
}

main().then(({ server, client }) => {
  process.on("SIGTERM", shutDown);
  process.on("SIGINT", shutDown);

  function shutDown() {
    console.log("Received kill signal, shutting down gracefully");
    server.close();
    client.close();
    process.exit(0);
  }
});
