import React, { Fragment } from 'react'
import NavigationBar from './DoctorNavigationBar'
function DoctorHome({setAuth}) {
  return (
    <Fragment>
        <NavigationBar setAuth={setAuth}/>
        <div className="container">
            <div className="py-4">
            <h1>Doctor Home</h1>
            </div>
        </div>
        
    </Fragment>
  )
}

export default DoctorHome
