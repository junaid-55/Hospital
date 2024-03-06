import React, { Fragment, useEffect, useState } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import AppointmentData from "./component/AppointmentData";
import Check from "./component/Check";
import LabTest from "./component/LabTest";
import Login from "./component/Login";
import PateintAppointment from "./component/PatientAppointment";
import ProtectedPage from "./component/ProtectedPage";
import Register from "./component/Register";
import Surgery from "./component/Surgery";
import UserHome from "./component/UserHome";
import AdminHome from "./component/admin/AdminHome";
import DrugAdminstration from "./component/admin/DrugAdminstration";
import LabTestAdminstration from "./component/admin/LabTestAdminstration";
import Reports from "./component/admin/Reports";
import AddPrescription from "./component/doctor/AddPrescription";
import DoctorAppointments from "./component/doctor/DoctorAppointments";
import DoctorHome from "./component/doctor/DoctorHome";
import DoctorPatient from "./component/doctor/DoctorPatient";

function AuthenticatedRoutes({ setAuth, isAuthenticated }) {
  const navigate = useNavigate();

  useEffect(() => {
    async function check_Authenticated() {
      try {
        const res = await fetch("http://localhost:5000/auth/is-verify", {
          method: "GET",
          headers: { token: localStorage.token },
        });

        const parseRes = await res.json();
        parseRes === true ? setAuth(true) : setAuth(false);

        //navigate to the home page based on the user type
        // if (parseRes === true) {
        //   console.log("Authenticated");
        //   isAuthenticated = true;
        //   if (localStorage.getItem("user_type") === "Admin") {
        //     navigate("/adminhome");
        //   } else if (localStorage.getItem("user_type") === "Doctor") {
        //     console.log("Doctor");
        //     navigate("/doctorhome");
        //   } else if (localStorage.getItem("user_type") === "Patient") {
        //     navigate("/userhome");
        //   }
        // }
      } catch (err) {
        console.error(err.message);
      }
    }
    check_Authenticated();
  }, [navigate, setAuth]);
}

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const setAuth = (bool) => {
    setAuthenticated(bool);
  };
  return (
    <Fragment>
      <div>
        <Router>
          <AuthenticatedRoutes
            setAuth={setAuth}
            isAuthenticated={isAuthenticated}
          />
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
                  <Surgery setAuth={setAuth} />
                </ProtectedPage>
              }
            />
            <Route
              path="/tests"
              element={
                <ProtectedPage isAuthenticated={isAuthenticated}>
                  <LabTest setAuth={setAuth} />
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
            <Route
              path="/doctorhome"
              element={
                !isAuthenticated ? (
                  <Login setAuth={setAuth} />
                ) : (
                  <DoctorHome setAuth={setAuth} />
                )
              }
            />
            <Route
              path="/doctorappointments"
              element={
                <ProtectedPage isAuthenticated={isAuthenticated}>
                  <DoctorAppointments setAuth={setAuth} />
                </ProtectedPage>
              }
            />
            <Route
              path="/DoctorPatient/:appointmentId"
              element={
                <ProtectedPage isAuthenticated={isAuthenticated}>
                  <DoctorPatient setAuth={setAuth} />
                </ProtectedPage>
              }
            />
            <Route
              path="/AddPrescription/:appointmentId"
              element={
                <ProtectedPage isAuthenticated={isAuthenticated}>
                  <AddPrescription setAuth={setAuth} />
                </ProtectedPage>
              }
            />

            <Route path="/appointment/:id" element={<AppointmentData />} />

            {/* This Paths has some issues with setAuth  */}
            <Route
              path="/adminhome"
              element={<AdminHome setAuth={setAuth} />}
            />
            <Route
              path="/adminhome/lab-test-administration"
              element={<LabTestAdminstration setAuth={setAuth} />}
            />
            <Route
              path="/adminhome/drug-administration"
              element={<DrugAdminstration setAuth={setAuth} />}
            />
            <Route
              path="/adminhome/reports"
              element={<Reports setAuth={setAuth} />}
            />
            <Route path="/check" element={<Check />} />
          </Routes>
        </Router>
      </div>
    </Fragment>
  );
}

export default App;
