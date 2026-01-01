import React from 'react'
import { useContext } from 'react'
import { PortContext } from '../../context/PortContext'
import { IoMdDownload } from 'react-icons/io';

const CprDetails = ({vesselName, inwardVoyage}) => {

    const { cprDetails, exportCprStyled } = useContext(PortContext);

    if (!cprDetails) {
        return <p>Loading....</p>
    }

  return (
    <div className='flex flex-col mt-4'>
        <button onClick={()=>exportCprStyled(vesselName, inwardVoyage, cprDetails)} className='bg-green-900 text-green-100 px-2 py-1 my-3 rounded-lg flex gap-2 justify-center items-center'>Export to Excel <IoMdDownload/></button>
        
        {cprDetails.shiftNumbers.map(shiftNo=>{
            const shiftInfo = cprDetails.shiftDetails.find(s=>s.shiftNumber === shiftNo);

            return(
                <React.Fragment key={shiftNo}>
                    <table border="1" cellPadding="5" className='w-full border-collapse bg-neutral-100 mb-4'>
                        <tbody>
                            <tr className='border-y-1 border-neutral-700 bg-neutral-300'>
                                <td className='pl-2' colSpan={2}>Vessel Name: {vesselName}</td>
                                <td className='pl-2 border-l-1'>Voyage: {inwardVoyage}</td>
                            </tr>
                            <tr className='border-b-1 border-neutral-700 bg-neutral-200'>
                                <td className='pl-2'>Shift {shiftNo}</td>
                                <td className='pl-2 border-l-1'>Commenced: {shiftInfo.shiftStartDate?.split("T")[0]} {shiftInfo.shiftStartTime}</td>
                                <td className='pl-2 border-l-1'>Completed: {shiftInfo.shiftEndDate?.split("T")[0]} {shiftInfo.shiftEndTime}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table border="1" cellPadding="5" className='w-full border-collapse bg-neutral-100 mb-4'>
                        <tbody>
                            <tr className='border-y-1 border-neutral-700 bg-neutral-100'>
                                <td className='pl-2 bg-neutral-200' rowSpan={2}>Crane</td>
                                {shiftInfo?.cranes.map(crane=>(
                                    <td key={crane.GangPlanHeaderID} className='pl-2 border-l-2 text-center' colSpan={3}>{crane.Crane}</td>
                                ))}
                            </tr>
                            <tr className='border-b-1 border-neutral-700 bg-neutral-100'>
                                {shiftInfo?.cranes.map(crane=>(
                                    <React.Fragment key={crane.GangPlanHeaderID}>
                                        <td className='pl-2 border-l-2 bg-neutral-200'>Name</td>
                                        <td className='px-2 border-l-1 bg-neutral-200 text-center'>EDP</td>
                                        <td className='px-2 border-l-1 bg-neutral-200 text-center'>Blank</td>
                                    </React.Fragment>
                                ))}
                            </tr>
                            <tr className='border-b-1 border-neutral-700 bg-neutral-100'>
                                <td className='pl-2 bg-neutral-200'>Foreman</td>
                                {shiftInfo?.cranes.map(crane=>{
                                    const craneInfo = shiftInfo.craneDetails.find(c=>c.gphID===crane.GangPlanHeaderID);

                                    return (
                                        <React.Fragment key={crane.GangPlanHeaderID + '_foreman'}>
                                            <td className='pl-2 border-l-2'>{craneInfo?.foreman || '-'}</td>
                                            <td className='px-2 border-l-1 text-center'>{craneInfo?.foremanEmpNo || '-'}</td>
                                            <td className='px-2 border-l-1 text-center'>Blank</td>
                                        </React.Fragment>
                                    );
                                })}
                            </tr>
                            <tr className='border-b-2 border-neutral-700 bg-neutral-100'>
                                <td className='pl-2 bg-neutral-200'>BayPlanner</td>
                                {shiftInfo?.cranes.map(crane=>{
                                    const craneInfo = shiftInfo.craneDetails.find(c=>c.gphID===crane.GangPlanHeaderID);

                                    return (
                                        <React.Fragment key={crane.GangPlanHeaderID + '_bayplanner'}>
                                            <td className='pl-2 border-l-2'>{craneInfo?.bayplanner || '-'}</td>
                                            <td className='px-2 border-l-1 text-center'>{craneInfo?.bayplannerEmpNo || '-'}</td>
                                            <td className='px-2 border-l-1 text-center'>Blank</td>
                                        </React.Fragment>
                                    );
                                })}
                            </tr>
                            <tr className='border-b-1 border-neutral-700 bg-neutral-200'>
                                <td className='pl-2'>Time</td>
                                {shiftInfo?.cranes.map(crane=>(
                                    <React.Fragment key={crane.GangPlanHeaderID}>
                                        <td className='pl-2 border-l-2'>Crane Operator Name</td>
                                        <td className='px-2 border-l-1 text-center'>EDP</td>
                                        <td className='px-2 border-l-1 text-center'>Productivity</td>
                                    </React.Fragment>
                                ))}
                            </tr>
                            {shiftInfo.liftTimeShift.map(liftTime => (
                                <tr key={`${shiftInfo.shiftNumber}_${liftTime}`} className='border-b-1 border-neutral-700 bg-neutral-100'>
                                    <td className='pl-2 bg-neutral-200'>{liftTime}</td>

                                    {shiftInfo.craneDetails.map(crane => {
                                        const liftTimeInfo = crane.liftTimeDetails.find(l => l.liftTime === liftTime);
                                        return (
                                            <React.Fragment key={`${shiftInfo.shiftNumber}_${liftTime}_${crane.gphID}`}>
                                                <td className='pl-2 border-l-2'>{liftTimeInfo?.winchman?.[0] || '-'}</td>
                                                <td className='px-2 border-l-1 text-center'>{liftTimeInfo?.winchmanEmpNo?.[0] || '-'}</td>
                                                <td className='px-2 border-l-1 text-center'>{liftTimeInfo?.actual?.[0] || 0}</td>
                                            </React.Fragment>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <table border="1" cellPadding="5" className='w-full border-collapse bg-neutral-100 mb-4'>
                        <tbody>
                            <tr className='border-y-1 border-neutral-700 bg-neutral-200'>
                                <td className='pl-2'>SR</td>
                                <td className='pl-2 border-l-1'>Crane Type</td>
                                <td className='pl-2 border-l-1'>Crane Operator</td>
                                <td className='pl-2 border-l-1 text-center'>EDP</td>
                                <td className='pl-2 border-l-1 text-center'>Hours Worked</td>
                                <td className='pl-2 border-l-1 text-center'>Total Moves</td>
                                <td className='pl-2 border-l-1 text-center'>Actual Productivity</td>
                                <td className='pl-2 border-l-1 text-center'>Target</td>
                                <td className='pl-2 border-l-1 text-center'>Varience</td>
                            </tr>
                            {shiftInfo.summary?.map((record, index) => (
                                <tr key={index} className='border-b-1 border-neutral-700 bg-neutral-100'>
                                    <td className='pl-2'>{index + 1}</td>
                                    <td className='pl-2 border-l-1'>{record.craneType}</td>
                                    <td className='pl-2 border-l-1'>{record.winchman}</td>
                                    <td className='pl-2 border-l-1 text-center'>{record.winchmanEmpNo}</td>
                                    <td className='pl-2 border-l-1 text-center'>{record.totalHours}</td>
                                    <td className='pl-2 border-l-1 text-center'>{record.totalProductivity}</td>
                                    <td className='pl-2 border-l-1 text-center'>{Number(record.totalProductivity/record.totalHours).toFixed(0)}</td>
                                    <td className='pl-2 border-l-1 text-center'>{record.avgTarget}</td>
                                    <td className='pl-2 border-l-1 text-center'>{Number((record.totalProductivity/record.totalHours).toFixed(0)-(record.avgTarget))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </React.Fragment>
            );
        })}
    </div>
  )
}

export default CprDetails