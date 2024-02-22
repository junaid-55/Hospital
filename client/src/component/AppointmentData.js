import React, { Fragment, useState, useEffect } from "react";
import NavigationBar from "./NavigationBar";
import { useParams } from "react-router-dom";
import OutPatientAppointmentInfo from "./OutPatientAppointmentInfo";
import PrescriptionDetails from "./PrescriptionDetails";
import BillDetails from "./BillDetails";
function AppointmentData() {
  const [detailsButton, setDetailsButton] = useState(true);
  const [prescriptionButton, setPrescriptionButton] = useState(false);
  const [billButton, setBillButton] = useState(false);
  const detailsButtonClicked = () => {
    setDetailsButton(true);
    setPrescriptionButton(false);
    setBillButton(false);
  };
  const prescriptionButtonClicked = () => {
    setDetailsButton(false);
    setPrescriptionButton(true);
    setBillButton(false);
  };
  const billButtonClicked = () => {
    setDetailsButton(false);
    setPrescriptionButton(false);
    setBillButton(true);
  };
  useEffect(() => {
    detailsButtonClicked();
  }, []);
  const [details, setDetails] = useState([]);
  const { id } = useParams();
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
          type: details,
        },
      });
      const data = await res.json();
      setDetails(data);
      console.log("Details:", data);
    } catch (error) {
      console.error("Error fetching details:", error.message);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <Fragment>
      {/* <NavigationBar /> */}
      {/* <div className="bg-gradient-to-r from-violet-300 to-indigo-300"> */}
        <div>
          <div className="p-6 mt-4 mr-40 ml-40  rounded-md shadow-sm cursor-pointer bg-gradient-to-r from-violet-100 to-indigo-100 hover:from-violet-200 hover:to-indigo-200 border-violet-200 border-2 hover:border-violet-300 transition-colors duration-300">
            <div className="flex justify-between mb-4">
              <button
                className={`btn w-1/2 ml-2 ${
                  detailsButton ? "btn-primary" : "btn-secondary"
                }`}
                onClick={detailsButtonClicked}
              >
                Details
              </button>
              <button
                className={`btn w-1/2 ml-2 ${
                  prescriptionButton ? "btn-primary" : "btn-secondary"
                }`}
                onClick={prescriptionButtonClicked}
              >
                Prescription
              </button>
              <button
                className={`btn w-1/2 ml-2 ${
                  billButton ? "btn-primary" : "btn-secondary"
                }`}
                onClick={billButtonClicked}
              >
                Bill
              </button>
            </div>
            {detailsButton && <OutPatientAppointmentInfo />}
            {prescriptionButton && <PrescriptionDetails />}
            {billButton && <BillDetails />}
          </div>
        </div>
    </Fragment>
  );
}
export default AppointmentData;
