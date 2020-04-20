import React, { useState } from "react";
import ReactDOM from "react-dom";

// App state:
// messages: an object which maps room IDs to arrays of messages
// rooms: an array of rooms for the logged in user
// session: an object that describes the currently logged in user. Has two keys:
// token and user
// users: an array of users

function App() {
  const [messages, setMessages] = useState({});
  const [rooms, setRooms] = useState([]);
  const [session, setSession] = useState();
  const [users, setUsers] = useState([]);

  return <div>Write the app here</div>;
}

const appNode = document.getElementById("app");
ReactDOM.render(<App />, appNode);
