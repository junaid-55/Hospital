import React, { Fragment, useState, useEffect } from "react";
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

  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    detailsButtonClicked();
  }, []);
  return (
    <Fragment>
      <div>
        <div className="p-6 mt-4 mr-40 ml-40  rounded-md shadow-sm cursor-pointer bg-gradient-to-r from-violet-100 to-indigo-100 hover:from-violet-200 hover:to-indigo-200 border-violet-200 border-2 hover:border-violet-300 transition-colors duration-300">
          <div className="flex justify-between items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 mr-2 ml-4"
              onClick={goBack}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>

            <button
              className={`btn ${
                detailsButton ? "btn-dark" : "btn-secondary"
              }`}
              style={{ width: "30%"} }
              onClick={detailsButtonClicked}
            >
              Details
            </button>
            <button
              className={`btn w-1/4 ${
                prescriptionButton ? "btn-dark" : "btn-secondary"
              }`}
              style={{ width: "30%"} }
              onClick={prescriptionButtonClicked}
            >
              Prescription
            </button>
            <button
              className={`btn w-1/4 ${
                billButton ? "btn-dark" : "btn-secondary"
              }`}
              style={{ width: "30%"} }
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