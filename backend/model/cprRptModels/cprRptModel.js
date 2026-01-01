const { poolPromise, sql } = require('../../config/mssqldb.js');

async function getAllCprDetails(inwardVoyage) {
    try {
        const pool = await poolPromise;
        const shiftDetailsResults = await pool.request()
            .input('InwardVoyage', inwardVoyage)
            .query(`SELECT 
                        VPS_ShiftPlanHeader.ShiftNumber, 
                        VPS_ShiftPlanHeader.ShiftStartDate, 
                        VPS_ShiftPlanHeader.ShiftStartTime, 
                        VPS_ShiftPlanHeader.ShiftEndDate, 
                        VPS_ShiftPlanHeader.ShiftEndTime, 
                        VPS_ShiftPlanHeader.VoyageID
                    FROM  
                        VPS_ShiftPlanHeader 
                    INNER JOIN 
                        VPS_Voyages 
                    ON 
                        VPS_ShiftPlanHeader.VoyageID = VPS_Voyages.VoyageID
                    WHERE 
                        VPS_Voyages.InwardVoyage=@inwardVoyage`);
        if (shiftDetailsResults.recordset.length===0) {
            throw new Error('No Shifts found for this voyage');
        }

        const voyageId = shiftDetailsResults.recordset[0].VoyageID;
        const shiftNumbers = shiftDetailsResults.recordset.map(r=>r.ShiftNumber);

        let shiftDetails = [];
        
        for(const shiftNumber of shiftNumbers){
            const craneResults = await pool.request()
                .input('VoyageID', voyageId)
                .input('ShiftNumber', shiftNumber)
                .query(`SELECT 
                            LTRIM(RTRIM(VPS_GangPlanHeader.Crane)) AS Crane, 
                            VPS_ShiftPlanHeader.ShiftPlanHeaderID,
                            VPS_GangPlanHeader.GangPlanHeaderID
                        FROM  
                            VPS_Voyages 
                        INNER JOIN
                            VPS_GangPlanHeader 
                        ON 
                            VPS_Voyages.VoyageID = VPS_GangPlanHeader.VoyageID
                        INNER JOIN
                            VPS_ShiftPlanHeader 
                        ON 
                            VPS_Voyages.VoyageID = VPS_ShiftPlanHeader.VoyageID
                        WHERE 
                            VPS_Voyages.VoyageID=@voyageId AND VPS_ShiftPlanHeader.ShiftNumber=@shiftNumber`);

            if (craneResults.recordset.length===0) {
                throw new Error('No cranes found for this voyage');
            }
            const cranes = craneResults.recordset;
            const craneList = cranes.map(r=>r.Crane);
            let craneDetails = [];

            const liftTimesResults = await pool.request()
                .input('ShiftHeaderID', cranes[0].ShiftPlanHeaderID)
                .input('ShiftNo', shiftNumber)
                .query(`SELECT DISTINCT 
                            LiftTime
                        FROM 
                            VPS_ShiftPlanDetail
                        WHERE 
                            ShiftHeaderID=@ShiftHeaderID
                        AND 
                            ShiftNo=@ShiftNo`);

            if (liftTimesResults.recordset.length===0) {
                throw new Error(`No lift times found for shift ${shiftNumber}`);
            }

            const getCraneType = (craneName) => {
                const vslCranes = ['VC1', 'VC2', 'VC3'];
                return vslCranes.includes(craneName) ? 'VSL' : 'MBL';
            };

            const winchmanMap = new Map();

            for(const craneItem of cranes){
                const gangPlanHeaderId = craneItem.GangPlanHeaderID;
                const crane = craneItem.Crane;
                const craneType = getCraneType(crane);
                const shiftPlanHeaderId = craneItem.ShiftPlanHeaderID;
                const craneDetailsResults = await pool.request()
                    .input('ShiftHeaderID', shiftPlanHeaderId)
                    .input('ShiftNo', shiftNumber)
                    .input('GangPlanHeaderID', gangPlanHeaderId)
                    .query(`SELECT DISTINCT 
                                LTRIM(RTRIM(VPS_ShiftPlanDetail.Foreman)) AS Foreman,
                                VPS_ShiftPlanDetail.ForemanEmpNo, 
                                LTRIM(RTRIM(VPS_ShiftPlanDetail.BayPlanner)) AS BayPlanner,
                                VPS_ShiftPlanDetail.BayPlannerEmpNo
                            FROM 
                                VPS_ShiftPlanDetail
                            INNER JOIN
                                VPS_GangPlanHeader 
                            ON 
                                VPS_ShiftPlanDetail.GangNo = VPS_GangPlanHeader.GangNumber
                            WHERE 
                                VPS_ShiftPlanDetail.ShiftHeaderID=@ShiftHeaderID
                            AND 
                                VPS_ShiftPlanDetail.ShiftNo=@ShiftNo
                            AND
                                VPS_GangPlanHeader.GangPlanHeaderID=@GangPlanHeaderID`);

                if (craneDetailsResults.recordset.length===0) {
                    throw new Error('No cranes details found for this voyage');
                }

                let liftTimeDetails = [];
                const liftTimes = liftTimesResults.recordset.map(r=>r.LiftTime);

                for(const liftTime of liftTimes){
                    const liftTimeDetailsResults = await pool.request()
                        .input('LiftTime', liftTime)
                        .input('ShiftHeaderID', shiftPlanHeaderId)
                        .input('ShiftNo', shiftNumber)
                        .input('GangPlanHeaderID', gangPlanHeaderId)
                        .query(`SELECT 
                                    VPS_ShiftPlanDetail.Actual, 
                                    VPS_ShiftPlanDetail.Target,
                                    LTRIM(RTRIM(VPS_ShiftPlanDetail.Winchman)) AS Winchman,
                                    VPS_ShiftPlanDetail.WinchmanEmpNo
                                FROM  
                                    VPS_ShiftPlanHeader 
                                INNER JOIN
                                    VPS_ShiftPlanDetail 
                                ON 
                                    VPS_ShiftPlanHeader.ShiftPlanHeaderID = VPS_ShiftPlanDetail.ShiftHeaderID 
                                AND 
                                    VPS_ShiftPlanHeader.ShiftNumber = VPS_ShiftPlanDetail.ShiftNo
                                INNER JOIN
                                    VPS_GangPlanHeader 
                                ON 
                                    VPS_ShiftPlanDetail.GangNo = VPS_GangPlanHeader.GangNumber 
                                AND 
                                    VPS_ShiftPlanHeader.VoyageID = VPS_GangPlanHeader.VoyageID
                                WHERE 
                                    VPS_ShiftPlanDetail.ShiftHeaderID=@ShiftHeaderID
                                AND 
                                    VPS_ShiftPlanDetail.ShiftNo=@ShiftNo
                                AND
                                    VPS_ShiftPlanDetail.LiftTime=@LiftTime
                                AND 
                                    VPS_GangPlanHeader.GangPlanHeaderID=@GangPlanHeaderID`);

                    if (liftTimeDetailsResults.recordset.length===0) {
                        throw new Error(`No details found for lift ${liftTime}`);
                    }

                    liftTimeDetailsResults.recordset.forEach(record => {
                        const winchmanEmpNo = record.WinchmanEmpNo;
                        const key = `${crane}-${winchmanEmpNo}`;

                        if(!winchmanMap.has(key)){
                            winchmanMap.set(key, {
                                craneName: crane,
                                craneType: craneType,
                                winchmanEmpNo: winchmanEmpNo,
                                winchman: record.Winchman.trim(),
                                totalProductivity: 0,
                                totalTarget: 0,
                                totalHours: 0,
                                liftCount: 0
                            });
                        }

                        const winchmanData = winchmanMap.get(key);
                        winchmanData.totalProductivity += (record.Actual || 0);
                        winchmanData.totalTarget += (record.Target || 0);
                        winchmanData.totalHours += 1;
                        winchmanData.liftCount += 1;
                    });

                    liftTimeDetails.push({
                        liftTime,
                        winchman: liftTimeDetailsResults.recordset.map(r=>r.Winchman.trim()),
                        winchmanEmpNo: liftTimeDetailsResults.recordset.map(r=>r.WinchmanEmpNo),
                        target: liftTimeDetailsResults.recordset.map(r=>r.Target),
                        actual: liftTimeDetailsResults.recordset.map(r=>r.Actual)
                    });
                }
                craneDetails.push({
                    gphID: gangPlanHeaderId, 
                    craneName: crane,
                    foreman: craneDetailsResults.recordset.map(r=>r.Foreman.trim()),
                    foremanEmpNo: craneDetailsResults.recordset.map(r=>r.ForemanEmpNo),
                    bayplanner: craneDetailsResults.recordset.map(r=>r.BayPlanner.trim()),
                    bayplannerEmpNo: craneDetailsResults.recordset.map(r=>r.BayPlannerEmpNo),
                    liftTimeDetails
                });
            }
            const liftTimeShift = liftTimesResults.recordset.map(r=>r.LiftTime);
            const shiftRow =  shiftDetailsResults.recordset.find(r=>r.ShiftNumber === shiftNumber);

            const summary = Array.from(winchmanMap.values()).map(data => ({
                craneName: data.craneName,
                craneType: data.craneType,
                winchmanEmpNo: data.winchmanEmpNo,
                winchman: data.winchman,
                totalProductivity: data.totalProductivity,
                totalTarget: data.totalTarget,
                totalHours: data.totalHours,
                avgTarget: data.liftCount > 0 ? (data.totalTarget/data.liftCount).toFixed(0) : 0
            }));

            shiftDetails.push({
                shiftNumber,
                shiftStartDate: shiftRow.ShiftStartDate,
                shiftStartTime: shiftRow.ShiftStartTime,
                shiftEndDate: shiftRow.ShiftEndDate,
                shiftEndTime: shiftRow.ShiftEndTime,
                cranes,
                craneList,
                liftTimeShift,
                craneDetails,
                summary
            });
        }
        return { shiftNumbers, shiftDetails }
    } catch (error) {
        throw error;
    }
}

module.exports = { getAllCprDetails };