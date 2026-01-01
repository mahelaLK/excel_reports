import ExcelJS from 'exceljs';
import { assets } from "../assets/assets";

export const exportVprStyled = async(vesselName, inwardVoyage, gwTime, bTime, vprDetails) => {
    try {
        const maxRowTotalItem = vprDetails.craneInfo?.reduce((max, item)=>item.rowTotal > max.rowTotal ? item : max, vprDetails.craneInfo[0]);
        const grossCraneProductivity = maxRowTotalItem ? Number(maxRowTotalItem.rowTotal/maxRowTotalItem.duration).toFixed(0) : 0;
        const netCraneProductivity = maxRowTotalItem ? Number(maxRowTotalItem.rowTotal/(maxRowTotalItem.duration-(vprDetails.delayInfo?.reduce((sum, item)=>sum+Number(item.minutes || 0), 0)))).toFixed(0) : 0;
        const shipsRateProductivity = Number(((vprDetails.craneInfo?.reduce((sum, item) => sum + Number(item.rowTotal || 0), 0))/(vprDetails.craneInfo?.reduce((sum, item) => sum + Number(item.duration || 0), 0)))*2).toFixed(0);
        const ciValue = vprDetails.craneInfo?.reduce((sum, item) => item.crane?.startsWith("VC")
            ? sum + Number(item.rowTotal || 0)
            : sum,
            0 ) ?? 0;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('VPR');
        
        // Set column widths
        worksheet.columns = [
            { width: 20 }, { width: 10 }, { width: 10 }, { width: 10 }, 
            { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, 
            { width: 10 }, { width: 20 }
        ];

        const thinBorder = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        // Add logo
        try {
            // Merge cells for logo area (rows 1-3, columns 1-10)
            worksheet.mergeCells('A1:D5');
            
            // Set alignment for merged cell
            const logoCell = worksheet.getCell('A1');
            logoCell.alignment = { horizontal: 'left', vertical: 'middle' };

            // Merge cells for title area (rows 1-3, columns E-J)
            worksheet.mergeCells('E1:J3');
            const titleCell = worksheet.getCell('E1');
            titleCell.value = 'VESSEL PRODUCTIVITY REPORT'; // Add your title here
            titleCell.alignment = { horizontal: 'left', vertical: 'bottom' };
            titleCell.font = { bold: true, size: 16 }; // Customize font as needed
            //sub title
            worksheet.mergeCells('E4:J5');
            const subtitleCell = worksheet.getCell('E4');
            subtitleCell.value = 'PORT OF SUVA'; // Add your title here
            subtitleCell.alignment = { horizontal: 'left', vertical: 'top' };
            subtitleCell.font = { bold: true, size: 12 }; // Customize font as needed
            
            const logoBase64 = await getLogoBase64();
            const imageId = workbook.addImage({
                base64: logoBase64,
                extension: 'png',
            });
            
            // Add image - position it in the first 3 rows
            worksheet.addImage(imageId, {
                tl: { col: 0, row: 1 },
                ext: { width: 200, height: 60 } // Scaled down from 604x145
            });
            
            // Set height for logo rows
            worksheet.getRow(1).height = 40;
            worksheet.getRow(2).height = 40;
            worksheet.getRow(3).height = 40;
            worksheet.getRow(4).height = 40;
            worksheet.getRow(5).height = 40;
        } catch (err) {
            console.log('Logo error:', err);
        }

        let currentRow = 6; // Start after logo space

        // Vessel Name Row
        const vesselRow = worksheet.getRow(currentRow);
        vesselRow.getCell(1).value = 'Vessel Name';
        vesselRow.getCell(1).border = thinBorder;
        vesselRow.getCell(2).value = vesselName;
        vesselRow.getCell(2).font = { bold: true };
        vesselRow.getCell(2).border = thinBorder;
        
        for (let i = 3; i <= 7; i++) {
            vesselRow.getCell(i).border = thinBorder;
        }
        
        vesselRow.getCell(8).value = 'Voyage';
        vesselRow.getCell(8).border = thinBorder;
        vesselRow.getCell(9).border = thinBorder;
        vesselRow.getCell(10).value = inwardVoyage;
        vesselRow.getCell(10).font = { bold: true };
        vesselRow.getCell(10).border = thinBorder;
        
        worksheet.mergeCells(currentRow, 2, currentRow, 7);
        worksheet.mergeCells(currentRow, 8, currentRow, 9);
        currentRow++;

        // Operator Row
        const operatorRow = worksheet.getRow(currentRow);
        operatorRow.getCell(1).value = 'Operator';
        operatorRow.getCell(1).border = thinBorder;
        operatorRow.getCell(2).value = 'To be developed';
        operatorRow.getCell(2).font = { bold: true };
        operatorRow.getCell(2).border = thinBorder;
        
        for (let i = 3; i <= 7; i++) {
            operatorRow.getCell(i).border = thinBorder;
        }
        
        operatorRow.getCell(8).value = 'Service Code';
        operatorRow.getCell(8).border = thinBorder;
        operatorRow.getCell(9).border = thinBorder;
        operatorRow.getCell(10).value = vprDetails.voyageInfo?.ServiceCode || '';
        operatorRow.getCell(10).font = { bold: true };
        operatorRow.getCell(10).border = thinBorder;
        
        worksheet.mergeCells(currentRow, 2, currentRow, 7);
        worksheet.mergeCells(currentRow, 8, currentRow, 9);
        currentRow++;

        // Helper function to add date/time rows
        const addDateTimeRow = (label, date, time, rightLabel, rightValue) => {
            const row = worksheet.getRow(currentRow);
            row.getCell(1).value = label;
            row.getCell(1).border = thinBorder;
            row.getCell(2).value = date?.split("T")[0] || '';
            row.getCell(2).font = { bold: true };
            row.getCell(2).border = thinBorder;
            row.getCell(3).border = thinBorder;
            row.getCell(4).value = time?.split(":").slice(0,2).join(":") + ' hrs';
            row.getCell(4).font = { bold: true };
            row.getCell(4).border = thinBorder;
            row.getCell(5).border = thinBorder;
            
            if (rightLabel) {
                row.getCell(6).value = rightLabel;
                row.getCell(6).border = thinBorder;
                for (let i = 7; i <= 9; i++) {
                    row.getCell(i).border = thinBorder;
                }
                row.getCell(10).value = rightValue;
                row.getCell(10).font = { bold: true };
                row.getCell(10).border = thinBorder;
                worksheet.mergeCells(currentRow, 6, currentRow, 9);
            } else {
                for (let i = 6; i <= 10; i++) {
                    row.getCell(i).border = thinBorder;
                }
                worksheet.mergeCells(currentRow, 6, currentRow, 10);
            }
            
            worksheet.mergeCells(currentRow, 2, currentRow, 3);
            worksheet.mergeCells(currentRow, 4, currentRow, 5);
            currentRow++;
        };

        // Add all date/time rows
        addDateTimeRow('Arrived', vprDetails.voyageInfo?.ArrivedDate, vprDetails.voyageInfo?.ArrivedTime, 'Idle Time at Anchorage', 'To be developed');
        addDateTimeRow('First Drop Anchor', vprDetails.voyageInfo?.FirstDropAnchorDate, vprDetails.voyageInfo?.FirstDropAnchorTime, 'Time at Berth', bTime);
        addDateTimeRow('First Anchor Weigh', vprDetails.voyageInfo?.FirstAnchorWeighDate, vprDetails.voyageInfo?.FirstAnchorWeighTime, 'Gross Working Time', gwTime);
        addDateTimeRow('First Berth', vprDetails.voyageInfo?.FirstBerthDate, vprDetails.voyageInfo?.FirstBerthTime);
        addDateTimeRow('First OPS Commence', vprDetails.voyageInfo?.FirstOPSCommenceDate, vprDetails.voyageInfo?.FirstOPSCommenceTime);
        addDateTimeRow('First OPS Complete', vprDetails.voyageInfo?.FirstOPSCompleteDate, vprDetails.voyageInfo?.FirstOPSCompleteTime);

        // First berth shift (if exists)
        if(vprDetails.voyageInfo?.FirstBerthShiftDate){
            addDateTimeRow('First Berth Shift', vprDetails.voyageInfo?.FirstBerthShiftDate, vprDetails.voyageInfo?.FirstBerthShiftTime);
            addDateTimeRow('Second Drop Anchor', vprDetails.voyageInfo?.SecondDropAnchorDate, vprDetails.voyageInfo?.SecondDropAnchorTime);
            addDateTimeRow('Second Anchor Weigh', vprDetails.voyageInfo?.SecondAnchorWeighDate, vprDetails.voyageInfo?.SecondAnchorWeighTime);
            addDateTimeRow('Second Berth', vprDetails.voyageInfo?.SecondBerthDate, vprDetails.voyageInfo?.SecondBerthTime);
            addDateTimeRow('Second OPS Commence', vprDetails.voyageInfo?.SecondOPSCommenceDate, vprDetails.voyageInfo?.SecondOPSCommenceTime);
            addDateTimeRow('Second OPS Complete', vprDetails.voyageInfo?.SecondOPSCompleteDate, vprDetails.voyageInfo?.SecondOPSCompleteTime);
        }

        // Second berth shift (if exists)
        if(vprDetails.voyageInfo?.SecondBerthShiftDate){
            addDateTimeRow('Second Berth Shift', vprDetails.voyageInfo?.SecondBerthShiftDate, vprDetails.voyageInfo?.SecondBerthShiftTime);
            addDateTimeRow('Third Drop Anchor', vprDetails.voyageInfo?.ThirdDropAnchorDate, vprDetails.voyageInfo?.ThirdDropAnchorTime);
            addDateTimeRow('Third Anchor Weigh', vprDetails.voyageInfo?.ThirdAnchorWeighDate, vprDetails.voyageInfo?.ThirdAnchorWeighTime);
            addDateTimeRow('Third Berth', vprDetails.voyageInfo?.ThirdBerthDate, vprDetails.voyageInfo?.ThirdBerthTime);
            addDateTimeRow('Third OPS Commence', vprDetails.voyageInfo?.ThirdOPSCommenceDate, vprDetails.voyageInfo?.ThirdOPSCommenceTime);
            addDateTimeRow('Third OPS Complete', vprDetails.voyageInfo?.ThirdOPSCompleteDate, vprDetails.voyageInfo?.ThirdOPSCompleteTime);
        }

        // Departure
        if (ciValue > 0) {
            addDateTimeRow('Depature', vprDetails.voyageInfo?.DepatureDate, vprDetails.voyageInfo?.DepatureTime, 'CI', ciValue);
        } else {
            addDateTimeRow('Depature', vprDetails.voyageInfo?.DepatureDate, vprDetails.voyageInfo?.DepatureTime);
        }

        // Gross Crane Performance Header
        const gcpHeaderRow = worksheet.getRow(currentRow);
        gcpHeaderRow.getCell(1).value = 'Gross Crane Performance';
        gcpHeaderRow.getCell(1).font = { bold: true };
        gcpHeaderRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
        gcpHeaderRow.getCell(1).border = thinBorder;
        for (let i = 2; i <= 10; i++) {
            gcpHeaderRow.getCell(i).border = thinBorder;
        }
        worksheet.mergeCells(currentRow, 1, currentRow, 10);
        currentRow++;

        // GCP Column Headers
        const gcpColRow = worksheet.getRow(currentRow);
        gcpColRow.getCell(1).value = 'Working Bays';
        gcpColRow.getCell(1).font = { bold: true };
        gcpColRow.getCell(1).border = thinBorder;
        
        gcpColRow.getCell(2).value = 'Duration';
        gcpColRow.getCell(2).font = { bold: true };
        gcpColRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
        gcpColRow.getCell(2).border = thinBorder;
        gcpColRow.getCell(3).border = thinBorder;
        
        gcpColRow.getCell(4).value = 'Moves';
        gcpColRow.getCell(4).font = { bold: true };
        gcpColRow.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };
        gcpColRow.getCell(4).border = thinBorder;
        gcpColRow.getCell(5).border = thinBorder;
        
        gcpColRow.getCell(6).value = 'Rates';
        gcpColRow.getCell(6).font = { bold: true };
        gcpColRow.getCell(6).alignment = { horizontal: 'center', vertical: 'middle' };
        gcpColRow.getCell(6).border = thinBorder;
        gcpColRow.getCell(7).border = thinBorder;
        
        gcpColRow.getCell(8).value = 'Remarks';
        gcpColRow.getCell(8).font = { bold: true };
        gcpColRow.getCell(8).border = thinBorder;
        gcpColRow.getCell(9).border = thinBorder;
        gcpColRow.getCell(10).border = thinBorder;
        
        worksheet.mergeCells(currentRow, 2, currentRow, 3);
        worksheet.mergeCells(currentRow, 4, currentRow, 5);
        worksheet.mergeCells(currentRow, 6, currentRow, 7);
        worksheet.mergeCells(currentRow, 8, currentRow, 10);
        currentRow++;

        // GCP Data
        vprDetails.craneInfo?.forEach((crane) => {
            const dataRow = worksheet.getRow(currentRow);
            dataRow.getCell(1).value = crane.bay;
            dataRow.getCell(1).border = thinBorder;
            
            dataRow.getCell(2).value = crane.duration;
            dataRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
            dataRow.getCell(2).border = thinBorder;
            dataRow.getCell(3).border = thinBorder;
            
            dataRow.getCell(4).value = crane.rowTotal;
            dataRow.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };
            dataRow.getCell(4).border = thinBorder;
            dataRow.getCell(5).border = thinBorder;
            
            dataRow.getCell(6).value = Number(crane.rowTotal/crane.duration).toFixed(0);
            dataRow.getCell(6).alignment = { horizontal: 'center', vertical: 'middle' };
            dataRow.getCell(6).border = thinBorder;
            dataRow.getCell(7).border = thinBorder;
            
            dataRow.getCell(8).value = crane.crane;
            dataRow.getCell(8).border = thinBorder;
            dataRow.getCell(9).border = thinBorder;
            dataRow.getCell(10).border = thinBorder;
            
            worksheet.mergeCells(currentRow, 2, currentRow, 3);
            worksheet.mergeCells(currentRow, 4, currentRow, 5);
            worksheet.mergeCells(currentRow, 6, currentRow, 7);
            worksheet.mergeCells(currentRow, 8, currentRow, 10);
            currentRow++;
        });

        // GCP Total Row
        const gcpTotalRow = worksheet.getRow(currentRow);
        gcpTotalRow.getCell(1).value = 'Total';
        gcpTotalRow.getCell(1).font = { bold: true };
        gcpTotalRow.getCell(1).border = thinBorder;
        
        gcpTotalRow.getCell(2).value = vprDetails.craneInfo?.reduce((sum, item) => sum + Number(item.duration || 0), 0);
        gcpTotalRow.getCell(2).font = { bold: true };
        gcpTotalRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
        gcpTotalRow.getCell(2).border = thinBorder;
        gcpTotalRow.getCell(3).border = thinBorder;
        
        gcpTotalRow.getCell(4).value = vprDetails.craneInfo?.reduce((sum, item) => sum + Number(item.rowTotal || 0), 0);
        gcpTotalRow.getCell(4).font = { bold: true };
        gcpTotalRow.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };
        gcpTotalRow.getCell(4).border = thinBorder;
        gcpTotalRow.getCell(5).border = thinBorder;
        
        gcpTotalRow.getCell(6).border = thinBorder;
        gcpTotalRow.getCell(7).border = thinBorder;
        gcpTotalRow.getCell(8).border = thinBorder;
        gcpTotalRow.getCell(9).border = thinBorder;
        gcpTotalRow.getCell(10).border = thinBorder;
        
        worksheet.mergeCells(currentRow, 2, currentRow, 3);
        worksheet.mergeCells(currentRow, 4, currentRow, 5);
        worksheet.mergeCells(currentRow, 6, currentRow, 7);
        worksheet.mergeCells(currentRow, 8, currentRow, 10);
        currentRow++;

        // Delays Header
        const delayHeaderRow = worksheet.getRow(currentRow);
        delayHeaderRow.getCell(1).value = 'Delays- based on heavy hatch';
        delayHeaderRow.getCell(1).font = { bold: true, color: { argb: 'FF991B1B' } };
        delayHeaderRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
        delayHeaderRow.getCell(1).border = thinBorder;
        for (let i = 2; i <= 10; i++) {
            delayHeaderRow.getCell(i).border = thinBorder;
        }
        worksheet.mergeCells(currentRow, 1, currentRow, 10);
        currentRow++;

        // Delay Column Headers
        const delayColRow = worksheet.getRow(currentRow);
        delayColRow.getCell(1).value = 'Reason';
        delayColRow.getCell(1).font = { bold: true };
        delayColRow.getCell(1).border = thinBorder;
        delayColRow.getCell(2).border = thinBorder;
        delayColRow.getCell(3).border = thinBorder;
        delayColRow.getCell(4).border = thinBorder;
        
        delayColRow.getCell(5).value = 'Duration';
        delayColRow.getCell(5).font = { bold: true };
        delayColRow.getCell(5).alignment = { horizontal: 'center', vertical: 'middle' };
        delayColRow.getCell(5).border = thinBorder;
        delayColRow.getCell(6).border = thinBorder;
        
        delayColRow.getCell(7).value = 'Remarks';
        delayColRow.getCell(7).font = { bold: true };
        delayColRow.getCell(7).border = thinBorder;
        for (let i = 8; i <= 10; i++) {
            delayColRow.getCell(i).border = thinBorder;
        }
        
        worksheet.mergeCells(currentRow, 1, currentRow, 4);
        worksheet.mergeCells(currentRow, 5, currentRow, 6);
        worksheet.mergeCells(currentRow, 7, currentRow, 10);
        currentRow++;

        // Delay Data
        vprDetails.delayInfo?.forEach((delay) => {
            const delayRow = worksheet.getRow(currentRow);
            delayRow.getCell(1).value = delay.reason;
            delayRow.getCell(1).font = { bold: true };
            delayRow.getCell(1).border = thinBorder;
            delayRow.getCell(2).border = thinBorder;
            delayRow.getCell(3).border = thinBorder;
            delayRow.getCell(4).border = thinBorder;
            
            delayRow.getCell(5).value = delay.minutes;
            delayRow.getCell(5).alignment = { horizontal: 'center', vertical: 'middle' };
            delayRow.getCell(5).border = thinBorder;
            delayRow.getCell(6).border = thinBorder;
            
            delayRow.getCell(7).value = '-';
            delayRow.getCell(7).border = thinBorder;
            for (let i = 8; i <= 10; i++) {
                delayRow.getCell(i).border = thinBorder;
            }
            
            worksheet.mergeCells(currentRow, 1, currentRow, 4);
            worksheet.mergeCells(currentRow, 5, currentRow, 6);
            worksheet.mergeCells(currentRow, 7, currentRow, 10);
            currentRow++;
        });

        // Total Delay Row
        const totalDelayRow = worksheet.getRow(currentRow);
        totalDelayRow.getCell(1).value = 'Total Delay';
        totalDelayRow.getCell(1).font = { bold: true };
        totalDelayRow.getCell(1).border = thinBorder;
        totalDelayRow.getCell(2).border = thinBorder;
        totalDelayRow.getCell(3).border = thinBorder;
        totalDelayRow.getCell(4).border = thinBorder;
        
        totalDelayRow.getCell(5).value = vprDetails.delayInfo?.reduce((sum, item) => sum + (item.minutes || 0), 0);
        totalDelayRow.getCell(5).font = { bold: true };
        totalDelayRow.getCell(5).alignment = { horizontal: 'center', vertical: 'middle' };
        totalDelayRow.getCell(5).border = thinBorder;
        totalDelayRow.getCell(6).border = thinBorder;
        
        totalDelayRow.getCell(7).border = thinBorder;
        for (let i = 8; i <= 10; i++) {
            totalDelayRow.getCell(i).border = thinBorder;
        }
        
        worksheet.mergeCells(currentRow, 1, currentRow, 4);
        worksheet.mergeCells(currentRow, 5, currentRow, 6);
        worksheet.mergeCells(currentRow, 7, currentRow, 10);
        currentRow++;

        // Productivity Header
        const prodHeaderRow = worksheet.getRow(currentRow);
        prodHeaderRow.getCell(1).value = 'Productivity Ratios -based on heavy hatch';
        prodHeaderRow.getCell(1).font = { bold: true, color: { argb: 'FF991B1B' } };
        prodHeaderRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
        prodHeaderRow.getCell(1).border = thinBorder;
        for (let i = 2; i <= 10; i++) {
            prodHeaderRow.getCell(i).border = thinBorder;
        }
        worksheet.mergeCells(currentRow, 1, currentRow, 10);
        currentRow++;

        // Productivity Rows
        const addProductivityRow = (label, value) => {
            const row = worksheet.getRow(currentRow);
            row.getCell(1).value = label;
            row.getCell(1).border = thinBorder;
            row.getCell(2).border = thinBorder;
            row.getCell(3).border = thinBorder;
            row.getCell(4).border = thinBorder;
            row.getCell(5).value = value;
            row.getCell(5).border = thinBorder;
            for (let i = 6; i <= 10; i++) {
                row.getCell(i).border = thinBorder;
            }
            worksheet.mergeCells(currentRow, 1, currentRow, 4);
            worksheet.mergeCells(currentRow, 5, currentRow, 10);
            currentRow++;
        };

        addProductivityRow('Gross crane productivity', grossCraneProductivity);
        addProductivityRow('Net crane Productivity', netCraneProductivity);
        addProductivityRow('Ships Rate productivity', shipsRateProductivity);

        // Remarks Header
        const remarksHeaderRow = worksheet.getRow(currentRow);
        remarksHeaderRow.getCell(1).value = 'Remarks';
        remarksHeaderRow.getCell(1).font = { bold: true };
        remarksHeaderRow.getCell(1).border = thinBorder;
        for (let i = 2; i <= 10; i++) {
            remarksHeaderRow.getCell(i).border = thinBorder;
        }
        worksheet.mergeCells(currentRow, 1, currentRow, 10);
        currentRow++;

        // Remarks Data
        vprDetails.remarks?.forEach((remark) => {
            const remarkRow = worksheet.getRow(currentRow);
            remarkRow.getCell(1).value = remark;
            remarkRow.getCell(1).border = thinBorder;
            for (let i = 2; i <= 10; i++) {
                remarkRow.getCell(i).border = thinBorder;
            }
            worksheet.mergeCells(currentRow, 1, currentRow, 10);
            currentRow++;
        });

        // Report Date
        const reportDateRow = worksheet.getRow(currentRow);
        reportDateRow.getCell(1).value = 'Report Date';
        reportDateRow.getCell(1).border = thinBorder;
        reportDateRow.getCell(2).value = new Date().toISOString().split("T")[0];
        reportDateRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
        reportDateRow.getCell(2).border = thinBorder;
        for (let i = 3; i <= 10; i++) {
            reportDateRow.getCell(i).border = thinBorder;
        }
        worksheet.mergeCells(currentRow, 2, currentRow, 10);

        // Save file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `VPR_Vessel_${vesselName}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.log(error);
    }
}

// Helper function to convert image to base64
async function getLogoBase64() {
    // Option 1: If your logo is imported from assets
    const logoUrl = assets.FijiPortLogo; // Adjust to your actual logo path
    
    const response = await fetch(logoUrl);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}