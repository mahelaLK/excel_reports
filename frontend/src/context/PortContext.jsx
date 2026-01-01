import React from "react";
import { useState } from "react";
import { createContext } from "react";
import axios from "axios";
import { useEffect } from "react";
import { exportTableStyledGen } from '../utils/excelExportGen'
import { exportTableStyledCar } from '../utils/excelExportCar'
import { exportTableStyledCon } from '../utils/excelExportCon'
import { grossWorkingTime } from "../utils/calculations/grossWorkingTime";
import { exportVprStyled } from "../utils/excelExportVpr";
import { exportVprCarStyled } from "../utils/excelExportVprCar";
import { exportCprStyled } from "../utils/excelExportCpr";

export const PortContext = createContext();

const PortContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [voyageNames, setVoyageNames] = useState([]);
  const [vesselNames, setVesselNames] = useState([]);
  const [gangDetails, setGangDetails] = useState(null);
  const [gangDetailCars, setGangDetailCars] = useState(null);
  const [gangDetailsGen, setGangDetailsGen] = useState(null);
  const [vprDetails, setVprDetails] = useState(null);
  const [cprDetails, setCprDetails] = useState(null);

  const getAllVoyageNames = async (vesselName) => {
    try {
      const response = await axios.get(backendUrl + `/api/voyagenames/${vesselName}`);
      if (response.data.success) {
        setVoyageNames(response.data.voyageNames.recordset);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllVesselNames = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/vesselnames");
      if (response.data.success) {
        setVesselNames(response.data.vesselNames.recordset);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCprDetails = async (inwardVoyage) => {
    try {
      const response = await axios.get(backendUrl + `/api/cpr-report/${inwardVoyage}`);
      if (response.data.success) {
        setCprDetails(response.data.details);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getVprDetails = async (inwardVoyage) => {
    try {
      const response = await axios.get(backendUrl + `/api/vpr-report/${inwardVoyage}`);
      if (response.data.success) {
        setVprDetails(response.data.details);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getGangDetails = async (inwardVoyage) => {
    try {
      const response = await axios.get(backendUrl + `/api/gangplandetails/${inwardVoyage}`);
      if (response.data.success) {
        setGangDetails(response.data.details);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getGangDetailsCar = async (inwardVoyage) => {
    try {
        const response = await axios.get(backendUrl + `/api/gangplandetailcars/${inwardVoyage}`);
        if (response.data.success) {
            setGangDetailCars(response.data.details);
        } else {
            console.log(response.data.message);
        }
    } catch (error) {
        console.log(error);
    }
  }

  const getGangDetailsGen = async (inwardVoyage) => {
    try {
        const response = await axios.get(backendUrl + `/api/gangplandetailgen/${inwardVoyage}`);
        if (response.data.success) {
            setGangDetailsGen(response.data.details);
        } else {
            console.log(response.data.message);
        }
    } catch (error) {
        console.log(error);
    }
  }

  const handleExportTableStyledGen = async (vesselName) => {
    return exportTableStyledGen(vesselName, gangDetailsGen)
  }

  const handleExportTableStyledCar = async (vesselName) => {
    return exportTableStyledCar(vesselName, gangDetailCars)
  };

  const handleExportTableStyledCon = async (vesselName) => {
    return exportTableStyledCon(vesselName, gangDetails)
  };

  const handleExportVpr = async (vesselName, inwardVoyage, gwTime, bTime) => {
    return exportVprStyled(vesselName, inwardVoyage, gwTime, bTime, vprDetails)
  };

  const handleExportCarVpr = async (vesselName, inwardVoyage, gwTime, bTime) => {
    return exportVprCarStyled(vesselName, inwardVoyage, gwTime, bTime, vprDetails)
  };

  const handleExportCpr = async (vesselName, inwardVoyage) => {
    return exportCprStyled(vesselName, inwardVoyage, cprDetails)
  };

  const handleCalculationGrossWorkingTime = () => {
    return grossWorkingTime(vprDetails)
  };

  useEffect(() => {
    getAllVesselNames();
  }, []);

  const value = {
    voyageNames,
    vesselNames,
    gangDetails,
    gangDetailCars,
    gangDetailsGen,
    vprDetails,
    cprDetails,
    getAllVoyageNames,
    getGangDetails,
    getGangDetailsCar,
    getGangDetailsGen,
    getVprDetails,
    getCprDetails,
    exportTableStyledCon: handleExportTableStyledCon,
    exportTableStyledCar: handleExportTableStyledCar,
    exportTableStyledGen: handleExportTableStyledGen,
    grossWorkingTime: handleCalculationGrossWorkingTime,
    exportVprStyled: handleExportVpr,
    exportVprCarStyled: handleExportCarVpr,
    exportCprStyled: handleExportCpr
  };

  return (
    <PortContext.Provider value={value}>{props.children}</PortContext.Provider>
  );
};

export default PortContextProvider;
