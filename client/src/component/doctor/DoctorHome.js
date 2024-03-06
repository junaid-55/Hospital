import React, { Fragment, useState, useEffect } from "react";
import NavigationBar from "./DoctorNavigationBar";
import Swal from "sweetalert2";

function DoctorHome({ setAuth }) {
  const [doctorInfo, setDoctorInfo] = useState(null);

  const fetchDoctorInfo = async () => {
    try {
      const response = await fetch("http://localhost:5000/doctorhome", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
        },
      });
      const data = await response.json();
      setDoctorInfo(data);
    } catch (err) {
      console.error(err.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch doctor information. Please try again later.",
      });
    }
  };
  useEffect(() => {
    fetchDoctorInfo();
  }, []);

  return (
    <Fragment>
      <NavigationBar setAuth={setAuth} />
      <div className="ml-40 mt-10">
        <div className="px-4 sm:px-0">
          <h3 className="text-xl font-semibold font-mono leading-7 text-gray-900">
            Doctor Profile
          </h3>
          <p className="mt-1 text-lg  font-semibold font-mono max-w-2xl  leading-6 text-gray-500">
            Personalized details of the doctor...
          </p>
        </div>
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            {doctorInfo && Object.keys(doctorInfo).map((key) => (
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-lg font-semibold font-mono leading-6 text-gray-900">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </dt>
                <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {doctorInfo[key]}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Fragment>
  );
}

export default DoctorHome;