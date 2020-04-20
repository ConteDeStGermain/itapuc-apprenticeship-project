import React, { useState } from "react";
import ReactDOM from "react-dom";
import Login from './components/Login';

// App state:
// messages: an object which maps room IDs to arrays of messages
// rooms: an array of rooms for the logged in user
// session: an object that describes the currently logged in user. Has two keys:
// token and user
// users: an array of users

const App = () => {
  const [messages, setMessages] = useState({});
  const [rooms, setRooms] = useState([]);
  const [session, setSession] = useState();
  const [users, setUsers] = useState([]);

  return (
    <div>
      <Login />
    </div>
    );
}

const appNode = document.getElementById("app");
ReactDOM.render(<App />, appNode);
