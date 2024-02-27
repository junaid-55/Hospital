import React, { Fragment, useState, useEffect } from 'react';
import NavigationBar from './DoctorNavigationBar';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import DoctorPatient from './DoctorPatient';
function DoctorAppointments({ setAuth}) {
  const [showAppointments, setShowAppointments] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState(null); // State to store doctor ID
  const [ApprovedAppointments, setApprovedAppointments] = useState([]);
 const [showapprovedAppointments, setShowApprovedAppointments] = useState(false);

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
      // Now doctorId should be properly set
      fetchAppointments(doctorId); 
      fetchApprovedAppointments(doctorId);        // Fetch appointments after doctorId is set
    };
    fetchDoctorId(); // Fetch doctor ID from backend
  }, []);
  const fetchAppointments = async (doctorId) => {
    try {
      const response = await fetch(`http://localhost:5000/doctorhome/doctor-appointments/${doctorId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.token,
        },
      });
      const data = await response.json();
      setAppointments(data);
      setShowAppointments(true);
      setShowApprovedAppointments(false);
    } catch (err) {
      console.error(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch appointments. Please try again later.',
      });
    }
  };
const fetchApprovedAppointments = async (doctorId, status) => {
  try {
    const response = await fetch(`http://localhost:5000/doctorhome/doctor-approvedappointments/${doctorId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.token,
      },
    });
    const data = await response.json();
    setApprovedAppointments(data);
    setShowApprovedAppointments(true);
    setShowAppointments(false);
  } catch (err) {
    console.error(err.message);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to fetch appointments. Please try again later.',
    });
  }
}
// Inside DoctorAppointments component
const deleteFromPending = async (appointmentId) => {
  try {
    const response = await fetch(`http://localhost:5000/doctorhome/delete/${appointmentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.token,
      },
    });
  }
  catch (err) {
    console.error(err.message);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to delete appointment. Please try again later.',
    });
  } 
};
const approveAppointment = async (appointmentId) => {
  try {
    const response = await fetch(`http://localhost:5000/doctorhome/approve/${appointmentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.token,
      },
    });

    if (response.ok) {
      // If the request was successful, fetch updated appointments
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Appointment approved successfully',
      });
     // deleteFromPending(appointmentId);
      fetchAppointments(doctorId, 'pending');

    } else {
      throw new Error('Failed to approve appointment');
    }
  } catch (err) {
    console.error(err.message);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to approve appointment. Please try again later.',
    });
  }
};
// const viewAppointment = async (appointmentId) => {  
//   try {
//     const response = await fetch(`http://localhost:5000/appointments/${appointmentId}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         token: localStorage.token,
//       },
//     });
//     const data = await response.json();
//     console.log(data);
//     Swal.fire({
//       icon: 'info',
//       title: 'Appointment Details',
//       html: `
//       <div class="text-left">
//         <p><strong>Patient Name:</strong> ${data.patient_name}</p>
//         <p><strong>Appointment Date:</strong> ${data.appointment_date}</p>
//         <p><strong>Contact No:</strong> ${data.contact_no}</p>
        
//       </div>
//       `,
//     });
//   } catch (err) {
//     console.error(err.message);
//     Swal.fire({
//       icon: 'error',
//       title: 'Error',
//       text: 'Failed to fetch appointment details. Please try again later.',
//     });
//   }

// }

// Inside render method, update the button to handle approval


return (
  <Fragment>
    <NavigationBar setAuth={setAuth} />
    <div className="container">
      <div className="py-4">
        <div className="btn-group" role="group" aria-label="Pending and Approved Appointments">
          <button type="button" className="btn btn-primary" onClick={() => fetchAppointments(doctorId, 'pending')} style={{ color: '#000' }}>Pending Appointments</button>
          <button type="button" className="btn btn-success" onClick={() => fetchApprovedAppointments(doctorId, 'approved')} style={{ color: '#000' }}>Approved Appointments</button>
        </div>
        {showAppointments && (
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
                {appointments.map((appointment, index) => (
                  appointment.status === 'pending' && // Filter pending appointments
                  <tr key={index}>
                    <td>{appointment.patient_name}</td>
                    <td>{appointment.appointment_date}</td>
                    <td>{appointment.contact_no}</td>
                    <td>{appointment.status}</td>
                    <td>
                      {appointment.status === 'pending' && ( // Render Approve button only for pending appointments
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={() => approveAppointment(appointment.appointment_id)}
                          style={{ color: '#000' }}
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showapprovedAppointments && (
          <div>
            <table className="table border shadow">
              <thead>
                <tr>
                  <th scope="col">Patient Name</th>
                  <th scope="col">Date</th>
                  <th scope="col">Contact No</th>
                  <th scope="col">Status</th>
                  <th scope="col">View</th>
                </tr>
              </thead>
              <tbody>
                {ApprovedAppointments.map((appointment, index) => (
                  appointment.status === 'approved' && // Filter approved appointments
                  <tr key={index}>
                    <td>{appointment.patient_name}</td>
                    <td>{appointment.appointment_date}</td>
                    <td>{appointment.contact_no}</td>
                    <td>{appointment.status}</td>
                    <td>
                    {appointment.status === 'approved' && ( // Render Approve button only for pending appointments
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={() => {
                            // Navigate to the appointment details page
                            navigate(`/DoctorPatient/${appointment.appointment_id}`);
                          }}
                          style={{ color: '#000' }}
                        >
                          VIEW
                        </button>
                      )}
                     
                    <td></td>
                    {/* No action needed for approved appointments */}
                    </td>
                  </tr>
                  
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

export default DoctorAppointments;
