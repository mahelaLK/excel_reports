import XLSX from "xlsx-js-style";

export const exportTableStyledGen = async (vesselName, gangDetailsGen) => {
    try {
        const wb = XLSX.utils.book_new();
        const wsData = [];

        const createEmptyCells = (count) =>
            Array(count).fill({
            v: "",
            s: {
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            });

        const numGangs = gangDetailsGen.gangPlanDetails.length;
        const numGangPlnHeadId = gangDetailsGen.gangPlanDetails.reduce(
            (sum, plan) => sum + (plan.gangDetails?.length || 0),
            0
        );
        const totalCols = 2 + numGangs + numGangPlnHeadId * 3;

        // Row 1: Voyage with proper styling
        wsData.push([
            {
            v: `VESSEL NAME/VOYAGE: ${vesselName}`,
            s: {
                font: {
                bold: true,
                underline: true,
                sz: 16,
                color: { rgb: "FFFFFF" },
                },
                fill: { fgColor: { rgb: "8497B0" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            },
            ...createEmptyCells(totalCols - 1),
        ]);

        // Row 2: Berthside with styling
        wsData.push([
            {
            v: `Berthside: ${gangDetailsGen.berthSide}`,
            s: {
                font: { bold: true, sz: 12 },
                fill: { fgColor: { rgb: "8497B0" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            },
            ...createEmptyCells(totalCols - 1),
        ]);

        // Row 3: Gang headers with styling
        const gangRow = [
            {
            v: "Gang",
            s: {
                font: { bold: true, sz: 11 },
                fill: { fgColor: { rgb: "8497B0" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            },
        ];

        gangDetailsGen.gangPlanDetails.forEach((plan) => {
            const details = plan.gangDetails;
            return details.map((d, i) => {
            if (i === 0) {
                gangRow.push({
                v: plan.gangNumber,
                s: {
                    font: { bold: true, sz: 11 },
                    fill: { fgColor: { rgb: "8497B0" } },
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                    },
                },
                });
            } else {
                gangRow.push({
                v: "",
                s: {
                    font: { bold: true, sz: 11 },
                    fill: { fgColor: { rgb: "8497B0" } },
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                    },
                },
                });
            }

            gangRow.push(
                {
                v: "",
                s: {
                    border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                    },
                },
                },
                {
                v: "",
                s: {
                    border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                    },
                },
                }
            ); // Empty cells for colspan effect
            });
        });
        wsData.push(gangRow);

        // Row 4: Crane with styling
        const craneRow = [
            {
            v: "Crane",
            s: {
                font: { bold: true, sz: 10 },
                fill: { fgColor: { rgb: "8497B0" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            },
        ];

        gangDetailsGen.gangPlanDetails.forEach((plan) => {
            const details = plan.gangDetails;
            details.map((d, i) => {
            if (i === 0) {
                craneRow.push({
                v: plan.Crane,
                s: {
                    font: { bold: true, sz: 10 },
                    fill: { fgColor: { rgb: "8497B0" } },
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                    },
                },
                });
            } else {
                craneRow.push({
                v: "",
                s: {
                    font: { bold: true, sz: 10 },
                    fill: { fgColor: { rgb: "8497B0" } },
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                    },
                },
                });
            }

            craneRow.push(
                {
                v: "",
                s: {
                    border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                    },
                },
                },
                {
                v: "",
                s: {
                    border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                    },
                },
                }
            );
            });
        });
        wsData.push(craneRow);

        // Row 5: Bays with styling
        const baysRow = [
            {
            v: "Bays",
            s: {
                font: { bold: true, sz: 10 },
                fill: { fgColor: { rgb: "8497B0" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            },
        ];

        gangDetailsGen.gangPlanDetails.forEach((plan) => {
            const details = plan.gangDetails;
            details.map(
            (d, i) => (
                baysRow.push({
                v: details[i].listOfBays,
                s: {
                    font: { bold: true, sz: 10 },
                    fill: { fgColor: { rgb: "8497B0" } },
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                    },
                },
                }),
                baysRow.push(
                {
                    v: "",
                    s: {
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } },
                    },
                    },
                },
                {
                    v: "",
                    s: {
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } },
                    },
                    },
                }
                )
            )
            );
        });
        wsData.push(baysRow);

        // Rows 6-9: Discharge, Overstow, Restow, Loads with styling
        const metrics = ["Discharge", "Overstow", "Restow", "Loads"];
        metrics.forEach((metric) => {
            const row = [
            {
                v: metric,
                s: {
                font: { bold: true, sz: 10 },
                fill: { fgColor: { rgb: "F2F2F2" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
                },
            },
            ];

            let total = 0;
            gangDetailsGen.gangPlanDetails.forEach((plan) => {
            const details = plan.gangDetails;
            details.map((d, i) => {
                const value = Number(details[i][metric]) || 0;
                total += value;
                row.push({
                v: value,
                s: {
                    font: { sz: 10 },
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                    },
                },
                });
                row.push(
                {
                    v: "",
                    s: {
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } },
                    },
                    },
                },
                {
                    v: "",
                    s: {
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } },
                    },
                    },
                }
                );
            });
            });

            row.push({
            v: total,
            s: {
                font: { bold: true, sz: 10 },
                fill: { fgColor: { rgb: "FFFFFF" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            });
            row.push(...createEmptyCells(numGangs));
            wsData.push(row);
        });

        // Row 10: No of Lifts with styling
        const liftsRow = [
            {
            v: "No of Lifts",
            s: {
                font: { bold: true, sz: 10 },
                fill: { fgColor: { rgb: "F2F2F2" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            },
        ];

        let totalLifts = 0;
        gangDetailsGen.gangPlanDetails.forEach((plan) => {
            const details = plan.gangDetails;
            details.map((d, i) => {
            const lifts =
                (Number(details[i].Loads) || 0) +
                (Number(details[i].Restow) || 0) +
                (Number(details[i].Overstow) || 0) +
                (Number(details[i].Discharge) || 0);
            totalLifts += lifts;
            liftsRow.push({
                v: lifts,
                s: {
                font: { sz: 10 },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
                },
            });
            liftsRow.push(
                {
                v: "",
                s: {
                    border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                    },
                },
                },
                {
                v: "",
                s: {
                    border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                    },
                },
                }
            );
            });
        });

        liftsRow.push({
            v: totalLifts,
            s: {
            font: { bold: true, sz: 10 },
            fill: { fgColor: { rgb: "FFFFFF" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            },
        });
        liftsRow.push(...createEmptyCells(numGangs));
        wsData.push(liftsRow);

        // Define merges (same as before)
        const merges = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } },
        ];

        for (let i = 0; i < numGangPlnHeadId; i++) {
            merges.push({ s: { r: 2, c: 1 + i * 3 }, e: { r: 2, c: 3 + i * 3 } });
        }

        for (let row = 3; row <= 4; row++) {
            for (let i = 0; i < numGangPlnHeadId; i++) {
            merges.push({
                s: { r: row, c: 1 + i * 3 },
                e: { r: row, c: 3 + i * 3 },
            });
            }
        }

        for (let row = 5; row <= 9; row++) {
            for (let i = 0; i < numGangPlnHeadId; i++) {
            merges.push({
                s: { r: row, c: 1 + i * 3 },
                e: { r: row, c: 3 + i * 3 },
            });
            }
            merges.push({
            s: { r: row, c: 1 + numGangPlnHeadId * 3 },
            e: { r: row, c: totalCols - 1 },
            });
        }

        // Continue with shift details (add styling to these as well)...
        const totalGangDetails = gangDetailsGen.gangPlanDetails.reduce(
            (sum, plan) => sum + (plan.gangDetails?.length || 0),
            0
        );
        const globalRunning = Array(totalGangDetails).fill(0);
        const allShifts = [
            ...new Set(
            gangDetailsGen.gangPlanDetails.flatMap((plan) =>
                plan.gangDetails.flatMap((g) =>
                g.shiftPlanDetails.map((s) => s.ShiftNumber)
                )
            )
            ),
        ];

        allShifts.forEach((shiftNo) => {
            const firstShift =
            gangDetailsGen.gangPlanDetails[0].gangDetails[0].shiftPlanDetails.find(
                (s) => s.ShiftNumber === shiftNo
            );
            const baselineLiftTimes = firstShift?.liftTimePlanDetails ?? [];

            const cumulativeByGangDetail = [];
            let gangDetailIdx = 0;

            gangDetailsGen.gangPlanDetails.forEach((plan) => {
            plan.gangDetails.forEach((gangDetail) => {
                const shift = gangDetail.shiftPlanDetails.find(
                (s) => s.ShiftNumber === shiftNo
                );
                const ltPlan = shift?.liftTimePlanDetails ?? [];
                let running = globalRunning[gangDetailIdx] || 0;
                const rows = [];

                for (let idx = 0; idx < baselineLiftTimes.length; idx++) {
                const lt = ltPlan[idx];
                const details = lt?.Details?.[0];

                // Convert to numbers, handling null/undefined
                const tNum =
                    details && details.Target != null ? Number(details.Target) : 0;
                const aNum =
                    details && details.Actual != null ? Number(details.Actual) : 0;

                // Calculate delta for this row
                const delta = aNum - tNum;

                // Add delta to running total
                running += delta;

                rows.push({
                    targetRaw: details?.Target,
                    actualRaw: details?.Actual,
                    cumulative: running,
                });
                }
                globalRunning[gangDetailIdx] = running;
                cumulativeByGangDetail.push(rows);
                gangDetailIdx++;
            });
            });

            // Shift header row with styling
            const shiftHeaderRow = [
            {
                v: `SHIFT ${shiftNo}`,
                s: {
                font: { bold: true, sz: 12 },
                fill: { fgColor: { rgb: "8497B0" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
                },
            },
            ...createEmptyCells(numGangPlnHeadId * 3),
            {
                v: "Remarks",
                s: {
                font: { bold: true, sz: 11 },
                fill: { fgColor: { rgb: "8497B0" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
                },
            },
            {
                v: `SHIFT ${shiftNo} SHIP SUPERVISOR: ${
                firstShift?.Supervisor ?? "-"
                }`,
                s: {
                font: { bold: true, sz: 10 },
                fill: { fgColor: { rgb: "8497B0" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
                },
            },
            ...createEmptyCells(numGangs - 1),
            ];

            wsData.push(shiftHeaderRow);
            merges.push({
            s: { r: wsData.length - 1, c: 0 },
            e: { r: wsData.length - 1, c: numGangPlnHeadId * 3 },
            });
            merges.push({
            s: { r: wsData.length - 1, c: numGangPlnHeadId * 3 + 1 },
            e: { r: wsData.length, c: numGangPlnHeadId * 3 + 1 },
            });
            merges.push({
            s: { r: wsData.length - 1, c: numGangPlnHeadId * 3 + 2 },
            e: { r: wsData.length - 1, c: totalCols - 1 },
            });

            // Date + headers row with styling
            const dateStr = firstShift?.ShiftStartDate
            ? (() => {
                const d = new Date(firstShift.ShiftStartDate);
                return `${String(d.getDate()).padStart(2, "0")}/${String(
                    d.getMonth() + 1
                ).padStart(2, "0")}/${d.getFullYear()}`;
                })()
            : "-";

            const dateRow = [
            {
                v: dateStr,
                s: {
                font: { bold: true, sz: 10 },
                fill: { fgColor: { rgb: "8497B0" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
                },
            },
            ];

            gangDetailsGen.gangPlanDetails.forEach((plan) => {
            plan.gangDetails.forEach((gangDetail) => {
                const shift = gangDetail.shiftPlanDetails.find(
                (s) => s.ShiftNumber === shiftNo
                );
                if (shift) {
                ["Target", "Actual", "Variance"].forEach((header) => {
                    dateRow.push({
                    v: header,
                    s: {
                        font: { bold: true, sz: 9 },
                        fill: { fgColor: { rgb: "8497B0" } },
                        alignment: { horizontal: "center", vertical: "center" },
                        border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } },
                        },
                    },
                    });
                });
                } else {
                dateRow.push({
                    v: "-",
                    s: {
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } },
                    },
                    },
                });
                dateRow.push("", "");
                }
            });
            });

            dateRow.push(""); // Remarks column (merged above)
            gangDetailsGen.gangPlanDetails.forEach((plan) => {
            dateRow.push({
                v: plan.Crane[0],
                s: {
                font: { bold: true, sz: 9 },
                fill: { fgColor: { rgb: "8497B0" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
                },
            });
            });
            wsData.push(dateRow);

            // Shift data rows with basic styling
            baselineLiftTimes.forEach((lt, i) => {
            const dataRow = [
                {
                v: lt?.LiftTime ?? "-",
                s: {
                    font: { sz: 9 },
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                    },
                },
                },
            ];

            let gangDetailGlobalIdx = 0;
            gangDetailsGen.gangPlanDetails.forEach((plan, planIdx) => {
                plan.gangDetails.forEach((gangDetail, gangDetailIdx) => {
                const cell = cumulativeByGangDetail[gangDetailGlobalIdx]?.[i] ?? {
                    targetRaw: null,
                    actualRaw: null,
                    cumulative: globalRunning[gangDetailGlobalIdx],
                };

                //const targetNum = cell.targetRaw != null ? Number(cell.targetRaw) : 0;
                //const actualNum = cell.actualRaw != null ? Number(cell.actualRaw) : 0;
                //const varianceNum = actualNum - targetNum;

                [
                    cell.targetRaw != null ? cell.targetRaw : "-",
                    cell.actualRaw != null ? cell.actualRaw : "-",
                    cell.cumulative,
                ].forEach((value) => {
                    dataRow.push({
                    v: value,
                    s: {
                        font: { sz: 9 },
                        alignment: { horizontal: "center", vertical: "center" },
                        border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } },
                        },
                    },
                    });
                });
                gangDetailGlobalIdx++;
                });
            });

            const remarks =
                gangDetailsGen.gangPlanDetails
                .map((plan) => {
                    const details = plan.gangDetails;
                    const crane = plan.Crane[0];
                    const shift = details[0].shiftPlanDetails.find(
                    (s) => s.ShiftNumber === shiftNo
                    );
                    const ltThis = shift?.liftTimePlanDetails[i];
                    const remark = ltThis?.Details?.[0]?.Remarks;
                    return remark && remark.trim() !== ""
                    ? `${crane}: ${remark}`
                    : null;
                })
                .filter(Boolean)
                .join("\n") || "-";

            dataRow.push({
                v: remarks,
                s: {
                font: { sz: 8 },
                alignment: {
                    horizontal: "left",
                    vertical: "center",
                    wrapText: true,
                },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
                },
            });

            gangDetailsGen.gangPlanDetails.forEach((plan) => {
                const shift = plan.gangDetails[0]?.shiftPlanDetails.find(
                (s) => s.ShiftNumber === shiftNo
                );
                let staffInfo = "";

                const isRamp =
                plan.Crane && plan.Crane.toString().toUpperCase() === "RAMP";

                if (isRamp) {
                if (i === 0) {
                    staffInfo = `FM: ${shift?.Foreman ?? "-"}`;
                } else if (i === 1) {
                    staffInfo = `Time Keeper: ${shift?.TK ?? "-"}`;
                } else if (i === 2) {
                    staffInfo = `Drivers: ${shift?.NoOfDrivers ?? "-"}`;
                } else if (i === 3) {
                    staffInfo = `Checklist: ${shift?.Checklist ?? "-"}`;
                } else if (i === 4) {
                    staffInfo = `Traffic: ${shift?.Traffic ?? "-"}`;
                } else if (i === 5) {
                    staffInfo = `Unlashing: ${shift?.Unlashing ?? "-"}`;
                }
                } else {
                if (i === 0) {
                    staffInfo = `FM: ${shift?.Foreman ?? "-"}`;
                } else if (i === 1) {
                    staffInfo = `BP: ${shift?.BayPlanner ?? "-"}`;
                } else if (i === 2) {
                    staffInfo = `WM: ${shift?.Winchman ?? "-"}`;
                } else if (i === 3) {
                    staffInfo = `RDT: ${shift?.RDT ?? "-"}`;
                }
                }

                dataRow.push({
                v: staffInfo,
                s: {
                    font: { sz: 8 },
                    alignment: { horizontal: "left", vertical: "center" },
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } },
                    },
                },
                });
            });
            wsData.push(dataRow);
            });
        });

        // Summary rows with styling (Total lifts left, Productivity Rate, Est Hrs of Completion)

        const summaryRows = [
            {
            label: "Total lifts left",
            bgColor: "8497B0",
            calculation: (gangDetail) => {
                const totalLifts =
                (Number(gangDetail.Discharge) || 0) +
                (Number(gangDetail.Overstow) || 0) +
                (Number(gangDetail.Restow) || 0) +
                (Number(gangDetail.Loads) || 0);
                const totalActual = gangDetail.shiftPlanDetails.reduce(
                (sum, shift) => {
                    const shiftSum = (shift.liftTimePlanDetails || []).reduce(
                    (s, lt) => {
                        const details = lt?.Details?.[0];
                        return s + (Number(details?.Actual) || 0);
                    },
                    0
                    );
                    return sum + shiftSum;
                },
                0
                );
                return totalLifts - totalActual;
            },
            },
            {
            label: "Productivity Rate",
            bgColor: "8497B0",
            calculation: (gangDetail) => {
                let totalActual = 0,
                totalCount = 0;
                gangDetail.shiftPlanDetails.forEach((shift) => {
                (shift.liftTimePlanDetails || []).forEach((lt) => {
                    const details = lt?.Details?.[0];
                    if (details) {
                    totalActual += Number(details.Actual) || 0;
                    totalCount++;
                    }
                });
                });
                return totalCount > 0 ? (totalActual / totalCount).toFixed(0) : 0;
            },
            },
            {
            label: "Est Hrs of Completion",
            bgColor: "8497B0",
            calculation: (gangDetail) => {
                let totalActual = 0,
                totalCount = 0;
                const totalLifts =
                (Number(gangDetail.Discharge) || 0) +
                (Number(gangDetail.Overstow) || 0) +
                (Number(gangDetail.Restow) || 0) +
                (Number(gangDetail.Loads) || 0);
                gangDetail.shiftPlanDetails.forEach((shift) => {
                (shift.liftTimePlanDetails || []).forEach((lt) => {
                    const details = lt?.Details?.[0];
                    if (details) {
                    totalActual += Number(details.Actual) || 0;
                    totalCount++;
                    }
                });
                });
                const productivity =
                totalCount > 0 ? (totalActual / totalCount).toFixed(0) : 0;
                return productivity > 0
                ? ((totalLifts - totalActual) / productivity).toFixed(0)
                : 0;
            },
            },
        ];

        summaryRows.forEach((summaryRow) => {
            const row = [
            {
                v: summaryRow.label,
                s: {
                font: { bold: true, sz: 10 },
                fill: { fgColor: { rgb: "8497B0" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
                },
            },
            ];

            gangDetailsGen.gangPlanDetails.forEach((plan) => {
            plan.gangDetails.forEach((gangDetail) => {
                row.push({
                v: summaryRow.calculation(gangDetail),
                s: {
                    font: { bold: true, sz: 10 },
                    fill: { fgColor: { rgb: summaryRow.bgColor } },
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                    },
                },
                });
                row.push(
                {
                    v: "",
                    s: {
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } },
                    },
                    },
                },
                {
                    v: "",
                    s: {
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } },
                    },
                    },
                }
                );
            });
            });

            wsData.push(row);
            for (let i = 0; i < numGangPlnHeadId; i++) {
            merges.push({
                s: { r: wsData.length - 1, c: 1 + i * 3 },
                e: { r: wsData.length - 1, c: 3 + i * 3 },
            });
            }
        });

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        ws["!merges"] = merges;

        const colWidths = [{ wch: 20 }];
        for (let i = 0; i < numGangPlnHeadId * 3; i++) {
            colWidths.push({ wch: 12 });
        }
        colWidths.push({ wch: 30 });
        for (let i = 0; i < numGangPlnHeadId; i++) {
            colWidths.push({ wch: 25 });
        }
        ws["!cols"] = colWidths;

        XLSX.utils.book_append_sheet(wb, ws, "Gang Details");
        XLSX.writeFile(wb, `Voyage_${gangDetailsGen.inwardVoyage}.xlsx`);
    } catch (error) {
        console.log(error);
    }
};