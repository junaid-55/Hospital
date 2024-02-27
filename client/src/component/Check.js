// // import React, { Fragment, useState } from "react";
// // import DatePicker from "react-datepicker";
// // import "react-datepicker/dist/react-datepicker.css";
// // function Check() {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const openModal = () => setIsOpen(true);
// //   const closeModal = () => setIsOpen(false);

// //   return (
// //     <Fragment>
// //       <button onClick={openModal} className="btn btn-primary">
// //         Check
// //       </button>
// //       {isOpen && (
// //         <div className="fixed inset-0 z-10 overflow-y-auto">
// //           <div className="absolute inset-0 bg-gray-500 bg-opacity-200 transition-opacity flex items-center justify-center">
// //             <div className="relative w-full  bg-white p-6 rounded-md" style={{ width: '70%', height: '60%' }}>
// //               <div
// //                 style={{
// //                   display: "flex",
// //                   justifyContent: "space-between",
// //                   alignItems: "center",
// //                 }}
// //               >
// //                 <div className="flex justify-between w-full">
// //                   <select
// //                     name="user_type"
// //                     class="border  rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
// //                   >
// //                     <option>AC</option>
// //                     <option>Non Ac</option>
// //                   </select>
// //                   <select class="border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300">
// //                     <option>WARD</option>
// //                     <option>ICU</option>
// //                     <option>SINGLE CABIN</option>
// //                     <option>DOUBLE CABIN</option>
// //                   </select>
// //                   <input
// //                     type="text"
// //                     className=" w-1/5 rounded"
// //                     placeholder="min price"
// //                   />
// //                   <input
// //                     type="text"
// //                     className=" w-1/5 rounded"
// //                     placeholder="max price"
// //                   />
// //                   <DatePicker
// //                     selected={new Date()}
// //                     className="rounded"
// //                   />
// //                   <button className="px-4 text-white bg-gray-600 border-l rounded">
// //                     Search
// //                   </button>
// //                 </div>
// //               </div>
// //               <table className="table-auto w-full mt-4">
// //                 <thead>
// //                   <tr>
// //                     <th className="px-4 py-2">Room No</th>
// //                     <th className="px-4 py-2">Type</th>
// //                     <th className="px-4 py-2">AC/Non AC</th>
// //                     <th className="px-4 py-2">Price</th>
// //                     <th className="px-4 py-2">Book</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   <tr>
// //                     <td className="border px-4 py-2">201A</td>
// //                     <td className="border px-4 py-2">SINGLE CABIN</td>
// //                     <td className="border px-4 py-2">AC</td>
// //                     <td className="border px-4 py-2">858</td>
// //                     <td className="border">
// //                       <button className="btn btn-success w-full h-full" onClick={closeModal}>Select...</button>
// //                     </td>
// //                   </tr>
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </Fragment>
// //   );
// // }

// // export default Check;
// // import React, { useState } from "react";
// // import { useNavigate, useParams } from "react-router-dom";

// // const AddPrescription = () => {
// //   // State to control visibility of the prescription form
// //   const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);

// //   // State to store prescription data
// //   const [prescription, setPrescription] = useState({
// //     visitId: "",
// //     diseaseName: "",
// //     patientName: "",
// //     date: "",
// //     dosages: [{ drug: "", morning: false, noon: false, night: false }],
// //     advice: "",
// //     patientType: "",
// //   });

// //   // State to track if changes have been made to the prescription
// //   const [unsavedChanges, setUnsavedChanges] = useState(false);

// //   const navigate = useNavigate();
// //   const { appointmentId } = useParams();

// //   // Handler for adding a dosage to the prescription
// //   const handleAddDosage = () => {
// //     setPrescription({
// //       ...prescription,
// //       dosages: [
// //         ...prescription.dosages,
// //         { drug: "", morning: false, noon: false, night: false },
// //       ],
// //     });
// //     setUnsavedChanges(true);
// //   };

// //   // Handler for updating dosage details
// //   const handleDosageChange = (index, field, value) => {
// //     const updatedDosages = prescription.dosages.map((dosage, i) =>
// //       i === index ? { ...dosage, [field]: value } : dosage
// //     );
// //     setPrescription({ ...prescription, dosages: updatedDosages });
// //     setUnsavedChanges(true);
// //   };

// //   // Handler for removing a dosage from the prescription
// //   const handleRemoveDosage = (index) => {
// //     const updatedDosages = prescription.dosages.filter((dosage, i) => i !== index);
// //     setPrescription({ ...prescription, dosages: updatedDosages });
// //     setUnsavedChanges(true);
// //   };

// //   // Handler for saving the prescription
// //   const handleSavePrescription = () => {
// //     // Implement logic to save the prescription
// //     console.log("Prescription saved:", prescription);
// //     setUnsavedChanges(false);
// //   };

// //   // Handler for discarding changes and closing the prescription form
// //   const handleDiscardChanges = () => {
// //     setPrescription({
// //       visitId: "",
// //       diseaseName: "",
// //       patientName: "",
// //       date: "",
// //       dosages: [{ drug: "", morning: false, noon: false, night: false }],
// //       advice: "",
// //       patientType: "",
// //     });
// //     setShowPrescriptionForm(false);
// //     setUnsavedChanges(false);
// //   };

// //   // Handler for showing/hiding the prescription form
// //   const handlePrescriptionClick = () => {
// //     if (unsavedChanges) {
// //       const confirmDiscard = window.confirm("You have unsaved changes. Do you want to discard them?");
// //       if (confirmDiscard) {
// //         handleDiscardChanges();
// //         setShowPrescriptionForm(true);
// //       }
// //     } else {
// //      setShowPrescriptionForm(true);
// //     }
// //   };

// //   // UI for prescription form
// //   return (
// //     <div>
// //       {/* Prescription button */}
// //       <button onClick={handlePrescriptionClick}>Prescriptionnn</button>

// //       {/* Prescription form */}
// //       {showPrescriptionForm && (
// //         <div>
// //           <input
// //             type="text"
// //             placeholder="Visit ID"
// //             value={prescription.visitId}
// //             onChange={(e) =>
// //               setPrescription({ ...prescription, visitId: e.target.value })
// //             }
// //           />
// //           {/* Rest of the prescription form */}
// //           {/* Add dosage button */}
// //           <button onClick={handleAddDosage}>Add Dosage</button>
// //           {/* Save button */}
// //           <button onClick={handleSavePrescription}>Save Prescription</button>
// //           {/* Discard button */}
// //           <button onClick={handleDiscardChanges}>Discard Changes</button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default AddPrescription;
// {/* Drug Inputs */}
// {prescription.drugs.map((drug, drugIndex) => (
//   <div key={drugIndex}>
//     <label htmlFor={`drugName_${drugIndex}`}>Drug Name:</label>
//     <input
//       type="text"
//       id={`drugName_${drugIndex}`}
//       name={`drugName_${drugIndex}`}
//       value={drug.name}
//       onChange={(e) => handleDrugInputChange(drugIndex, e.target.value)}
//     />
//     {/* Render all drug names in the dropdown */}
//     <select
//       value={drug.name}
//       onChange={(e) => handleDrugSelection(drugIndex, e.target.value)}
//     >
//       <option value="">Select Drug</option>
//       {allDrugs.map((drug) => (
//         <option key={drug.id} value={drug.name}>
//           {drug.name}
//         </option>
//       ))}
//     </select>
//     {/* Display dosage and days input fields */}
//     <div>
//       <label>Dosage:</label>
//       {drug.dosage.map((d, i) => (
//         <span
//           key={i}
//           onClick={() => handleDosageToggle(drugIndex, i)}
//           style={{
//             cursor: "pointer",
//             marginRight: "5px",
//             border: "1px solid #ccc",
//             padding: "5px",
//           }}
//         >
//           {d}
//         </span>
//       ))}
//     </div>
//     <div>
//       <label htmlFor={`days_${drugIndex}`}>Days:</label>
//       <input
//         type="number"
//         id={`days_${drugIndex}`}
//         name={`days_${drugIndex}`}
//         value={drug.days}
//         onChange={(e) => {
//           const drugs = [...prescription.drugs];
//           drugs[drugIndex].days = parseInt(e.target.value);
//           setPrescription({ ...prescription, drugs });
//         }}
//       />
//     </div>
//     <button type="button" onClick={() => handleDeleteDrug(drugIndex)}>
//       Delete
//     </button>
//   </div>
// ))}

// <button type="button" onClick={handleAddDrug}>Add Drugs</button>
