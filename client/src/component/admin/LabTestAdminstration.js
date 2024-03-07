import React, { Fragment, useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import AdminNavigationBar from "./AdminNavigationBar";

function LabTestAdminstration({ setAuth }) {
  const [isOpen, setIsOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [tests, setTests] = useState([]);
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const fetchPatients = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/lab-test-administration",
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );
      const parseRes = await response.json();
      setPatients(parseRes);
      console.log(parseRes);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchTests = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/lab-test-administration/${id}`,
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );
      const parseRes = await response.json();
      setTests(parseRes);
      console.log(parseRes);
    } catch (err) {
      console.error(err.message);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleSaveResult = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // const fileURL = URL.createObjectURL(file);
      // const link = document.createElement('a');
      // link.href = fileURL;
      // link.download = file.name;
      // link.click();
      setFile(file);
      console.log(file);
    }
    console.log("Test conducted");
  };

  const handleEnterResult = async (appointment_id, test_id) => {
    try {
      const response = await fetch(
        "http://localhost:5000/lab-test-administration/enter_result",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.token,
          },
          body: JSON.stringify({ test_result: file, appointment_id, test_id }),
        }
      );
      const parseRes = await response.json();
      console.log(parseRes);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <Fragment>
      <AdminNavigationBar setAuth={setAuth} />
      <div className="row mt-3 container">
        <div className="flex justify-between mb-3">
          <button className="btn btn-primary w-1/2 mr-5">In Patient</button>
          <button className="btn btn-dark w-1/2">Out Patient</button>
        </div>
        {patients.map((patient) => (
          <div className="col-md-12 mb-4 " key={patient.appointment_id}>
            <div className="card dark:bg-slate-300">
              <div className="card-body">
                <h5 className="card-title">
                  <strong>Appointment id : </strong>
                  <span className="patient-name">{patient.appointment_id}</span>
                </h5>
                <h5 className="card-title">
                  <strong>Patient Name: </strong>
                  <span className="patient-name">{patient.patient_name}</span>
                </h5>
                <p className="card-text">
                  <strong>Doctor Name: </strong>
                  <span className="doctor-name">{patient.doctor_name}</span>
                </p>
                <button
                  onClick={() => {
                    openModal();
                    fetchTests(patient.appointment_id);
                  }}
                  className="btn btn-outline-success position-absolute top-3 end-3 mt-2 custom-btn"
                >
                  Conduct Test
                </button>
              </div>
              {isOpen && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                  <div className="absolute inset-0 bg-gray-500 bg-opacity-80 transition-opacity flex items-center justify-center">
                    <div
                      className="relative w-full  bg-white p-6 rounded-md"
                      style={{ width: "70%", height: "60%" }}
                    >
                      <button
                        onClick={closeModal}
                        className="btn btn-danger w-20"
                      >
                        x
                      </button>
                      {tests.map((test) => (
                        <div
                          className="col-md-12 mb-4 mt-4 "
                          key={test.test_id}
                        >
                          <div className="card dark:bg-slate-300">
                            <div className="card-body d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                <h5 className="card-title mr-3">{test.name}</h5>
                              </div>
                              <div className="flex align-items-center">
                                <input
                                  type="file"
                                  className="rounded"
                                  onChange={handleSaveResult}
                                />
                                {/* {file && typeof window !== "undefined" && (
                                  <Document
                                    file={file}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                  >
                                    <Page pageNumber={pageNumber} />
                                  </Document>
                                )} */}
                                <button
                                  className="btn btn-outline-dark custom-btn"
                                  onClick={() =>
                                    handleEnterResult(
                                      patient.appointment_id,
                                      test.test_id
                                    )
                                  }
                                >
                                  Enter Result
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
}

export default LabTestAdminstration;
