import React, { Fragment, useEffect, useState } from "react";
import "./App.css";
import LabTest from "./component/LabTest";
import Login from "./component/Login";
import PateintAppointment from "./component/PatientAppointment";
import ProtectedPage from "./component/ProtectedPage";
import Register from "./component/Register";
import Surgery from "./component/Surgery";
import UserHome from "./component/UserHome";
import Check from "./component/Check";

import {
  Route,
  BrowserRouter as Router,
  Routes
} from "react-router-dom";


function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  async function check_Authenticated() {
    try {
      const res = await fetch("http://localhost:5000/auth/is-verify", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await res.json();
      parseRes === true ? setAuthenticated(true) : setAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    check_Authenticated();
  }, []);

  const setAuth = (bool) => {
    setAuthenticated(bool);
  };

  return (
    <Fragment>
      <div>
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
                <ProtectedPage isAuthenticated={isAuthenticated}>
                  <UserHome setAuth={setAuth} />
                </ProtectedPage>
              }
            />
            <Route
              path="/surgeries"
              element={
                <ProtectedPage isAuthenticated={isAuthenticated}>
                  <Surgery setAuth={setAuth}/>
                </ProtectedPage>
              }
            />
            <Route
              path="/tests"
              element={
                <ProtectedPage isAuthenticated={isAuthenticated}>
                  <LabTest setAuth={setAuth}/>
                </ProtectedPage>
              }
            />
            <Route 
            path="/appointments"
            element={
              <ProtectedPage isAuthenticated={isAuthenticated}>
                <PateintAppointment setAuth={setAuth} />
              </ProtectedPage> 
            }
            />
            <Route path="/check" element={<Check/>} />
          </Routes>
        </Router>
      </div>
    </Fragment>
  );
}

export default App;
