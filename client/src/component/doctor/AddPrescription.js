import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
const AddPrescription = () => {
  const [prescription, setPrescription] = useState({
    patientType: "",
    diseaseName: "",
    date: new Date(),
    drugs: [{ name: [], dosage: [0, 0, 0], days: 0 }],
    advice: "",
    admit_date: "",
    Test: [],
    Surgery: [{ name: "", date: "" }],
  });

  const [patientType, setPatientType] = useState("Out_Patient");
  const [allDrugs, setAllDrugs] = useState([]);
  const [filteredDrugs, setFilteredDrugs] = useState([]);
  const [allTests, setAllTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [allSurgeries, setAllSurgeries] = useState([]);
  const [filteredSurgeries, setFilteredSurgeries] = useState([]);

  const navigate = useNavigate();
  const { appointmentId } = useParams();

  const fetchPrescription = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/doctorhome/prescription/${appointmentId}`
      );
      const data = await response.json();
      console.log("previous prescription->", data[0].advice);
      setPrescription((prevPrescription) => ({
        ...prevPrescription,
        patientType: data[0].patienttype,
        diseaseName: data[0].diseasename,
        advice: data[0].advice,
      }));
      console.log(prescription);
    } catch (error) {
      console.error("Error fetching prescription:", error.message);
    }
  };

  const fetchDrugs = async () => {
    try {
      const response = await fetch(`http://localhost:5000/doctorhome/drug`);
      const data = await response.json();
      setAllDrugs(data);
    } catch (error) {
      console.error("Error fetching drugs:", error.message);
    }
  };

  const fetchSuggestedDrugs = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/doctorhome/prescription_drug/${appointmentId}`
      );
      let data = await response.json();

      data = data.map((drug) => {
        let dosage = drug.dosage.replace("{", "[").replace("}", "]");
        return {
          ...drug,
          dosage: JSON.parse(dosage),
        };
      });
      setPrescription((prevPrescription) => ({
        ...prevPrescription,
        drugs: data,
      }));
      console.log(prescription);
      console.log(data);
    } catch (error) {
      console.error("Error fetching suggested drugs:", error.message);
    }
  };

  const fetchTests = async () => {
    try {
      const response = await fetch(`http://localhost:5000/doctorhome/test`);
      const data = await response.json();
      setAllTests(data);
    } catch (error) {
      console.error("Error fetching tests:", error.message);
    }
  };

  const fetchSuggestedTests = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/doctorhome/prescription_labtest/${appointmentId}`
      );
      const data = await response.json();
      console.log(data);
      setPrescription((prevPrescription) => ({
        ...prevPrescription,
        Test: data,
      }));
    } catch (error) {
      console.error("Error fetching suggested tests:", error.message);
    }
  };

  const fetchSurgeries = async () => {
    try {
      const response = await fetch(`http://localhost:5000/doctorhome/surgery`);
      const data = await response.json();
      setAllSurgeries(data);
    } catch (error) {
      console.error("Error fetching surgeries:", error.message);
    }
  };

  useEffect(() => {
    fetchPrescription();
    fetchDrugs();
    fetchSuggestedDrugs();
    fetchTests();
    fetchSuggestedTests();
    fetchSurgeries();
  }, []);

  const handlePatientTypeChange = (e) => {
    setPrescription({ ...prescription, patientType: e.target.value });
    setPatientType(e.target.value);
  };

  // Function to filter drugs based on user input
  const handleDrugInputChange = (index, value) => {
    const filtered = allDrugs.filter((drug) =>
      drug.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDrugs(filtered);
  };

  const handleTestInputChange = (index, value) => {
    const filtered = allTests.filter((test) =>
      test.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTests(filtered);
  };

  const handleSurgeryInputChange = (index, value) => {
    const filtered = allSurgeries.filter((surgery) =>
      surgery.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSurgeries(filtered);
  };

  // Function to set drug name in the prescription
  const handleDrugSelection = (index, selectedDrug) => {
    const drugs = [...prescription.drugs];
    drugs[index].name = selectedDrug;
    setPrescription({ ...prescription, drugs });
    setFilteredDrugs([]); // Clear filtered drugs after selection
  };
  const handleTestSelection = (index, selectedTest) => {
    const tests = [...prescription.Test];
    tests[index] = { name: selectedTest };
    setPrescription({ ...prescription, Test: tests });
    setFilteredTests([]); // Clear filtered drugs after selection
  };
  const handleSurgerySelection = (index, selectedSurgery) => {
    const surgeries = [...prescription.Surgery];
    surgeries[index] = { name: selectedSurgery };
    setPrescription({ ...prescription, Surgery: surgeries });
    setFilteredSurgeries([]); // Clear filtered surgeries after selection
  };

  const handleAddTest = () => {
    setPrescription({
      ...prescription,
      Test: [...prescription.Test, ""],
    });
  };
  const handleAddSurgery = () => {
    setPrescription({
      ...prescription,
      Surgery: [...prescription.Surgery, {}],
    });
  };

  const handleAddDrug = () => {
    setPrescription({
      ...prescription,
      drugs: [...prescription.drugs, { name: [], dosage: [0, 0, 0], days: 0 }],
    });
  };

  // Handler for saving the prescription
  const handleSavePrescription = async (e) => {
    e.preventDefault();
    console.log(patientType);
    console.log(prescription);
    try {
      const prescriptionData = {
        diseaseName: prescription.diseaseName,
        patientType: patientType,
        date: prescription.date,
        advice: prescription.advice,
        admit_date: prescription.admit_date,
      };

      const response = await fetch(
        `http://localhost:5000/doctorhome/prescription/${appointmentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(prescriptionData),
        }
      );
      if (response.ok) {
        if (prescription.drugs.length > 0) {
          try {
            const response1 = await fetch(
              `http://localhost:5000/doctorhome/prescription_drug/${appointmentId}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ drugs: prescription.drugs }),
              }
            );
            if (!response1.ok) {
              throw new Error("Failed to save prescription drugs");
            }
          } catch (error) {
            console.error("Error saving prescription drugs:", error.message);
          }
        }

        if (prescription.Test.length > 0) {
          try {
            const response2 = await fetch(
              `http://localhost:5000/doctorhome/prescription_labtest/${appointmentId}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ Test: prescription.Test }),
              }
            );
            if (!response2.ok) {
              throw new Error("Failed to save prescription tests");
            }
          } catch (error) {
            console.error("Error saving prescription tests:", error.message);
          }
        }
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Prescription added successfully",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to add prescription",
        });
      }
      return;
      if (prescription.Surgery.length > 0) {
        try {
          console.log(prescription.Surgery);
          localStorage.setItem(
            "prescription",
            JSON.stringify({ Surgery: prescription.Surgery })
          );
          const response3 = await fetch(
            `http://localhost:5000/doctorhome/prescription_surgery/${appointmentId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ Surgery: prescription.Surgery }),
            }
          );
          if (!response3.ok) {
            throw new Error("Failed to save prescription surgeries");
          }
        } catch (error) {
          console.error("Error saving prescription surgeries:", error.message);
        }
      }
    } catch (error) {
      console.error("Error saving prescription:", error.message);
    }
  };

  const handleDeleteSurgery = (index) => {
    const surgeries = [...prescription.Surgery];
    surgeries.splice(index, 1);
    setPrescription({ ...prescription, Surgery: surgeries });
    //deleteSurgery(prescription.Surgery[index]); // Pass the correct surgery name to deleteSurgery function
  };
  // Function to handle dosage input change
  const handleDosageToggle = (drugIndex, dosageIndex) => {
    const drugs = [...prescription.drugs];
    drugs[drugIndex].dosage[dosageIndex] =
      1 - drugs[drugIndex].dosage[dosageIndex];
    setPrescription({ ...prescription, drugs });
  };
  const deleteTest = async (testName) => {
    try {
      console.log(appointmentId);

      const response = await fetch(
        `http://localhost:5000/doctorhome/deletetest/${testName}/${appointmentId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Test deleted successfully",
        });
      } else {
        console.error("Failed to delete test");
      }
    } catch (error) {
      console.error("Error deleting test:", error.message);
    }
  };

  const handleDeleteTest = async (index) => {
    const tests = [...prescription.Test];
    const testToDelete = tests[index]; // Get the test at the specified index
    console.log(testToDelete);
    tests.splice(index, 1);
    setPrescription({ ...prescription, Test: tests });
    await deleteTest(testToDelete.name); // Pass the correct
  };

  // Function to handle drug deletion
  const handleDeleteDrug = async (index) => {
    const drugs = [...prescription.drugs];
    const drugToDelete = drugs[index]; // Get the drug at the specified index
    drugs.splice(index, 1);
    setPrescription({ ...prescription, drugs });
    try {
      const response = await fetch(
        `http://localhost:5000/doctorhome/deletedrug/${drugToDelete.name}/${appointmentId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        Swal.fire("Success", "Drug deleted successfully");
      } else {
        console.error("Failed to delete prescription");
      }
    } catch (error) {
      console.error("Error deleting prescription:", error.message);
    }
  };

  return (
    <div className="mt-5 mr-42 ml-40">
      <h2 style={{ height: "60%" }}>Add Prescription</h2>
      <h2> </h2>
      <div className="flex mt-4">
        <h3 className="text-lg font-bold w-1/4">Patient Type:</h3>
        <select
          name="patientType"
          className="border w-1/4 rounded"
          id="patientType"
          value={prescription.patientType}
          onChange={handlePatientTypeChange}
        >
          <option value="">Select Patient Type</option>
          <option value="In_Patient">In Patient</option>
          <option value="Out_Patient">Out Patient</option>
        </select>
      </div>

      <div className="flex mt-4">
        <h3 className="text-lg font-bold w-1/4">Disease Name:</h3>
        <input
          type="text"
          id="diseaseName"
          name="diseaseName"
          className="border mr-56 w-1/4 rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
          value={prescription.diseaseName}
          onChange={(e) =>
            setPrescription({ ...prescription, diseaseName: e.target.value })
          }
        />
      </div>
      {patientType === "In_Patient" && (
        <div className="flex mt-4">
          <h3 className="text-lg font-bold w-1/4">Admit Date:</h3>
          <input
            type="date"
            id="date"
            name="date"
            className="border mr-56 w-1/4 rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
            value={prescription.admit_date}
            onChange={(e) =>
              setPrescription({ ...prescription, admit_date: e.target.value })
            }
          />
        </div>
      )}
      {/* Drug Inputs */}
      <label htmlFor={`drugName`} className="font-bold text-lg ">
        Drugs:
      </label>
      {prescription.drugs.map((drug, drugIndex) => (
        <div key={drugIndex} className="flex mt-3 ml-64 justify-start">
          <input
            type="text"
            id={`drugName_${drugIndex}`}
            name={`drugName_${drugIndex}`}
            value={drug.name}
            className=" rounded-l"
            style={{ width: "15%", height: "100%" }}
            onChange={(e) => handleDrugInputChange(drugIndex, e.target.value)}
          />
          {/* Render all drug names in the dropdown */}
          <select
            value={drug.name}
            style={{ width: "15%", height: "90%" }}
            className=" rounded-r"
            onChange={(e) => handleDrugSelection(drugIndex, e.target.value)}
          >
            <option value="">Select Drug</option>
            {allDrugs.map((drug) => (
              <option key={drug.id} value={drug.name}>
                {drug.name}
              </option>
            ))}
          </select>
          {/* Display dosage and days input fields */}
          <div className="ml-3 flex">
            <h3 className="font-bold mt-2">Dosage:</h3>
            <div className="">
              {drug.dosage.map((d, i) => {
                let className = "";
                if (i === 0) {
                  className = "rounded-l";
                } else if (i === 2) {
                  className = "rounded-r";
                }
                return (
                  <input
                    key={i}
                    type="text"
                    value={d}
                    className={`${className} other-classes`}
                    onClick={() => handleDosageToggle(drugIndex, i)}
                    style={{
                      width: "50px",
                      height: "40px",
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div className="ml-5 flex">
            <h3 className="font-bold mt-2" htmlFor={`days_${drugIndex}`}>
              Days:
            </h3>
            <input
              type="number"
              id={`days_${drugIndex}`}
              name={`days_${drugIndex}`}
              value={drug.days}
              className="rounded"
              style={{ width: "45%", height: "100%" }}
              onChange={(e) => {
                const drugs = [...prescription.drugs];
                drugs[drugIndex].days = parseInt(e.target.value);
                setPrescription({ ...prescription, drugs });
              }}
            />
          </div>

          <button
            className="btn btn-danger -ml-16"
            onClick={() => handleDeleteDrug(drugIndex)}
          >
            Delete
          </button>
        </div>
      ))}

      <button className="btn btn-success" onClick={handleAddDrug}>
        Add Drug
      </button>

      {/* Test Inputs */}
      <h3 className="font-bold" htmlFor={`testName`}>
        Tests:
      </h3>
      {prescription.Test.map((test, testIndex) => (
        <div key={testIndex} className="mt-3 flex">
          <input
            type="text"
            id={`testName_${testIndex}`}
            name={`testName_${testIndex}`}
            value={test.name}
            className="w-1/4  ml-64 rounded-l"
            onChange={(e) => handleTestInputChange(testIndex, e.target.value)}
          />
          {/* Render all drug names in the dropdown */}
          <select
            value={test.name}
            className="w-1/4 rounded-r"
            onChange={(e) => handleTestSelection(testIndex, e.target.value)}
          >
            <option value="">Select Test</option>
            {allTests.map((test) => (
              <option key={test.id} value={test.name}>
                {test.name}
              </option>
            ))}
          </select>

          <button
            className="btn btn-danger ml-3"
            onClick={() => handleDeleteTest(testIndex)}
          >
            Delete
          </button>
        </div>
      ))}
      <button className="btn btn-success" onClick={handleAddTest}>
        Add Tests
      </button>

      <h3 className="font-bold text-lg" htmlFor={`surgeryName`}>
        Surgery Name:
      </h3>
      {prescription.Surgery.map((surgery, surgeryIndex) => (
        <div
          key={surgeryIndex}
          className="mt-3 flex"
          style={{ display: "flex", alignItems: "center" }}
        >
          <input
            type="text"
            id={`surgeryName${surgeryIndex}`}
            name={`surgeryName${surgeryIndex}`}
            value={surgery.name}
            className="w-1/4  ml-64 rounded-l"
            onChange={(e) =>
              handleSurgeryInputChange(surgeryIndex, e.target.value)
            }
          />
          {/* Render all surgery names in the dropdown */}
          <select
            value={surgery.name}
            className="w-1/4 rounded-r"
            onChange={(e) =>
              handleSurgerySelection(surgeryIndex, e.target.value)
            }
          >
            <option value="">Select Surgery</option>
            {allSurgeries.map((surgeryOption) => (
              <option key={surgeryOption.id} value={surgeryOption.name}>
                {surgeryOption.name}
              </option>
            ))}
          </select>
          <div style={{ marginLeft: "10px" }} className="flex ml-3">
            <h3 className="font-bold mt-2" htmlFor={`date_${surgeryIndex}`}>
              Date:
            </h3>
            <input
              type="date"
              id={`date_${surgeryIndex}`}
              name={`date_${surgeryIndex}`}
              value={surgery.date}
              className="rounded"
              onChange={(e) => {
                const updatedSurgeries = [...prescription.Surgery];
                updatedSurgeries[surgeryIndex].date = e.target.value;
                setPrescription({
                  ...prescription,
                  Surgery: updatedSurgeries,
                });
              }}
            />
          </div>
          <button
            className="btn btn-danger ml-3"
            onClick={() => handleDeleteSurgery(surgeryIndex)}
          >
            Delete
          </button>
        </div>
      ))}
      <button className="btn btn-success" onClick={handleAddSurgery}>
        Add Surgery
      </button>

      <div className="flex mt-3">
        <h3 className="font-bold text-lg" htmlFor="advice">
          Advice:
        </h3>
        <textarea
          id="advice"
          name="advice"
          className=" ml-48 rounded"
          style={{ width: "50%", height: "100%" }}
          value={prescription.advice}
          onChange={(e) =>
            setPrescription({ ...prescription, advice: e.target.value })
          }
        ></textarea>
      </div>

      <button
        className="btn btn-success w-2/3 mt-5 ml-20 mb-5"
        onClick={handleSavePrescription}
      >
        Save Prescription
      </button>
    </div>
  );
};

export default AddPrescription;
