import React, { useState, useEffect } from "react";
import NavigationBar from "./NavigationBar";

function LabTest({ setAuth }) {
  const [tests, setTests] = useState([]);
  const test_data = async () => {
    const res = await fetch("http://localhost:5000/tests/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Request-Type": "all_test",
        token: localStorage.token,
      },
    });
    const data = await res.json(); // Call the json method
    setTests(data);
    console.log(data);
  };
  useEffect(() => {
    test_data();
  }, []);

  const handleTestClick = (test) => {
    console.log(test);
  }
    

  return (
    <div>
      <NavigationBar setAuth={setAuth} />
      <div className="row my-5 container ">
        {tests.map((test, index) => (
          <div key={index} class="col-md-4 mb-4">
            <div class="card dark:bg-slate-300">
              <div class="card-body">
                <h5 class="card-title">{test.name}</h5>
                <h6 class="card-text">{test.type}</h6>
                <p class="card-text">{test.price}</p>
                <button
                  class="btn btn-success"
                  onClick={() => handleTestClick(test)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default LabTest;
