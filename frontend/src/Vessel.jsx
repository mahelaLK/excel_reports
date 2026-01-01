import React, { useContext, useState } from "react";
import { PortContext } from "./context/PortContext";
import Voyage from "./Voyage";

const Vessel = () => {
  const { vesselNames, getGangDetails } = useContext(PortContext);
  const [selectedVessel, setSelectedVessel] = useState("");
  const [vesselType, setVesselType] = useState('');

  return (
    <div className="flex flex-col mt-2">
      <select
        value={selectedVessel}
        onChange={(e) => {
          setSelectedVessel(e.target.value);
          setVesselType(e.target.selectedOptions[0].getAttribute('data-type'));
        }}
        className="outline-1 px-2 py-1 rounded-lg my-2"
      >
        <option value="">---Select Vessel---</option>
        {vesselNames.map((vessel, index) => (
          <option key={index} value={vessel.VesselName} data-type={vessel.VesselType}>
            {vessel.VesselName}
          </option>
        ))}
      </select>
      {selectedVessel && <Voyage vesselName={selectedVessel} vesselType={vesselType}/>}
    </div>
  );
};

export default Vessel;
