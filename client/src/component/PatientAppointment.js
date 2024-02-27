import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";

function PatientAppointment({ setAuth }) {
  const navigate = useNavigate();
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
    const data = await res.json();
    setAppointments(data);
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

  useEffect(() => {
    appointment_data();
  }, []);

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
      <div className="row my-5 container ">
        {appointments.map((appointment, index) => (
          <div key={appointment.appointment_id} class="col-md-12 mb-4">
            <div class="card dark:bg-slate-300">
              <div class="card-body">
                <h5 class="card-title">{appointment.doctor_name}</h5>
                {/* <h6 class="card-text">{appointment.type}</h6> */}
                <p class="card-text">{formatDate(appointment.date)}</p>
                <p class="card-text">{appointment.contact_no}</p>
                {!appointment.status === "pending" ? (
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
    </Fragment>
  );
}

export default PatientAppointment;
