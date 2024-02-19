import React, { useState, useEffect } from "react";
import NavigationBar from "./NavigationBar";
import { Link } from "react-router-dom";
const Surgery = ( {setAuth}) => {
  const [surgeries, setSurgeries] = useState([]);
  const surgery_data = async () => {
    try {
      const res = await fetch("http://localhost:5000/surgeries/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Request-Type": "all_surgery",
          token: localStorage.token,
        },
      });
      const data = await res.json(); // Call the json method
      setSurgeries(data);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    surgery_data();
  }, []);

  return (
    <div>
      <NavigationBar setAuth={setAuth}/>
      <div className="container">
        <div className="py-4">
          {/* <table class="table border shadow">
            <thead class="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Surgery Name</th>
                <th scope="col">Surgery Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {surgeries.map((surgery, index) => (
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>{surgery.name}</td>
                  <td>{surgery.type}</td>
                  <td>
                    <Link
                      class="btn btn-primary mr-2"
                      to={`/userhome/surgery/${surgery.name}`}
                    >
                      View
                    </Link>
                   <Link
                      class="btn btn-outline-primary mr-2"
                      to={`/userhome/surgery/edit/${surgery.name}`}
                    >
                      Edit
                    </Link>
                    <Link
                      class="btn btn-danger"
                      // onClick={() => deleteSurgery(surgery.name)}
                    >
                      Delete
                    </Link> 
                  </td>
                </tr>
              ))}
            </tbody>
          </table> */}
          <div className="row my-5 container ">
            {surgeries.map((surgery, index) => (
              <div key={index} class="col-md-4 mb-4">
                <div class="card dark:bg-slate-300">
                  <div class="card-body">
                    <h5 class="card-title">{surgery.name}</h5>
                    <h6 class="card-text">{surgery.type}</h6>
                    <p class="card-text">{surgery.price}</p>
                    <button
                      class="btn btn-success"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Surgery;
