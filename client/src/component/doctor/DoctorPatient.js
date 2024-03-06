import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const DoctorPatient = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/doctorhome/doctorappointment/${appointmentId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: localStorage.token,
            },
          }
        );
        const data = await response.json();
        setAppointment(data);
      } catch (err) {
        console.error(err.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch appointment details. Please try again later.",
        });
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const goBack = () => {
    window.history.back();
  };

  const handleSendButton = () => {
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Prescription sent successfully",
    });
  };

  return (
    <Fragment>
      <div className="ml-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 mr-2 mt-4"
          onClick={goBack}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
      </div>
      <div className="ml-40 mt-10">
        <div className="px-4 sm:px-0">
          <h3 className="text-xl font-semibold font-mono leading-7 text-gray-900">
            Patient Details
          </h3>
          <p className="mt-1 text-lg  font-semibold font-mono max-w-2xl  leading-6 text-gray-500">
            Personalized details of this appointment...
          </p>
        </div>
        {appointment && (
          <div class="mt-6 border-t border-gray-100">
            <dl class="divide-y divide-gray-100">
              <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt class="text-lg font-semibold font-mono leading-6 text-gray-900">
                  Patient Name
                </dt>
                <dd class="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {appointment.patient_name}
                </dd>
              </div>
              <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt class="text-lg font-semibold font-mono leading-6 text-gray-900">
                  Appointment Date
                </dt>
                <dd class="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {new Date(appointment.date).toDateString()}
                </dd>
              </div>
              <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt class="text-lg font-semibold font-mono leading-6 text-gray-900">
                  Patient Email
                </dt>
                <dd class="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {appointment.patient_email}
                </dd>
              </div>
              <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt class="text-lg font-semibold font-mono leading-6 text-gray-900">
                  Appointment Type
                </dt>
                <dd class="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {appointment.appointment_type}
                </dd>
              </div>
              <div className="flex justify-center">
                <button className="btn btn-success w-1/4 mr-20" onClick={handleSendButton}>
                  Send Prescription
                </button>
                <button
                  className="btn btn-primary w-1/4"
                  onClick={() =>
                    navigate(`/AddPrescription/${appointment.appointment_id}`)
                  }
                >
                  Generate Prescription
                </button>
              </div>
            </dl>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default DoctorPatient;
