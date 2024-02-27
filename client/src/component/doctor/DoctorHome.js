import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import NavigationBar from './DoctorNavigationBar';
import Swal from 'sweetalert2';

function DoctorHome({ setAuth }) {
  const navigate = useNavigate();
  const handleClick = () => {
    localStorage.clear();
    setAuth(false);
    navigate("/auth/login");};
  const [doctorInfo, setDoctorInfo] = useState(null); // Initialize doctorInfo state
    
  
  
    // Fetch the doctor's information from localStorage or an API endpoint
    // const storedDoctorInfo = JSON.parse(localStorage.getItem('doctorInfo'));
    // setDoctorInfo(storedDoctorInfo);
    const fetchDoctorInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/doctorhome', {
          method: 'GET',
          headers: {
            "Content-Type": 'application/json',
            token: localStorage.token,
          },
        });
        const data = await response.json();
        setDoctorInfo(data);
      } catch (err) {
        console.error(err.message);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch doctor information. Please try again later.',
        });
      }
    };
    useEffect
    (() => {
      fetchDoctorInfo();
    }, []);
  

  return (
    <Fragment>
      <NavigationBar setAuth={setAuth} />
      <div className="container">
        <div className="py-4">
          {doctorInfo && (
            <div>
              <h1>Doctor Profile</h1>
              <div className="doctor-profile">
                <div className="profile-item">
                  <strong>Name:</strong> {doctorInfo.first_name} {doctorInfo.last_name}
                </div>
                <div className="profile-item">
                  <strong>Title:</strong> {doctorInfo.title}
                </div>
                <div className="profile-item">
                  <strong>Department:</strong> {doctorInfo.department_title}
                </div>
                <div className="profile-item">
                  <strong>Experience:</strong> {doctorInfo.experience}
                </div>
                <div className="profile-item">
                  <strong>Schedule:</strong> {doctorInfo.schedule}
                </div>
                <div className="profile-item">
                  <strong>Contact No:</strong> {doctorInfo.contact_no}
                </div>
                <div className="profile-item">
                  <strong>Consultation Fee:</strong> ${doctorInfo.consultation_fee}
                </div>
                <div className="profile-item">
                  <strong>Email:</strong> {doctorInfo.email}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default DoctorHome;
