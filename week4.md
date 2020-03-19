# Week 4 - API design

This week will focus on building the REST API for the application. Although I
know you're already familiar with REST, I've typed up a brief recap of REST and
HTTP below.

## HTTP

HTTP, or *H*yper*t*ext *T*ransfer *P*rotocol, is an application-level networking
protocol which was designed primarily to implement the world-wide-web. HTTP is a
client-server protocol and specifies a plain-text-based request / response
format.

In HTTP a, client application sends a `request` to a server application, which
sends a `response`.  Examples of client applications include:

- Web borwsers
- Command line utilities like `curl`
- So-called graphical "REST clients" like Postman or Insomnia which are simply
  HTTP clients with specialized features for automation and scripting that take
  advantage of REST conventions.
- Web application fontends like browser-based web apps, desktop clients, and
  mobile apps.

Examples of server applications include:

- Configurable HTTP server software like Apache or Nginx
- Web app servers that expose an API used to control access to some underlying 
  resource like a database.

HTTP is not tied to any one piece of software. It is just a set of rules for how
two pieces of software that implement the protocol are supposed to interact. All
that is needed to implement HTTP is a network connection, via TCP.

You can read all about HTTP at
https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages

## REST

REST, or *Re*presentational *S*tate *T*ransfer is a set of conventions for
writing networked user applications which are primarily focused on creating,
reading and modifying document-like data. It uses HTTP to do this, and data is
typically encoded using JSON. It is *not* a protocol, but rather a set of
conventions and best practices. REST treats data like files, and makes use of
HTTP's resource-oriented nature to do so.

You can read more about REST APIs here: https://restfulapi.net/ - I highly
recommend reading through all the information on this site, as it very
comprehensivvely describes the pronciples of building REST APIs.

## You Task

Your task this week is to build out the API for the `users` collection. You can
use the `user.js` file as a starting point, and refer to `api.md` for the API
specification. Please refer to express.js and Mongo DB documentation as you fill
in the blanks. As this is the first API, I've created a pretty complete skeleton
of the file for you to start with, and indications of where to fill in the
blanks.

In order to mount this API on the express application, you will need to make the
following modification to `server.js`:

```diff
const express = require("express");
const connect = require("./db");
+ const users = require("./api/users.js");
```

```diff
async function main() {
  try {
    const app = express();

    const { db, client } = await connect();

    // Note how I pass the DB dependency to the users module. The users API
    // needs access to the database connection. Rather than have it resolve
    // its own reference staticalluy, (e.g. by a call to "require("../db");),
    // we pass it down from the calling code. This is called dependency
    // injection, and it is one of the universal principles of clean
    // architecture.
+    app.use(users(db));

    const server = app.listen(8082, () => {
      console.log('Server is listening on port 8082')
    });

    return { server, client };
  } catch(error) {
    console.log(error);
  }
}
```
