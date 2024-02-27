import React, { useEffect, useState } from "react";
import { PDFDownloadLink, Document, Page, Text } from "@react-pdf/renderer";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import {AddPrescription} from "./AddPrescription";
const DoctorPatient = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [prescription, setPrescription] = useState(null);
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`http://localhost:5000/doctorhome/doctorappointment/${appointmentId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            token: localStorage.token,
          },
        });
        const data = await response.json();
        setAppointment(data);
      } catch (err) {
        console.error(err.message);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch appointment details. Please try again later.',
        });
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const handlePrescriptionClick = () => {
    // Generate the prescription PDF
    // const prescriptionData = generatePrescriptionData();
    // setPrescription(prescriptionData);
  };

  const handleBackClick = () => {
    // Navigate back to the appointment list page
    navigate('/doctorappointments')
  };

  const handleSendButton = () => {
    // Logic to send the prescription as a PDF to the corresponding patient ID
    // You can use libraries like react-pdf to generate the PDF
    // For demonstration, let's assume we're just logging the prescription data
    console.log("Sending prescription:", prescription);
  };

  
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Patient Details</h1>
      {appointment && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Appointment Information</h5>
            <p className="card-text"><strong>Name:</strong> {appointment.patient_name}</p>
            <p className="card-text"><strong>Doctor ID:</strong> {appointmentId}</p>
            <p className="card-text"><strong>Contact Number:</strong> {appointment.contact_no}</p>
            <p className="card-text"><strong>Type:</strong> {appointment.appointment_type}</p>
            <p className="card-text"><strong>Appointment Date:</strong> {appointment.date}</p>
            <div className="d-flex justify-content-between">
              <button className="btn btn-success" onClick={handleSendButton}>Send Prescription</button>
              <button className="btn btn-primary" onClick={() =>
  navigate(`/AddPrescription/${appointment.appointment_id}`)
}>Generate Prescription</button>

              <button className="btn btn-danger" onClick={handleBackClick}>Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPatient;
