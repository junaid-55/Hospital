import React, { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BedSelection from "./BedSelection";

function OutPatientAppointmentInfo() {
  const [details, setDetails] = useState([]);
  const { id } = useParams();
  const [patient_type, setPatientType] = useState("Out Patient");
  const [isBedSelected, setIsBedSelected] = useState(false);
  const [changeBedClicked, setChangeBedClicked] = useState(false);
  const [chooseBedClicked, setChooseBedClicked] = useState(false);
  const [bedDetails, setBedDetails] = useState([]);
  const keysToDisplay = ["type_name","ac_type", "price","occupying_date", "description"];
  const [isOpened, setIsOpened] = useState(false);
  const closeModal = () => setIsOpened(false);
  const openModal = () => {
    console.log("Opening modal");
    setIsOpened(true);
  };
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
      if (data.patient_type === "In_Patient") {
        setPatientType("In Patient");
      }
      console.log("Details fetched:", data);
    } catch (error) {
      console.error("Error fetching details:", error.message);
    }
  };

  const fetchBedDetails = async () => {
    console.log("Fetching bed details for appointment:", id);
    try {
      const res = await fetch(
        `http://localhost:5000/appointments/bed_selection/${"bed_details"}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.token,
            criteria: "bed_details",
            appointment_id: id,
          },
        }
      );
      const data = await res.json();
      console.log("Bed details fetched:", data);
      if (data.length > 0) {
        setIsBedSelected(true);
        setBedDetails(data[0]);
      }
    } catch (error) {
      console.error("Error fetching bed details:", error.message);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  useEffect(() => {
    fetchBedDetails();
  }, [changeBedClicked, chooseBedClicked]);
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
                {patient_type}
              </dd>
            </div>
            {patient_type === "In Patient" && (
              <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt class="text-lg font-semibold font-mono  text-gray-900">
                  Bed Details
                </dt>
                <dd class="text-base leading-10 text-gray-700 sm:col-span-2 sm:mt-0">
                  {isBedSelected ? (
                    <div>
                      <button
                        className="btn btn-success mr-2"
                        onClick={openModal}
                      >
                        See details
                      </button>
                      {isOpened && (
                        <div className="fixed inset-0 z-10 overflow-y-auto">
                          <div className="absolute inset-0 bg-gray-500 bg-opacity-80 transition-opacity flex items-center justify-center">
                            <div
                              className="relative w-full  bg-white p-6 rounded-md"
                              style={{ width: "70%", height: "60%" }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <button
                                  className="btn btn-danger mb-2"
                                  style={{ width: "8%" }}
                                  onClick={closeModal}
                                >
                                  x
                                </button>
                              </div>
                              {keysToDisplay.map((key) => (
                                <div class="mt-1 border-t border-gray-100">
                                  <dl class="divide-y divide-gray-100">
                                    <div class="px-2 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                      <dt class="text-lg font-semibold font-mono leading-2 text-gray-900">
                                        {key.charAt(0).toUpperCase() +
                                          key.slice(1)}
                                      </dt>
                                      <dd class="mt-1 text-base leading-2 text-gray-700 sm:col-span-2 sm:mt-0">
                                      {key === 'occupying_date' ? formatDate(bedDetails[key]) : bedDetails[key]}
                                      </dd>
                                    </div>
                                  </dl>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
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
                        onClick={() =>
                          setChooseBedClicked(new Date().getTime())
                        }
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
            )}
          </dl>
        </div>
      </div>
    </Fragment>
  );
}

export default OutPatientAppointmentInfo;
