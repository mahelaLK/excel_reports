import React, { useContext, useEffect, useState } from 'react'
import { PortContext } from '../../context/PortContext';
import { IoMdDownload } from "react-icons/io";

const GangDetailsGen = ({vesselName, inwardVoyage}) => {

    const { gangDetailsGen, exportTableStyledGen } = useContext(PortContext);

    if (!gangDetailsGen) {
        return <p>Loading....</p>
    }

    const totalGangDetails = gangDetailsGen.gangPlanDetails
        ? gangDetailsGen.gangPlanDetails.reduce((sum, plan)=>sum+(plan.gangDetails?.length || 0), 0)
        : 0;

  return (
    <div className="flex flex-col mt-4">
      <button
        onClick={() => exportTableStyledGen(vesselName)}
        className="bg-green-900 text-green-100 px-2 py-1 my-3 rounded-lg flex gap-2 justify-center items-center w-full"
      >
        Export to Excel <IoMdDownload />
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
            <td colSpan={2 + totalGangDetails * 4} className="text-center">
              VESSEL NAME/VOYAGE: {vesselName}
            </td>
          </tr>

          {/* BerthSide */}
          <tr className="border-b-1 border-neutral-700 bg-neutral-200">
            <td colSpan={2 + totalGangDetails * 4} className="text-center">
              Berthside : {gangDetailsGen.berthSide}
            </td>
          </tr>

          {/* Gang row */}
          <tr className="border-b-1 border-neutral-600">
            <td className="px-2 bg-neutral-300">Gang</td>
            {gangDetailsGen.gangPlanDetails.map((plan) => (
              <td
                key={plan.gangNumber}
                colSpan={3 * (plan.gangDetails?.length || 1)}
                className="border-x-1 border-neutral-400 px-2 text-center"
              >
                {plan.gangNumber}
              </td>
            ))}
          </tr>

          {/* Crane row */}
          <tr className="border-b-1 border-neutral-600">
            <td className="px-2 bg-neutral-300">Crane</td>
            {gangDetailsGen.gangPlanDetails.map((plan) => (
              <td
                key={plan.gangNumber}
                colSpan={3 * (plan.gangDetails?.length || 1)}
                className="border-x-1 border-neutral-400 px-2 text-center"
              >
                {plan.Crane}
              </td>
            ))}
          </tr>

          {/* List of Bays */}
          <tr className="border-b-1 border-neutral-600">
            <td className="px-2 bg-neutral-300">Bays</td>
            {gangDetailsGen.gangPlanDetails.map((plan) => {
              const bays = plan.gangDetails
                .map((d) => d.listOfBays)
                .filter(Boolean);

              // Single bay
              if (bays.length === 1) {
                return (
                  <td
                    key={plan.gangNumber}
                    colSpan={3}
                    className="border-x-1 border-neutral-400 px-2 text-center"
                  >
                    {bays[0]}
                  </td>
                );
              }

              // Multiple bays
              return bays.map((bay, i) => (
                <td
                  key={`${plan.gangNumber}-${i}`}
                  className="border-x-1 border-neutral-400 px-2 text-center"
                  colSpan={3}
                >
                  {bay}
                </td>
              ));
            })}
          </tr>

          {/* Discharge row */}
          <tr className="border-b-1 border-neutral-500">
            <td className="px-2 bg-neutral-300">Discharge</td>

            {gangDetailsGen.gangPlanDetails.map((plan) => {
              const details = plan.gangDetails;

              if (details.length === 1) {
                // single bay
                return (
                  <td
                    key={plan.gangNumber}
                    colSpan={3}
                    className="border-x-1 border-neutral-400 px-2 text-center"
                  >
                    {details[0].Discharge}
                  </td>
                );
              }

              // multiple bays
              return details.map((d, i) => (
                <td
                  key={`${plan.gangNumber}-${i}`}
                  className="border-x-1 border-neutral-400 px-2 text-center"
                  colSpan={3}
                >
                  {d.Discharge}
                </td>
              ));
            })}

            {/* Total discharge column */}
            <td
              colSpan={1 + gangDetailsGen.gangPlanDetails.length}
              className="text-center bg-neutral-200 font-semibold"
            >
              {gangDetailsGen.gangPlanDetails.reduce((sum, plan) => {
                const totalForPlan = plan.gangDetails.reduce(
                  (subSum, d) => subSum + (Number(d.Discharge) || 0),
                  0
                );
                return sum + totalForPlan;
              }, 0)}
            </td>
          </tr>

          {/* Overstow row */}
          <tr className="border-b-1 border-neutral-500">
            <td className="px-2 bg-neutral-300">Overstow</td>

            {gangDetailsGen.gangPlanDetails.map((plan) => {
              const details = plan.gangDetails;

              if (details.length === 1) {
                // single bay
                return (
                  <td
                    key={plan.gangNumber}
                    colSpan={3}
                    className="border-x-1 border-neutral-400 px-2 text-center"
                  >
                    {details[0].Overstow}
                  </td>
                );
              }

              // multiple bays
              return details.map((d, i) => (
                <td
                  key={`${plan.gangNumber}-${i}`}
                  className="border-x-1 border-neutral-400 px-2 text-center"
                  colSpan={3}
                >
                  {d.Overstow}
                </td>
              ));
            })}

            {/* Total overstow column */}
            <td
              colSpan={1 + gangDetailsGen.gangPlanDetails.length}
              className="text-center bg-neutral-200 font-semibold"
            >
              {gangDetailsGen.gangPlanDetails.reduce((sum, plan) => {
                const totalForPlan = plan.gangDetails.reduce(
                  (subSum, d) => subSum + (Number(d.Overstow) || 0),
                  0
                );
                return sum + totalForPlan;
              }, 0)}
            </td>
          </tr>

          {/* Restow row */}
          <tr className="border-b-1 border-neutral-500">
            <td className="px-2 bg-neutral-300">Restow</td>

            {gangDetailsGen.gangPlanDetails.map((plan) => {
              const details = plan.gangDetails;

              if (details.length === 1) {
                // single bay
                return (
                  <td
                    key={plan.gangNumber}
                    colSpan={3}
                    className="border-x-1 border-neutral-400 px-2 text-center"
                  >
                    {details[0].Restow}
                  </td>
                );
              }

              // multiple bays
              return details.map((d, i) => (
                <td
                  key={`${plan.gangNumber}-${i}`}
                  className="border-x-1 border-neutral-400 px-2 text-center"
                  colSpan={3}
                >
                  {d.Restow}
                </td>
              ));
            })}

            {/* Total Restow column */}
            <td
              colSpan={1 + gangDetailsGen.gangPlanDetails.length}
              className="text-center bg-neutral-200 font-semibold"
            >
              {gangDetailsGen.gangPlanDetails.reduce((sum, plan) => {
                const totalForPlan = plan.gangDetails.reduce(
                  (subSum, d) => subSum + (Number(d.Restow) || 0),
                  0
                );
                return sum + totalForPlan;
              }, 0)}
            </td>
          </tr>

          {/* Loads row */}
          <tr className="border-b-1 border-neutral-500">
            <td className="px-2 bg-neutral-300">Loads</td>

            {gangDetailsGen.gangPlanDetails.map((plan) => {
              const details = plan.gangDetails;

              if (details.length === 1) {
                // single bay
                return (
                  <td
                    key={plan.gangNumber}
                    colSpan={3}
                    className="border-x-1 border-neutral-400 px-2 text-center"
                  >
                    {details[0].Loads}
                  </td>
                );
              }

              // multiple bays
              return details.map((d, i) => (
                <td
                  key={`${plan.gangNumber}-${i}`}
                  className="border-x-1 border-neutral-400 px-2 text-center"
                  colSpan={3}
                >
                  {d.Loads}
                </td>
              ));
            })}

            {/* Total Loads column */}
            <td
              colSpan={1 + gangDetailsGen.gangPlanDetails.length}
              className="text-center bg-neutral-200 font-semibold"
            >
              {gangDetailsGen.gangPlanDetails.reduce((sum, plan) => {
                const totalForPlan = plan.gangDetails.reduce(
                  (subSum, d) => subSum + (Number(d.Loads) || 0),
                  0
                );
                return sum + totalForPlan;
              }, 0)}
            </td>
          </tr>

          {/* No of Lifts row */}
          <tr className="border-b-1 border-neutral-500">
            <td className="px-2 bg-neutral-300">No of Lifts</td>

            {gangDetailsGen.gangPlanDetails.map((plan) => {
              const details = plan.gangDetails;

              if (details.length === 1) {
                // single bay
                return (
                  <td
                    key={plan.gangNumber}
                    colSpan={3}
                    className="border-x-1 border-neutral-400 px-2 text-center"
                  >
                    {Number(details[0].Discharge) +
                      Number(details[0].Overstow) +
                      Number(details[0].Restow) +
                      Number(details[0].Loads)}
                  </td>
                );
              }

              // multiple bays
              return details.map((d, i) => (
                <td
                  key={`${plan.gangNumber}-${i}`}
                  className="border-x-1 border-neutral-400 px-2 text-center"
                  colSpan={3}
                >
                  {Number(d.Discharge) +
                    Number(d.Overstow) +
                    Number(d.Restow) +
                    Number(d.Loads)}
                </td>
              ));
            })}

            {/* Total No of Lifts column */}
            <td
              colSpan={1 + gangDetailsGen.gangPlanDetails.length}
              className="text-center bg-neutral-200 font-semibold"
            >
              {gangDetailsGen.gangPlanDetails.reduce((sum, plan) => {
                const totalForPlan = plan.gangDetails.reduce(
                  (subSum, d) =>
                    subSum +
                    Number(d.Discharge) +
                    Number(d.Overstow) +
                    Number(d.Restow) +
                    (Number(d.Loads) || 0),
                  0
                );
                return sum + totalForPlan;
              }, 0)}
            </td>
          </tr>

          {/* Shift details */}

          {(() => {
            // Keep global cumulative variance per gang detail (not per gang)
            const globalRunning = [];
            gangDetailsGen.gangPlanDetails.forEach(gang => {
              gang.gangDetails.forEach(() => {
                globalRunning.push(0);
              });
            });

            // Get all unique shift numbers across all gangs
            const allShiftNumbers = [
              ...new Set(
                gangDetailsGen.gangPlanDetails.flatMap(g =>
                  g.gangDetails.flatMap(gd =>
                    gd.shiftPlanDetails.map(s => s.ShiftNumber)
                  )
                )
              ),
            ].sort((a, b) => a - b);

            return allShiftNumbers.map((shiftNo) => {
              // Get baseline lift times from first gang's first detail
              const firstGangFirstDetail = gangDetailsGen.gangPlanDetails[0]?.gangDetails[0];
              const firstShift = firstGangFirstDetail?.shiftPlanDetails.find(
                (s) => s.ShiftNumber === shiftNo
              );
              const baselineLiftTimes = firstShift?.liftTimePlanDetails ?? [];

              // Calculate cumulative variance for each gang detail
              let globalRunningIdx = 0;
              const cumulativeByGangDetail = [];
              
              gangDetailsGen.gangPlanDetails.forEach(gang => {
                gang.gangDetails.forEach(gangDetail => {
                  const shift = gangDetail.shiftPlanDetails.find(
                    (s) => s.ShiftNumber === shiftNo
                  );
                  const ltPlan = shift?.liftTimePlanDetails ?? [];
                  let running = globalRunning[globalRunningIdx];
                  const rows = [];

                  for (let idx = 0; idx < baselineLiftTimes.length; idx++) {
                    const lt = ltPlan[idx];
                    const details = lt?.Details?.[0];

                    const hasTarget = details && details.Target != null && String(details.Target).trim() !== "";
                    const hasActual = details && details.Actual != null && String(details.Actual).trim() !== "";

                    if (hasTarget || hasActual) {
                      const tNum = hasTarget ? Number(details.Target) : 0;
                      const aNum = hasActual ? Number(details.Actual) : 0;
                      const delta = aNum - tNum;
                      running += delta;
                      rows.push({
                        targetRaw: details.Target,
                        actualRaw: details.Actual,
                        cumulative: running,
                      });
                    } else {
                      rows.push({
                        targetRaw: null,
                        actualRaw: null,
                        cumulative: running,
                      });
                    }
                  }

                  globalRunning[globalRunningIdx] = running;
                  cumulativeByGangDetail.push(rows);
                  globalRunningIdx++;
                });
              });

              // Calculate total columns needed
              const totalTargetActualVarianceCols = gangDetailsGen.gangPlanDetails.reduce(
                (sum, gang) => sum + gang.gangDetails.length * 3,
                0
              );

              return (
                <React.Fragment key={`shift-${shiftNo}`}>
                  {/* Shift header row */}
                  <tr className="border-b-1 border-neutral-500">
                    <td
                      colSpan={1 + totalTargetActualVarianceCols}
                      className="text-center px-2 bg-neutral-300"
                    >
                      SHIFT {shiftNo}
                    </td>
                    <td
                      rowSpan={2}
                      className="border-x-1 border-neutral-400 text-center px-2 bg-neutral-300"
                    >
                      Remarks
                    </td>
                    <td
                      colSpan={gangDetailsGen.gangPlanDetails.reduce(
                        (sum, gang) => sum + gang.gangDetails.length,
                        0
                      )}
                      className="text-center px-2 bg-neutral-300"
                    >
                      SHIFT {shiftNo} SHIP SUPERVISOR: {firstShift?.Supervisor ?? "-"}
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

                    {gangDetailsGen.gangPlanDetails.map((gang) =>
                      gang.gangDetails.map((gangDetail, detailIdx) => {
                        const shift = gangDetail.shiftPlanDetails.find(
                          (s) => s.ShiftNumber === shiftNo
                        );
                        return shift ? (
                          <React.Fragment key={`${gang.gangNumber}-detail-${detailIdx}`}>
                            <td className="border-x-1 border-neutral-400 px-2 text-center bg-neutral-200">
                              Target
                            </td>
                            <td className="border-x-1 border-neutral-400 px-2 text-center bg-neutral-200">
                              Actual
                            </td>
                            <td className="border-x-1 border-neutral-400 px-2 text-center bg-neutral-200">
                              Variance
                            </td>
                          </React.Fragment>
                        ) : (
                          <td
                            colSpan={3}
                            key={`${gang.gangNumber}-detail-${detailIdx}`}
                            className="border-x-1 border-neutral-400 px-2 text-center"
                          >
                            -
                          </td>
                        );
                      })
                    )}

                    {gangDetailsGen.gangPlanDetails.map((gang) =>
                      (
                        <td key={gang.Crane} className="border-l-1 border-neutral-400 text-center px-2 bg-neutral-200">
                          {gang.Crane?.[0] ?? gang.Crane ?? "-"}
                        </td>
                      )
                    )}
                  </tr>

                  {/* Shift data rows */}
                  {baselineLiftTimes.map((lt, i) => (
                    <tr
                      key={`shift-${shiftNo}-row-${i}`}
                      className="border-b-1 border-neutral-500"
                    >
                      <td className="px-2 bg-neutral-200">{lt?.LiftTime ?? "-"}</td>

                      {(() => {
                        let cellIdx = 0;
                        return gangDetailsGen.gangPlanDetails.flatMap((gang) =>
                          gang.gangDetails.map((gangDetail) => {
                            const cell = cumulativeByGangDetail[cellIdx]?.[i] ?? {
                              targetRaw: null,
                              actualRaw: null,
                              cumulative: globalRunning[cellIdx],
                            };
                            cellIdx++;
                            return (
                              <React.Fragment key={`cell-${cellIdx}`}>
                                <td className="border-x-1 border-neutral-400 px-2 text-center">
                                  {cell.targetRaw != null ? cell.targetRaw : "-"}
                                </td>
                                <td className="border-x-1 border-neutral-400 px-2 text-center">
                                  {cell.actualRaw != null ? cell.actualRaw : "-"}
                                </td>
                                <td className="border-x-1 border-neutral-400 px-2 text-center">
                                  {cell.cumulative}
                                </td>
                              </React.Fragment>
                            );
                          })
                        );
                      })()}

                      {/* Remarks */}
                      <td className="px-2 text-left">
                        {gangDetailsGen.gangPlanDetails
                          .flatMap((gang) =>
                            gang.gangDetails.map((gangDetail) => {
                              const crane = gang.Crane?.[0] ?? gang.Crane;
                              const shift = gangDetail.shiftPlanDetails.find(
                                (s) => s.ShiftNumber === shiftNo
                              );
                              const ltThis = shift?.liftTimePlanDetails[i];
                              const remark = ltThis?.Details?.[0]?.Remarks;
                              return remark && remark.trim() !== ""
                                ? `${crane}: ${remark}`
                                : null;
                            })
                          )
                          .filter(Boolean)
                          .join(" | ") || "-"}
                      </td>

                      {gangDetailsGen.gangPlanDetails.map((gang) =>
                        {
                          const gangDetail = gang.gangDetails?.[0] ?? gang.GangDetails;
                          const crane = gang.Crane?.[0] ?? gang.Crane;
                          const isRamp = crane?.toUpperCase().includes("RAMP");
                          const shift = gangDetail.shiftPlanDetails.find(
                            (s) => s.ShiftNumber === shiftNo
                          );
                          //const ltThis = shift?.liftTimePlanDetails?.[i];
                          //const fm = shift?.Foreman?.[i];
                          
                          return (
                            <td
                              key={gang.Crane}
                              className="border-l-1 border-neutral-400 px-2"
                            >
                              {i === 0 && (
                                <>
                                  FM: {shift?.Foreman ?? "-"}
                                  <br />
                                  {isRamp ? (
                                    <>
                                      Time Keeper: {shift?.TK ?? "-"}
                                      <br />
                                      Drivers: {shift?.NoOfDrivers ?? "-"}
                                      <br />
                                      Checklist: {shift?.Checklist ?? "-"}
                                      <br />
                                      Traffic: {shift?.Traffic ?? "-"}
                                      <br />
                                      Unlashing: {shift?.Unlashing ?? "-"}
                                    </>
                                  ) : (
                                    <>
                                      BP: {shift?.BayPlanner?.[0] ?? "-"}
                                      <br />
                                      WM: {shift?.Winchman?.[0] ?? "-"}
                                      <br />
                                      RDT: {shift?.RDT?.[0] ?? "-"}
                                    </>
                                  )}
                                </>
                              )}
                            </td>
                          );
                        }
                      )}
                    </tr>
                  ))}
                </React.Fragment>
              );
            });
          })()}
            <tr className='border-b-1 border-neutral-700'>
              <td className='px-2 bg-neutral-300'>Total lifts left</td>
              {gangDetailsGen.gangPlanDetails.map((plan)=>{
                const details = plan.gangDetails;
                
                //Single bay
                if (details.length===1) {
                  const totalLifts = (Number(details[0]?.Discharge||0)) + (Number(details[0]?.Overstow||0)) + (Number(details[0]?.Restow||0)) + (Number(details[0]?.Loads||0));
                  const totalActual = details[0].shiftPlanDetails.reduce((sum, shift)=>{
                    const shiftSum = (shift.liftTimePlanDetails || []).reduce((s, lt)=>{
                      const detail = lt?.Details?.[0];
                      return s+ (Number(detail?.Actual) || 0);
                    }, 0);
                    return sum + shiftSum;
                  }, 0);
                  return (
                    <td key={plan.gangNumber} colSpan={3} className='text-center px-2 border-x-1 border-neutral-400 bg-neutral-200'>{totalLifts-totalActual}</td>
                  );
                }
                //Multiple bays
                return details.map((d, i)=>{
                  const totalLifts = (Number(d?.Discharge||0))||0 + (Number(d?.Overstow||0)) + (Number(d?.Restow||0)) + (Number(d?.Loads||0));
                  const totalActual = details[i].shiftPlanDetails.reduce((sum, shift)=>{
                    const shiftSum = (shift.liftTimePlanDetails || []).reduce((s, lt)=>{
                      const detail = lt?.Details?.[0];
                      return s+ (Number(detail?.Actual) || 0);
                    }, 0);
                    return sum + shiftSum;
                  }, 0);
                  return (
                    <td key={`${plan.gangNumber}-${i}`} className='text-center px-2 border-x-1 border-neutral-400 bg-neutral-200' colSpan={3}>{totalLifts-totalActual}</td>
                  );
                })
              })}
            </tr>
            <tr className='border-b-1 border-neutral-700'>
              <td className='px-2 bg-neutral-300'>Productivity Rate</td>
              {gangDetailsGen.gangPlanDetails.map((plan)=> {
                const details = plan.gangDetails;
                let totalActual=0;
                let totalCount=0;

                //Single bay
                if (details.length===1) {
                  details[0].shiftPlanDetails.forEach((shift)=>{
                    (shift.liftTimePlanDetails || []).forEach((lt)=>{
                      const detail = lt?.Details?.[0];
                      if (detail) {
                        totalActual += Number(detail.Actual) || 0;
                        totalCount++;
                      }
                    });
                  });
    
                  const productivity = totalCount > 0 ? (totalActual / totalCount).toFixed(0) : 0;
    
                  return (
                    <td key={plan.gangNumber} colSpan={3} className='text-center px-2 border-x-1 border-neutral-400 bg-neutral-200'>{productivity}</td>
                  );
                }
                //Multiple bays
                return details.map((d, i)=>{
                  details[i].shiftPlanDetails.forEach((shift)=>{
                    (shift.liftTimePlanDetails || []).forEach((lt)=>{
                      const detail = lt?.Details?.[0];
                      if (detail) {
                        totalActual += Number(detail.Actual) || 0;
                        totalCount++;
                      }
                    });
                  });
                  
                  const productivity = totalCount > 0 ? (totalActual / totalCount).toFixed(0) : 0;
                  return (
                    <td key={`${plan.gangNumber}-${i}`} colSpan={3} className='text-center px-2 border-x-1 border-neutral-400 bg-neutral-200'>{productivity}</td>
                  );
                })
              })}
            </tr>
            <tr className='border-b-1 border-neutral-700'>
              <td className='px-2 bg-neutral-300'>Est Hrs of Completion</td>
              {gangDetailsGen.gangPlanDetails.map((plan)=> {
                const details = plan.gangDetails;
                let totalActual=0;
                let totalCount=0;
                //Single bay
                if (details.length===1) {
                  const totalLifts = (Number(details[0]?.Discharge||0)) + (Number(details[0]?.Overstow||0)) + (Number(details[0]?.Restow||0)) + (Number(details[0]?.Loads||0));
                  details[0].shiftPlanDetails.forEach((shift)=>{
                    (shift.liftTimePlanDetails || []).forEach((lt)=>{
                      const detail = lt?.Details?.[0];
                      if (detail) {
                        totalActual += Number(detail.Actual) || 0;
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
                //Multiple bay
                return details.map((d, i)=>{
                  const totalLifts = (Number(d?.Discharge||0))||0 + (Number(d?.Overstow||0)) + (Number(d?.Restow||0)) + (Number(d?.Loads||0));
                  details[i].shiftPlanDetails.forEach((shift)=>{
                    (shift.liftTimePlanDetails || []).forEach((lt)=>{
                      const detail = lt?.Details?.[0];
                      if (detail) {
                        totalActual += Number(detail.Actual) || 0;
                        totalCount++;
                      }
                    });
                  });
                  
                  const productivity = totalCount > 0 ? (totalActual / totalCount).toFixed(0) : 0;
                  const estHrOfCompletion = productivity > 0 ? ((totalLifts-totalActual)/productivity).toFixed(0) : 0;
                  return (
                    <td key={`${plan.gangNumber}-${i}`} colSpan={3} className='text-center px-2 border-x-1 border-neutral-400 bg-neutral-200'>{estHrOfCompletion}</td>
                  );
                })
              })}
            </tr>           
        </tbody>
      </table>
    </div>
  );
}

export default GangDetailsGen