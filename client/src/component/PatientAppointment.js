import React, { Fragment, useState, useEffect } from "react";
import NavigationBar from "./NavigationBar";

function PatientAppointment({ setAuth }) {
  const [appointments, setAppointments] = useState([]);
  const appointment_data = async () => {
    const res = await fetch("http://localhost:5000/appointments", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Request-Type": "all_appointment",
        token: localStorage.token,
      },
    });
    const data = await res.json(); // Call the json method
    setAppointments(data);
    console.log(data);
  };
  useEffect(() => {
    appointment_data();
  }, []);
  return (
    <Fragment>
      <NavigationBar setAuth={setAuth} />
      <div className="row my-5 container ">
        {appointments.map((appointment, index) => (
          <div key={index} class="col-md-4 mb-4">
            <div class="card dark:bg-slate-300">
              <div class="card-body">
                <h5 class="card-title">{appointment.doctor_name}</h5>
                <h6 class="card-text">{appointment.type}</h6>
                <p class="card-text">{appointment.date}</p>
                <p class="card-text">{appointment.contact_no}</p>
              </div>
            </div>
          </div>
        ))}
        </div>
    </Fragment>
  );
}

export default PatientAppointment;
