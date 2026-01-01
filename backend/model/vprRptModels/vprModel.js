const { poolPromise, sql } = require('../../config/mssqldb.js');

async function getAllVprDetail(inwardVoyage) {
    try {
        const pool = await poolPromise;
        const dateTimeResults = await pool.request()
            .input('InwardVoyage', inwardVoyage)
            .query(`SELECT 
                        VPS_VesselMovements.ArrivedDate, 
                        VPS_VesselMovements.ArrivedTime, 
                        VPS_VesselMovements.FirstDropAnchorDate, 
                        VPS_VesselMovements.FirstDropAnchorTime, 
                        VPS_VesselMovements.FirstAnchorWeighDate, 
                        VPS_VesselMovements.FirstAnchorWeighTime, 
                        VPS_VesselMovements.FirstBerthDate, 
                        VPS_VesselMovements.FirstBerthTime, 
                        VPS_VesselMovements.FirstOPSCommenceDate, 
                        VPS_VesselMovements.FirstOPSCommenceTime, 
                        VPS_VesselMovements.FirstOPSCompleteDate, 
                        VPS_VesselMovements.FirstOPSCompleteTime, 
                        VPS_VesselMovements.FirstBerthShiftDate, 
                        VPS_VesselMovements.FirstBerthShiftTime, 
                        VPS_VesselMovements.SecondDropAnchorDate, 
                        VPS_VesselMovements.SecondDropAnchorTime, 
                        VPS_VesselMovements.SecondAnchorWeighDate, 
                        VPS_VesselMovements.SecondAnchorWeighTime, 
                        VPS_VesselMovements.SecondBerthDate, 
                        VPS_VesselMovements.SecondBerthTime,
                        VPS_VesselMovements.SecondOPSCommenceDate, 
                        VPS_VesselMovements.SecondOPSCommenceTime, 
                        VPS_VesselMovements.SecondOPSCompleteDate, 
                        VPS_VesselMovements.SecondOPSCompleteTime, 
                        VPS_VesselMovements.SecondBerthShiftDate, 
                        VPS_VesselMovements.SecondBerthShiftTime, 
                        VPS_VesselMovements.ThirdDropAnchorDate, 
                        VPS_VesselMovements.ThirdDropAnchorTime, 
                        VPS_VesselMovements.ThirdAnchorWeighDate, 
                        VPS_VesselMovements.ThirdAnchorWeighTime, 
                        VPS_VesselMovements.ThirdBerthDate, 
                        VPS_VesselMovements.ThirdBerthTime,
                        VPS_VesselMovements.ThirdOPSCommenceDate, 
                        VPS_VesselMovements.ThirdOPSCommenceTime, 
                        VPS_VesselMovements.ThirdOPSCompleteDate, 
                        VPS_VesselMovements.ThirdOPSCompleteTime, 
                        VPS_VesselMovements.DepatureDate, 
                        VPS_VesselMovements.DepatureTime, 
                        VPS_VesselMovements.VoyageID,
                        VPS_Voyages.ServiceCode
                    FROM  
                        VPS_VesselMovements INNER JOIN VPS_Voyages 
                    ON 
                        VPS_VesselMovements.VoyageID = VPS_Voyages.VoyageID
                    WHERE 
                        VPS_Voyages.InwardVoyage=@inwardVoyage`);

        if (dateTimeResults.recordset.length===0) {
            throw new Error("No voyage found for given inward voyage");
        }

        const voyageId = dateTimeResults.recordset[0].VoyageID;

        const cranePerformanceResults = await pool.request()
            .input('InwardVoyage', inwardVoyage)
            .query(`SELECT 
                        g.ListOfBays,
                        d.GangNo, 
                        g.Crane, 
                        g.Discharge, 
                        g.Overstow, 
                        g.Restow, 
                        g.Loads,
                        d.DurationMinutes
                    FROM
                        (
                            SELECT 
                                VPS_GangPlanHeader.GangNumber, 
                                VPS_GangPlanDetail.ListOfBays, 
                                VPS_GangPlanHeader.Crane, 
                                VPS_GangPlanHeader.Discharge, 
                                VPS_GangPlanHeader.Overstow, 
                                VPS_GangPlanHeader.Restow, 
                                VPS_GangPlanHeader.Loads
                            FROM 
                                    VPS_GangPlanDetail 
                                INNER JOIN 
                                    VPS_GangPlanHeader 
                            ON 
                                VPS_GangPlanDetail.GangPlanHeaderID = VPS_GangPlanHeader.GangPlanHeaderID 
                                INNER JOIN 
                                    VPS_Voyages 
                            ON 
                                VPS_GangPlanHeader.VoyageID = VPS_Voyages.VoyageID
                            WHERE 
                                VPS_Voyages.InwardVoyage=@inwardVoyage
                        ) AS g
                    LEFT JOIN 
                        (
                            SELECT
                                GangNo,
                                SUM(DurationMinutes) AS DurationMinutes
                            FROM (
                                SELECT DISTINCT
                                    VPS_VesselPerfEntry.GangNo,
                                    DATEDIFF(
                                        MINUTE, 
                                        CAST(VPS_VesselPerfEntry.ShiftStartDate AS DATETIME) + CAST(VPS_VesselPerfEntry.ShiftStartTime AS DATETIME), 
                                        CAST(VPS_VesselPerfEntry.ShiftEndDate AS DATETIME) + CAST(VPS_VesselPerfEntry.ShiftEndTime AS DATETIME)
                                    ) AS DurationMinutes
                                FROM  
                                    VPS_VesselPerfEntry 
                                INNER JOIN
                                    VPS_Voyages 
                                ON 
                                    VPS_VesselPerfEntry.VoyageID = VPS_Voyages.VoyageID 
                                INNER JOIN
                                    VPS_GangPlanHeader 
                                ON 
                                    VPS_Voyages.VoyageID = VPS_GangPlanHeader.VoyageID 
                                    AND 
                                    VPS_VesselPerfEntry.GangNo = VPS_GangPlanHeader.GangNumber 
                                INNER JOIN
                                    VPS_GangPlanDetail 
                                ON 
                                    VPS_GangPlanHeader.GangPlanHeaderID = VPS_GangPlanDetail.GangPlanHeaderID
                                WHERE
                                    VPS_Voyages.InwardVoyage=@inwardVoyage
                            ) AS DistinctDurations
                            GROUP BY
                                GangNo
                        ) AS d
                        ON g.GangNumber=d.GangNo`);

        if (cranePerformanceResults.recordset.length===0) {
            throw new Error("No cranes found for given inward voyage");
        }
        
        const summaryCrane = [];
        let duration = 0;

        for(const row of cranePerformanceResults.recordset){
            const bay = row.ListOfBays?.trim();
            const crane = row.Crane?.trim();
            const gangNo = row.GangNo;
            duration = Number((row.DurationMinutes)/60).toFixed(2);

            // Calculate combined total for this row
            const rowTotal =
                (row.Discharge ?? 0) +
                (row.Overstow ?? 0) +
                (row.Restow ?? 0) +
                (row.Loads ?? 0);

            if(crane==='RAMP' && bay==='BBLK'){
                const countBBLKHoursResults = await pool.request()
                    .input('VoyageId', voyageId)
                    .input('GangNo', gangNo)
                    .query(`SELECT COUNT(*) AS BblkDuration
                            FROM VPS_VesselPerfEntry
                            WHERE BBLK IS NOT NULL AND BBLK > 0 AND VoyageID=@voyageId AND GangNo=@gangNo`);
                    
                if (countBBLKHoursResults.recordset.length===0) {
                    throw new Error("No bblk hours found given gang and voyage");
                }

                duration = Number(countBBLKHoursResults.recordset[0].BblkDuration).toFixed(2);
            }

            // Add to summary
            summaryCrane.push({
                bay,
                crane,
                rowTotal,
                duration
            })
        }

        const delayReasonResults = await pool.request()
            .input('VoyageId', voyageId)
            .query(`SELECT 
                        DelayReason1, 
                        DelayMinutes1, 
                        DelayReason2, 
                        DelayMinutes2, 
                        DelayReason3, 
                        DelayMinutes3, 
                        DelayReason4, 
                        DelayMinutes4, 
                        Remarks
                    FROM  VPS_VesselPerfEntry
                    WHERE VoyageID=@voyageId
                `);

        if (delayReasonResults.recordset.length===0) {
            throw new Error("No voyage id found for given inward voyage");
        }

        const summaryDelay = [];

        for (const row of delayReasonResults.recordset) {
            for (let i = 1; i <= delayReasonResults.recordset.length; i++) {
                const reason = row[`DelayReason${i}`]?.trim();
                const minutes = Number(row[`DelayMinutes${i}`]) || 0;

                if (reason) {
                    const existing = summaryDelay.find(item => item.reason === reason);

                    if (existing) {
                        existing.minutes += minutes;   // add to existing
                    } else {
                        summaryDelay.push({
                            reason,
                            minutes
                        });
                    }
                }
            }
        }
        
        // Optional: get remarks list too
        const remarks = delayReasonResults.recordset
            .map(r => r.Remarks?.trim())
            .filter(Boolean);   

        return { voyageInfo: dateTimeResults.recordset[0], craneInfo:summaryCrane, delayInfo: summaryDelay, remarks }
    } catch (error) {
        throw error;
    }
}

module.exports = { getAllVprDetail };