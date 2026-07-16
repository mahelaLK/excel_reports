import XLSX from "xlsx-js-style";

const BORDER = {
  top: { style: "thin", color: { rgb: "000000" } },
  bottom: { style: "thin", color: { rgb: "000000" } },
  left: { style: "thin", color: { rgb: "000000" } },
  right: { style: "thin", color: { rgb: "000000" } },
};

// ---- small helpers -------------------------------------------------------

const mk = (v, s = {}) => ({
  v,
  s: {
    border: BORDER,
    alignment: { horizontal: "center", vertical: "center" },
    ...s,
  },
});

const empty = () => mk("");
const emptyN = (n) => Array(n).fill(empty());

const headerStyle = (sz = 11) => ({
  font: { bold: true, sz },
  fill: { fgColor: { rgb: "8497B0" } },
});

const labelStyle = (sz = 10) => ({
  font: { bold: true, sz },
  fill: { fgColor: { rgb: "F2F2F2" } },
});

const totalStyle = (sz = 10) => ({
  font: { bold: true, sz },
  fill: { fgColor: { rgb: "FFFFFF" } },
});

const valueStyle = (sz = 10) => ({ font: { sz } });

const isRamp = (plan) => plan.details.Crane === "RAMP";

const hasBothVehAndBblk = (plan) => {
  const d = plan.details;
  return (Number(d.NoOfVehicles) || 0) !== 0 && (Number(d.BBLK) || 0) !== 0;
};

const isVehOnly = (plan) => {
  const d = plan.details;
  return (Number(d.NoOfVehicles) || 0) !== 0 && (Number(d.BBLK) || 0) === 0;
};

const isBblkOnly = (plan) => {
  const d = plan.details;
  return (Number(d.NoOfVehicles) || 0) === 0 && (Number(d.BBLK) || 0) !== 0;
};

// Column width per gang: 4 when the gang carries both VEH & BBLK, else 3.
// (Only RAMP gangs realistically hit "both", but the width itself doesn't
// need to be RAMP-gated - it just falls out of the veh/bblk values.)
const getGangCols = (plan) => (hasBothVehAndBblk(plan) ? 4 : 3);

export const exportTableStyledGen = async (vesselName, gangDetailsGen) => {
  try {
    const wb = XLSX.utils.book_new();
    const wsData = [];
    const merges = [];

    const plans = gangDetailsGen.gangPlanDetails;
    const numGangs = plans.length;
    const anyRamp = plans.some(isRamp);

    const gangColWidths = plans.map(getGangCols);
    const gangColStarts = [];
    {
      let acc = 1; // column 0 is the row label
      gangColWidths.forEach((w) => {
        gangColStarts.push(acc);
        acc += w;
      });
    }
    const totalGangCols = gangColWidths.reduce((a, b) => a + b, 0);

    // Shared width for: (a) the "sum" column block on metric rows, and
    // (b) the Remarks(1) + per-gang Crane(numGangs) block in the shift
    // section. Both equal 1 + numGangs.
    const totalColStart = 1 + totalGangCols;
    const totalColWidth = 1 + numGangs;
    const totalCols = totalColStart + totalColWidth;

    const addMerge = (row, colStart, width) => {
      if (width > 1) {
        merges.push({
          s: { r: row, c: colStart },
          e: { r: row, c: colStart + width - 1 },
        });
      }
    };
    const addMergeRows = (rowStart, rowEnd, col) => {
      if (rowEnd > rowStart) {
        merges.push({ s: { r: rowStart, c: col }, e: { r: rowEnd, c: col } });
      }
    };

    // ---- Row 1: Vessel name --------------------------------------------
    wsData.push([
      mk(`VESSEL NAME/VOYAGE: ${vesselName}`, {
        font: { bold: true, underline: true, sz: 16, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "8497B0" } },
      }),
      ...emptyN(totalCols - 1),
    ]);
    addMerge(0, 0, totalCols);

    // ---- Row 2: Berthside ----------------------------------------------
    wsData.push([
      mk(`Berthside: ${gangDetailsGen.berthSide}`, {
        font: { bold: true, sz: 12 },
        fill: { fgColor: { rgb: "8497B0" } },
      }),
      ...emptyN(totalCols - 1),
    ]);
    addMerge(1, 0, totalCols);

    // ---- Row 3: Gang ----------------------------------------------------
    {
      const row = [mk("Gang", headerStyle(11))];
      plans.forEach((plan, i) => {
        row.push(mk(plan.gangNumber, headerStyle(11)));
        row.push(...emptyN(gangColWidths[i] - 1));
      });
      wsData.push(row);
      const r = wsData.length - 1;
      plans.forEach((_, i) => addMerge(r, gangColStarts[i], gangColWidths[i]));
    }

    // ---- Row 4: Crane ----------------------------------------------------
    {
      const row = [mk("Crane", headerStyle(10))];
      plans.forEach((plan, i) => {
        row.push(mk(plan.details.Crane, headerStyle(10)));
        row.push(...emptyN(gangColWidths[i] - 1));
      });
      wsData.push(row);
      const r = wsData.length - 1;
      plans.forEach((_, i) => addMerge(r, gangColStarts[i], gangColWidths[i]));
    }

    // ---- Row 5: Bays -----------------------------------------------------
    {
      const row = [mk("Bays", headerStyle(10))];
      plans.forEach((plan, i) => {
        row.push(mk(plan.details.ListOfBays, headerStyle(10)));
        row.push(...emptyN(gangColWidths[i] - 1));
      });
      wsData.push(row);
      const r = wsData.length - 1;
      plans.forEach((_, i) => addMerge(r, gangColStarts[i], gangColWidths[i]));
    }

    // ---- Cont/VEH/BBLK (conditional: only if some RAMP gang has veh/bblk) --
    if (plans.some((p) => isRamp(p) && (p.details.NoOfVehicles !== 0 || p.details.BBLK !== 0))) {
      const row = [mk("Cont/VEH/BBLK", labelStyle(10))];
      plans.forEach((plan, i) => {
        const d = plan.details;
        if (hasBothVehAndBblk(plan)) {
          row.push(mk("VEH", valueStyle(10)));
          row.push(...emptyN(2));
          row.push(mk("BBLK", valueStyle(10)));
        } else if (isVehOnly(plan)) {
          row.push(mk("VEH", valueStyle(10)));
          row.push(...emptyN(2));
        } else if (isBblkOnly(plan)) {
          row.push(mk("BBLK", valueStyle(10)));
          row.push(...emptyN(2));
        } else {
          row.push(mk("Cont", valueStyle(10)));
          row.push(...emptyN(gangColWidths[i] - 1));
        }
      });
      wsData.push(row);
      const r = wsData.length - 1;
      plans.forEach((plan, i) => {
        if (hasBothVehAndBblk(plan)) addMerge(r, gangColStarts[i], 3);
        else addMerge(r, gangColStarts[i], gangColWidths[i]);
      });
    }

    // ---- Discharge ---------------------------------------------------
    {
      const row = [mk("Discharge", labelStyle(10))];
      plans.forEach((plan, i) => {
        const d = plan.details;
        if (isRamp(plan)) {
          if (hasBothVehAndBblk(plan)) {
            row.push(mk(d.NoOfVehicles, valueStyle(10)));
            row.push(...emptyN(2));
            row.push(mk(d.BBLK, valueStyle(10)));
          } else if (isVehOnly(plan)) {
            row.push(mk(d.NoOfVehicles, valueStyle(10)));
            row.push(...emptyN(2));
          } else if (isBblkOnly(plan)) {
            row.push(mk(d.BBLK, valueStyle(10)));
            row.push(...emptyN(2));
          } else {
            row.push(...emptyN(gangColWidths[i]));
          }
        } else {
          row.push(mk(d.Discharge, valueStyle(10)));
          row.push(...emptyN(gangColWidths[i] - 1));
        }
      });
      if (!anyRamp) {
        const total = plans.reduce((s, p) => s + (Number(p.details.Discharge) || 0), 0);
        row.push(mk(total, totalStyle(10)));
      } else {
        row.push(empty());
      }
      row.push(...emptyN(totalColWidth - 1));
      wsData.push(row);
      const r = wsData.length - 1;
      plans.forEach((plan, i) => {
        if (isRamp(plan) && hasBothVehAndBblk(plan)) addMerge(r, gangColStarts[i], 3);
        else addMerge(r, gangColStarts[i], gangColWidths[i]);
      });
      addMerge(r, totalColStart, totalColWidth);
    }

    // ---- Apw Discharge (conditional; veh/bblk split applies to ALL gangs) --
    if (plans.some((p) => p.details.ApwNoOfVehicles > 0 || p.details.ApwBBLK > 0)) {
      const row = [mk("Apw Discharge", labelStyle(10))];
      plans.forEach((plan, i) => {
        const d = plan.details;
        if (hasBothVehAndBblk(plan)) {
          row.push(mk(d.ApwNoOfVehicles, valueStyle(10)));
          row.push(...emptyN(2));
          row.push(mk(d.ApwBBLK, valueStyle(10)));
        } else if (isVehOnly(plan)) {
          row.push(mk(d.ApwNoOfVehicles, valueStyle(10)));
          row.push(...emptyN(2));
        } else if (isBblkOnly(plan)) {
          row.push(mk(d.ApwBBLK, valueStyle(10)));
          row.push(...emptyN(2));
        } else {
          row.push(...emptyN(gangColWidths[i]));
        }
      });
      if (!anyRamp) {
        const totalVehicles = plans.reduce((s, p) => s + (Number(p.details.ApwNoOfVehicles) || 0), 0);
        const totalBBLK = plans.reduce((s, p) => s + (Number(p.details.ApwBBLK) || 0), 0);
        let total = "";
        if (totalVehicles !== 0 && totalBBLK === 0) total = totalVehicles;
        else if (totalVehicles === 0 && totalBBLK !== 0) total = totalBBLK;
        else if (totalVehicles !== 0 && totalBBLK !== 0) total = totalVehicles + totalBBLK;
        row.push(mk(total, totalStyle(10)));
      } else {
        row.push(empty());
      }
      row.push(...emptyN(totalColWidth - 1));
      wsData.push(row);
      const r = wsData.length - 1;
      plans.forEach((plan, i) => {
        if (hasBothVehAndBblk(plan)) addMerge(r, gangColStarts[i], 3);
        else addMerge(r, gangColStarts[i], gangColWidths[i]);
      });
      addMerge(r, totalColStart, totalColWidth);
    }

    // ---- Overstow / Restow / Loads (unconditional; blank for RAMP gangs) --
    const plainMetricRow = (label, field) => {
      const row = [mk(label, labelStyle(10))];
      plans.forEach((plan, i) => {
        if (isRamp(plan)) {
          row.push(...emptyN(gangColWidths[i]));
        } else {
          row.push(mk(plan.details[field], valueStyle(10)));
          row.push(...emptyN(gangColWidths[i] - 1));
        }
      });
      if (!anyRamp) {
        const total = plans.reduce((s, p) => s + (Number(p.details[field]) || 0), 0);
        row.push(mk(total, totalStyle(10)));
      } else {
        row.push(empty());
      }
      row.push(...emptyN(totalColWidth - 1));
      wsData.push(row);
      const r = wsData.length - 1;
      plans.forEach((plan, i) => {
        if (isRamp(plan) && hasBothVehAndBblk(plan)) addMerge(r, gangColStarts[i], 3);
        else addMerge(r, gangColStarts[i], gangColWidths[i]);
      });
      addMerge(r, totalColStart, totalColWidth);
    };
    plainMetricRow("Overstow", "Overstow");
    plainMetricRow("Restow", "Restow");
    plainMetricRow("Loads", "Loads");

    // ---- No of Lifts -----------------------------------------------
    {
      const row = [mk("No of Lifts", labelStyle(10))];
      plans.forEach((plan, i) => {
        const d = plan.details;
        const rampSplit = isRamp(plan) && (d.NoOfDrivers !== 0 || d.BBLK !== 0);
        if (rampSplit && hasBothVehAndBblk(plan)) {
          const veh = (Number(d.NoOfVehicles) || 0) + (Number(d.ApwNoOfVehicles) || 0);
          const bblk = (Number(d.BBLK) || 0) + (Number(d.ApwBBLK) || 0);
          row.push(mk(veh, { ...valueStyle(10), fill: { fgColor: { rgb: "F2F2F2" } } }));
          row.push(...emptyN(2));
          row.push(mk(bblk, { ...valueStyle(10), fill: { fgColor: { rgb: "F2F2F2" } } }));
        } else if (rampSplit && isVehOnly(plan)) {
          const veh = (Number(d.NoOfVehicles) || 0) + (Number(d.ApwNoOfVehicles) || 0);
          row.push(mk(veh, { ...valueStyle(10), fill: { fgColor: { rgb: "F2F2F2" } } }));
          row.push(...emptyN(2));
        } else if (rampSplit && isBblkOnly(plan)) {
          const bblk = (Number(d.BBLK) || 0) + (Number(d.ApwBBLK) || 0);
          row.push(mk(bblk, { ...valueStyle(10), fill: { fgColor: { rgb: "F2F2F2" } } }));
          row.push(...emptyN(2));
        } else {
          const sum =
            (Number(d.Loads) || 0) + (Number(d.Restow) || 0) +
            (Number(d.Overstow) || 0) + (Number(d.Discharge) || 0);
          row.push(mk(sum, { ...valueStyle(10), fill: { fgColor: { rgb: "F2F2F2" } } }));
          row.push(...emptyN(gangColWidths[i] - 1));
        }
      });
      if (!anyRamp) {
        const total = plans.reduce(
          (s, p) =>
            s +
            (Number(p.details.Loads) || 0) + (Number(p.details.Restow) || 0) +
            (Number(p.details.Overstow) || 0) + (Number(p.details.Discharge) || 0),
          0
        );
        row.push(mk(total, { ...totalStyle(10), fill: { fgColor: { rgb: "D9D9D9" } } }));
      } else {
        row.push(empty());
      }
      row.push(...emptyN(totalColWidth - 1));
      wsData.push(row);
      const r = wsData.length - 1;
      plans.forEach((plan, i) => {
        const rampSplit = isRamp(plan) && (plan.details.NoOfDrivers !== 0 || plan.details.BBLK !== 0);
        if (rampSplit && hasBothVehAndBblk(plan)) addMerge(r, gangColStarts[i], 3);
        else addMerge(r, gangColStarts[i], gangColWidths[i]);
      });
      addMerge(r, totalColStart, totalColWidth);
    }

    // ---- Shift details ---------------------------------------------
    const globalRunning = plans.map(() => 0);
    const allShifts = [
      ...new Set(plans.flatMap((g) => g.shiftPlanDetails.map((s) => s.ShiftNumber))),
    ];

    allShifts.forEach((shiftNo) => {
      const firstShift = plans[0].shiftPlanDetails.find((s) => s.ShiftNumber === shiftNo);
      const baselineLiftTimes = firstShift?.liftTimePlanDetails ?? [];

      const cumulativeByGang = plans.map((plan, gangIdx) => {
        const shift = plan.shiftPlanDetails.find((s) => s.ShiftNumber === shiftNo);
        const ltPlan = shift?.liftTimePlanDetails ?? [];
        let running = globalRunning[gangIdx];
        const rows = [];

        for (let idx = 0; idx < baselineLiftTimes.length; idx++) {
          const lt = ltPlan[idx];
          const details = lt?.Details?.[0];
          const hasTarget = details && details.Target != null && String(details.Target).trim() !== "";
          const hasActual = details && details.Actual != null && String(details.Actual).trim() !== "";
          const hasBblk = details && details.BBLK != null && String(details.BBLK).trim() !== "";

          if (hasTarget || hasActual || hasBblk) {
            const tNum = hasTarget ? Number(details.Target) : 0;
            const aNum = hasActual ? Number(details.Actual) : 0;
            running += aNum - tNum;
            rows.push({
              targetRaw: details.Target,
              actualRaw: details.Actual,
              cumulative: running,
              bblkRaw: details.BBLK,
            });
          } else {
            rows.push({ targetRaw: null, actualRaw: null, cumulative: running, bblkRaw: null });
          }
        }
        globalRunning[gangIdx] = running;
        return rows;
      });

      // Shift header row
      {
        const row = [mk(`SHIFT ${shiftNo}`, headerStyle(12))];
        row.push(...emptyN(totalGangCols));
        row.push(mk("Remarks", headerStyle(11)));
        row.push(
          mk(`SHIFT ${shiftNo} SHIP SUPERVISOR: ${firstShift?.Supervisor ?? "-"}`, headerStyle(10))
        );
        row.push(...emptyN(numGangs - 1));
        wsData.push(row);
        const r = wsData.length - 1;
        addMerge(r, 0, 1 + totalGangCols);
        addMergeRows(r, r + 1, totalColStart); // Remarks spans 2 rows
        addMerge(r, totalColStart + 1, numGangs);
      }

      // Date + headers row
      {
        const dateStr = firstShift?.ShiftStartDate
          ? (() => {
              const d = new Date(firstShift.ShiftStartDate);
              return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
            })()
          : "-";

        const row = [mk(dateStr, headerStyle(10))];
        plans.forEach((plan, gangIdx) => {
          const shift = plan.shiftPlanDetails.find((s) => s.ShiftNumber === shiftNo);
          const both = hasBothVehAndBblk(plan);
          if (shift) {
            row.push(mk("Target", headerStyle(9)));
            row.push(mk("Actual", headerStyle(9)));
            row.push(mk("Variance", headerStyle(9)));
            if (both) row.push(mk("BBLK", headerStyle(9)));
          } else {
            row.push(mk("-", { alignment: { horizontal: "center", vertical: "center" } }));
            row.push(...emptyN(gangColWidths[gangIdx] - 1));
          }
        });
        row.push(empty()); // Remarks column (merged from header row above)
        plans.forEach((plan) => {
          row.push(mk(plan.details.Crane, headerStyle(9)));
        });
        wsData.push(row);
      }

      // Shift data rows
      baselineLiftTimes.forEach((lt, i) => {
        const row = [mk(lt?.LiftTime ?? "-", valueStyle(9))];

        plans.forEach((plan, gangIdx) => {
          const cell = cumulativeByGang[gangIdx]?.[i] ?? {
            targetRaw: null,
            actualRaw: null,
            cumulative: globalRunning[gangIdx],
            bblkRaw: null,
          };
          const both = hasBothVehAndBblk(plan);
          row.push(mk(cell.targetRaw != null ? cell.targetRaw : "-", valueStyle(9)));
          row.push(mk(cell.actualRaw != null ? cell.actualRaw : "-", valueStyle(9)));
          row.push(mk(cell.cumulative, valueStyle(9)));
          if (both) {
            row.push(mk(cell.bblkRaw != null ? cell.bblkRaw : "-", valueStyle(9)));
          }
        });

        const remarks =
          plans
            .map((plan) => {
              const crane = plan.details.Crane;
              const shift = plan.shiftPlanDetails.find((s) => s.ShiftNumber === shiftNo);
              const ltThis = shift?.liftTimePlanDetails[i];
              const remark = ltThis?.Details?.[0]?.Remarks;
              return remark && remark.trim() !== "" ? `${crane}: ${remark}` : null;
            })
            .filter(Boolean)
            .join("\n") || "-";

        row.push(
          mk(remarks, {
            font: { sz: 8 },
            alignment: { horizontal: "left", vertical: "center", wrapText: true },
          })
        );

        // Staff info: RAMP gangs spread FM/TK/Drivers/Checklist/Traffic/
        // Unlashing one-per-row (unchanged behavior). Non-RAMP gangs bundle
        // FM/BP/Winchman(s)/RDT together, shown only on the first row.
        plans.forEach((plan) => {
          const shift = plan.shiftPlanDetails.find((s) => s.ShiftNumber === shiftNo);
          let staffInfo = "";

          if (isRamp(plan)) {
            if (i === 0) staffInfo = `FM: ${shift?.Foreman ?? "-"}`;
            else if (i === 1) staffInfo = `Time Keeper: ${shift?.TK ?? "-"}`;
            else if (i === 2) staffInfo = `Drivers: ${shift?.NoOfDrivers ?? "-"}`;
            else if (i === 3) staffInfo = `Checklist: ${shift?.Checklist ?? "-"}`;
            else if (i === 4) staffInfo = `Traffic: ${shift?.Traffic ?? "-"}`;
            else if (i === 5) staffInfo = `Unlashing: ${shift?.Unlashing ?? "-"}`;
          } else if (i === 0) {
            const lines = [`FM: ${shift?.Foreman ?? "-"}`, `BP: ${shift?.BayPlanner ?? "-"}`];
            if (shift?.Winchman?.length) {
              shift.Winchman.forEach((wm, idx) => lines.push(`WM${idx + 1}: ${wm}`));
            } else {
              lines.push("WM: -");
            }
            lines.push(`RDT: ${shift?.Rdt ?? "-"}`);
            staffInfo = lines.join("\n");
          }

          row.push(
            mk(staffInfo, {
              font: { sz: 8 },
              alignment: { horizontal: "left", vertical: "center", wrapText: true },
            })
          );
        });

        wsData.push(row);
      });
    });

    // ---- Total lifts left / Productivity Rate / Est Hrs of Completion --
    const calcTotalLiftsLeft = (plan) => {
      const d = plan.details;
      const totalActual = plan.shiftPlanDetails.reduce((sum, shift) => {
        const s = (shift.liftTimePlanDetails || []).reduce(
          (ss, lt) => ss + (Number(lt?.Details?.[0]?.Actual) || 0),
          0
        );
        return sum + s;
      }, 0);

      if (isRamp(plan)) {
        if (hasBothVehAndBblk(plan)) {
          const totalLiftsVeh = (Number(d.NoOfVehicles) || 0) + (Number(d.ApwNoOfVehicles) || 0);
          const totalLiftsBBLK = (Number(d.BBLK) || 0) + (Number(d.ApwBBLK) || 0);
          const totalBblk = plan.shiftPlanDetails.reduce((sum, shift) => {
            const s = (shift.liftTimePlanDetails || []).reduce(
              (ss, lt) => ss + (Number(lt?.Details?.[0]?.BBLK) || 0),
              0
            );
            return sum + s;
          }, 0);
          return { veh: totalLiftsVeh - totalActual, bblk: totalLiftsBBLK - totalBblk };
        }
        const field = isVehOnly(plan) ? "NoOfVehicles" : "BBLK";
        const apwField = isVehOnly(plan) ? "ApwNoOfVehicles" : "ApwBBLK";
        const totalLifts = (Number(d[field]) || 0) + (Number(d[apwField]) || 0);
        return { veh: totalLifts - totalActual, bblk: null };
      }

      const totalLifts =
        (Number(d.Discharge) || 0) + (Number(d.Overstow) || 0) + (Number(d.Restow) || 0) + (Number(d.Loads) || 0);
      return { veh: totalLifts - totalActual, bblk: null };
    };

    const calcProductivity = (plan) => {
      let totalActual = 0;
      let totalCount = 0;
      plan.shiftPlanDetails.forEach((shift) => {
        (shift.liftTimePlanDetails || []).forEach((lt) => {
          const details = lt?.Details?.[0];
          if (details) {
            totalActual += Number(details.Actual) || 0;
            totalCount++;
          }
        });
      });

      if (isRamp(plan)) {
        if (hasBothVehAndBblk(plan)) {
          const productivity = totalCount > 0 ? (totalActual / totalCount).toFixed(0) : 0;
          return { veh: productivity, bblk: "" };
        }
        if (isBblkOnly(plan)) {
          let totalBblk = 0;
          let bblkCount = 0;
          plan.shiftPlanDetails.forEach((shift) => {
            (shift.liftTimePlanDetails || []).forEach((lt) => {
              const details = lt?.Details?.[0];
              if (details) {
                totalBblk += Number(details.Bblk) || 0;
                bblkCount++;
              }
            });
          });
          const productivity = bblkCount > 0 ? (totalBblk / bblkCount).toFixed(0) : 0;
          return { veh: productivity, bblk: null };
        }
      }
      const productivity = totalCount > 0 ? (totalActual / totalCount).toFixed(0) : 0;
      return { veh: productivity, bblk: null };
    };

    const calcEstHrs = (plan) => {
      const d = plan.details;
      let totalActual = 0;
      let totalCount = 0;
      plan.shiftPlanDetails.forEach((shift) => {
        (shift.liftTimePlanDetails || []).forEach((lt) => {
          const details = lt?.Details?.[0];
          if (details) {
            totalActual += Number(details.Actual) || 0;
            totalCount++;
          }
        });
      });
      const productivity = totalCount > 0 ? (totalActual / totalCount).toFixed(0) : 0;

      if (isRamp(plan)) {
        const totalLifts =
          (Number(d.Discharge) || 0) + (Number(d.Overstow) || 0) + (Number(d.Restow) || 0) +
          (Number(d.Loads) || 0) + (Number(d.NoOfVehicles) || 0) + (Number(d.ApwNoOfVehicles) || 0);
        const est = productivity > 0 ? ((totalLifts - totalActual) / productivity).toFixed(0) : 0;
        return { veh: est, bblk: hasBothVehAndBblk(plan) ? "" : null };
      }

      const totalLifts =
        (Number(d.Discharge) || 0) + (Number(d.Overstow) || 0) + (Number(d.Restow) || 0) + (Number(d.Loads) || 0);
      const est = productivity > 0 ? ((totalLifts - totalActual) / productivity).toFixed(0) : 0;
      return { veh: est, bblk: null };
    };

    const addSummaryRow = (label, calcFn) => {
      const row = [mk(label, labelStyle(10))];
      const results = plans.map(calcFn);
      const r = wsData.length; // this row's index (before push)

      plans.forEach((plan, i) => {
        const { veh, bblk } = results[i];
        row.push(mk(veh, valueStyle(10)));
        row.push(...emptyN(2));
        if (isRamp(plan) && hasBothVehAndBblk(plan)) {
          row.push(mk(bblk ?? "", valueStyle(10)));
        }
      });

      wsData.push(row);
      plans.forEach((plan, i) => {
        if (isRamp(plan) && hasBothVehAndBblk(plan)) addMerge(r, gangColStarts[i], 3);
        else addMerge(r, gangColStarts[i], gangColWidths[i]);
      });
      return r;
    };

    const totalLiftsRowIdx = addSummaryRow("Total lifts left", calcTotalLiftsLeft);
    addSummaryRow("Productivity Rate", calcProductivity);
    const estHrsRowIdx = addSummaryRow("Est Hrs of Completion", calcEstHrs);

    // BBLK cell for RAMP gangs with both VEH & BBLK spans across all three
    // summary rows, matching the JSX's rowSpan={3} on "Total lifts left".
    plans.forEach((plan, i) => {
      if (isRamp(plan) && hasBothVehAndBblk(plan)) {
        const bblkCol = gangColStarts[i] + 3;
        addMergeRows(totalLiftsRowIdx, estHrsRowIdx, bblkCol);
      }
    });

    // ---- sheet assembly --------------------------------------------
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws["!merges"] = merges;

    const colWidths = [{ wch: 20 }];
    for (let i = 0; i < totalGangCols; i++) colWidths.push({ wch: 12 });
    colWidths.push({ wch: 30 });
    for (let i = 0; i < numGangs; i++) colWidths.push({ wch: 25 });
    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Gang Details");
    XLSX.writeFile(wb, `Voyage_${gangDetailsGen.inwardVoyage}.xlsx`);
  } catch (error) {
    console.log(error);
  }
};