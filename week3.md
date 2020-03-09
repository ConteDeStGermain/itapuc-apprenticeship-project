# Week 2

## The MERN Stack

MERN is an acronym for a commonly used stack of technologies for building web
applications:

- MongoDB (https://www.mongodb.com): a document store for the database
- Express (https://expressjs.com): a minimal web server framework for Node.js
- React (https://reactjs.org): a JavaScript library for building user interfaces
- Node (https://nodejs.org): a command line-based JavaScript runtime built
  on Chrome's V8 JavaScript engine.

Note, I recommend checking out some courses on sites such as Udemy, which can
provide a thorough overview and exploration of these technologies. Here are a
few you might consider checking out:

- https://www.udemy.com/course/the-complete-nodejs-developer-course-2/ Covers
  the development of Node.js applications with Mongo DB and express. The
  instructors are the authors of some of the most subscribed to courses on the
  site.
- https://www.udemy.com/course/react-nodejs-express-mongodb-the-mern-fullstack-guide/
  is a full course on developing MERN stack applications. When I was learning
  JavaScript and web development, I did several courses by Maximilian
  Schwarzmüller - he is one of my favourite instructors on the site.

### MongoDB

MongoDB is a document-based storage engine that is designed to work seamlessly
with JavaScript. Instead of data being stored in tables, like in a relational
database, it is organized into a set of collections of documents, which are
similar to JavaScript Objects.

For example, a MongoDB database may have a collection called "users", which
holds many documents that describe the users of a system. Each document in the
"users" collection would describe one user, and may look something like this:

```js
{
  _id: ObjectId(<Mongo-Generated 24 character hexadecimal string>),
  email: "joe@test.com",
  firstName: "Joe",
  lastName: "Test",
}
```

### Node.js

Node JS is the JavaScript runtime we will use to run the backend of the
application.  You can download the LTS version of the runtime from
https://nodejs.org

The NodeJS runtime comes with several programs, the most important of which are:

- `node`: starts the node runtime.
- `npm`: the Node Package Manager. This is used to download and install
  third-party libraries and packages which we can use to write Node
  applications.

To create a new Node.js project, first install Node.  Now, from a command line
prompt, in the folder you want to use as the project root (usually the root
folder of a git repository), run

```bash
$ npm init
```

And answer the questions the CLI prompts you with. After doing this, you should
see a file called `package.json` in your folder. This file contains the
information which describes your Node.js package (such as name, author, git
repo, dependencies, entry point file, and so on).

Here is an example `package.json` file:

```json
{
  "name": "My Application",
  "version": "1.0.0",
  "description": "This is an example Node package",
  "main": "main.js",
  "scripts": {
    "start": "node main.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/jhbertra/samle-project.git"
  },
  "author": "Jamie Bertram",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/jhbertra/samle-project/issues"
  },
  "homepage": "https://github.com/jhbertra/samle-project#readme",
  "dependencies": {
  }
}
```

`scripts` are a set of commands you can execute to run certain tasks in your
project. To run a script, you run

```bash
$ npm run <script-name>
```

`start` and `test` are special script names which can be run with the commands:

```bash
$ npm start
$ npm test
```

In other words, you can drop the `run` part. Running `npm start` will run the
command `node main.js`, which will start a new Node process, and execute the
`main.js` file.

### Node Modules and NPM

NPM is both the name of the registry for publishing and downloading JavaScript
packages (https://www.npmjs.com/), and the command line tool for managing `NPM`
packages.

What we mostly care about for this project is the ability to download and
install third-party packages which we will use to write our application.

For example, if we want to communicate with a Mongo database, there is an NPM
package which exposes the functionality we need to do this called `mongodb`. To
install this package, we run

```bash
$ npm install mongodb
```
This does 2 things:

1. It downloads the package, along with any of its dependencies, and saves
   them in a folder called `node_modules`.
2. It writes an entry to the `dependencies` object in `package.json`, which
   describes the name of the package we installed, and the version we depend on.

```json
"dependencies": {
  "mongodb": "^3.5.4"
}
```

Now, from any file in our application,
we can write

```js
const mongo = requrie("mongodb");
```

And have access to the functions exported by the `mongodb` module.

### Express

Express is a framework for creating web servers. The way you use Express is by
creating an application object with the `express()` function, and registering
handler functions for client requests.

Here is a very simple example of an Express application:

```js
const express = require("express");

const app = express();

app.get("/hello", function (req, res) {
  res.send("hi there");
});

app.listen(8080);
```

We first import the `express` NPM package:

```js
const express = require("express");
```

Then we create a new express app:

```js
const app = express();
````

We register a callback which will handle HTTP GET requests to the `/hello`
endpoint:

```js
app.get("/hello", function (req, res) {
  res.send("hi there\n");
});
```

Finally, we listen for incoming connections on port 8080.

```js
app.listen(8080);
```

To run this simple application, we save this as a javascript file (e.g.
`server.js`), and run it with `node`:

```bash
$ node server.js
```

We can now send HTTP requests to our application, and it will handle them:

```bash
$ curl http://localhost:8080/hello
hi there
```
