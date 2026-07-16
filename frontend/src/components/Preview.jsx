import React from 'react'
import GangDetails from '../reports/update/GangDetails'
import GangDetailsCar from '../reports/update/GangDetailsCar'
import GangDetailsGen from '../reports/update/GangDetailsGen'
import VprDetailsCar from '../reports/vpr/VprDetailsCar'
import CprDetails from '../reports/cpr/CprDetails'
import VprDetails from '../reports/vpr/VprDetails'

const Preview = ({loading, vesselName, vesselType, submittedVoyage, submittedRptType}) => {

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        {loading ? (
            <div className='w-full flex flex-col items-center justify-center py-16 gap-3'>
                <div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin'/>
                <p className='text-sm text-on-surface-variant'>Loading...</p>
            </div>
        ) : (
            <div>
                {submittedVoyage && submittedRptType &&(
                <>
                    {vesselType==='Container' && submittedRptType==='UPDATE' && (<GangDetails vesselName={vesselName} inwardVoyage={submittedVoyage}/>)}
                    {vesselType==='Car Carrier' && submittedRptType==='UPDATE' && (<GangDetailsCar vesselName={vesselName} inwardVoyage={submittedVoyage}/>)}
                    {vesselType==='General Purpose Vessel' && submittedRptType==='UPDATE' && (<GangDetailsGen vesselName={vesselName} inwardVoyage={submittedVoyage}/>)}
                    {(vesselType==='Container' || vesselType==='General Purpose Vessel') && submittedRptType==='VPR' && (<VprDetails vesselName={vesselName} inwardVoyage={submittedVoyage}/>)}
                    {vesselType==='Car Carrier' && submittedRptType==='VPR' && (<VprDetailsCar vesselName={vesselName} inwardVoyage={submittedVoyage}/>)}
                    {submittedRptType==='CPR' && (<CprDetails vesselName={vesselName} inwardVoyage={submittedVoyage}/>)}
                </>
                )}
            </div>
        )}
    </div>
  )
}

export default Preview