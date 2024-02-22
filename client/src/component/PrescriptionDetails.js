import React from 'react';

// Define the PrescriptionDetails component
function PrescriptionDetails() {
  return (
    <div className="mt-4 mr-40 ml-40">
      <h2 className="text-2xl font-bold text-center">Prescription Details</h2>

      {/* Doctor's details */}
      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          <h3 className="text-lg font-bold">Doctor:</h3>
          <p className="ml-2">Dr. John Doe</p>
        </div>
        <div className="flex items-center">
          <h3 className="text-lg font-bold">Date:</h3>
          <p className="ml-2">12th May, 2021</p>
        </div>
      </div>

      {/* Patient's details */}
      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          <h3 className="text-lg font-bold">Patient:</h3>
          <p className="ml-2">John Doe</p>
        </div>
        <div className="flex items-center">
          <h3 className="text-lg font-bold">Age:</h3>
          <p className="ml-2">42</p>
        </div>
      </div>

      {/* Prescription details */}
      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          <h3 className="text-lg font-bold w-1/3">Prescription:</h3>
          <p className="ml-2">Take two pills twice a day for a week</p>
        </div>
      </div>

      {/* Diagnosis details */}
      <div className="flex justify-between mt-4">
        <div className="flex  justify-between">
          <h3 className="text-lg font-bold w-1/3">Diagnosis:</h3>
          <p className="ml-2">Fever</p>
        </div>
      </div>

      {/* Notes */}
      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          <h3 className="text-lg font-bold w-1/3">Notes:</h3>
          <p className="ml-2">Take plenty of rest</p>
        </div>
      </div>
    </div>
  );
}

export default PrescriptionDetails;