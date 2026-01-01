const { poolPromise, sql } = require('../../config/mssqldb.js');

async function getAllGangPlanDetailCar(inwardVoyage) {
    try {
        const pool = await poolPromise;
        const gangResult = await pool.request()
            .input('InwardVoyage', inwardVoyage)
            .query('SELECT VPS_Voyages.VoyageID, VPS_GangPlanHeader.GangNumber FROM  VPS_GangPlanHeader INNER JOIN VPS_Voyages ON VPS_GangPlanHeader.VoyageID = VPS_Voyages.VoyageID WHERE VPS_Voyages.InwardVoyage=@inwardVoyage');
        
            if (gangResult.recordset.length === 0){
                throw new Error("No voyage found for given number");
            }

            const voyageId = gangResult.recordset[0].VoyageID;
            const gangNumbers = gangResult.recordset.map(r => r.GangNumber);

            const gangPlanDetails = [];
            let berthSide = null;
            for (const gangNumber of gangNumbers){
                const detailResult = await pool.request()
                .input('gangNumber', gangNumber)
                .input('voyageId', voyageId)
                .query(`
                    SELECT VPS_GangPlanHeader.BerthSide, VPS_GangPlanHeader.Crane, VPS_GangPlanHeader.Discharge, VPS_GangPlanHeader.Overstow, VPS_GangPlanHeader.Restow, VPS_GangPlanHeader.Loads, VPS_GangPlanHeader.NoOfVehicles, VPS_GangPlanHeader.BBLK, VPS_ShiftPlanHeader.ShiftPlanHeaderID, VPS_ShiftPlanHeader.ShiftNumber, VPS_ShiftPlanHeader.ShiftStartDate, VPS_ShiftPlanHeader.Supervisor, VPS_ShiftPlanHeader.NoOfDrivers, VPS_ShiftPlanHeader.TK, VPS_ShiftPlanHeader.Checklist, VPS_ShiftPlanHeader.Traffic, VPS_ShiftPlanHeader.Unlashing, VPS_GangPlanDetail.ListOfBays
                    FROM VPS_ShiftPlanHeader INNER JOIN
                        VPS_GangPlanHeader ON VPS_ShiftPlanHeader.VoyageID = VPS_GangPlanHeader.VoyageID INNER JOIN
                        VPS_GangPlanDetail ON VPS_GangPlanHeader.GangPlanHeaderID = VPS_GangPlanDetail.GangPlanHeaderID 
                    WHERE VPS_GangPlanHeader.GangNumber=@gangNumber AND VPS_GangPlanHeader.VoyageID=@voyageId
                    `);
                
                berthSide = detailResult.recordset[0]?.BerthSide || null;

                let shiftPlanDetails = [];

                const shiftNumbers = detailResult.recordset.map(r=>(r.ShiftNumber))
                for (const row of detailResult.recordset){
                    const shiftDetails = await pool.request()
                    .input('shiftHeaderId', row.ShiftPlanHeaderID)
                    .input('voyageId', voyageId)
                    .input('shiftNumber', row.ShiftNumber)
                    .query(`
                        SELECT DISTINCT VPS_ShiftPlanDetail.LiftTime
                        FROM VPS_ShiftPlanDetail INNER JOIN
                            VPS_ShiftPlanHeader ON VPS_ShiftPlanDetail.ShiftHeaderID = VPS_ShiftPlanHeader.ShiftPlanHeaderID
                        WHERE VPS_ShiftPlanHeader.ShiftPlanHeaderID=@shiftHeaderId AND VPS_ShiftPlanHeader.VoyageID=@voyageId AND VPS_ShiftPlanDetail.ShiftNo=@shiftNumber
                        ORDER BY VPS_ShiftPlanDetail.LiftTime
                        `);

                    let liftTimePlanDetails = [];
                    let foreman = null;
                    let bayplanner = null;
                    let winchman = null;
                    let winchman2 = null;
                    let winchman3 = null;
                    let rdt = null;
                    for (const liftTimeRow of shiftDetails.recordset){
                        const liftTimeDetails = await pool.request()
                        .input('shiftHeaderId', row.ShiftPlanHeaderID)
                        .input('shiftNumber', row.ShiftNumber)
                        .input('gangNumber', gangNumber)
                        .input('liftTime', liftTimeRow.LiftTime)
                        .query(`
                            SELECT Target, Actual, Remarks, Foreman, BayPlanner, Winchman, Winchman2, Winchman3, RDT
                            FROM VPS_ShiftPlanDetail
                            WHERE LiftTime=@liftTime AND ShiftHeaderID=@shiftHeaderId AND ShiftNo=@shiftNumber AND GangNo=@gangNumber
                            `);

                        foreman = liftTimeDetails.recordset.flatMap(r=>r.Foreman);
                        bayplanner = liftTimeDetails.recordset.flatMap(r=>r.BayPlanner);
                        winchman = liftTimeDetails.recordset.flatMap(r=>r.Winchman);
                        winchman2 = liftTimeDetails.recordset.flatMap(r=>r.Winchman2);
                        winchman3 = liftTimeDetails.recordset.flatMap(r=>r.Winchman3);
                        rdt = liftTimeDetails.recordset.flatMap(r=>r.RDT);
                        liftTimePlanDetails.push({
                            LiftTime: liftTimeRow.LiftTime,
                            Details: liftTimeDetails.recordset.map(r=>({
                                Target: r.Target,
                                Actual: r.Actual,
                                Remarks: r.Remarks
                            }))})
                    }    

                    shiftPlanDetails.push({
                        ShiftNumber: row.ShiftNumber,
                        ShiftStartDate: row.ShiftStartDate,
                        Supervisor: row.Supervisor,
                        NoOfDrivers: row.NoOfDrivers,
                        TK: row.TK,
                        Checklist: row.Checklist,
                        Traffic: row.Traffic,
                        Unlashing: row.Unlashing,
                        Foreman: foreman,
                        BayPlanner: bayplanner,
                        Winchman: winchman,
                        Winchman2: winchman2,
                        Winchman3: winchman3,
                        Rdt: rdt,
                        LiftTimes: shiftDetails.recordset.map(r=>(r.LiftTime)),
                        liftTimePlanDetails
                    });
                    
                }
                

                gangPlanDetails.push({
                    gangNumber,
                    details: detailResult.recordset.map(r => ({
                        Crane: r.Crane,
                        ListOfBays: r.ListOfBays,
                        Discharge: r.Discharge,
                        Overstow: r.Overstow,
                        Restow: r.Restow,
                        Loads: r.Loads,
                        NoOfVehicles: r.NoOfVehicles,
                        BBLK: r.BBLK
                    }))[0],
                    shiftNumbers,
                    shiftPlanDetails
                })
            }
            

        //const result = await pool.request().query('SELECT VPS_Voyages.InwardVoyage, VPS_GangPlanHeader.GangNumber, VPS_GangPlanHeader.Crane, VPS_GangPlanHeader.Discharge, VPS_GangPlanHeader.Overstow, VPS_GangPlanHeader.Restow FROM  VPS_GangPlanHeader INNER JOIN VPS_Voyages ON VPS_GangPlanHeader.VoyageID = VPS_Voyages.VoyageID');
        return {inwardVoyage, berthSide, gangNumbers, gangPlanDetails};
    } catch (error) {
        throw error;
    }
}


module.exports = { getAllGangPlanDetailCar };