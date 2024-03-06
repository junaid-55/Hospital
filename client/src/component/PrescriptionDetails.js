import React, { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// Define the PrescriptionDetails component
function PrescriptionDetails() {
  const [appointment_data, setAppointment_data] = useState([]);
  const [patient_type, setPatientType] = useState("Out Patient");
  const [admit_date, setAdmitDate] = useState("");
  const [drugs, setDrugs] = useState([]);
  const [labtests, setLabTests] = useState([]);
  const { id } = useParams();

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const fetchAppointment_data = async () => {
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
      setAppointment_data(data);

      if (data.patient_type === "In_Patient") {
        setPatientType("In Patient");
        const res2 = await fetch(
          `http://localhost:5000/appointments/prescription/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: localStorage.token,
              type: "admit_date",
            },
          }
        );

        const data2 = await res2.json();
        setAdmitDate(data2.admit_date);
      }
      console.log("Details:", data);
    } catch (error) {
      console.error("Error fetching details:", error.message);
    }
  };

  const drug_data = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/appointments/prescription/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.token,
            type: "drugs",
          },
        }
      );
      const data = await res.json();
      setDrugs(data);
      console.log("Drugs:", data);
    } catch (error) {
      console.error("Error fetching drugs:", error.message);
    }
  };

  const labtest_data = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/appointments/prescription/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.token,
            type: "labtests",
          },
        }
      );
      const data = await res.json();
      setLabTests(data);
      console.log("Lab Tests:", data);
    } catch (error) {
      console.error("Error fetching lab tests:", error.message);
    }
  };

  useEffect(() => {
    fetchAppointment_data();
  }, []);

  useEffect(() => {
    drug_data();
    labtest_data();
  }, []);

  return (
    <div className="mt-4 mr-40 ml-40">
      <h2 className="text-2xl font-bold text-center">Prescription Details</h2>

      {/* Doctor's details */}

      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          <h3 className="text-lg font-bold">Doctor:</h3>
          <p className="ml-2">{appointment_data.doctor_name}</p>
        </div>
        <div className="flex items-center">
          <h3 className="text-lg font-bold">Date:</h3>
          <p className="ml-2">{formatDate(appointment_data.date)}</p>
        </div>
      </div>

      {/* Patient's details */}
      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          <h3 className="text-lg font-bold">Patient:</h3>
          <p className="ml-2">{appointment_data.patient_name}</p>
        </div>
        <div className="flex items-center">
          <h3 className="text-lg font-bold">Age:</h3>
          {/* ?age not added */}
          <p className="ml-2">42</p>
        </div>
      </div>
      <br />
      {/* Patient's type */}
      <div className="flex justify-between mt-4">
        <h3 className="text-lg font-bold w-1/4">Admit Date:</h3>
        <p className="mr-48 w-1/4">{formatDate(admit_date)}</p>
      </div>
      {/* Drug details */}
      <div className="flex justify-between items-center mt-4">
        <h3 className="text-lg font-bold w-1/4">Suggested Drugs:</h3>
        <select
          name="time_type"
          className="border  mr-48 w-1/4 rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
        >
          {drugs.map((drug) => (
            <option key={drug.name}>{drug.name}</option>
          ))}
        </select>
      </div>
      {/* Drug details */}
      <div className="flex justify-between items-center mt-4">
        <h3 className="text-lg font-bold w-1/4">Suggested Lab Test:</h3>
        <select
          name="time_type"
          className="border  mr-48 w-1/4 rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
        >
          {labtests.map((labtest) => (
            <option key={labtest.name}>{labtest.name}</option>
          ))}
        </select>
      </div>
      {/* Diagnosis details */}
      <div className="flex  mt-4">
        <h3 className="text-lg font-bold w-10">Diagnosis:</h3>
        <p className=" ml-32">{appointment_data.diagonosis}</p>
      </div>

      {/* Notes */}
      <div className="flex mt-4">
        <h3 className="text-lg font-bold w-10">Notes:</h3>
        <p className="ml-32">{appointment_data.advice}</p>
      </div>
    </div>
  );
}

export default PrescriptionDetails;
