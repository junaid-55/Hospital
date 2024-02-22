import React, { Fragment } from 'react'
import DoctorNavigationBar from './DoctorNavigationBar'
function DoctorAppointments({setAuth}) {
  return (
    <Fragment>
        <DoctorNavigationBar setAuth={setAuth} />
        <div className="container">
            <h1>Appointments</h1>
        </div>
    </Fragment>
  )
}
export default DoctorAppointments
