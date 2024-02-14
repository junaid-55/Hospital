import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import Swal from "sweetalert2";
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
        token: localStorage.token,
      },
    });
    const data = await res.json(); // Call the json method
    setDoctors(data);
  };

  //on using search option stores searched name
  const [criteria, setCriteria] = useState("Name");
  const [inputs, setInputs] = useState({
    name: "",
  });
  const { name } = inputs;
  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (e) => {
    e.preventDefault();
    setCriteria(e.target.value);
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
          "Request-Type": "search",
          Criteria: criteria,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleAppointmentClick = async (doctor) => {
    try {
      console.log(doctor);
      const body = { doctor };
      const res = await fetch("http://localhost:5000/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Request-Type": "appointment",
          token: localStorage.token,
        },
        body: JSON.stringify(body),
      });
      console.log(res);
      Swal.fire({
        icon: "success",
        title: "Congrats...",
        text: "Appointment successful...",
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  //shows doctors whenever doctor is filtered by any way
  useEffect(() => {
    doctor_data();
  }, []);

  // useEffect(() => {
  //   if (name) {
  //     search();
  //   }
  // }, [name]);

  return (
    <Fragment>
      <NavigationBar setAuth={setAuth} />

      <form class="flex" onSubmit={search}>
        <label
          for="search-dropdown"
          class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Your Email
        </label>

        <select
          name="user_type"
          class="w-40 flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
          onChange={handleUserTypeChange}
        >
          <option>Name</option>
          <option>Department</option>
        </select>

        <div class="relative flex-grow">
          <input
            type="search"
            name="name"
            value={name}
            onChange={(e) => onChange(e)}
            class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            placeholder="Search doctors"
          />
          <button
            type="submit"
            class="w-20  absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg
              class="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span class="sr-only">Search</span>
          </button>
        </div>
      </form>
      {/* search bar on top */}
      {/* mapping of available doctors in card view html */}
      {/* <div className="row my-5 container "> 
        {doctors.map((doctor, index) => (
          <div key={index} class="col-md-4 mb-4">
            <div class="card dark:bg-slate-300">
              <div class="card-body">
                <h5 class="card-title">{doctor.first_name}</h5>
                <h6 class="card-text">{doctor.department_title}</h6>
                <p class="card-text">{doctor.schedule}</p>
                <button
                  class="btn btn-success"
                  onClick={() => handleAppointmentClick(doctor)}
                >
                  Appointment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div> */}
      <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {doctors.map((doctor, index) => (
          <div class="p-6 rounded-md shadow-sm cursor-pointer bg-gradient-to-r from-violet-100 to-indigo-100 hover:from-violet-200 hover:to-indigo-200 border-violet-200 border-2 hover:border-violet-300 transition-colors duration-300">
            <h6 class="text-xl font-semibold mb-4">{doctor.first_name}</h6>
            <p class="text-xl font-semibold mb-4">{doctor.department_title}</p>
            <p class="text-gray-700">{doctor.schedule}</p>
            <button
              class="btn btn-success mt-2"
              onClick={() => handleAppointmentClick(doctor)}
            >
              Appointment
            </button>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default UserHome;
