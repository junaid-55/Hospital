import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';
const AddPrescription = () => {
  const [prescription, setPrescription] = useState({
    patientType: "",
    diseaseName: "",
    date: "",
    drugs: [{ name: [], dosage: [0, 0, 0], days: 0  }],
    advice: "",
    Test: [],
    Surgery: [],
  });

  const [allDrugs, setAllDrugs] = useState([]); // State to store all drugs
  const [filteredDrugs, setFilteredDrugs] = useState([]); // State to store filtered drugs
  const [allTests, setAllTests] = useState([]); // State to store all tests
  const [filteredTests, setFilteredTests] = useState([]); // State to store filtered tests
  const [allSurgeries, setAllSurgeries] = useState([]); // State to store all surgeries
  const [filteredSurgeries, setFilteredSurgeries] = useState([]); // State to store filtered surgeries

  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const fetchDrugs = async () => {
    try {
      const response = await fetch(`http://localhost:5000/doctorhome/drug`);
      const data = await response.json();
      setAllDrugs(data);
    } catch (error) {
      console.error("Error fetching drugs:", error.message);
    }
  };
  const [appointment, setAppointment] = useState(null);
  const appointmentDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/appointments/doctorappointment/${appointmentId}`);
      const data = await response.json();
      setAppointment(data);
    } catch (error) {
      console.error("Error fetching appointment details:", error.message);
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
   
    fetchDrugs();
    appointmentDetails();
    fetchTests();
    fetchSurgeries();
    
  }, []);

  // Fetch prescription data if appointmentId changes
  // useEffect(() => {
  //   const fetchPrescription = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:5000/prescriptions/${appointmentId}`);
  //       const data = await response.json();
  //       setPrescription(data); // Update prescription state with fetched data
  //     } catch (error) {
  //       console.error("Error fetching prescription:", error.message);
  //     }
  //   };

  //   fetchPrescription();
  // }, [appointmentId]);

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
    tests[index] = selectedTest;
    setPrescription({ ...prescription,  tests });
    setFilteredTests([]); // Clear filtered drugs after selection
  };
  const handleSurgerySelection = (index, selectedSurgery) => {
    const surgeries = [...prescription.Surgery];
    surgeries[index] = selectedSurgery;
    setPrescription({ ...prescription,  surgeries });
    setFilteredSurgeries([]); // Clear filtered drugs after selection
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
  // Handler for adding a new set of drugs and dosage
  const handleAddDrug = () => {
    setPrescription({
      ...prescription,
      drugs: [...prescription.drugs, { name: [], dosage: [0, 0, 0] , days: 0 }],
    });

  };

  // Handler for saving the prescription
  const handleSavePrescription = async (e) => {
    e.preventDefault();
  
    try {
      const prescriptionData = {
        diseaseName: prescription.diseaseName,
        patientType: prescription.patientType,
        date: prescription.date,
        advice: prescription.advice
      };
  
      const response = await fetch(`http://localhost:5000/doctorhome/prescription/${appointmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prescriptionData)
      });
  
      if (response.ok) {
        if (prescription.drugs.length > 0) {
          try {
            const response1 = await fetch(`http://localhost:5000/doctorhome/prescription_drug/${appointmentId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ drugs: prescription.drugs}),
            });
            if (!response1.ok) {
              throw new Error("Failed to save prescription drugs");
            }
          } catch (error) {
            console.error("Error saving prescription drugs:", error.message);
          }
        }
  
        if (prescription.Test.length > 0) {
          try {
            const response2 = await fetch(`http://localhost:5000/doctorhome/prescription_test/${appointmentId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(prescription.Test),
            });
            if (!response2.ok) {
              throw new Error("Failed to save prescription tests");
            }
          } catch (error) {
            console.error("Error saving prescription tests:", error.message);
          }
        }
  
        if (prescription.Surgery.length > 0) {
          try {
            const response3 = await fetch(`http://localhost:5000/doctorhome/prescription_surgery/${appointmentId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(prescription.Surgery),
            });
            if (!response3.ok) {
              throw new Error("Failed to save prescription surgeries");
            }
          } catch (error) {
            console.error("Error saving prescription surgeries:", error.message);
          }
        }
        if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Prescription added successfully',
        });
      }} else {
        console.error("Failed to save prescription");
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
    drugs[drugIndex].dosage[dosageIndex] = 1 - drugs[drugIndex].dosage[dosageIndex];
    setPrescription({ ...prescription, drugs });
  };
  const deleteTest = async (testName) => {
    try {
      const response = await fetch(`http://localhost:5000/doctorhome/deletetest/${testName,appointmentId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Test deleted successfully',
        });
      } else {
        console.error("Failed to delete test");
      }
    } catch (error) {
      console.error("Error deleting test:", error.message);
    }
  }
const handleDeleteTest = (index) => {
  const tests = [...prescription.Test];
  tests.splice(index, 1);
  setPrescription({ ...prescription, Test:tests });
 // deleteTest(index);
};

  // Function to handle drug deletion
  const handleDeleteDrug = (index) => {
    const drugs = [...prescription.drugs];
    drugs.splice(index, 1);
    setPrescription({ ...prescription, drugs });
    try {

      const response = fetch(`http://localhost:5000/doctorhome/deletedrug/${index,appointmentId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        navigate("/success");
      } else {
        console.error("Failed to delete prescription");
      }
    }
    catch (error) {
      console.error("Error deleting prescription:", error.message);
    }
  }
  const handlePatientTypeChange = (e) => {
    setPrescription({ ...prescription, patientType: e.target.value });
  };

  return (
    <div>
      <h2>Add Prescription</h2>
      <form onSubmit={handleSavePrescription}>
      <div>
        <label htmlFor="patientType">Patient Type:</label>
        <select
          id="patientType"
          name="patientType"
          value={prescription.patientType}
          onChange={handlePatientTypeChange}
        >
          <option value="">Select Patient Type</option>
          <option value="In Patient">In Patient</option>
          <option value="Out Patient">Out Patient</option>
        </select>
      </div>
        <div>
          <label htmlFor="diseaseName">Disease Name:</label>
          <input
            type="text"
            id="diseaseName"
            name="diseaseName"
            value={prescription.diseaseName}
            onChange={(e) =>
              setPrescription({ ...prescription, diseaseName: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={prescription.date}
            onChange={(e) =>
              setPrescription({ ...prescription, date: e.target.value })
            }
          />
        </div>
     {/* Drug Inputs */}
{prescription.drugs.map((drug, drugIndex) => (
  <div key={drugIndex} style={{ display: "flex", alignItems: "center" }}>
    <label htmlFor={`drugName_${drugIndex}`}>Drug Name:</label>
    <input
      type="text"
      id={`drugName_${drugIndex}`}
      name={`drugName_${drugIndex}`}
      value={drug.name}
      onChange={(e) => handleDrugInputChange(drugIndex, e.target.value)}
    />
    {/* Render all drug names in the dropdown */}
    <select
      value={drug.name}
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
    <div style={{ marginLeft: "10px", display: "flex", alignItems: "center" }}>
      <label>Dosage:</label>
      {drug.dosage.map((d, i) => (
        <span
          key={i}
          onClick={() => handleDosageToggle(drugIndex, i)}
          style={{
            cursor: "pointer",
            marginRight: "5px",
            border: "1px solid #ccc",
            padding: "5px",
          }}
        >
          {d}
        </span>
      ))}
    </div>
    <div style={{ marginLeft: "10px" }}>
      <label htmlFor={`days_${drugIndex}`}>Days:</label>
      <input
        type="number"
        id={`days_${drugIndex}`}
        name={`days_${drugIndex}`}
        value={drug.days}
        onChange={(e) => {
          const drugs = [...prescription.drugs];
          drugs[drugIndex].days = parseInt(e.target.value);
          setPrescription({ ...prescription, drugs });
        }}
      />
    </div>
    <button type="button" onClick={() => handleDeleteDrug(drugIndex)}>
      Delete
    </button>
  </div>
))}

<button type="button" onClick={handleAddDrug}>Add Drugs</button>

        

     {/* Test Inputs */}
     {prescription.Test.map((test, testIndex) => (
  <div key={testIndex} style={{ display: "flex", alignItems: "center" }}>
    <label htmlFor={`testName${testIndex}`}>Test Name:</label>
    <input
      type="text"
      id={`testName${testIndex}`}
      name={`testName${testIndex}`}
      value={test.name}
      onChange={(e) => handleTestInputChange(testIndex, e.target.value)}
    />
    {/* Render all drug names in the dropdown */}
    <select
      value={test.name}
      onChange={(e) => handleTestSelection(testIndex, e.target.value)}
    >
      <option value="">Select Test</option>
      {allTests.map((test) => (
        <option key={test.id} value={test.name}>
          {test.name}
        </option>
      ))}
    </select>
    
    <button type="button" onClick={() => handleDeleteTest(testIndex)}>
      Delete
    </button>
  </div>
))}
<button type="button" onClick={handleAddTest}>Add Tests</button>

{prescription.Surgery.map((surgery, surgeryIndex) => (
  <div key={surgeryIndex} style={{ display: "flex", alignItems: "center" }}>
    <label htmlFor={`surgeryName${surgeryIndex}`}>Surgery Name:</label>
    <input
      type="text"
      id={`surgeryName${surgeryIndex}`}
      name={`surgeryName${surgeryIndex}`}
      value={surgery.name}
      onChange={(e) => handleSurgeryInputChange(surgeryIndex, e.target.value)}
    />
    {/* Render all drug names in the dropdown */}
    <select
      value={surgery.name}
      onChange={(e) => handleSurgerySelection(surgeryIndex, e.target.value)}
    >
      <option value="">Select Surgery</option>
      {allTests.map((surgery) => (
        <option key={surgery.id} value={surgery.name}>
          {surgery.name}
        </option>
      ))}
    </select>
    
    <button type="button" onClick={() => handleDeleteSurgery(surgeryIndex)}>
      Delete
    </button>
  </div>
))}
<button type="button" onClick={handleAddSurgery}>Add Surgery</button>

        <div>
          <label htmlFor="advice">Advice:</label>
          <textarea
            id="advice"
            name="advice"
            value={prescription.advice}
            onChange={(e) =>
              setPrescription({ ...prescription, advice: e.target.value })
            }
          ></textarea>
        </div>
       
 


        <button type="submit"onClick ={handleSavePrescription}>
          Save Prescription</button>
      </form>
    </div>
  );
};

export default AddPrescription;






// const handleAddTest = () => {
//   setPrescription({
//     ...prescription,
//     Test: [...prescription.Test, ""],
//   });
// };

// const handleDeleteTest = (index) => {
//   const tests = [...prescription.Test];
//   tests.splice(index, 1);
//   setPrescription({ ...prescription, Test: tests });
//   deleteTest(prescription.Test[index]); // Pass the correct test name to deleteTest function
// };


