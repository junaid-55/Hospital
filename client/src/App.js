import React, { Fragment, useEffect, useState } from "react";
import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
  json,
} from "react-router-dom";

import Login from "./component/Login";
import Register from "./component/Register";
import UserHome from "./component/UserHome";

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
   async function check_Authenticated (){
    try {
      console.log(localStorage.token);
      const res = await fetch("http://localhost:5000/auth/is-verify", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await res.json();
      parseRes === true ? setAuthenticated(true) : setAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(()=>{
    check_Authenticated();
  },[]);

  const setAuth = (bool) => {
    setAuthenticated(bool);
  };

  return (
    <Fragment>
      <div className="container">
        <Router>
          <Routes>
            <Route
              path="/auth/login"
              element={
                !isAuthenticated ? (
                  <Login setAuth={setAuth} />
                ) : (
                  <UserHome setAuth={setAuth} />
                )
              }
            />
            <Route
              path="/auth/register"
              element={
                !isAuthenticated ? (
                  <Register setAuth={setAuth} />
                ) : (
                  <Login setAuth={setAuth} />
                )
              }
            />
            <Route
              path="/userhome/"
              element={
                isAuthenticated ? (
                  <UserHome setAuth={setAuth} />
                ) : (
                  <Login setAuth={setAuth} />
                )
              }
            />
          </Routes>
        </Router>
      </div>
    </Fragment>
  );
}

export default App;
