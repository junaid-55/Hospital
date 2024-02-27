import React, { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BedSelection from "./BedSelection";

function OutPatientAppointmentInfo() {
  const [details, setDetails] = useState([]);
  const { id } = useParams();
  const [isBedSelected, setIsBedSelected] = useState(false);
  const [changeBedClicked, setChangeBedClicked] = useState(false);
  const [chooseBedClicked, setChooseBedClicked] = useState(false);
  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  const fetchDetails = async () => {
    console.log("Fetching details for appointment:", id);
    try {
      const res = await fetch(`http://localhost:5000/appointments/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
          type: "details",
        },
      });
      const data = await res.json();
      setDetails(data);
    } catch (error) {
      console.error("Error fetching details:", error.message);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <Fragment>
    <div className="ml-40 mt-10">
        <div className="px-4 sm:px-0">
          <h3 className="text-xl font-semibold font-mono leading-7 text-gray-900">
            Patient Information
          </h3>
          <p className="mt-1 text-lg  font-semibold font-mono max-w-2xl  leading-6 text-gray-500">
            Personalized details of this appointment...
          </p>
        </div>
        <div class="mt-6 border-t border-gray-100">
          <dl class="divide-y divide-gray-100">
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-lg font-semibold font-mono leading-6 text-gray-900">
                Doctor's Full name
              </dt>
              <dd class="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {details.doctor_name}
              </dd>
            </div>
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-lg font-semibold font-mono leading-6 text-gray-900">
                Appointment Date
              </dt>
              <dd class="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {formatDate(details.date)}
              </dd>
            </div>
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-lg font-semibold font-mono leading-6 text-gray-900">
                Doctor's Email address
              </dt>
              <dd class="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {details.doctor_email}
              </dd>
            </div>
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-lg font-semibold font-mono leading-6 text-gray-900">
                Appointment Type
              </dt>
              <dd class="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {details.appointment_type}
              </dd>
            </div>
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-lg font-semibold font-mono leading-6 text-gray-900">
                Patient's Current Type
              </dt>
              <dd class="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                Out Patient
              </dd>
            </div>
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-lg font-semibold font-mono  text-gray-900">
                Bed Details
              </dt>
              <dd class="text-base leading-10 text-gray-700 sm:col-span-2 sm:mt-0">
                {isBedSelected ? (
                  <div>
                    <button className="btn btn-success mr-2">
                      See details
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setChangeBedClicked(new Date().getTime());
                      }}
                    >
                      change Bed
                    </button>
                    {changeBedClicked && (
                      <BedSelection key={changeBedClicked} />
                    )}
                  </div>
                ) : (
                  <div>
                    <button
                      className="btn btn-primary"
                      onClick={() => setChooseBedClicked(new Date().getTime())}
                    >
                      Select Bed
                    </button>
                    {chooseBedClicked && (
                      <BedSelection key={chooseBedClicked} />
                    )}
                  </div>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </Fragment>
  );
}

export default OutPatientAppointmentInfo;
