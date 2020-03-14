const express = require("express");
const connect = require("./db");

// Entry point or our application
async function main() {
  try {
    const app = express();

    const { db, client } = await connect();

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
