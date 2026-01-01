import React from 'react'
import { useContext } from 'react';
import { useState } from 'react'
import { PortContext } from './context/PortContext';
import { useEffect } from 'react';
import GangDetails from './reports/update/GangDetails';
import { IoIosSearch } from "react-icons/io";
import GangDetailsCar from './reports/update/GangDetailsCar';
import GangDetailsGen from './reports/update/GangDetailsGen';
import VprDetails from './reports/vpr/VprDetails';
import VprDetailsCar from './reports/vpr/VprDetailsCar';
import CprDetails from './reports/cpr/CprDetails';

const Voyage = ({vesselName, vesselType}) => {

  const { voyageNames, getGangDetails, getGangDetailsCar, getGangDetailsGen, getAllVoyageNames, getVprDetails, getCprDetails } = useContext(PortContext);
  const [selectedVoyage, setSelectedVoyage] = useState('');
  const [submittedVoyage, setSubmittedVoyage] = useState('');
  const [selectedRptType, setSelectedRptType] = useState('');
  const [submittedRptType, setSubmittedRptType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedVoyage(selectedVoyage);
    setSubmittedRptType(selectedRptType);
    if (vesselType==='Container' && selectedRptType==='UPDATE') {
      getGangDetails(selectedVoyage);
    } else if (vesselType==='Car Carrier' && selectedRptType==='UPDATE'){
      getGangDetailsCar(selectedVoyage);
    } else if (vesselType==='General Cargo' && selectedRptType==='UPDATE'){
      getGangDetailsGen(selectedVoyage);
    } else if (selectedRptType==='VPR'){
      getVprDetails(selectedVoyage);
    } else if (selectedRptType==='CPR'){
      getCprDetails(selectedVoyage);
    }
  }

  useEffect(()=>{
    if (vesselName) {
      getAllVoyageNames(vesselName);
    }
    setSelectedVoyage('');
    setSubmittedVoyage('');
    setSelectedRptType('');
    setSubmittedRptType('');
  },[vesselName])

  return (
    <div>
      <form onSubmit={handleSubmit} className='flex flex-col'>
        <select value={selectedVoyage}
          onChange={(e)=>{
            const value = e.target.value;
            setSelectedVoyage(value);
            if (value==='') {
              setSubmittedVoyage('');
            }
          }}
          className='outline-1 px-2 py-1 rounded-lg my-2'
        >
          <option value="" className='px-4'>----Select Voyage----</option>
          {voyageNames.map((voyage, index) => (
            <option key={index} value={voyage.InwardVoyage} className='px-4'>
              {voyage.InwardVoyage}
            </option>
          ))}
        </select>
        <select value={selectedRptType} 
          onChange={(e)=>{
            const value = e.target.value;
            setSelectedRptType(value);
            if (value==='') {
              setSubmittedRptType('');
            }
          }}
          className='outline-1 px-2 py-1 rounded-lg my-2'
        >
          <option value="" className='px-4'>----Report Type----</option>
          <option value="UPDATE" className='px-4'>UPDATE</option>
          <option value="VPR" className='px-4'>VPR</option>
          <option value="CPR" className='px-4'>CPR</option>
        </select>
        <button type="submit" className='bg-neutral-800 text-neutral-200 px-2 py-1 rounded-lg my-2 flex gap-2 justify-center items-center'>Submit <IoIosSearch/></button>
      </form>
      <hr className='mt-4'/>
      <div className='overflow-auto'>
        {submittedVoyage && submittedRptType &&(
          <>
            {vesselType==='Container' && submittedRptType==='UPDATE' && (<GangDetails vesselName={vesselName} inwardVoyage={submittedVoyage}/>)}
            {vesselType==='Car Carrier' && submittedRptType==='UPDATE' && (<GangDetailsCar vesselName={vesselName} inwardVoyage={submittedVoyage}/>)}
            {vesselType==='General Cargo' && submittedRptType==='UPDATE' && (<GangDetailsGen vesselName={vesselName} inwardVoyage={submittedVoyage}/>)}
            {(vesselType==='Container' || vesselType==='General Cargo') && submittedRptType==='VPR' && (<VprDetails vesselName={vesselName} inwardVoyage={submittedVoyage}/>)}
            {vesselType==='Car Carrier' && (<VprDetailsCar vesselName={vesselName} inwardVoyage={submittedVoyage}/>)}
            {submittedRptType==='CPR' && (<CprDetails vesselName={vesselName} inwardVoyage={submittedVoyage}/>)}
          </>
        )}
      </div>
    </div>
  )
}

export default Voyage