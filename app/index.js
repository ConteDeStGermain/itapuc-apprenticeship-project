import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Auth from './components/Auth';
import Main from './components/Main';

import 'semantic-ui-css/semantic.min.css';
import './CSS/general.css';

const apiHost = process.env.API_HOST || "http://localhost:8082";

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
        ? <Main apiHost={apiHost} session={session} onLogout={ () => setSession(null) } /> 
        : <Auth apiHost={apiHost} onAuthenticated={({ data, token }) => {setSession({ user: data, token });}} /> 
      }
    </div>
    );
}

const appNode = document.getElementById("app");
ReactDOM.render(<App />, appNode);
