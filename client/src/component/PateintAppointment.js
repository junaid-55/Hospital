import React,{Fragment} from 'react'
import NavigationBar from './NavigationBar'

function PateintAppointment({setAuth}) {
  return (
    <Fragment>
      <NavigationBar setAuth={setAuth}/>
    </Fragment>
  )
}

export default PateintAppointment
