import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import NavigationBar from "./DoctorNavigationBar";

function DoctorAppointments({ setAuth }) {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const navigate = useNavigate();
  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/doctorhome/doctor-appointments`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.token,
          },
        }
      );
      const data = await response.json();
      setAppointments(data);
      filterAppointmentsByStatus("pending");

    } catch (err) {
      console.error(err.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch appointments. Please try again later.oooo",
      });
    }
  };

  const approveAppointment = async (appointmentId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/doctorhome/approve/${appointmentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.token,
          },
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Appointment approved successfully",
        });
      } else {
        throw new Error("Failed to approve appointment");
      }
    } catch (err) {
      console.error(err.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to approve appointment. Please try again later.",
      });
    }
  };

  const pendingAppointmentsClicked = () => {
    filterAppointmentsByStatus("pending");
  };

  const approvedAppointmentsClicked = () => {
    filterAppointmentsByStatus("approved");
  };

  const filterAppointmentsByStatus = (status) => {
    setFilteredAppointments(
      appointments.filter((appointment) => appointment.status === status)
    );
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointmentsByStatus("approved");
  }, [appointments]);

  return (
    <Fragment>
      <NavigationBar setAuth={setAuth} />
      <div className="container">
        <div className="py-4">
          <div className="flex" aria-label="Pending and Approved Appointments">
            <button
              type="button"
              className="btn btn-primary w-1/2"
              onClick={pendingAppointmentsClicked}
              style={{ color: "#000" }}
            >
              Pending Appointments
            </button>
            <button
              type="button"
              className="btn btn-success w-1/2"
              onClick={approvedAppointmentsClicked}
              style={{ color: "#000" }}
            >
              Approved Appointments
            </button>
          </div>
          <div className="mt-4">
            {filteredAppointments.map((appointment, index) => (
              <div className="col-md-12 mb-4" key={index}>
                <div className="card dark:bg-slate-300">
                  <div className="card-body">
                    <h5 className="card-title">
                      <span style={{ fontWeight: "bold" }}>Patient Name:</span>
                      <span className="ml-10">{appointment.patient_name}</span>
                    </h5>
                    <h5 className="card-title">
                      <span style={{ fontWeight: "bold" }}>
                        Appointment Date:
                      </span>
                      <span className="ml-2">
                        {formatDate(appointment.appointment_date)}
                      </span>
                    </h5>
                    <div>
                      {appointment.status === "pending" ? (
                        <button
                          className="btn btn-secondary position-absolute top-3 end-3 mt-2 custom-btn"
                          onClick={() =>
                            approveAppointment(appointment.appointment_id)
                          }
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          className="btn btn-success position-absolute top-3 end-3 custom-btn"
                          onClick={() => {
                            navigate(
                              `/DoctorPatient/${appointment.appointment_id}`
                            );
                          }}
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default DoctorAppointments;
