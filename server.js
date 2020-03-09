const express = require("express");

// Entry point or our application
async function main() {
	const app = express();

	return app.listen(8080);
}

main().then(({ server, client }) => {
  # Run the shutdown function when we receive a kill signal
  process.on("SIGTERM", shutDown);
  process.on("SIGINT", shutDown);

  function shutDown () {
    console.log("Received kill signal, shutting down gracefully");

    // close the server
    server.close();

    // close connection to Mongo
    client.close();

    // exit gracefully
    process.exit(0);
  }
});
