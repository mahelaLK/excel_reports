import React, { useContext } from 'react'
import { PortContext } from '../../context/PortContext';
import { IoMdDownload } from "react-icons/io";

const GangDetailsCar = ({vesselName, inwardVoyage}) => {
  
  const { gangDetailCars, exportTableStyledCar } = useContext(PortContext);
  
      if (!gangDetailCars) {
          return <p>Loading....</p>
      }
  
    return (
      <div className='flex flex-col mt-4'>
        <button onClick={()=>exportTableStyledCar(vesselName)} className='bg-green-900 text-green-100 px-2 py-1 my-3 rounded-lg flex gap-2 justify-center items-center w-full'>Export to Excel <IoMdDownload/></button>
        {/* === Gang Summary Table === */}
        <table id='gangTable' border="1" cellPadding="5" className='w-full border-collapse bg-neutral-100'>
          <tbody>
            {/* Voyage Inward */}
            <tr className='border-b-2 border-neutral-700 bg-neutral-200'>
              <td colSpan={2+(gangDetailCars.gangPlanDetails.length * 4)} className='text-center'>VESSEL NAME/VOYAGE: {vesselName}</td>
            </tr>
  
            {/* BerthSide */}
            <tr className='border-b-1 border-neutral-700 bg-neutral-200'>
              <td colSpan={2+(gangDetailCars.gangPlanDetails.length * 4)} className='text-center'>Berthside : {gangDetailCars.berthSide}</td>
            </tr>
  
            {/* Gang row */}
            <tr className='border-b-1 border-neutral-600'>
              <td className='px-2 bg-neutral-300'>Gang</td>
              {gangDetailCars.gangPlanDetails.map((plan) => (
                <td key={plan.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>{plan.gangNumber}</td>
              ))}
            </tr>
  
            {/* Crane row */}
            <tr className='border-b-1 border-neutral-600'>
              <td className='px-2 bg-neutral-300'>Crane</td>
              {gangDetailCars.gangPlanDetails.map((plan) => (
                <td key={plan.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>{plan.details.Crane}</td>
              ))}
            </tr>

            {/* Cont/BBLK/VEH */}
            <tr className='border-b-1 border-neutral-600'>
              <td className='px-2 bg-neutral-300'>Cont/BBLK/VEH</td>
              {gangDetailCars.gangPlanDetails.map((plan) => {
                const details = plan.details;
                let type = '';

                if(details.NoOfVehicles !== 0) type = 'VEH';
                if(details.BBLK !== 0) type = 'BBLK';
                if(details.NoOfVehicles !== 0 && details.BBLK !== 0) type = 'Cont';

                return(
                  <td key={plan.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>{type}</td>
                )
              })}
            </tr>
  
            {/* List of Bays */}
            <tr className='border-b-1 border-neutral-600'>
              <td className='px-2 bg-neutral-300'>Bays</td>
              {gangDetailCars.gangPlanDetails.map((plan) => (
                <td key={plan.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>{plan.details.ListOfBays}</td>
              ))}
            </tr>
  
            {/* Discharge row */}
            <tr className='border-b-1 border-neutral-500'>
              <td className='px-2 bg-neutral-300'>Discharge</td>
              {gangDetailCars.gangPlanDetails.map((plan) => (
                <td key={plan.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>{plan.details.Discharge}</td>
              ))}
              <td colSpan={1 + gangDetailCars.gangPlanDetails.length} className='text-center bg-neutral-200'>{gangDetailCars.gangPlanDetails
                .reduce((sum, plan) => sum + (Number(plan.details.Discharge) || 0), 0)
                }</td>
            </tr>
  
            {/* Overstow row */}
            <tr className='border-b-1 border-neutral-500'>
              <td className='px-2 bg-neutral-300'>Overstow</td>
              {gangDetailCars.gangPlanDetails.map((plan) => (
                <td key={plan.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>{plan.details.Overstow}</td>
              ))}
              <td colSpan={1 + gangDetailCars.gangPlanDetails.length} className='text-center bg-neutral-200'>{gangDetailCars.gangPlanDetails
                .reduce((sum, plan) => sum + (Number(plan.details.Overstow) || 0), 0)
                }</td>
            </tr>
  
            {/* Restow row */}
            <tr className='border-b-1 border-neutral-500'>
              <td className='px-2 bg-neutral-300'>Restow</td>
              {gangDetailCars.gangPlanDetails.map((plan) => (
                <td key={plan.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>{plan.details.Restow}</td>
              ))}
              <td colSpan={1 + gangDetailCars.gangPlanDetails.length} className='text-center bg-neutral-200'>{gangDetailCars.gangPlanDetails
                .reduce((sum, plan) => sum + (Number(plan.details.Restow) || 0), 0)
                }</td>
            </tr>
  
            {/* Loads row */}
            <tr className='border-b-1 border-neutral-500'>
              <td className='px-2 bg-neutral-300'>Loads</td>
              {gangDetailCars.gangPlanDetails.map((plan) => (
                <td key={plan.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2'>{plan.details.Loads}</td>
              ))}
              <td colSpan={1 + gangDetailCars.gangPlanDetails.length} className='text-center bg-neutral-200'>{gangDetailCars.gangPlanDetails
                .reduce((sum, plan) => sum + (Number(plan.details.Loads) || 0), 0)
                }</td>
            </tr>
  
            {/* No of Lifts */}
            <tr className='border-b-1 border-neutral-700'>
              <td className='px-2 bg-neutral-300'>No of Lifts</td>
              {gangDetailCars.gangPlanDetails.map((plan) => (
                <td key={plan.gangNumber} colSpan={3} className='border-x-1 border-neutral-400 px-2 bg-neutral-200'>{(Number(plan.details.Loads) || 0) + (Number(plan.details.Restow) || 0) + (Number(plan.details.Overstow) || 0) + (Number(plan.details.Discharge) || 0)}</td>
              ))}
              <td colSpan={1 + gangDetailCars.gangPlanDetails.length} className='text-center bg-neutral-300'>{gangDetailCars.gangPlanDetails
                .reduce((sum, plan) => sum + (Number(plan.details.Loads) || 0) + (Number(plan.details.Restow) || 0) + (Number(plan.details.Overstow) || 0) + (Number(plan.details.Discharge) || 0), 0)
                }</td>
            </tr>
  
            {/* Shift details */}
            
            {(() => {
              // keep global cumulative variance per gang
              const globalRunning = gangDetailCars.gangPlanDetails.map(() => 0);
  
              return [...new Set(
                gangDetailCars.gangPlanDetails.flatMap(g => g.shiftPlanDetails.map(s => s.ShiftNumber))
              )].map(shiftNo => {
                const firstShift = gangDetailCars.gangPlanDetails[0].shiftPlanDetails.find(s => s.ShiftNumber === shiftNo);
                const baselineLiftTimes = firstShift?.liftTimePlanDetails ?? [];
  
                // Precompute cumulative variance for each gang in this shift (continuing from globalRunning)
                const cumulativeByGang = gangDetailCars.gangPlanDetails.map((plan, gangIdx) => {
                  const shift = plan.shiftPlanDetails.find(s => s.ShiftNumber === shiftNo);
                  const ltPlan = shift?.liftTimePlanDetails ?? [];
                  let running = globalRunning[gangIdx]; // continue from last shift
                  const rows = [];
  
                  for (let idx = 0; idx < baselineLiftTimes.length; idx++) {
                    const lt = ltPlan[idx];
                    const details = lt?.Details?.[0];
  
                    const hasTarget = details && details.Target != null && String(details.Target).trim() !== '';
                    const hasActual = details && details.Actual != null && String(details.Actual).trim() !== '';
  
                    if (hasTarget || hasActual) {
                      const tNum = hasTarget ? Number(details.Target) : 0;
                      const aNum = hasActual ? Number(details.Actual) : 0;
                      const delta = aNum - tNum;
                      running += delta;
                      rows.push({ targetRaw: details.Target, actualRaw: details.Actual, cumulative: running });
                    } else {
                      rows.push({ targetRaw: null, actualRaw: null, cumulative: running });
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
                      <td colSpan={1 + gangDetailCars.gangPlanDetails.length * 3} className='text-center px-2 bg-neutral-300'>
                        SHIFT {shiftNo}
                      </td>
                      <td rowSpan={2} className='border-x-1 border-neutral-400 text-center px-2 bg-neutral-300'>Remarks</td>
                      <td colSpan={gangDetailCars.gangPlanDetails.length} className='text-center px-2 bg-neutral-300'>
                        SHIFT {shiftNo} SHIP SUPERVISOR: {firstShift?.Supervisor ?? '-'}
                      </td>
                    </tr>
  
                    {/* Date + headers row */}
                    <tr className='border-b-1 border-neutral-500'>
                      <td className='px-2 bg-neutral-300'>
                        {firstShift?.ShiftStartDate ? (() => {
                          const d = new Date(firstShift.ShiftStartDate);
                          return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
                        })() : '-'}
                      </td>
  
                      {gangDetailCars.gangPlanDetails.map(plan => {
                        const shift = plan.shiftPlanDetails.find(s => s.ShiftNumber === shiftNo);
                        return shift ? (
                          <React.Fragment key={plan.gangNumber}>
                            <td className='border-x-1 border-neutral-400 px-2 text-center bg-neutral-200'>Target</td>
                            <td className='border-x-1 border-neutral-400 px-2 text-center bg-neutral-200'>Actual</td>
                            <td className='border-x-1 border-neutral-400 px-2 text-center bg-neutral-200'>Variance</td>
                          </React.Fragment>
                        ) : (
                          <td colSpan={3} key={plan.gangNumber} className='border-x-1 border-neutral-400 px-2 text-center'>-</td>
                        )
                      })}
  
                      {gangDetailCars.gangPlanDetails.map(plan => (
                        <td key={plan.gangNumber} className='border-l-1 border-neutral-400 text-center px-2 bg-neutral-200'>{plan.details.Crane}</td>
                      ))}
                    </tr>
  
                    {/* Shift data rows */}
                    {baselineLiftTimes.map((lt, i) => (
                      <tr key={`shift-${shiftNo}-row-${i}`} className='border-b-1 border-neutral-500'>
                        <td className='px-2 bg-neutral-200'>{lt?.LiftTime ?? '-'}</td>
  
                        {gangDetailCars.gangPlanDetails.map((plan, gangIdx) => {
                          const cell = cumulativeByGang[gangIdx]?.[i] ?? { targetRaw: null, actualRaw: null, cumulative: globalRunning[gangIdx] };
                          return (
                            <React.Fragment key={`${plan.gangNumber}-row-${i}`}>
                              <td className='border-x-1 border-neutral-400 px-2 text-center'>{cell.targetRaw != null ? cell.targetRaw : '-'}</td>
                              <td className='border-x-1 border-neutral-400 px-2 text-center'>{cell.actualRaw != null ? cell.actualRaw : '-'}</td>
                              <td className='border-x-1 border-neutral-400 px-2 text-center'>{cell.cumulative}</td>
                            </React.Fragment>
                          );
                        })}
  
                        {/* Remarks */}
                        <td className='px-2 text-left'>{gangDetailCars.gangPlanDetails.map(plan => {
                          const crane = plan.details.Crane;
                          const shift = plan.shiftPlanDetails.find(s => s.ShiftNumber === shiftNo);
                          const ltThis = shift?.liftTimePlanDetails[i];
                          const remark = ltThis?.Details?.[0]?.Remarks;
                          return remark && remark.trim() !== "" ? `${crane}: ${remark}` : null;
                        }).filter(Boolean).join(" | ") || '-'}</td>
  
                        {gangDetailCars.gangPlanDetails.map(plan => {
                          const shift = plan.shiftPlanDetails.find(s => s.ShiftNumber === shiftNo);
                          return (
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
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                );
              });
            })()}
            <tr className='border-b-1 border-neutral-700'>
              <td className='px-2 bg-neutral-300'>Total lifts left</td>
              {gangDetailCars.gangPlanDetails.map((plan)=>{
                const totalLifts = (Number(plan.details.Discharge)) + (Number(plan.details.Overstow)) + (Number(plan.details.Restow)) + (Number(plan.details.Loads));
                const totalActual = plan.shiftPlanDetails.reduce((sum, shift)=>{
                  const shiftSum = (shift.liftTimePlanDetails || []).reduce((s, lt)=>{
                    const details = lt?.Details?.[0];
                    return s+ (Number(details?.Actual) || 0);
                  }, 0);
                  return sum + shiftSum;
                }, 0);
                return (
                  <td key={plan.gangNumber} colSpan={3} className='text-center px-2 border-x-1 border-neutral-400 bg-neutral-200'>{totalLifts-totalActual}</td>
                );
              })}
            </tr>
            <tr className='border-b-1 border-neutral-700'>
              <td className='px-2 bg-neutral-300'>Productivity Rate</td>
              {gangDetailCars.gangPlanDetails.map((plan)=>{
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
              {gangDetailCars.gangPlanDetails.map((plan)=>{
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
    )
}

export default GangDetailsCar