import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Auth from './components/Auth';
import Main from './components/Main';

import 'semantic-ui-css/semantic.min.css';
import './CSS/general.css';

// App state:
// messages: an object which maps room IDs to arrays of messages
// rooms: an array of rooms for the logged in user
// session: an object that describes the currently logged in user. Has two keys:
// token and user
// users: an array of users

const App = () => {
  const [session, setSession] = useState();
  

  useEffect (() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if(token) {
      setSession({ token, user: JSON.parse(userString) });
    }
  }, []);

  useEffect (() => {
      if (session) {
        localStorage.setItem("token", session.token);
        localStorage.setItem("user", JSON.stringify(session.user));
      } else {
        localStorage.clear();
      }
    }, [session]);

    // Conditionally render the main app or the login screen accordingly
  return (
    <div>
      { session 
        ? <Main session={session} onLogout /> 
        : <Auth onAuthenticated={({ data, token }) => {setSession({ user: data, token });}} /> 
      }
    </div>
    );
}

const appNode = document.getElementById("app");
ReactDOM.render(<App />, appNode);
