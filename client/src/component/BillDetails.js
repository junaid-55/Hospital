import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function BillDetails() {
  const [appointment_data, setAppointment_data] = useState([]);
  const [drug_data, setDrug_data] = useState([]);
  const [labtest, setLabTest] = useState([]);
  const [bills, setBills] = useState([]);
  const [isPaid, setIsPaid] = useState(false);
  const { id } = useParams();

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
      console.log("Details:", data);
    } catch (error) {
      console.error("Error fetching details:", error.message);
    }
  };

  const BillDetails = async () => {
    console.log("Fetching details for bills:", id);
    try {
      const res = await fetch(`http://localhost:5000/bill/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
        },
      });
      const data = await res.json();
      setBills(data);
      console.log("Details:", data);
    } catch (error) {
      console.error("Error fetching details:", error.message);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handlePayBill = () => {
    setIsPaid(true);
  };

  useEffect(() => {
    fetchAppointment_data();
  }, []);

  useEffect(() => {
    BillDetails();
  }, []);

  return (
    <Fragment>
      <h2
        className="text-2xl font-bold text-center"
        style={{ fontSize: "30px" }}
      >
        Bill Details
      </h2>
      {/* Bill details */}
      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          <h3 className="text-lg font-bold">Bill ID:</h3>
          <p className="ml-2"> --------- </p>
        </div>
        <div className="flex items-center">
          <h3 className="text-lg font-bold">Date:</h3>
          {isPaid ? (
            <p className="ml-2">12th May, 2021</p>
          ) : (
            <p className="ml-2"> --------- </p>
          )}
        </div>
      </div>
      {/* Patient's details */}
      <div className="flex justify-between mt-2">
        <div className="flex items-center">
          <h3 className="text-lg font-bold">Patient:</h3>
          <p className="ml-2">{appointment_data.patient_name}</p>
        </div>
        <div className="flex items-center">
          <h3 className="text-lg font-bold">Age:</h3>
          <p className="ml-2">42</p>
        </div>
      </div>
      <div className="flex mt-2">
        <h3 className="text-lg font-bold mt-1">Bill Status:</h3>
        {isPaid ? (
          <button className="btn btn-success ml-10 w-36">Paid</button>
        ) : (
          <Fragment>
            <button className="btn btn-danger ml-10 w-36">Not Paid</button>
            <button
              className="btn btn-primary ml-4 w-36"
              onClick={handlePayBill}
            >
              Pay Bill
            </button>
          </Fragment>
        )}
      </div>
      <br />
      {/* Bill details */}
      <h3
        className="text-lg font-bold text-center"
        style={{ fontSize: "25px" }}
      >
        Bills
      </h3>{" "}
      <div className="mt-4">
        {bills.map((bill) => (
          <div className="flex justify-between">
            <Fragment>
              <h3 className="text-lg font-bold ">{bill.type}</h3>
              {/* <p className=""> ------------------------------------- </p> */}
              <p className="ml-2">{bill.fee}</p>
            </Fragment>
          </div>
        ))}
      </div>
      {/* Payment status */}
      <div className="flex justify-end mt-4">
        <h3 className="text-lg font-bold w-1/3 mr-32 text-right">Bill:</h3>
        <p className="ml-2">{bills[0] && bills[0].fee}</p>
      </div>
    </Fragment>
  );
}

export default BillDetails;
