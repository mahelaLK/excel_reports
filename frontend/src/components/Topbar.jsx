import React, { useContext, useEffect, useMemo, useState } from 'react'
import { assets } from '../assets/assets';
import { RiFileExcel2Fill } from "react-icons/ri";
import { IoSearch } from "react-icons/io5";
import { PortContext } from '../context/PortContext';
import { toast } from 'react-toastify';
import AutoComplete from './AutoComplete';
import Select from 'react-select'

const Topbar = ({
    loading, setLoading,
    selectedVessel, setSelectedVessel, 
    vesselType, setVesselType, 
    selectedVoyage, setSelectedVoyage,
    submittedVoyage, setSubmittedVoyage,
    selectedRptType, setSelectedRptType,
    submittedRptType, setSubmittedRptType
}) => {
    
    const { vesselNames, voyageNames, getGangDetails, getGangDetailsCar, getGangDetailsGen, getAllVoyageNames, getVprDetails, getCprDetails } = useContext(PortContext);

    const [isVisible, setIsVisible] = useState(true)
    const [scrollPosition, setScrollPosition] = useState(0);

    const [loadingData, setLoadingData] = useState(false)

    const vesselOptions = useMemo(()=>
        vesselNames.map(vessel => ({
            value: vessel.VesselName,
            label: vessel.VesselName,
            type: vessel.VesselType
        })),
        [vesselNames]
    );
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingData(false)
        setLoading(true)
        try {
            setSubmittedVoyage(selectedVoyage);
            setSubmittedRptType(selectedRptType);
            if (vesselType==='Container' && selectedRptType==='UPDATE') {
                await getGangDetails(selectedVoyage);
            } else if (vesselType==='Car Carrier' && selectedRptType==='UPDATE'){
                await getGangDetailsCar(selectedVoyage);
            } else if (vesselType==='General Purpose Vessel' && selectedRptType==='UPDATE'){
                await getGangDetailsGen(selectedVoyage);
            } else if (selectedRptType==='VPR'){
                await getVprDetails(selectedVoyage);
            } else if (selectedRptType==='CPR'){
                await getCprDetails(selectedVoyage);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        if (selectedVessel) {
            setLoadingData(true)
            getAllVoyageNames(selectedVessel);
        }
        setSelectedVoyage('');
        setSubmittedVoyage('');
        setSelectedRptType('');
        setSubmittedRptType('');
    },[selectedVessel])

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollState = window.scrollY;

            if (currentScrollState > scrollPosition && currentScrollState > 100) {
                setIsVisible(false);
            }else{
                setIsVisible(true);
            }

            setScrollPosition(currentScrollState);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrollPosition]);

  return (
    <div className={`px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] flex items-end justify-between py-5 
        sticky top-0 w-full transition-transform duration-300 z-50 gap-4 bg-surface-container-highest
        ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <div className='hidden w-full md:flex sm:w-60'>
            <img src={assets.FijiPortLogo} alt="" />
        </div>
        <div className='flex items-center justify-between gap-4'>
            <div>
                <p>Select Vessel</p>
                <Select
                    inputId="vessel-select"
                    unstyled
                    options={vesselOptions}
                    value={vesselOptions.find(opt => opt.value === selectedVessel) || null}
                    onChange={(selected) => {
                        setSelectedVessel(selected ? selected.value : '');
                        setVesselType(selected ? selected.type : '');
                        setSelectedVoyage('');
                        setSelectedRptType('');
                        setSubmittedVoyage('');
                        setSubmittedRptType('');
                    }}
                    isClearable
                    placeholder="---Select Vessel---"
                    className="w-full sm:w-60"
                    classNames={{
                        control: () =>
                            'p-2 bg-surface-container-high rounded-lg cursor-pointer',
                        valueContainer: () => 'gap-1',
                        placeholder: () => 'text-gray-400',
                        singleValue: () => 'text-inherit',
                        input: () => 'text-inherit',
                        menu: () =>
                            'bg-surface-container-high rounded-lg mt-1 shadow-lg z-50 overflow-hidden',
                        menuList: () => 'py-1',
                        option: ({ isFocused, isSelected }) =>
                            `px-3 py-2 cursor-pointer ${
                                isSelected
                                    ? 'bg-primary text-on-primary'
                                    : isFocused
                                    ? 'bg-black/5'
                                    : ''
                            }`,
                        noOptionsMessage: () => 'p-2 text-sm text-gray-400',
                        dropdownIndicator: () => 'px-2 text-gray-400 hover:text-gray-600',
                        clearIndicator: () => 'px-1 text-gray-400 hover:text-gray-600 cursor-pointer',
                        indicatorSeparator: () => 'bg-gray-300 mx-1',
                    }}
                />
            </div>
            <div>
                <p>Select Voyage</p>
                <select className='p-2 bg-surface-container-high rounded-lg w-full sm:w-60'
                    disabled={voyageNames.length===0}
                    value={selectedVoyage}
                    onChange={(e)=>{
                        const value = e.target.value;
                        setSelectedVoyage(value);
                        setSelectedRptType('')
                        setSubmittedRptType('')
                        setSubmittedVoyage('')
                        if (value==='') {
                            setSubmittedVoyage('');
                        }
                    }}
                >
                    <option value="" className='px-4'>----Select Voyage----</option>
                    {voyageNames.map((voyage, index) => (
                        <option key={index} value={voyage.InwardVoyage} className='px-4'>
                        {voyage.InwardVoyage}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <p>Type of Report</p>
                <select className='p-2 bg-surface-container-high rounded-lg w-full sm:w-60'
                    value={selectedRptType} 
                    onChange={(e)=>{
                        const value = e.target.value;
                        setSelectedRptType(value);
                        if (value==='') {
                        setSubmittedRptType('');
                        }
                    }}
                >
                    <option value="" className='px-4'>----Report Type----</option>
                    <option value="UPDATE" className='px-4'>UPDATE</option>
                    <option value="VPR" className='px-4'>VPR</option>
                    <option value="CPR" className='px-4'>CPR</option>
                </select>
            </div>
        </div>
        <div className='flex items-center justify-between gap-4'>
            {selectedVessel && selectedVoyage && selectedRptType &&(
                <button className='py-2 bg-primary text-on-primary border border-primary rounded-xl 
                    flex items-center justify-center gap-1 px-4 cursor-pointer w-full'
                    onClick={handleSubmit}
                >
                    <IoSearch />
                    Sumbit
                </button>
            )}
        </div>
    </div>
  )
}

export default Topbar