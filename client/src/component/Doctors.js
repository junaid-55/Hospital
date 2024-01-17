import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Doctors = ({ setAuth }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    setAuth(false);
    navigate("/login");
  };

  //storing doctors from databse after fetching
  const [doctors, setDoctors] = useState([]);
  const doctor_data = async () => {
    const res = await fetch("http://localhost:5000/userhome/", {
      method: "GET",
    });
    const data = await res.json(); // Call the json method
    setDoctors(data);
  };

    //on using search option stores searched name
    const [inputs, setInputs] = useState({
      name: "",
    });
    const { name } = inputs;
    const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  //onSubmit function for searching doctors
  const search = async (e) => {
    e.preventDefault();
    try {
      const body = { name };
      const res = await fetch("http://localhost:5000/userhome/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Request-Type": "search", // lowercase "request-type"
        },
        body: JSON.stringify(body),
      });
  
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  //shows doctors whenever doctor is filtered by any way
  useEffect(() => {
    doctor_data();
  }, []);

  return (
    <Fragment>
      <h1 className="text-center my-5">Doctors</h1>
      
      {/* search bar on top */}
      <nav class="navbar navbar-light bg-light justify-content-between my-5" style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' }}>
        <a class="navbar-brand">Available Doctors</a>
        <form class="form-inline" onSubmit={search}>
          <input
            class="form-control mr-sm-2"
            type="search"
            name="name"
            value={name}
            onChange={(e) => onChange(e)}
            placeholder="Search"
            aria-label="Search"
          />
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">
            Search
          </button>
        </form>
      </nav>

      {/* mapping of available doctors in card view html */}
      <div class="row">
        {doctors.map((doctor, index) => (
          <div key={index} class="col-md-4 mb-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">{doctor.name}</h5>
                <p class="card-text">Doctor ID: {doctor.id}</p>
                <p class='card-text'>{doctor.email}</p>
                <button class="btn btn-success">Appointment</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* logout button for going back into login page */}
      <button className="btn btn-danger btn-block" onClick={handleClick}>
        logout
      </button>
    </Fragment>
  );
};

export default Doctors;
