import XLSX from "xlsx-js-style";

export const exportCprStyled = async(vesselName, inwardVoyage, cprDetails) => {
    try {
        const wb = XLSX.utils.book_new();
        const wsData = [];

        //Empty cells
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
            }
        });

        //Empty cells with color
        const createEmptyCellsColor = (count) =>
        Array(count).fill({
            v: "",
            s: {
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
                fill: { fgColor: { rgb: "8497B0" } }
            }
        });

        //Border style
        const thinBorder = {
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            }
        }

        const merges = [];
        let currentRow = 0;

        const maxCranes = Math.max(...cprDetails.shiftNumbers.map(shift => {
            const shiftInfo = cprDetails.shiftDetails.find(s => s.shiftNumber === shift);
            return shiftInfo.cranes.length;
        }));

        const totalColumns = 1 + (maxCranes * 3);

        {cprDetails.shiftNumbers.map(shift => {
            const shiftInfo = cprDetails.shiftDetails.find(s => s.shiftNumber === shift);

            // Vessel name row
            merges.push(
                {s: {r: currentRow, c: 1}, e: {r: currentRow, c: 3}},
                {s: {r: currentRow, c: 4}, e: {r: currentRow, c: 6}}
            );
            wsData.push([
                ...createEmptyCells(1),
                {
                    v: `Vessel Name : ${vesselName}`,
                    s: { ...thinBorder, font: { bold: true}, fill: { fgColor: { rgb: "8497B0" } }}
                },
                ...createEmptyCells(2),
                {
                    v: `Voyage : ${inwardVoyage}`,
                    s: { ...thinBorder, font: {bold: true}, fill: { fgColor: { rgb: "8497B0" } }}
                },
                ...createEmptyCells(2)
            ]);
            currentRow++;

            // Shift number row
            merges.push(
                {s: {r: currentRow, c: 1}, e: {r: currentRow, c: 3}},
                {s: {r: currentRow, c: 4}, e: {r: currentRow, c: 6}}
            );
            wsData.push([
                {
                    v: `Shift : ${shift}`,
                    s: { ...thinBorder, fill: { fgColor: { rgb: "F3F3F3" } }}
                },
                {
                    v: `Commenced : ${shiftInfo.shiftStartDate.split('T')[0]}  ${shiftInfo.shiftStartTime.trim()} hrs`,
                    s: { ...thinBorder}
                },
                ...createEmptyCells(2),
                {
                    v: `Completed : ${shiftInfo.shiftEndDate.split('T')[0]}  ${shiftInfo.shiftEndTime.trim()} hrs`,
                    s: { ...thinBorder}
                },
                ...createEmptyCells(2)
            ]);
            currentRow++;

            // Empty row gap
            wsData.push(Array(totalColumns).fill({ v: "" }));
            currentRow++;

            // crane row
            const craneRow = [
                {
                    v: 'Crane',
                    s: { ...thinBorder, font: {bold: true}, alignment: { horizontal: "left", vertical: "center" }, fill: { fgColor: { rgb: "8497B0" } }}
                }
            ];
            
            shiftInfo.cranes.forEach((crane, index) => {
                const startCol = 1 + (index*3)
                merges.push({s: {r: currentRow, c: startCol}, e: {r: currentRow, c: startCol + 2}});
                const craneInfo = shiftInfo.craneDetails.find(c => c.gphID === crane.GangPlanHeaderID);

                craneRow.push({
                        v: `${craneInfo.craneName}`,
                        s: { ...thinBorder, alignment: { horizontal: "center", vertical: "center" }, fill: { fgColor: { rgb: "F3F3F3" } }}
                });

                craneRow.push(...createEmptyCells(2));
            });
            wsData.push(craneRow);
            currentRow++;

            //crane header row
            merges.push({s: {r: currentRow, c: 0}, e: {r: currentRow-1, c: 0}})
            const craneHeaderRow = [
                {...createEmptyCells(1)}
            ];
            
            shiftInfo.cranes.forEach(crane => {
                const craneInfo = shiftInfo.craneDetails.find(c => c.gphID === crane.GangPlanHeaderID);

                craneHeaderRow.push({
                        v: 'Name',
                        s: { ...thinBorder, font: {bold: true}, fill: { fgColor: { rgb: "8497B0" } }}
                });

                craneHeaderRow.push({
                        v: 'EDP',
                        s: { ...thinBorder, font: {bold: true}, alignment: { horizontal: "center", vertical: "center" }, fill: { fgColor: { rgb: "8497B0" } }}
                });

                craneHeaderRow.push(...createEmptyCellsColor(1));
            });
            wsData.push(craneHeaderRow);
            currentRow++;

            //Foreman Row
            const foremanRow = [
                {
                    v: 'Foreman',
                    s: { ...thinBorder, font: {bold: true}, fill: { fgColor: { rgb: "8497B0" } }}
                }
            ];
            
            shiftInfo.cranes.forEach(crane => {
                const craneInfo = shiftInfo.craneDetails.find(c => c.gphID === crane.GangPlanHeaderID);

                foremanRow.push({
                        v: `${craneInfo.foreman}`,
                        s: { ...thinBorder}
                });

                foremanRow.push({
                        v: `${craneInfo.foremanEmpNo}`,
                        s: { ...thinBorder, alignment: { horizontal: "center", vertical: "center" }}
                });

                foremanRow.push(...createEmptyCells(1));
            });
            wsData.push(foremanRow);
            currentRow++;

            //Bayplanner Row
            const bayplannerRow = [
                {
                    v: 'BayPlanner',
                    s: { ...thinBorder, font: {bold: true}, fill: { fgColor: { rgb: "8497B0" } }}
                }
            ];
            
            shiftInfo.cranes.forEach(crane => {
                const craneInfo = shiftInfo.craneDetails.find(c => c.gphID === crane.GangPlanHeaderID);

                bayplannerRow.push({
                        v: `${craneInfo.bayplanner}`,
                        s: { ...thinBorder}
                });

                bayplannerRow.push({
                        v: `${craneInfo.bayplannerEmpNo}`,
                        s: { ...thinBorder, alignment: { horizontal: "center", vertical: "center" }}
                });

                bayplannerRow.push(...createEmptyCells(1));
            });
            wsData.push(bayplannerRow);
            currentRow++;

            //Crane Operator Header Row
            const liftTimeHeaderRow = [
                {
                    v: 'Time',
                    s: { ...thinBorder, font: {bold: true}, fill: { fgColor: { rgb: "8497B0" } }}
                }
            ];
            
            shiftInfo.cranes.forEach(crane => {

                liftTimeHeaderRow.push({
                        v: 'Crane Operator Name',
                        s: { ...thinBorder, font: {bold: true}, fill: { fgColor: { rgb: "8497B0" } }}
                });

                liftTimeHeaderRow.push({
                        v: 'EDP',
                        s: { ...thinBorder, font: {bold: true}, alignment: { horizontal: "center", vertical: "center" }, fill: { fgColor: { rgb: "8497B0" } }}
                });

                liftTimeHeaderRow.push({
                        v: 'Productivity',
                        s: { ...thinBorder, font: {bold: true}, alignment: { horizontal: "center", vertical: "center" }, fill: { fgColor: { rgb: "8497B0" } }}
                });
            });
            wsData.push(liftTimeHeaderRow);
            currentRow++;

            //Lift Rows
            shiftInfo.liftTimeShift.forEach(liftTime => {
                const liftRow = [{
                    v: `${liftTime}`,
                    s: { ...thinBorder, fill: { fgColor: { rgb: "F3F3F3" } }}
                }];

                shiftInfo.cranes.forEach(crane => {
                    const craneInfo = shiftInfo.craneDetails.find(c => c.gphID === crane.GangPlanHeaderID);
                    const liftTimeInfo = craneInfo.liftTimeDetails.find(lt => lt.liftTime === liftTime);
                    liftRow.push({
                        v: `${liftTimeInfo.winchman}`,
                        s: { ...thinBorder}
                    });

                    liftRow.push({
                        v: `${liftTimeInfo.winchmanEmpNo}`,
                        s: { ...thinBorder, alignment: { horizontal: "center", vertical: "center" }}
                    });

                    liftRow.push({
                        v: `${liftTimeInfo.actual}`,
                        s: { ...thinBorder, alignment: { horizontal: "center", vertical: "center" }}
                    });
                })
                wsData.push(liftRow);
                currentRow++;
            });

            // Empty row gap
            wsData.push(Array(totalColumns).fill({ v: "" }));
            currentRow++;

            //Summary Header
            merges.push(
                {s: {r: currentRow, c: 2}, e: {r: currentRow, c: 3}}
            );
            wsData.push([
                {
                    v: 'SR',
                    s: { ...thinBorder, font: { bold: true}, fill: { fgColor: { rgb: "8497B0" } }}
                },
                {
                    v: 'Crane Type',
                    s: { ...thinBorder, font: { bold: true}, fill: { fgColor: { rgb: "8497B0" } }}
                },
                {
                    v: 'Crane Operator',
                    s: { ...thinBorder, font: { bold: true}, fill: { fgColor: { rgb: "8497B0" } }}
                },
                ...createEmptyCells(1),
                {
                    v: 'EDP',
                    s: { ...thinBorder, font: { bold: true}, alignment: { horizontal: "center", vertical: "center" }, fill: { fgColor: { rgb: "8497B0" } }}
                },
                {
                    v: 'Hours Worked',
                    s: { ...thinBorder, font: { bold: true}, alignment: { horizontal: "center", vertical: "center" }, fill: { fgColor: { rgb: "8497B0" } }}
                },
                {
                    v: 'Total Moves',
                    s: { ...thinBorder, font: { bold: true}, alignment: { horizontal: "center", vertical: "center" }, fill: { fgColor: { rgb: "8497B0" } }}
                },
                {
                    v: 'Actual Productivity',
                    s: { ...thinBorder, font: { bold: true}, alignment: { horizontal: "center", vertical: "center" }, fill: { fgColor: { rgb: "8497B0" } }}
                },
                {
                    v: 'Target',
                    s: { ...thinBorder, font: { bold: true}, alignment: { horizontal: "center", vertical: "center" }, fill: { fgColor: { rgb: "8497B0" } }}
                },
                {
                    v: 'Varience',
                    s: { ...thinBorder, font: { bold: true}, alignment: { horizontal: "center", vertical: "center" }, fill: { fgColor: { rgb: "8497B0" } }}
                }
            ]);
            currentRow++;

            // Summary Rows
            shiftInfo.summary.forEach((row, index) => {
                const summaryRow = [];
                merges.push(
                    {s: {r: currentRow, c: 2}, e: {r: currentRow, c: 3}}
                );
                summaryRow.push({
                    v: `${index+1}`,
                    s: { ...thinBorder}
                });

                summaryRow.push({
                    v: `${row.craneType}`,
                    s: { ...thinBorder}
                });

                summaryRow.push({
                    v: `${row.winchman}`,
                    s: { ...thinBorder}
                });

                summaryRow.push(...createEmptyCells(1));

                summaryRow.push({
                    v: `${row.winchmanEmpNo}`,
                    s: { ...thinBorder, alignment: { horizontal: "center", vertical: "center" }}
                });

                summaryRow.push({
                    v: `${row.totalHours}`,
                    s: { ...thinBorder, alignment: { horizontal: "center", vertical: "center" }}
                });

                summaryRow.push({
                    v: `${row.totalProductivity}`,
                    s: { ...thinBorder, alignment: { horizontal: "center", vertical: "center" }}
                });

                summaryRow.push({
                    v: `${Number(row.totalProductivity/row.totalHours).toFixed(0)}`,
                    s: { ...thinBorder, alignment: { horizontal: "center", vertical: "center" }}
                });

                summaryRow.push({
                    v: `${row.avgTarget}`,
                    s: { ...thinBorder, alignment: { horizontal: "center", vertical: "center" }}
                });

                summaryRow.push({
                    v: `${Number((row.totalProductivity/row.totalHours).toFixed(0)-(row.avgTarget))}`,
                    s: { ...thinBorder, alignment: { horizontal: "center", vertical: "center" }}
                });
                wsData.push(summaryRow);
                currentRow++;
            });
            // Empty row gap
            wsData.push(Array(totalColumns).fill({ v: "" }));
            currentRow++;

            // Empty row gap
            wsData.push(Array(totalColumns).fill({ v: "" }));
            currentRow++;
        })}

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        ws["!merges"] = merges;

        const colWidths =[];
        colWidths.push({ wch: 10 });
        
        for (let i = 1; i < totalColumns; i++) {
            const positionInCrane = (i - 1) % 3;
            
            if (positionInCrane === 0) {
                // First column of each crane (Name) - wider
                colWidths.push({ wch: 25 });
            } else {
                // Second and third columns (EDP, Productivity) - default
                colWidths.push({ wch: 15 });
            }
        }
        
        ws["!cols"] = colWidths;
        XLSX.utils.book_append_sheet(wb, ws, "CPR");
        XLSX.writeFile(wb, `CPR_Vessel_${vesselName}.xlsx`);
    } catch (error) {
        console.log(error);
    }
}