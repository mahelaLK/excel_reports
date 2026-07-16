import React, { useState } from 'react'
import Vessel from './Vessel'
import Topbar from './components/Topbar'
import Preview from './components/Preview';
import { ToastContainer } from 'react-toastify';

const App = () => {

  const [loading, setLoading] = useState(false);

  const [selectedVessel, setSelectedVessel] = useState('');
  const [vesselType, setVesselType] = useState('');

  const [selectedVoyage, setSelectedVoyage] = useState('');
  const [submittedVoyage, setSubmittedVoyage] = useState('');
  const [selectedRptType, setSelectedRptType] = useState('');
  const [submittedRptType, setSubmittedRptType] = useState('');

  return (
    <div className='bg-surface h-screen overflow-hidden overflow-y-auto'>
      <ToastContainer/>
      <Topbar 
        loading={loading} setLoading={setLoading}
        selectedVessel={selectedVessel} setSelectedVessel={setSelectedVessel}
        vesselType={vesselType} setVesselType={setVesselType}
        selectedVoyage={selectedVoyage} setSelectedVoyage={setSelectedVoyage}
        selectedRptType={selectedRptType} setSelectedRptType={setSelectedRptType}
        submittedVoyage={submittedVoyage} setSubmittedVoyage={setSubmittedVoyage}
        submittedRptType={submittedRptType} setSubmittedRptType={setSubmittedRptType}
      />
      <Preview 
        loading={loading} vesselName={selectedVessel} vesselType={vesselType} 
        submittedVoyage={submittedVoyage} submittedRptType={submittedRptType}
      />
    </div>
  )
}

export default App