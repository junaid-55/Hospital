import React, { Fragment, useEffect, useState } from "react";
import AdminNavigationBar from "./AdminNavigationBar";
import Swal from "sweetalert2";
function DrugAdminstration({ setAuth }) {
  const [patients, setPatients] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [counters, setCounters] = useState({});
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const fetchPatients = async () => {
    try {
      console.log("fetching patients");
      const res = await fetch("http://localhost:5000/drug-administration", {
        method: "GET",
        headers: { token: localStorage.token },
      });
      const data = await res.json();
      setPatients(data);
      console.log(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchDrugs = async (appointment_id) => {
    try {
      console.log("fetching drugs");
      const res = await fetch(
        `http://localhost:5000/drug-administration/${appointment_id}`,
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );
      const data = await res.json();
      console.log(data);
      setDrugs(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const formattedDosage = (dosage) => {
    console.log("New dosage", dosage);
    if (dosage === null) return "No dosage available";
    dosage = dosage.replace(/\{/g, "[").replace(/\}/g, "]");
    console.log(dosage);
    dosage = JSON.parse(dosage);
    console.log("New dosage", dosage);
    let formattedDosage = dosage.map((dose, index) => {
      switch (index) {
        case 0:
          return dose === "1" ? "Morning: Yes," : "Morning: No,";
        case 1:
          return dose === "1" ? "Afternoon: Yes," : "Afternoon: No,";
        case 2:
          return dose === "1" ? "Evening: Yes" : "Evening: No";
        default:
          return "";
      }
    });
    return formattedDosage;
  };
  const decrementCounter = (drug_id) => {
    setCounters((prevCounters) => ({
      ...prevCounters,
      [drug_id]: Math.max((prevCounters[drug_id] || 0) - 1, 0),
    }));
  };

  const incrementCounter = (drug_id) => {
    setCounters((prevCounters) => ({
      ...prevCounters,
      [drug_id]: (prevCounters[drug_id] || 0) + 1,
    }));
  };

  const handleGive = async(drug_id,appointment_id) => {
    // closeModal();
    console.log(appointment_id,drug_id)
    try {
      const res = await fetch("http://localhost:5000/drug-administration/give", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
        },
        body: JSON.stringify({
          drug_id: drug_id,
          count: counters[drug_id],
          appointment_id: appointment_id,
        }),
      });
      // const data = await res.json();
      // console.log(data);
      if(res.status === 200){
        Swal.fire({
          icon: "success",
          title: "Medicine given successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        // fetchDrugs(appointment_id);
      }
    }
    catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);
  return (
    <Fragment>
      <AdminNavigationBar setAuth={setAuth} />
      <div className="row mt-5 container">
        <div className="col-md-12 mb-4 ">
          {patients.map((patient) => (
            <div key={patient.appointment_id} className="mt-2">
              <div className="card dark:bg-slate-300">
                <div className="card-body">
                  <h5 className="card-title">
                    <strong>Appointment id : </strong>
                    <span className="patient-name">
                      {patient.appointment_id}
                    </span>
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
                      fetchDrugs(patient.appointment_id);
                    }}
                    className="btn btn-outline-success position-absolute top-3 end-3 mt-2 custom-btn"
                  >
                    Give Medicine
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
                        {drugs.map((drug) => (
                          <div
                            className="col-md-12 mb-4 mt-4 "
                            key={drug.drug_id}
                          >
                            <div className="card dark:bg-slate-300">
                              <div className="card-body d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  <h5 className="card-title mr-3">
                                    {drug.name}
                                  </h5>
                                  <p className="card-text mb-1 ml-32">
                                    {formattedDosage(drug.dosage)}
                                  </p>
                                </div>
                                <div className="d-flex align-items-center">
                                  <input
                                    type="text"
                                    value={counters[drug.drug_id] || 0}
                                    readOnly
                                    key={drug.drug_id}
                                    className="form-control mr-2 rounded"
                                    style={{ width: "50px" }}
                                  />
                                  <button
                                    onClick={() =>
                                      decrementCounter(drug.drug_id)
                                    }
                                    className="btn btn-primary custom-btn mr-2"
                                    key={drug.drug_id}
                                    style={{
                                      width: "20%",
                                      fontSize: "0.8rem",
                                      padding: "0.5rem 0.5rem",
                                    }}
                                  >
                                    -1
                                  </button>
                                  <button
                                    onClick={() =>
                                      incrementCounter(drug.drug_id)
                                    }
                                    key={drug.drug_id}
                                    className="btn btn-primary custom-btn mr-2  w-2"
                                    style={{
                                      width: "20%",
                                      fontSize: "0.8rem",
                                      padding: "0.5rem 0.5rem",
                                    }}
                                  >
                                    +1
                                  </button>
                                  <button
                                    key={drug.drug_id}
                                    className="btn btn-success custom-btn"
                                    onClick={() => handleGive(drug.drug_id,patient.appointment_id)}
                                  >
                                    Give
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
      </div>
    </Fragment>
  );
}

export default DrugAdminstration;
