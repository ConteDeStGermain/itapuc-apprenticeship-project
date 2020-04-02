const bodyParser = require("body-parser");
const connect = require("./db");
const express = require("express");
const morgan = require("morgan");
const users = require("./api/users");
const rooms = require("./api/rooms.js");

// Entry point or our application
async function main() {
  try {
    const app = express();

    // Avoid sending stack traces with expressb by using a middleware
    app.use(morgan('tiny'));
    app.use(bodyParser.json());

    const { db, client } = await connect();

    app.use("/users", users(db));
    app.use("/rooms", rooms(db));

    app.use(function middleware(error, req, res, next ) { //<- this is a middleware
      res.send(process.env.NODE_ENV === 'debug' ? error: null).status(500);
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
