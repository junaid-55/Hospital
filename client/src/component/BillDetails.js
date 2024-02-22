import React, { Fragment } from 'react'

function BillDetails() {
  return (
    <Fragment>
        <h2 className="text-2xl font-bold text-center">Bill Details</h2>
    
        {/* Bill details */}
        <div className="flex justify-between mt-4">
            <div className="flex items-center">
            <h3 className="text-lg font-bold">Bill ID:</h3>
            <p className="ml-2">12345</p>
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
    
        {/* Bill details */}
        <div className="flex justify-between mt-4">
            <div className="flex items-center">
            <h3 className="text-lg font-bold w-1/3">Bill:</h3>
            <p className="ml-2">$100</p>
            </div>
        </div>
    
        {/* Payment status */}
        <div className="flex justify-between mt-4">
            <div className="flex items-center">
            <h3 className="text-lg font-bold w-1/3">Payment Status:</h3>
            <p className="ml-2">Paid</p>
            </div>
        </div>
    </Fragment>
  )
}

export default BillDetails
