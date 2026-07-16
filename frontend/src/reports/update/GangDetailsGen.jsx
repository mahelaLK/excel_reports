import React, { useContext, useEffect, useState } from 'react'
import { PortContext } from '../../context/PortContext';
import { RiFileExcel2Fill } from "react-icons/ri";

const GangDetailsGen = ({vesselName, inwardVoyage}) => {

    const { gangDetailsGen, exportTableStyledGen } = useContext(PortContext);

    if (!gangDetailsGen) {
        return <p>Sorry, No gang details for selected voyage</p>
    }

    const totalGangDetails = gangDetailsGen.gangPlanDetails
        ? gangDetailsGen.gangPlanDetails.reduce((sum, plan)=>sum+(plan.gangDetails?.length || 0), 0)
        : 0;

    const hasBothVehAndBblk = (plan) => {
      const d = plan.details;
      return (Number(d.NoOfVehicles) || 0) !== 0 && (Number(d.BBLK) || 0) !== 0
    }

    const getGangShiftCols = (plan) => (hasBothVehAndBblk(plan) ? 4 : 3);

  return (
    <div className="flex flex-col mt-4">
      <button
        onClick={() => exportTableStyledGen(vesselName)}
        className="bg-green-900 text-green-100 px-2 py-1 my-3 rounded-lg flex gap-2 justify-center items-center w-full"
      >
        Export to Excel <RiFileExcel2Fill />
      </button>
      {/* === Gang Summary Table === */}
      <table
        id="gangTable"
        border="1"
        cellPadding="5"
        className="w-full border-collapse bg-neutral-100"
      >
        <tbody>
          {/* Voyage Inward */}
          <tr className="border-b-2 border-neutral-700 bg-neutral-200">
            {gangDetailsGen.gangPlanDetails.map((plan) => {
              const details = plan.details;

              if(details.NoOfVehicles !== 0 && details.BBLK === 0){
                return(
                  <td colSpan={2+(gangDetailsGen.gangPlanDetails.length * 4)} className='text-center'>VESSEL NAME/VOYAGE: {vesselName}</td>
                )
              }
              if(details.NoOfVehicles === 0 && details.BBLK !== 0){
                return(
                  <td colSpan={2+(gangDetailsGen.gangPlanDetails.length * 4)} className='text-center'>VESSEL NAME/VOYAGE: {vesselName}</td>
                )
              }
              if(details.NoOfVehicles !== 0 && details.BBLK !== 0){
                  return(
                  <td colSpan={3+(gangDetailsGen.gangPlanDetails.length * 4)} className='text-center'>VESSEL NAME/VOYAGE: {vesselName}</td>
                )
              }
            })}
          </tr>

          {/* BerthSide */}
          <tr className="border-b-1 border-neutral-700 bg-neutral-200">
            {gangDetailsGen.gangPlanDetails.map((plan) => {
              const details = plan.details;

              if(details.NoOfVehicles !== 0 && details.BBLK === 0){
                return(
                  <td colSpan={2+(gangDetailsGen.gangPlanDetails.length * 4)} className='text-center'>Berthside : {gangDetailsGen.berthSide}</td>
                )
              }
              if(details.NoOfVehicles === 0 && details.BBLK !== 0){
                return(
                  <td colSpan={2+(gangDetailsGen.gangPlanDetails.length * 4)} className='text-center'>Berthside : {gangDetailsGen.berthSide}</td>
                )
              }
              if(details.NoOfVehicles !== 0 && details.BBLK !== 0){
                  return(
                  <td colSpan={3+(gangDetailsGen.gangPlanDetails.length * 4)} className='text-center'>Berthside : {gangDetailsGen.berthSide}</td>
                )
              }
            })}
          </tr>

          {/* Gang row */}
          <tr className="border-b-1 border-neutral-600">
            <td className="px-2 bg-neutral-300">Gang</td>
            {gangDetailsGen.gangPlanDetails.map((plan) => {
              const details = plan.details;
              if (details.Crane==='RAMP'){
                if(details.NoOfVehicles !== 0 && details.BBLK === 0){
                  return(
                    <td key={plan.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>{plan.gangNumber}</td>
                  )
                }
                if(details.NoOfVehicles === 0 && details.BBLK !== 0){
                  return(
                    <td key={plan.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>{plan.gangNumber}</td>
                  )
                }
                if(details.NoOfVehicles !== 0 && details.BBLK !== 0){
                   return(
                    <td key={plan.gangNumber} colSpan={4} className='border-x-1 border-neutral-400 px-2'>{plan.gangNumber}</td>
                  )
                }
              }
              return(
                <td key={plan.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>{plan.gangNumber}</td>
              )
            })}
          </tr>

          {/* Crane row */}
          <tr className="border-b-1 border-neutral-600">
            <td className="px-2 bg-neutral-300">Crane</td>
            {gangDetailsGen.gangPlanDetails.map((plan) => {
              const details = plan.details;
              if (details.Crane==='RAMP'){
                if(details.NoOfVehicles !== 0 && details.BBLK === 0){
                  return(
                    <td key={details.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>{details.Crane}</td>
                  )
                }
                if(details.NoOfVehicles === 0 && details.BBLK !== 0){
                  return(
                    <td key={details.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>{details.Crane}</td>
                  )
                }
                if(details.NoOfVehicles !== 0 && details.BBLK !== 0){
                   return(
                    <td key={details.gangNumber} colSpan={4} className='border-x-1 border-neutral-400 px-2'>{details.Crane}</td>
                  )
                }
              }
              return(
                <td key={details.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>{details.Crane}</td>
              )
            })}
          </tr>

          {/* List of Bays */}
          <tr className='border-b-1 border-neutral-600'>
            <td className='px-2 bg-neutral-300'>Bays</td>
            {gangDetailsGen.gangPlanDetails.map((plan) => {
              const details = plan.details;
              if (details.Crane==='RAMP'){
                if(details.NoOfVehicles !== 0 && details.BBLK === 0){
                  return(
                    <td key={details.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>{details.ListOfBays}</td>
                  )
                }
                if(details.NoOfVehicles === 0 && details.BBLK !== 0){
                  return(
                    <td key={details.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>{details.ListOfBays}</td>
                  )
                }
                if(details.NoOfVehicles !== 0 && details.BBLK !== 0){
                   return(
                    <td key={details.gangNumber} colSpan={4} className='border-x-1 border-neutral-400 px-2'>{details.ListOfBays}</td>
                  )
                }
              }
              return(
                <td key={details.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>{details.ListOfBays}</td>
              )
            })}
          </tr>

          {/* Cont/BBLK/VEH row */}
          {gangDetailsGen.gangPlanDetails.map((plan) => {
            const details = plan.details;
            if(details.Crane==='RAMP' && (details.NoOfVehicles !== 0 || details.BBLK !== 0)){
              return (
                <tr className='border-b-1 border-neutral-500'>
                  <td className='px-2 bg-neutral-300'>Cont/VEH/BBLK</td>
                  {gangDetailsGen.gangPlanDetails.map((plan) => {
                    const details = plan.details;
          
                    if(details.NoOfVehicles !== 0 && details.BBLK === 0){
                      return(
                        <td key={plan.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>VEH</td>
                      )
                    }
                    if(details.NoOfVehicles === 0 && details.BBLK !== 0){
                      return(
                        <td key={plan.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>BBLK</td>
                      )
                    }
                    if(details.NoOfVehicles !== 0 && details.BBLK !== 0){
                      return(
                        <React.Fragment key={plan.gangNumber}>
                          <td colSpan={3} className='border-x-1 border-neutral-400 px-2'>VEH</td>
                          <td colSpan={1} className='border-x-1 border-neutral-400 px-2'>BBLK</td>
                        </React.Fragment>
                      )
                    }
                    if(details.NoOfVehicles === 0 && details.BBLK === 0){
                      return(
                        <td key={plan.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>Cont</td>
                      )
                    }
                  })}
                </tr>
              )
            }
          })}

          {/* Discharge row */}
          <tr className='border-b-1 border-neutral-500'>
            <td className='px-2 bg-neutral-300'>Discharge</td>
            {gangDetailsGen.gangPlanDetails.map((plan) => {
              const details = plan.details;
              if (details.Crane==='RAMP'){
                if(details.NoOfVehicles !== 0 && details.BBLK === 0){
                  return(
                    <td key={details.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>{details.NoOfVehicles}</td>
                  )
                }
                if(details.NoOfVehicles === 0 && details.BBLK !== 0){
                  return(
                    <td key={details.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>{details.BBLK}</td>
                  )
                }
                if(details.NoOfVehicles !== 0 && details.BBLK !== 0){
                   return(
                    <React.Fragment key={plan.gangNumber}>
                      <td colSpan={3} className='border-x-1 border-neutral-400 px-2'>{details.NoOfVehicles}</td>
                      <td colSpan={1} className='border-x-1 border-neutral-400 px-2'>{details.BBLK}</td>
                    </React.Fragment>
                  )
                }
              }
              return(
                <td key={details.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>{details.Discharge}</td>
              )
            })}
            {!gangDetailsGen.gangPlanDetails.some(plan => plan.details.Crane === 'RAMP') && (
              <td colSpan={1 + gangDetailsGen.gangPlanDetails.length} className='text-center bg-neutral-400'>
                {gangDetailsGen.gangPlanDetails.reduce((sum, plan) => sum + (Number(plan.details.Discharge) || 0), 0)}
              </td>
            )}
          </tr>

          {/* Apw Discharge row */}
          {gangDetailsGen.gangPlanDetails.map((plan) => {
            const details = plan.details;
            if(details.ApwNoOfVehicles > 0 || details.ApwBBLK > 0){
              return (
                <tr className='border-b-1 border-neutral-500'>
                  <td className='px-2 bg-neutral-300'>Apw Discharge</td>
                  {gangDetailsGen.gangPlanDetails.map((plan) => {
                    const details = plan.details;
          
                    if(details.NoOfVehicles !== 0 && details.BBLK === 0){
                      return(
                        <td key={plan.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>{details.ApwNoOfVehicles}</td>
                      )
                    }
                    if(details.NoOfVehicles === 0 && details.BBLK !== 0){
                      return(
                        <td key={plan.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>{details.ApwBBLK}</td>
                      )
                    }
                    if(details.NoOfVehicles !== 0 && details.BBLK !== 0){
                      return(
                        <React.Fragment key={plan.gangNumber}>
                          <td colSpan={3} className='border-x-1 border-neutral-400 px-2'>{details.ApwNoOfVehicles}</td>
                          <td colSpan={1} className='border-x-1 border-neutral-400 px-2'>{details.ApwBBLK}</td>
                        </React.Fragment>
                      )
                    }
                    if(details.NoOfVehicles === 0 && details.BBLK === 0){
                      return(
                        <td key={plan.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'></td>
                      )
                    }
                  })}
                  {!gangDetailsGen.gangPlanDetails.some(plan => plan.details.Crane === 'RAMP') && (() => {
                    // 1. Calculate aggregated grand totals across all plans upfront
                    const totalVehicles = gangDetailsGen.gangPlanDetails.reduce((sum, p) => sum + (Number(p.details.ApwNoOfVehicles) || 0), 0);
                    const totalBBLK = gangDetailsGen.gangPlanDetails.reduce((sum, p) => sum + (Number(p.details.ApwBBLK) || 0), 0);

                    // 2. Conditionally return exactly ONE <td> based on final totals
                    if (totalVehicles !== 0 && totalBBLK === 0) {
                      return (
                        <td colSpan={1 + gangDetailsGen.gangPlanDetails.length} className='text-center bg-neutral-200'>{totalVehicles}</td>
                      );
                    }
                    if (totalVehicles === 0 && totalBBLK !== 0) {
                      return (
                        <td colSpan={1 + gangDetailsGen.gangPlanDetails.length} className='text-center bg-neutral-200'>{totalBBLK}</td>
                      );
                    }
                    if (totalVehicles !== 0 && totalBBLK !== 0) {
                      return (
                        <td colSpan={1 + gangDetailsGen.gangPlanDetails.length} className='text-center bg-neutral-200'>{totalVehicles + totalBBLK}</td>
                      );
                    }
                    return null;
                  })()}
                </tr>
              )
            }
          })}

          {/* Overstow row */}
          <tr className='border-b-1 border-neutral-500'>
            <td className='px-2 bg-neutral-300'>Overstow</td>
            {gangDetailsGen.gangPlanDetails.map((plan) => {
              const details = plan.details;
              if (details.Crane==='RAMP'){
                if(details.NoOfVehicles !== 0 && details.BBLK === 0){
                  return(
                    <td key={details.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'></td>
                  )
                }
                if(details.NoOfVehicles === 0 && details.BBLK !== 0){
                  return(
                    <td key={details.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'></td>
                  )
                }
                if(details.NoOfVehicles !== 0 && details.BBLK !== 0){
                   return(
                    <React.Fragment key={plan.gangNumber}>
                      <td colSpan={3} className='border-x-1 border-neutral-400 px-2'></td>
                      <td colSpan={1} className='border-x-1 border-neutral-400 px-2'></td>
                    </React.Fragment>
                  )
                }
              }
              return(
                <td key={details.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>{details.Overstow}</td>
              )
            })}
            {!gangDetailsGen.gangPlanDetails.some(plan => plan.details.Crane === 'RAMP') && (
              <td colSpan={1 + gangDetailsGen.gangPlanDetails.length} className='text-center bg-neutral-400'>
                {gangDetailsGen.gangPlanDetails.reduce((sum, plan) => sum + (Number(plan.details.Overstow) || 0), 0)}
              </td>
            )}
          </tr>

          {/* Restow row */}
          <tr className='border-b-1 border-neutral-500'>
            <td className='px-2 bg-neutral-300'>Restow</td>
            {gangDetailsGen.gangPlanDetails.map((plan) => {
              const details = plan.details;
              if (details.Crane==='RAMP'){
                if(details.NoOfVehicles !== 0 && details.BBLK === 0){
                  return(
                    <td key={details.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'></td>
                  )
                }
                if(details.NoOfVehicles === 0 && details.BBLK !== 0){
                  return(
                    <td key={details.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'></td>
                  )
                }
                if(details.NoOfVehicles !== 0 && details.BBLK !== 0){
                   return(
                    <React.Fragment key={plan.gangNumber}>
                      <td colSpan={3} className='border-x-1 border-neutral-400 px-2'></td>
                      <td colSpan={1} className='border-x-1 border-neutral-400 px-2'></td>
                    </React.Fragment>
                  )
                }
              }
              return(
                <td key={details.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>{details.Restow}</td>
              )
            })}
            {!gangDetailsGen.gangPlanDetails.some(plan => plan.details.Crane === 'RAMP') && (
              <td colSpan={1 + gangDetailsGen.gangPlanDetails.length} className='text-center bg-neutral-400'>
                {gangDetailsGen.gangPlanDetails.reduce((sum, plan) => sum + (Number(plan.details.Restow) || 0), 0)}
              </td>
            )}
          </tr>

          {/* Loads row */}
          <tr className='border-b-1 border-neutral-500'>
            <td className='px-2 bg-neutral-300'>Loads</td>
            {gangDetailsGen.gangPlanDetails.map((plan) => {
              const details = plan.details;
              if (details.Crane==='RAMP'){
                if(details.NoOfVehicles !== 0 && details.BBLK === 0){
                  return(
                    <td key={details.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'></td>
                  )
                }
                if(details.NoOfVehicles === 0 && details.BBLK !== 0){
                  return(
                    <td key={details.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'></td>
                  )
                }
                if(details.NoOfVehicles !== 0 && details.BBLK !== 0){
                   return(
                    <React.Fragment key={plan.gangNumber}>
                      <td colSpan={3} className='border-x-1 border-neutral-400 px-2'></td>
                      <td colSpan={1} className='border-x-1 border-neutral-400 px-2'></td>
                    </React.Fragment>
                  )
                }
              }
              return(
                <td key={details.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>{details.Loads}</td>
              )
            })}
            {!gangDetailsGen.gangPlanDetails.some(plan => plan.details.Crane === 'RAMP') && (
              <td colSpan={1 + gangDetailsGen.gangPlanDetails.length} className='text-center bg-neutral-400'>
                {gangDetailsGen.gangPlanDetails.reduce((sum, plan) => sum + (Number(plan.details.Loads) || 0), 0)}
              </td>
            )}
          </tr>

          {/* No of Lifts */}
          <tr className='border-b-1 border-neutral-700'>
            <td className='px-2 bg-neutral-300'>No of Lifts</td>
            {gangDetailsGen.gangPlanDetails.map((plan) => {
              const details = plan.details;
              if(details.Crane==='RAMP' && (details.NoOfDrivers !== 0 || details.BBLK !== 0)){
                if(details.NoOfVehicles !== 0 && details.BBLK === 0){
                  return(
                    <td key={details.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2 bg-neutral-200'>{(Number(details.NoOfVehicles) || 0) + (Number(details.ApwNoOfVehicles) || 0)}</td>
                  )
                }
                if(details.NoOfVehicles === 0 && details.BBLK !== 0){
                  return(
                    <td key={details.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2 bg-neutral-200'>{(Number(details.BBLK) || 0) + (Number(details.ApwBBLK) || 0)}</td>
                  )
                }
                if(details.NoOfVehicles !== 0 && details.BBLK !== 0){
                   return(
                    <React.Fragment key={plan.gangNumber}>
                      <td colSpan={3} className='border-x-1 border-neutral-400 px-2 bg-neutral-200'>{(Number(details.NoOfVehicles) || 0) + (Number(details.ApwNoOfVehicles) || 0)}</td>
                      <td colSpan={1} className='border-x-1 border-neutral-400 px-2 bg-neutral-200'>{(Number(details.BBLK) || 0) + (Number(details.ApwBBLK) || 0)}</td>
                    </React.Fragment>
                  )
                }
              } else {
                return(
                  <td key={plan.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2 bg-neutral-200'>
                    {(Number(plan.details.Loads) || 0) + (Number(plan.details.Restow) || 0) + (Number(plan.details.Overstow) || 0) + (Number(plan.details.Discharge) || 0)}
                  </td>
                )
              }
            })}
            {!gangDetailsGen.gangPlanDetails.some(plan => plan.details.Crane === 'RAMP') && (
              <td colSpan={1 + gangDetailsGen.gangPlanDetails.length} className='text-center bg-neutral-400'>
                {gangDetailsGen.gangPlanDetails.reduce((sum, plan) => sum + (Number(plan.details.Loads) || 0) + (Number(plan.details.Restow) || 0) + (Number(plan.details.Overstow) || 0) + (Number(plan.details.Discharge) || 0), 0)}
              </td>
            )}
          </tr>

          {/* Shift details */}

          {(() => {
            // Keep global cumulative variance per gang detail (not per gang)
            const globalRunning = gangDetailsGen.gangPlanDetails.map(() => 0);
  
            const totalShiftCols = gangDetailsGen.gangPlanDetails.reduce((sum, plan) => sum + getGangShiftCols(plan), 0);

            // Get all unique shift numbers across all gangs
            return [
              ...new Set(gangDetailsGen.gangPlanDetails.flatMap(g => g.shiftPlanDetails.map(s => s.ShiftNumber)))]
              .map((shiftNo) => {
              // Get baseline lift times from first gang's first detail
              const firstShift = gangDetailsGen.gangPlanDetails[0].shiftPlanDetails.find(s => s.ShiftNumber === shiftNo);
              const baselineLiftTimes = firstShift?.liftTimePlanDetails ?? [];
  
                // Precompute cumulative variance for each gang in this shift (continuing from globalRunning)
              const cumulativeByGang = gangDetailsGen.gangPlanDetails.map((plan, gangIdx) => {
                const shift = plan.shiftPlanDetails.find(s => s.ShiftNumber === shiftNo);
                const ltPlan = shift?.liftTimePlanDetails ?? [];
                let running = globalRunning[gangIdx]; // continue from last shift
                const rows = [];
  
                for (let idx = 0; idx < baselineLiftTimes.length; idx++) {
                  const lt = ltPlan[idx];
                  const details = lt?.Details?.[0];
  
                  const hasTarget = details && details.Target != null && String(details.Target).trim() !== '';
                  const hasActual = details && details.Actual != null && String(details.Actual).trim() !== '';
                  const hasBblk = details && details.BBLK != null && String(details.BBLK).trim() !== '';
  
                  if (hasTarget || hasActual || hasBblk) {
                    const tNum = hasTarget ? Number(details.Target) : 0;
                    const aNum = hasActual ? Number(details.Actual) : 0;
                    const delta = aNum - tNum;
                    running += delta;
                    rows.push({ targetRaw: details.Target, actualRaw: details.Actual, cumulative: running, bblkRaw: details.BBLK });
                  } else {
                    rows.push({ targetRaw: null, actualRaw: null, cumulative: running, bblkRaw: null });
                  }
                }
  
                // update global running variance for next shift
                globalRunning[gangIdx] = running;
  
                return rows;
              });

              return (
                <React.Fragment key={`shift-${shiftNo}`}>
                  {/* Shift header row */}
                  <tr className='border-b-1 border-neutral-500'>
                    <td colSpan={1 + totalShiftCols} className='text-center px-2 bg-neutral-300'>
                      SHIFT {shiftNo}
                    </td>
                    <td rowSpan={2} className='border-x-1 border-neutral-400 text-center px-2 bg-neutral-300'>Remarks</td>
                    <td colSpan={gangDetailsGen.gangPlanDetails.length} className='text-center px-2 bg-neutral-300'>
                      SHIFT {shiftNo} SHIP SUPERVISOR: {firstShift?.Supervisor ?? '-'}
                    </td>
                  </tr>

                  {/* Date + headers row */}
                  <tr className="border-b-1 border-neutral-500">
                    <td className="px-2 bg-neutral-300">
                      {firstShift?.ShiftStartDate
                        ? (() => {
                            const d = new Date(firstShift.ShiftStartDate);
                            return `${String(d.getDate()).padStart(2, "0")}/${String(
                              d.getMonth() + 1
                            ).padStart(2, "0")}/${d.getFullYear()}`;
                          })()
                        : "-"}
                    </td>

                    {gangDetailsGen.gangPlanDetails.map(plan => {
                      const shift = plan.shiftPlanDetails.find(s => s.ShiftNumber === shiftNo);
                      const bothVehBblk = hasBothVehAndBblk(plan);
                    
                      return shift ? (
                        <React.Fragment key={plan.gangNumber}>
                          <td className='border-x-1 border-neutral-400 px-2 text-center bg-neutral-200'>Target</td>
                          <td className='border-x-1 border-neutral-400 px-2 text-center bg-neutral-200'>Actual</td>
                          <td className='border-x-1 border-neutral-400 px-2 text-center bg-neutral-200'>Variance</td>
                          {/* BBLK has no Target/Actual/Variance - just a single blank column */}
                          {bothVehBblk && (
                            <td className='border-x-1 border-neutral-400 px-2 text-center bg-neutral-200'>BBLK</td>
                          )}
                        </React.Fragment>
                      ) : (
                        <td colSpan={3} key={plan.gangNumber} className='border-x-1 border-neutral-400 px-2 text-center'>-</td>
                      )
                    })}
                      
                    {gangDetailsGen.gangPlanDetails.map(plan => (
                      <td key={plan.gangNumber} className='border-l-1 border-neutral-400 text-center px-2 bg-neutral-200'>{plan.details.Crane}</td>
                    ))}
                  </tr>

                  {/* Shift data rows */}
                  {baselineLiftTimes.map((lt, i) => (
                    <tr key={`shift-${shiftNo}-row-${i}`} className='border-b-1 border-neutral-500'>
                      <td className='px-2 bg-neutral-200'>{lt?.LiftTime ?? '-'}</td>
                    
                      {gangDetailsGen.gangPlanDetails.map((plan, gangIdx) => {
                        const cell = cumulativeByGang[gangIdx]?.[i] ?? { targetRaw: null, actualRaw: null, cumulative: globalRunning[gangIdx], bblkRaw: null };
                        const bothVehBblk = hasBothVehAndBblk(plan);
                        return (
                          <React.Fragment key={`${plan.gangNumber}-row-${i}`}>
                            <td className='border-x-1 border-neutral-400 px-2 text-center'>{cell.targetRaw != null ? cell.targetRaw : '-'}</td>
                            <td className='border-x-1 border-neutral-400 px-2 text-center'>{cell.actualRaw != null ? cell.actualRaw : '-'}</td>
                            <td className='border-x-1 border-neutral-400 px-2 text-center'>{cell.cumulative}</td>
                            {/* BBLK has no Target/Actual/Variance - just a single blank column */}
                            {bothVehBblk && (
                              <td className='border-x-1 border-neutral-400 px-2 text-center'>{cell.bblkRaw != null ? cell.bblkRaw : '-'}</td>
                            )}
                          </React.Fragment>
                        );
                      })}
                    
                      {/* Remarks */}
                      <td className='px-2 text-left'>{gangDetailsGen.gangPlanDetails.map(plan => {
                        const crane = plan.details.Crane;
                        const shift = plan.shiftPlanDetails.find(s => s.ShiftNumber === shiftNo);
                        const ltThis = shift?.liftTimePlanDetails[i];
                        const remark = ltThis?.Details?.[0]?.Remarks;
                        return remark && remark.trim() !== "" ? `${crane}: ${remark}` : null;
                      }).filter(Boolean).join(" | ") || '-'}</td>
                    
                      {gangDetailsGen.gangPlanDetails.map(plan => {
                        const details = plan.details;
                        const shift = plan.shiftPlanDetails.find(s => s.ShiftNumber === shiftNo);
                        if(details.Crane==='RAMP'){
                          return(
                            <td key={plan.gangNumber} className='border-l-1 border-neutral-400 px-2'>
                              {i === 0 && (
                                <>
                                  FM: {shift?.Foreman ?? "-"}<br />
                                  Time Keeper: {shift?.TK ?? "-"}<br />
                                  Drivers: {shift?.NoOfDrivers ?? "-"}<br />
                                  Checklist: {shift?.Checklist ?? "-"}<br />
                                  Traffic: {shift?.Traffic ?? "-"}<br />
                                  Unlashing: {shift?.Unlashing ?? "-"}
                                </>
                              )}
                            </td>
                          )
                        }
                        return (
                          <td key={plan.gangNumber} className='border-l-1 border-neutral-400 px-2'>
                            {i === 0 && (
                              <>
                                FM: {shift?.Foreman ?? "-"}<br />
                                BP: {shift?.BayPlanner ?? "-"}<br />
                                {shift?.Winchman?.length 
                                  ? shift.Winchman.map((wm, i)=>(
                                    <span key={i}>WM{i + 1}: {wm}<br /></span>
                                  ))
                                  : "WM: -"}
                                RDT: {shift?.Rdt ?? "-"}
                              </>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              );
            });
          })()}
          {/*--------Total Lifts Left------------*/}
          <tr className='border-b-1 border-neutral-700'>
            <td className='px-2 bg-neutral-300'>Total lifts left</td>
            {gangDetailsGen.gangPlanDetails.map((plan)=>{
              const details = plan.details;
              const totalLifts = (Number(details.Discharge)) + (Number(details.Overstow)) + (Number(details.Restow)) + (Number(details.Loads));
              const totalActual = plan.shiftPlanDetails.reduce((sum, shift)=>{
                const shiftSum = (shift.liftTimePlanDetails || []).reduce((s, lt)=>{
                  const details = lt?.Details?.[0];
                  return s+ (Number(details?.Actual) || 0);
                }, 0);
                return sum + shiftSum;
              }, 0);
              if(details.Crane==='RAMP'){
                if(details.NoOfVehicles !== 0 && details.BBLK === 0){
                  const totalLifts = (Number(details.NoOfVehicles)) + (Number(details.ApwNoOfVehicles));
                  const totalActual = plan.shiftPlanDetails.reduce((sum, shift)=>{
                    const shiftSum = (shift.liftTimePlanDetails || []).reduce((s, lt)=>{
                      const details = lt?.Details?.[0];
                      return s+ (Number(details?.Actual) || 0);
                    }, 0);
                    return sum + shiftSum;
                  }, 0);
                  return(
                    <td key={plan.gangNumber} colSpan={3} className='text-center px-2 border-x-1 border-neutral-400 bg-neutral-200'>
                      {totalLifts-totalActual}
                    </td>
                  )
                }
                if(details.NoOfVehicles === 0 && details.BBLK !== 0){
                  const totalLifts = (Number(details.BBLK)) + (Number(details.ApwBBLK));
                  const totalActual = plan.shiftPlanDetails.reduce((sum, shift)=>{
                    const shiftSum = (shift.liftTimePlanDetails || []).reduce((s, lt)=>{
                      const details = lt?.Details?.[0];
                      return s+ (Number(details?.Actual) || 0);
                    }, 0);
                    return sum + shiftSum;
                  }, 0);
                  return(
                    <td key={plan.gangNumber} colSpan={3} className='text-center px-2 border-x-1 border-neutral-400 bg-neutral-200'>
                      {totalLifts-totalActual}
                    </td>
                  )
                }
                if(details.NoOfVehicles !== 0 && details.BBLK !== 0){
                  const totalLiftsVeh = (Number(plan.details.NoOfVehicles)) + (Number(plan.details.ApwNoOfVehicles));
                  const totalLiftsBBLK = (Number(plan.details.BBLK)) + (Number(plan.details.ApwBBLK));
                  const totalActual = plan.shiftPlanDetails.reduce((sum, shift)=>{
                    const shiftSum = (shift.liftTimePlanDetails || []).reduce((s, lt)=>{
                      const details = lt?.Details?.[0];
                      return s+ (Number(details?.Actual) || 0);
                    }, 0);
                    return sum + shiftSum;
                  }, 0);
                  // calculate total BBLK
                  const totalBblk = plan.shiftPlanDetails.reduce((sum, shift)=>{
                    const shiftSum = (shift.liftTimePlanDetails || []).reduce((s, lt)=>{
                      const details = lt?.Details?.[0];
                      return s+ (Number(details?.BBLK) || 0);
                    }, 0);
                    return sum + shiftSum;
                  }, 0);
                  return(
                    <React.Fragment key={plan.gangNumber}>
                      <td colSpan={3} className='text-center px-2 border-x-1 border-neutral-400 bg-neutral-200'>
                        {totalLiftsVeh-totalActual}
                      </td>
                      <td colSpan={1} rowSpan={3} className='text-center px-2 border-x-1 border-neutral-400 bg-neutral-200'>
                        {totalLiftsBBLK-totalBblk}
                      </td>
                    </React.Fragment>
                  )
                }
              }
              return(
                <td key={plan.gangNumber} colSpan={3} className='text-center px-2 border-x-1 border-neutral-400 bg-neutral-200'>{totalLifts-totalActual}</td>
              )
            })}
          </tr>

          {/*--------Productivity rate-----------*/}
          <tr className='border-b-1 border-neutral-700'>
            <td className='px-2 bg-neutral-300'>Productivity Rate</td>
            {gangDetailsGen.gangPlanDetails.map((plan)=>{
              const details = plan.details;
              if(details.Crane==='RAMP'){
                if (details.NoOfVehicles !== 0 && details.BBLK === 0) {
                  let totalActual = 0;
                  let totalCount = 0;
                
                  plan.shiftPlanDetails.forEach((shift)=>{
                    (shift.liftTimePlanDetails || []).forEach((lt)=>{
                      const details = lt?.Details?.[0];
                      if (details) {
                        totalActual += Number(details.Actual) || 0;
                        totalCount++;
                      }
                    });
                  });
                
                  const productivity = totalCount > 0 ? (totalActual / totalCount).toFixed(0) : 0;
                
                  return (
                    <td key={plan.gangNumber} colSpan={3} className='text-center px-2 border-x-1 border-neutral-400 bg-neutral-200'>{productivity}</td>
                  );
                }
            
                if (details.NoOfVehicles === 0 && details.BBLK !== 0) {
                  let totalBblk = 0;
                  let totalCount = 0;
                
                  plan.shiftPlanDetails.forEach((shift)=>{
                    (shift.liftTimePlanDetails || []).forEach((lt)=>{
                      const details = lt?.Details?.[0];
                      if (details) {
                        totalBblk += Number(details.Bblk) || 0;
                        totalCount++;
                      }
                    });
                  });
                
                  const productivity = totalCount > 0 ? (totalBblk / totalCount).toFixed(0) : 0;
                
                  return (
                    <td key={plan.gangNumber} colSpan={3} className='text-center px-2 border-x-1 border-neutral-400 bg-neutral-200'>{productivity}</td>
                  );
                }
            
                if (details.NoOfVehicles !== 0 && details.BBLK !== 0) {
                  let totalActual = 0;
                  let totalCount = 0;
                
                  plan.shiftPlanDetails.forEach((shift)=>{
                    (shift.liftTimePlanDetails || []).forEach((lt)=>{
                      const details = lt?.Details?.[0];
                      if (details) {
                        totalActual += Number(details.Actual) || 0;
                        totalCount++;
                      }
                    });
                  });
                
                  const productivity = totalCount > 0 ? (totalActual / totalCount).toFixed(0) : 0;
                
                  return (
                    <React.Fragment key={plan.gangNumber}>
                      <td colSpan={3} className='text-center px-2 border-x-1 border-neutral-400 bg-neutral-200'>{productivity}</td>
                      <td colSpan={1}></td>
                    </React.Fragment>
                  );
                }
              }
              let totalActual = 0;
              let totalCount = 0;

              plan.shiftPlanDetails.forEach((shift)=>{
                (shift.liftTimePlanDetails || []).forEach((lt)=>{
                  const details = lt?.Details?.[0];
                  if (details) {
                    totalActual += Number(details.Actual) || 0;
                    totalCount++;
                  }
                });
              });

              const productivity = totalCount > 0 ? (totalActual / totalCount).toFixed(0) : 0;
              return (
                <td key={plan.gangNumber} colSpan={3} className='text-center px-2 border-x-1 border-neutral-400 bg-neutral-200'>{productivity}</td>
              );
            })}
          </tr>
          <tr className='border-b-1 border-neutral-700'>
            <td className='px-2 bg-neutral-300'>Est Hrs of Completion</td>
            {gangDetailsGen.gangPlanDetails.map((plan)=>{
              const details = plan.details;
              if(details.Crane==='RAMP'){
                if (details.NoOfVehicles !== 0 && details.BBLK === 0) {
                  let totalActual = 0;
                  let totalCount = 0;
                  const totalLifts = (Number(plan.details.Discharge)) + (Number(plan.details.Overstow)) + (Number(plan.details.Restow)) + (Number(plan.details.Loads)) + (Number(plan.details.NoOfVehicles)) + (Number(plan.details.ApwNoOfVehicles));
                
                  plan.shiftPlanDetails.forEach((shift)=>{
                    (shift.liftTimePlanDetails || []).forEach((lt)=>{
                      const details = lt?.Details?.[0];
                      if (details) {
                        totalActual += Number(details.Actual) || 0;
                        totalCount++;
                      }
                    });
                  });
                
                  const productivity = totalCount > 0 ? (totalActual / totalCount).toFixed(0) : 0;
                  const estHrOfCompletion = productivity > 0 ? ((totalLifts-totalActual)/productivity).toFixed(0) : 0;
                
                  return (
                    <td key={plan.gangNumber} colSpan={3} className='text-center px-2 border-x-1 border-neutral-400 bg-neutral-200'>{estHrOfCompletion}</td>
                  );
                }
            
                if (details.NoOfVehicles === 0 && details.BBLK !== 0) {
                  let totalActual = 0;
                  let totalCount = 0;
                  const totalLifts = (Number(plan.details.Discharge)) + (Number(plan.details.Overstow)) + (Number(plan.details.Restow)) + (Number(plan.details.Loads)) + (Number(plan.details.NoOfVehicles)) + (Number(plan.details.ApwNoOfVehicles));
                
                  plan.shiftPlanDetails.forEach((shift)=>{
                    (shift.liftTimePlanDetails || []).forEach((lt)=>{
                      const details = lt?.Details?.[0];
                      if (details) {
                        totalActual += Number(details.Actual) || 0;
                        totalCount++;
                      }
                    });
                  });
                
                  const productivity = totalCount > 0 ? (totalActual / totalCount).toFixed(0) : 0;
                  const estHrOfCompletion = productivity > 0 ? ((totalLifts-totalActual)/productivity).toFixed(0) : 0;
                
                  return (
                    <td key={plan.gangNumber} colSpan={3} className='text-center px-2 border-x-1 border-neutral-400 bg-neutral-200'>{estHrOfCompletion}</td>
                  );
                }
            
                if (details.NoOfVehicles !== 0 && details.BBLK !== 0) {
                  let totalActual = 0;
                  let totalCount = 0;
                  const totalLifts = (Number(plan.details.Discharge)) + (Number(plan.details.Overstow)) + (Number(plan.details.Restow)) + (Number(plan.details.Loads)) + (Number(plan.details.NoOfVehicles)) + (Number(plan.details.ApwNoOfVehicles));
                
                  plan.shiftPlanDetails.forEach((shift)=>{
                    (shift.liftTimePlanDetails || []).forEach((lt)=>{
                      const details = lt?.Details?.[0];
                      if (details) {
                        totalActual += Number(details.Actual) || 0;
                        totalCount++;
                      }
                    });
                  });
                
                  const productivity = totalCount > 0 ? (totalActual / totalCount).toFixed(0) : 0;
                  const estHrOfCompletion = productivity > 0 ? ((totalLifts-totalActual)/productivity).toFixed(0) : 0;
                
                  return (
                    <React.Fragment key={plan.gangNumber}>
                      <td colSpan={3} className='text-center px-2 border-x-1 border-neutral-400 bg-neutral-200'>{estHrOfCompletion}</td>
                      <td colSpan={1}></td>
                    </React.Fragment>
                  );
                }
              }
              let totalActual = 0;
              let totalCount = 0;
              const totalLifts = (Number(plan.details.Discharge)) + (Number(plan.details.Overstow)) + (Number(plan.details.Restow)) + (Number(plan.details.Loads));

              plan.shiftPlanDetails.forEach((shift)=>{
                (shift.liftTimePlanDetails || []).forEach((lt)=>{
                  const details = lt?.Details?.[0];
                  if (details) {
                    totalActual += Number(details.Actual) || 0;
                    totalCount++;
                  }
                });
              });

              const productivity = totalCount > 0 ? (totalActual / totalCount).toFixed(0) : 0;
              const estHrOfCompletion = productivity > 0 ? ((totalLifts-totalActual)/productivity).toFixed(0) : 0;

              return (
                <td key={plan.gangNumber} colSpan={3} className='text-center px-2 border-x-1 border-neutral-400 bg-neutral-200'>{estHrOfCompletion}</td>
              );
            })}
          </tr>         
        </tbody>
      </table>
    </div>
  );
}

export default GangDetailsGen