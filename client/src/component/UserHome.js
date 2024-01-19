import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
const UserHome = ({ setAuth }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    localStorage.clear();
    setAuth(false);
    navigate("/auth/login");
  };

  //storing doctors from databse after fetching
  const [doctors, setDoctors] = useState([]);
  const doctor_data = async () => {
    const res = await fetch("http://localhost:5000/userhome/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Request-Type": "all_doctors",
        Token: localStorage.token,
      },
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
      <NavigationBar />
      {/* search bar on top */}
      <nav
        className="navbar justify-content-between"
        style={{ backgroundColor: "#e3f2fd" }}
      >
        <form className="flex ml-auto  pr-6 " onSubmit={search}>
          <input
            className="form-control mr-sm-2"
            type="search"
            name="name"
            value={name}
            onChange={(e) => onChange(e)}
            placeholder="Search"
            aria-label="Search"
          />
          <button
            className="btn btn-outline-success my-2 my-sm-0"
            type="submit"
          >
            Search
          </button>
        </form>
      </nav>
      {/* mapping of available doctors in card view html */}
      <div className="row my-5 container ">
        {doctors.map((doctor, index) => (
          <div key={index} class="col-md-4 mb-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">{doctor.name}</h5>
                <p class="card-text">Doctor ID: {doctor.id}</p>
                <p class="card-text">{doctor.email}</p>
                <button class="btn btn-secondary">Appointment</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default UserHome;
