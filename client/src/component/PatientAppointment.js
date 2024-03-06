import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";

function PatientAppointment({ setAuth }) {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const appointment_data = async () => {
    const res = await fetch("http://localhost:5000/appointments", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Request-Type": "all_appointment",
        token: localStorage.token,
      },
    });
    const data = await res.json();
    setAppointments(data);
    // filterAppointmentsByStatus("pending");
    console.log(data);
  };

  const handleDelete = async (appointment_id) => {
    try {
      const res = await fetch(`http://localhost:5000/appointments`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
          appointment_id: appointment_id,
        },
      });
      const data = await res.json();
      console.log(data);
      appointment_data();
    } catch (error) {
      console.error(error.message);
    }
  };

  const filterAppointmentsByStatus = (status) => {
    setFilteredAppointments(
      appointments.filter((appointment) => appointment.status === status)
    );
  };

  // useEffect(() => {
  //   // Call appointment_data immediately after the component mounts
  //   appointment_data();
  
  //   // Set up an interval to call appointment_data every 5 seconds
  //   const intervalId = setInterval(appointment_data, 5000);
  
  //   // Clear the interval when the component unmounts
  //   return () => clearInterval(intervalId);
  // }, []);

  useEffect(() => {
     appointment_data();
  }, []);

  useEffect(() => {
    filterAppointmentsByStatus("pending");
  }, [appointments]);

  //parsing of date
  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const handleClick = (appointment) => {
    console.log(appointment);
    navigate(`/appointment/${appointment.appointment_id}`);
  };
  return (
    <Fragment>
      <NavigationBar setAuth={setAuth} />
      <div className="row mt-4 container ">
        <div className="flex" aria-label="Pending and Approved Appointments">
          <button
            type="button"
            className="btn btn-primary w-1/2"
            onClick={() => filterAppointmentsByStatus("pending")}
            style={{ color: "#000" }}
          >
            Pending Appointments
          </button>
          <button
            type="button"
            className="btn btn-success w-1/2"
            onClick={() => filterAppointmentsByStatus("approved")}
            style={{ color: "#000" }}
          >
            Approved Appointments
          </button>
        </div>
        <div className="mt-4">
        {filteredAppointments.map((appointment) => (
          <div key={appointment.appointment_id} class="col-md-12 mb-4">
            <div class="card dark:bg-slate-300">
              <div class="card-body">
                <h5 class="card-title">{appointment.doctor_name}</h5>
                {/* <h6 class="card-text">{appointment.type}</h6> */}
                <p class="card-text">{formatDate(appointment.date)}</p>
                <p class="card-text">{appointment.contact_no}</p>
                {appointment.status === "pending" ? (
                  <div>
                    <button class="btn btn-secondary position-absolute top-2 end-3 custom-btn">
                      Pending...
                    </button>
                    <button
                      class="btn btn-danger position-absolute top-12 end-3 custom-btn"
                      onClick={() => handleDelete(appointment.appointment_id)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    class="btn btn-success position-absolute top-3 end-3 custom-btn"
                    onClick={() => handleClick(appointment)}
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </Fragment>
  );
}

export default PatientAppointment;
