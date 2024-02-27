import React, { Fragment } from 'react'
import AdminNavigationBar from './AdminNavigationBar'
function AdminHome({setAuth}) {
  return (
    <Fragment>
        <AdminNavigationBar setAuth={setAuth} />
        <h1>Admin Home</h1>
    </Fragment>
  )
}

export default AdminHome
