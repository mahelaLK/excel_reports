import React, { useContext } from 'react';
import { PortContext } from '../../context/PortContext';
import { IoMdDownload } from "react-icons/io";
import {assets} from '../../assets/assets.js'
import { useEffect } from 'react';
import { useState } from 'react';
import { berthTime } from '../../utils/calculations/berthTime.js';

const VprDetailsCar = ({vesselName, inwardVoyage}) => {

    const {vprDetails, grossWorkingTime, exportVprCarStyled} = useContext(PortContext);
    const [gwTime, setGwTime] = useState(null);
    const [bTime, setBTime] = useState(null);

    useEffect(()=>{
        if (vprDetails) {
            const resultGwTime = grossWorkingTime(vprDetails);
            const resultBerthTime = berthTime(vprDetails);
            setGwTime(resultGwTime);
            setBTime(resultBerthTime)
        }
    },[vprDetails])

    if (!vprDetails) {
        return <p>Loading....</p>
    }

    const maxRowTotalItem = vprDetails.craneInfo?.reduce((max, item)=>item.rowTotal > max.rowTotal ? item : max, vprDetails.craneInfo[0]);
    const grossCraneProductivity = maxRowTotalItem ? Number(maxRowTotalItem.rowTotal/maxRowTotalItem.duration).toFixed(0) : 0;

  return (
    <div className='flex flex-col mt-4'>
        <button onClick={()=>exportVprCarStyled(vesselName, inwardVoyage, gwTime, bTime, vprDetails, maxRowTotalItem)} className='bg-green-900 text-green-100 px-2 py-1 my-3 rounded-lg flex gap-2 justify-center items-center'>Export to Excel <IoMdDownload/></button>
        <div className='flex w-full justify-between px-2 py-3 bg-neutral-200 border-b-1'>
            <img src={assets.FijiPortLogo} className='w-[25%]'/>
            <div className='flex flex-col w-[62.5%]'>
                <p className='text-2xl'>VESSEL PRODUCTIVITY REPORT</p>
                <p className='text-xl'>PORT OF SUVA</p>
            </div>
        </div>
        <table id='vprTable' border="1" cellPadding="5" className='w-full border-collapse bg-neutral-100'>
            <tbody>
                <tr className='border-b-1 border-neutral-700 bg-neutral-100'>
                    <td className='pl-2 bg-neutral-200 w-[25%]'>Vessel Name</td>
                    <td className='pl-2 border-l-1 w-[37.5%]' colSpan={6}>{vesselName}</td>
                    <td className='pl-2 border-l-1 w-[12.5%] bg-neutral-200' colSpan={2}>Voyage</td>
                    <td className='text-center pl-2 w-[25%] border-l-1'>{inwardVoyage}</td>
                </tr>
                <tr className='border-b-1 border-neutral-700 bg-neutral-100'>
                    <td className='pl-2 bg-neutral-200'>Operator</td>
                    <td className='pl-2 border-l-1' colSpan={6}>To Be Developed</td>
                    <td className='pl-2 border-l-1 bg-neutral-200' colSpan={2}>Service Code</td>
                    <td className='text-center pl-2 border-l-1'>{vprDetails.voyageInfo?.ServiceCode?.trim() || 'N/A'}</td>
                </tr>
                <tr className='border-b-1 border-neutral-700 bg-neutral-100'>
                    <td className='pl-2 bg-neutral-200 w-[25%]'>Arrived</td>
                    <td className='text-center px-2 border-l-1 w-[12.5%]' colSpan={2}>{vprDetails.voyageInfo?.ArrivedDate?.split("T")[0]}</td>
                    <td className='text-center px-2 border-l-1 w-[12.5%]' colSpan={2}>{vprDetails.voyageInfo?.ArrivedTime.split(":").slice(0,2).join(":") + 'hrs'}</td>
                    <td className='pl-2 border-l-1 bg-neutral-200 w-[25%]' colSpan={4}>Idle Time at Anchorage</td>
                    <td className='text-center pl-2 border-l-1 w-[25%]'>-</td>
                </tr>
                <tr className='border-b-1 border-neutral-700 bg-neutral-100'>
                    <td className='pl-2 bg-neutral-200 w-[25%]'>First Drop Anchor</td>
                    <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo?.FirstDropAnchorDate?.split("T")[0]}</td>
                    <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo?.FirstDropAnchorTime.split(":").slice(0,2).join(":") + 'hrs'}</td>
                    <td className='pl-2 border-l-1 bg-neutral-200 w-[25%]' colSpan={4}>Time at Berth</td>
                    <td className='text-center pl-2 border-l-1 w-[25%]'>{bTime || '-'}</td>
                </tr>
                <tr className='border-b-1 border-neutral-700 bg-neutral-100'>
                    <td className='pl-2 bg-neutral-200 w-[25%]'>First Anchor Weigh</td>
                    <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo?.FirstAnchorWeighDate?.split("T")[0]}</td>
                    <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo?.FirstAnchorWeighTime?.split(":").slice(0,2).join(":") + 'hrs'}</td>
                    <td className='pl-2 border-l-1 bg-neutral-200 w-[25%]' colSpan={4}>Gross Working Time</td>
                    <td className='text-center pl-2 border-l-1 w-[25%]'>{gwTime || '-'}</td>
                </tr>
                <tr className='border-b-1 border-neutral-700 bg-neutral-100'>
                    <td className='pl-2 bg-neutral-200 w-[25%]'>First Berth</td>
                    <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo?.FirstBerthDate?.split("T")[0]}</td>
                    <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo?.FirstBerthTime?.split(":").slice(0,2).join(":") + 'hrs'}</td>
                    <td className='border-l-1 w-[50%]' colSpan={5}></td>
                </tr>
                <tr className='border-b-1 border-neutral-700 bg-neutral-100'>
                    <td className='pl-2 bg-neutral-200 w-[25%]'>OPS Commence</td>
                    <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo?.FirstOPSCommenceDate?.split("T")[0]}</td>
                    <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo?.FirstOPSCommenceTime.split(":").slice(0,2).join(":") + 'hrs'}</td>
                    <td className='border-l-1 w-[50%]' colSpan={5}></td>
                </tr>
                <tr className='border-b-1 border-neutral-700 bg-neutral-100'>
                    <td className='pl-2 bg-neutral-200 w-[25%]'>OPS Complete</td>
                    <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo?.FirstOPSCompleteDate?.split("T")[0]}</td>
                    <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo?.FirstOPSCompleteTime.split(":").slice(0,2).join(":") + 'hrs'}</td>
                    <td className='border-l-1 w-[50%]' colSpan={5}></td>
                </tr>
                {
                    vprDetails.voyageInfo?.FirstBerthShiftDate!==null && vprDetails.voyageInfo?.FirstBerthShiftTime!==null && 
                    <tr className='border-b-1 border-neutral-700 bg-neutral-100'>
                        <td className='pl-2 bg-neutral-200'>First Berth Shift</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo.FirstBerthShiftDate?.split("T")[0]}</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo?.FirstBerthShiftTime.split(":").slice(0,2).join(":") + 'hrs'}</td>
                        <td className='border-l-1' colSpan={5}></td>
                    </tr>
                }
                {
                    vprDetails.voyageInfo?.SecondDropAnchorDate!==null && vprDetails.voyageInfo?.SecondDropAnchorTime!==null && 
                    <tr className='border-b-1 border-neutral-700 bg-neutral-100'>
                        <td className='pl-2 bg-neutral-200'>Second Drop Anchor</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo.SecondDropAnchorDate?.split("T")[0]}</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo?.SecondDropAnchorTime.split(":").slice(0,2).join(":") + 'hrs'}</td>
                        <td className='border-l-1' colSpan={5}></td>
                    </tr>
                }
                {
                    vprDetails.voyageInfo?.SecondAnchorWeighDate!==null && vprDetails.voyageInfo?.SecondAnchorWeighTime!==null && 
                    <tr className='border-b-1 border-neutral-700 bg-neutral-100'>
                        <td className='pl-2 bg-neutral-200'>Second Anchor Weigh</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo.SecondAnchorWeighDate?.split("T")[0]}</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo?.SecondAnchorWeighTime.split(":").slice(0,2).join(":") + 'hrs'}</td>
                        <td className='border-l-1' colSpan={5}></td>
                    </tr>
                }
                {
                    vprDetails.voyageInfo?.SecondBerthDate !==null && vprDetails.voyageInfo?.SecondBerthTime !==null &&
                    <tr className='border-b-1 border-neutral-700 bg-neutral-100'>
                        <td className='pl-2 bg-neutral-200 w-[25%]'>Second Berth</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo?.SecondBerthDate?.split("T")[0]}</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo?.SecondBerthTime?.split(":").slice(0,2).join(":") + 'hrs'}</td>
                        <td className='border-l-1' colSpan={5}></td>
                    </tr>
                }
                {
                    vprDetails.voyageInfo?.SecondOPSCommenceDate!==null && vprDetails.voyageInfo?.SecondOPSCommenceTime!==null && 
                    <tr className='border-b-1 border-neutral-700 bg-neutral-100'>
                        <td className='pl-2 bg-neutral-200'>Second OPS Commence</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo.SecondOPSCommenceDate?.split("T")[0]}</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo?.SecondOPSCommenceTime.split(":").slice(0,2).join(":") + 'hrs'}</td>
                        <td className='border-l-1' colSpan={5}></td>
                    </tr>
                }
                {
                    vprDetails.voyageInfo?.SecondOPSCompleteDate!==null && vprDetails.voyageInfo?.SecondOPSCompleteTime!==null && 
                    <tr className='border-b-1 border-neutral-700 bg-neutral-100'>
                        <td className='pl-2 bg-neutral-200'>Second OPS Complete</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo.SecondOPSCompleteDate?.split("T")[0]}</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo?.SecondOPSCompleteTime.split(":").slice(0,2).join(":") + 'hrs'}</td>
                        <td className='border-l-1' colSpan={5}></td>
                    </tr>
                }
                {
                    vprDetails.voyageInfo?.SecondBerthShiftDate!==null && vprDetails.voyageInfo?.SecondBerthShiftTime!==null && 
                    <tr className='border-b-1 border-neutral-700 bg-neutral-100'>
                        <td className='pl-2 bg-neutral-200'>Second Berth Shift</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo.SecondBerthShiftDate?.split("T")[0]}</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo?.SecondBerthShiftTime.split(":").slice(0,2).join(":") + 'hrs'}</td>
                        <td className='border-l-1' colSpan={5}></td>
                    </tr>
                }
                {
                    vprDetails.voyageInfo?.ThirdDropAnchorDate!==null && vprDetails.voyageInfo?.ThirdDropAnchorTime!==null && 
                    <tr className='border-b-1 border-neutral-700 bg-neutral-100'>
                        <td className='pl-2 bg-neutral-200'>Third Drop Anchor</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo.ThirdDropAnchorDate?.split("T")[0]}</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo?.ThirdDropAnchorTime.split(":").slice(0,2).join(":") + 'hrs'}</td>
                        <td className='border-l-1' colSpan={5}></td>
                    </tr>
                }
                {
                    vprDetails.voyageInfo?.ThirdAnchorWeighDate!==null && vprDetails.voyageInfo?.ThirdAnchorWeighTime!==null && 
                    <tr className='border-b-1 border-neutral-700 bg-neutral-100'>
                        <td className='pl-2 bg-neutral-200'>Third Anchor Weigh</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo.ThirdAnchorWeighDate?.split("T")[0]}</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo?.ThirdAnchorWeighTime.split(":").slice(0,2).join(":") + 'hrs'}</td>
                        <td className='border-l-1' colSpan={5}></td>
                    </tr>
                }
                {
                    vprDetails.voyageInfo?.ThirdBerthDate !==null && vprDetails.voyageInfo?.ThirdBerthTime !==null &&
                    <tr className='border-b-1 border-neutral-700 bg-neutral-100'>
                        <td className='pl-2 bg-neutral-200 w-[25%]'>Third Berth</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo?.ThirdBerthDate?.split("T")[0]}</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo?.ThirdBerthTime?.split(":").slice(0,2).join(":") + 'hrs'}</td>
                        <td className='border-l-1' colSpan={5}></td>
                    </tr>
                }
                {
                    vprDetails.voyageInfo?.ThirdOPSCommenceDate!==null && vprDetails.voyageInfo?.ThirdOPSCommenceTime!==null && 
                    <tr className='border-b-1 border-neutral-700 bg-neutral-100'>
                        <td className='pl-2 bg-neutral-200'>Third OPS Commence</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo.ThirdOPSCommenceDate?.split("T")[0]}</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo?.ThirdOPSCommenceTime.split(":").slice(0,2).join(":") + 'hrs'}</td>
                        <td className='border-l-1' colSpan={5}></td>
                    </tr>
                }
                {
                    vprDetails.voyageInfo?.ThirdOPSCompleteDate!==null && vprDetails.voyageInfo?.ThirdOPSCompleteTime!==null && 
                    <tr className='border-b-1 border-neutral-700 bg-neutral-100'>
                        <td className='pl-2 bg-neutral-200'>Third OPS Complete</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo.ThirdOPSCompleteDate?.split("T")[0]}</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{vprDetails.voyageInfo?.ThirdOPSCompleteTime.split(":").slice(0,2).join(":") + 'hrs'}</td>
                        <td className='border-l-1' colSpan={5}></td>
                    </tr>
                }
                <tr className='border-b-1 border-neutral-700 bg-neutral-200'>
                    <td className='pl-2'>Depature</td>
                    <td className='text-center px-2 border-l-1 bg-n' colSpan={2}>{vprDetails.voyageInfo?.DepatureDate?.split("T")[0]}</td>
                    <td className='text-center px-2 border-l-1 bg-n' colSpan={2}>{vprDetails.voyageInfo?.DepatureTime.split(":").slice(0,2).join(":") + 'hrs'}</td>
                    <td className='border-l-1' colSpan={5}></td>
                </tr>

                {/*----Gross Crane Performance----*/}
                <tr className='border-b-1 border-neutral-700 bg-neutral-200'>
                    <td className='text-center font-bold' colSpan={10}>Gross Crane Performance</td>
                </tr>
                <tr className='border-b-1 border-neutral-700 bg-neutral-200'>
                    <td className='font-semibold pl-2 w-[25%]'>Working Bays</td>
                    <td className='text-center font-semibold px-2 border-l-1 w-[12.5%]' colSpan={2}>Duration</td>
                    <td className='text-center font-semibold px-2 border-l-1 w-[12.5%]' colSpan={2}>Moves</td>
                    <td className='text-center font-semibold px-2 border-l-1 w-[12.5%]' colSpan={2}>Rate</td>
                    <td className='font-semibold pl-2 border-l-1 w-[37.5%]' colSpan={3}>Remarks</td>
                </tr>
                {vprDetails.craneInfo?.map((item, index) => (
                    <tr key={index} className={item.rowTotal=== maxRowTotalItem.rowTotal ? 'border-b-1 border-neutral-700 bg-red-100' : 'border-b-1 border-neutral-700 bg-neutral-100'}>
                        <td className='pl-2'>{item.bay}</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{item.duration}</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{item.rowTotal}</td>
                        <td className='text-center px-2 border-l-1' colSpan={2}>{Number((item.rowTotal)/(item.duration)).toFixed(0)}</td>
                        <td className='pl-2 border-l-1' colSpan={3}>{item.crane}</td>
                    </tr>
                ))}
                <tr className='border-b-1 border-neutral-700 bg-neutral-200'>
                    <td className='font-semibold pl-2 w-[25%]'>Total</td>
                    <td className='text-center font-semibold px-2 border-l-1' colSpan={2}>{vprDetails.craneInfo?.reduce((sum, item) => sum + Number(item.duration || 0), 0)}</td>
                    <td className='text-center font-semibold px-2 border-l-1' colSpan={2}>{vprDetails.craneInfo?.reduce((sum, item) => sum + Number(item.rowTotal || 0), 0)}</td>
                    <td className='text-center font-semibold px-2 border-l-1' colSpan={2}></td>
                    <td className='font-semibold pl-2 border-l-1' colSpan={3}></td>
                </tr>

                {/*----Delays----*/}
                <tr className='border-b-1 border-neutral-700 bg-neutral-200'>
                    <td className='text-red-800 font-bold pl-2' colSpan={10}>Delays- based on heavy hatch</td>
                </tr>
                <tr className='border-b-1 border-neutral-700 bg-neutral-200'>
                    <td className='pl-2 font-semibold w-[43.75%]' colSpan={4}>Reason</td>
                    <td className='px-2 text-center font-semibold w-[12.5%] border-l-1' colSpan={2}>Duration</td>
                    <td className='pl-2 font-semibold w-[43.75%] border-l-1' colSpan={4}>Remarks</td>
                </tr>
                {vprDetails.delayInfo?.map((item, index)=>(
                    <tr key={index} className='border-b-1 border-neutral-700 bg-neutral-100'>
                        <td className='pl-2 font-semibold bg-neutral-200 w-[43.75%]' colSpan={4}>{item.reason}</td>
                        <td className='px-2 text-center border-l-1 w-[12.5%]' colSpan={2}>{item.minutes}</td>
                        <td className='pl-2 border-l-1 w-[43.75%]' colSpan={4}>-</td>
                    </tr>
                ))}
                <tr className='border-b-1 border-neutral-700 bg-neutral-200'>
                    <td className='pl-2 font-bold' colSpan={4}>Total Delay</td>
                    <td className='px-2 font-semibold text-center border-l-1' colSpan={2}>{vprDetails.delayInfo?.reduce((sum, item)=>sum+(item.minutes || 0), 0)}</td>
                    <td className='pl-2 border-l-1' colSpan={4}></td>
                </tr>
                <tr className='border-b-1 border-neutral-700 bg-neutral-200'>
                    <td className='text-red-800 font-bold pl-2' colSpan={10}>Productivity Ratios -based on heavy hatch</td>
                </tr>
                <tr className='border-b-1 border-neutral-700 bg-neutral-100'>
                    <td className='pl-2 bg-neutral-200' colSpan={4}>Gross Vehicle discharged Productivity</td>
                    <td className='px-2 text-center border-l-1' colSpan={2}>{grossCraneProductivity}</td>
                    <td colSpan={4}></td>
                </tr>
                <tr className='border-b-1 border-neutral-700 bg-neutral-200'>
                    <td className='font-bold pl-2' colSpan={10}>Remarks</td>
                </tr>
                {vprDetails.remarks?.map((item, index) => (
                        <tr key={index} className='border-b-1 border-neutral-700 bg-neutral-100'>
                            <td className='pl-2' colSpan={10}>{item}</td>
                        </tr>
                ))}
                <tr className='border-b-1 border-neutral-700 bg-neutral-100'>
                    <td className='pl-2 bg-neutral-200'>Report Date</td>
                    <td className='pl-2 border-l-1 text-center' colSpan={9}>
                        {(() => {
                            const today = new Date();
                            const day = String(today.getDate()).padStart(2, '0');
                            const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
                            const year = today.getFullYear();
                            return `${day}/${month}/${year}`;
                        })()}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  )
}

export default VprDetailsCar