import React, { Fragment, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function TopEa() {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedTimeType, setSelectedTimeType] = useState("Custom");
  const [selectedCriteriaType, setSelectedCriteriaType] = useState("Doctor");
  const [count, setCount] = useState(0); // Added count state
  const [data, setData] = useState([]);

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
  };

  const handleTimeTypeChange = (event) => {
    setSelectedTimeType(event.target.value);
    // Reset selected dates when time type is changed
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };

  const handleCriteriaTypeChange = (event) => {
    setSelectedCriteriaType(event.target.value);
  };

  const handleCountChange = (event) => {
    setCount(event.target.value);
  }; // Added count change handler

  const handleSearch = () => {
    // Extract values from HTML tags
    const selectedStartDateValue = selectedStartDate
      ? selectedStartDate.toISOString()
      : "";
    const selectedEndDateValue = selectedEndDate
      ? selectedEndDate.toISOString()
      : "";
    const selectedTimeTypeValue = selectedTimeType;
    const selectedCriteriaTypeValue = selectedCriteriaType;

    // Perform further actions with the extracted values
    console.log("Selected Start Date:", selectedStartDateValue);
    console.log("Selected End Date:", selectedEndDateValue);
    console.log("Selected Time Type:", selectedTimeTypeValue);
    console.log("Selected Criteria Type:", selectedCriteriaTypeValue);
    console.log("Count:", count); // Log the count value

    // Simulate data retrieval
    const retrievedData = [
      { id: 1, name: "John Doe", earnings: "$1000" },
      { id: 2, name: "Jane Smith", earnings: "$1500" },
      { id: 3, name: "Bob Johnson", earnings: "$800" },
    ];

    setData(retrievedData);
  };

  return (
    <Fragment>
      <h1
        className="mt-5 font-medium "
        style={{ fontSize: "3em", textAlign: "center" }}
      >
        Top Earnings
      </h1>
      <div className=" w-full container mt-2  z-10 overflow-y-auto">
        <div className="mt-2 inset-20 fixed transition-opacity flex items-center justify-center">
          <div
            className="relative w-full  bg-white p-6 rounded-md"
            style={{ width: "100%", height: "100%" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="flex justify-between w-full">
                <select
                  name="time_type"
                  className="border mr-2 w-1/4 rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                  value={selectedTimeType}
                  onChange={handleTimeTypeChange}
                >
                  <option>Custom</option>
                  <option>Last Week</option>
                  <option>Last Month</option>
                  <option>Last Year</option>
                </select>
                <DatePicker
                  selected={selectedStartDate}
                  className="rounded mr-2"
                  placeholderText="Select Start Date"
                  calendarPlacement="top"
                  onChange={handleStartDateChange}
                  disabled={selectedTimeType !== "Custom"} // Disable when time type is not "Custom"
                />
                <DatePicker
                  selected={selectedEndDate}
                  className="rounded mr-2"
                  placeholderText="Select End Date"
                  calendarPlacement="top"
                  onChange={handleEndDateChange}
                  disabled={selectedTimeType !== "Custom"} // Disable when time type is not "Custom"
                />
                <select
                  className="border w-1/4 mr-2 rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                  value={selectedCriteriaType}
                  onChange={handleCriteriaTypeChange}
                >
                  <option>Doctor</option>
                  <option>Lab Test</option>
                  <option>Drug</option>
                </select>
                <input
                  type="text"
                  className=" w-1/12 mr-2 rounded"
                  placeholder="count"
                  value={count} // Bind the count value
                  onChange={handleCountChange} // Add the count change handler
                />
                <button
                  className="w-1/4 px-4 text-white bg-gray-600 border-l rounded"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>
            <table className="table-auto w-full mt-4">
              <thead>
                <tr className="border">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Earnings</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-l rounded">
                    <td className="border px-4 py-2">{item.id}</td>
                    <td className="border px-4 py-2">{item.name}</td>
                    <td className="border px-4 py-2">{item.earnings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default TopEa;
