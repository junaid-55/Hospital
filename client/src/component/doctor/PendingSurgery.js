import React, { Fragment, useState, useEffect } from 'react';
import NavigationBar from './DoctorNavigationBar';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import DoctorPatient from './DoctorPatient';

function PendingSurgery({ setAuth }) {
  const [showSurgeries, setShowSurgeries] = useState(false);
  const [surgeries, setSurgeries] = useState([]);
  const [appointmentId, setDoctorId] = useState(null); // State to store doctor ID
  const [approvedSurgeries, setApprovedSurgeries] = useState([]);
  const [showapprovedSurgeries, setShowApprovedSurgeries] = useState(false);

  const navigate = useNavigate();

  const fetchDoctorId = async () => {
    try {
      const response = await fetch('http://localhost:5000/doctorhome', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.token,
        },
      });
      const data = await response.json();
      setDoctorId(data.doctor_id); // Set doctor ID from backend response
    } catch (err) {
      console.error(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch doctor ID. Please try again later.',
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchDoctorId(); // Wait for fetchDoctorId to complete
      // Now appointmentId should be properly set
      fetchSurgeries();
      fetchApprovedSurgeries(appointmentId); // Fetch surgeries after appointmentId is set
    };
    fetchDoctorId(); // Fetch doctor ID from backend
  }, []);

  const fetchSurgeries = async () => {
    try {
      const response = await fetch(`http://localhost:5000/doctorhome/doctor-surgeries`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.token,
        },
      });
      const data = await response.json();
      setSurgeries(data);
      setShowSurgeries(true);
      setShowApprovedSurgeries(false);
    } catch (err) {
      console.error(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch surgeries. Please try again later.',
      });
    }
  };

  const fetchApprovedSurgeries = async (appointmentId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/doctorhome/doctor-approvedsurgeries/${appointmentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.token,
        },
      });
      const data = await response.json();
      setApprovedSurgeries(data);
      setShowApprovedSurgeries(true);
      setShowSurgeries(false);
    } catch (err) {
      console.error(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch surgeries. Please try again later.',
      });
    }
  };

  const deleteFromPending = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:5000/doctorhome/delete/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.token,
        },
      });
    } catch (err) {
      console.error(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete surgery. Please try again later.',
      });
    }
  };

  const approvedsurgeries = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:5000/doctorhome/approvesurg/${appointmentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.token,
        },
      });

      if (response.ok) {
        // If the request was successful, fetch updated surgeries
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Appointment approved successfully',
        });
        deleteFromPending(appointmentId);
        fetchSurgeries(appointmentId, 'pending');
      } else {
        throw new Error('Failed to approve surgery');
      }
    } catch (err) {
      console.error(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to approve surgery. Please try again later.',
      });
    }
  };

  const handleAddDoctor = async () => {
    // Function to handle saving doctor information
  };

  const viewAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:5000/surgeries/${appointmentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.token,
        },
      });
      const data = await response.json();
      console.log(data);
      Swal.fire({
        icon: 'info',
        title: 'Appointment Details',
        html: `
          <div class="text-left">
            <p><strong>Patient Name:</strong> ${data.patient_name}</p>
            <p><strong>Appointment Date:</strong> ${data.appointment_date}</p>
            <p><strong>Contact No:</strong> ${data.contact_no}</p>
          </div>
          <div>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <select id="doc" name="doc">
              <option value="doc1">Doctor 1</option>
              <option value="doc2">Doctor 2</option>
            </select>
            <select id="role" name="role">
              <option value="main">Main</option>
              <option value="assistant">Assistant</option>
              <option value="anesthesiologist">Anesthesiologist</option>
            </select>
            <button onclick="handleAddDoctor()" class="btn btn-primary">Save</button>
          </div>
        `,
      });
    } catch (err) {
      console.error(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch surgery details. Please try again later.',
      });
    }
  };

  return (
    <Fragment>
      <NavigationBar setAuth={setAuth} />
      <div className="container">
        <div className="py-4">
          <div className="btn-group" role="group" aria-label="Pending and Approved Surgeries">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => fetchSurgeries(appointmentId, 'pending')}
              style={{ color: '#000' }}
            >
              Pending surgeries
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => fetchApprovedSurgeries(appointmentId, 'approved')}
              style={{ color: '#000' }}
            >
              Approved surgeries
            </button>
          </div>
          {showSurgeries && (
            <div>
              <table className="table border shadow">
                <thead>
                  <tr>
                    <th scope="col">Patient Name</th>
                    <th scope="col">Date</th>
                    <th scope="col">Contact No</th>
                    <th scope="col">Status</th>
                    <th scope="col"></th> {/* Approve button column */}
                  </tr>
                </thead>

                <tbody>
                  {surgeries.map((surgery, index) => (
                    surgery.status === 'pending' && ( // Filter pending surgeries
                      <tr key={index}>
                        <td>{surgery.patient_name}</td>
                        <td>{surgery.appointment_date}</td>
                        <td>{surgery.contact_no}</td>
                        <td>{surgery.status}</td>
                        <td>
                          {surgery.status === 'pending' && ( // Render Approve button only for pending surgeries
                            <button
                              type="button"
                              className="btn btn-success"
                              onClick={() => approvedsurgeries(surgery.appointment_id)}
                              style={{ color: '#000' }}
                            >
                              Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {showapprovedSurgeries && (
            <div>
              <table className="table border shadow">
                <thead>
                  <tr>
                    <th scope="col">Patient Name</th>
                    <th scope="col">Surgery Name</th>
                    <th scope="col">Date</th>
                    <th scope="col">Contact No</th>
                    <th scope="col">Role</th>
                    <th scope="col">View</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedSurgeries.map((surgery, index) => (
                    surgery.status === 'approved' && ( // Filter approved surgeries
                      <tr key={index}>
                        <td>{surgery.patient_name}</td>
                        <td>{surgery.surgery_name}</td>
                        <td>{surgery.appointment_date}</td>
                        <td>{surgery.contact_no}</td>
                        <td>{surgery.status}</td>
                        <td>
                          {surgery.status === 'approved' && ( // Render Approve button only for pending surgeries
                            <button
                              type="button"
                              className="btn btn-success"
                              onClick={() => {
                                viewAppointment(surgery.appointment_id); // Open surgery details window
                              }}
                              style={{ color: '#000' }}
                            >
                              VIEW
                            </button>
                          )}
                        </td>
                        <td></td> {/* No action needed for approved surgeries */}
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default PendingSurgery;
