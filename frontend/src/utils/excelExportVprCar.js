import XLSX from "xlsx-js-style";
import { assets } from "../assets/assets";

export const exportVprCarStyled = async(vesselName, inwardVoyage, gwTime, bTime, vprDetails) => {
    try {
        const maxRowTotalItem = vprDetails.craneInfo?.reduce((max, item)=>item.rowTotal > max.rowTotal ? item : max, vprDetails.craneInfo[0]);
        const grossCraneProductivity = maxRowTotalItem ? Number(maxRowTotalItem.rowTotal/maxRowTotalItem.duration).toFixed(0) : 0;
        const netCraneProductivity = maxRowTotalItem ? Number(maxRowTotalItem.rowTotal/(maxRowTotalItem.duration-(vprDetails.delayInfo?.reduce((sum, item)=>sum+Number(item.minutes || 0), 0)))).toFixed(0) : 0;
        const shipsRateProductivity = Number(((vprDetails.craneInfo?.reduce((sum, item) => sum + Number(item.rowTotal || 0), 0))/(vprDetails.craneInfo?.reduce((sum, item) => sum + Number(item.duration || 0), 0)))*2).toFixed(0);
        const ciValue = vprDetails.craneInfo?.reduce((sum, item) => item.crane?.startsWith("VC")
            ? sum + Number(item.rowTotal || 0)
            : sum,
            0 ) ?? 0;

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

        //Merge types
        const addGcpMerges = (i, merges) => {
            merges.push(
                {s: {r: i, c: 1}, e: {r: i, c: 2}},
                {s: {r: i, c: 3}, e: {r: i, c: 4}},
                {s: {r: i, c: 5}, e: {r: i, c: 6}},
                {s: {r: i, c: 7}, e: {r: i, c: 9}}
            );
        }

        const addDelayMerges = (i, merges) => {
            merges.push(
                {s: {r: i, c: 0}, e: {r: i, c: 3}},
                {s: {r: i, c: 4}, e: {r: i, c: 5}},
                {s: {r: i, c: 6}, e: {r: i, c: 9}}
            );
        }

        const addProductivityMerges = (i, merges) => {
            merges.push(
                {s: {r: i, c: 0}, e: {r: i, c: 3}},
                {s: {r: i, c: 4}, e: {r: i, c: 9}}
            );
        }

        const addMainHeadMerges = (i, merges) => {
            merges.push(
                {s: {r: i, c: 0}, e: {r: i, c: 9}}
            );
        }

        //Border style
        const thinBorder = {
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            }
        }

        //Vessel name row

        wsData.push([
            {
                v: 'Vessel Name',
                s: { ...thinBorder }
            },
            {
                v: `${vesselName}`,
                s: {
                    font: {
                        bold: true
                    },
                    ...thinBorder
                }
            },
            ...createEmptyCells(5),
            {
                v: 'Voyage',
                s: { ...thinBorder }
            },
            ...createEmptyCells(1),
            {
                v: `${inwardVoyage}`,
                s: {
                    font: {
                        bold: true
                    },
                    ...thinBorder
                }
            },
        ]);

        // Operator Row

        wsData.push([
            {
                v: 'Operator',
                s: { ...thinBorder }
            },
            {
                v: 'To be developed',
                s: {
                    font: {
                        bold: true
                    },
                    ...thinBorder
                }
            },
            ...createEmptyCells(5),
            {
                v: 'Service Code',
                s: { ...thinBorder }
            },
            ...createEmptyCells(1),
            {
                v: `${vprDetails.voyageInfo?.ServiceCode}`,
                s: {
                    font: {
                        bold: true
                    },
                    ...thinBorder
                }
            },
        ]);

        const merges = [];

        for (let i = 0; i < 2; i++) {
            merges.push(
                {s: {r: i, c: 1}, e: {r: i, c: 6}}, 
                {s: {r: i, c: 7}, e: {r: i, c: 8}}
            );
        }

        // Arrived Row

        wsData.push([
            {
                v: 'Arrived',
                s: { ...thinBorder }
            },
            {
                v: `${vprDetails.voyageInfo?.ArrivedDate?.split("T")[0]}`,
                s: {
                    font: {
                        bold: true
                    },
                    ...thinBorder
                }
            },
            ...createEmptyCells(1),
            {
                v: `${vprDetails.voyageInfo?.ArrivedTime?.split(":").slice(0,2).join(":") + ' hrs'}`,
                s: {
                    font: {
                        bold: true
                    },
                    ...thinBorder
                }
            },
            ...createEmptyCells(1),
            {
                v: 'Idle Time at Anchorage',
                s: { ...thinBorder }
            },
            ...createEmptyCells(3),
            {
                v: 'To be developed',
                s: {
                    font: {
                        bold: true
                    },
                    ...thinBorder
                }
            },
        ]);

        //First Drop Anchor Row

        wsData.push([
            {
                v: 'First Drop Anchor',
                s: { ...thinBorder }
            },
            {
                v: `${vprDetails.voyageInfo?.FirstDropAnchorDate?.split("T")[0]}`,
                s: {
                    font: {
                        bold: true
                    },
                    ...thinBorder
                }
            },
            ...createEmptyCells(1),
            {
                v: `${vprDetails.voyageInfo?.FirstDropAnchorTime?.split(":").slice(0,2).join(":") + ' hrs'}`,
                s: {
                    font: {
                        bold: true
                    },
                    ...thinBorder
                }
            },
            ...createEmptyCells(1),
            {
                v: 'Time at Berth',
                s: { ...thinBorder }
            },
            ...createEmptyCells(3),
            {
                v: `${bTime}`,
                s: {
                    font: {
                        bold: true
                    },
                    ...thinBorder
                }
            },
        ]);

        //First Drop Anchor Row

        wsData.push([
            {
                v: 'First Anchor Weigh',
                s: { ...thinBorder }
            },
            {
                v: `${vprDetails.voyageInfo?.FirstAnchorWeighDate?.split("T")[0]}`,
                s: {
                    font: {
                        bold: true
                    },
                    ...thinBorder
                }
            },
            ...createEmptyCells(1),
            {
                v: `${vprDetails.voyageInfo?.FirstAnchorWeighTime?.split(":").slice(0,2).join(":") + ' hrs'}`,
                s: {
                    font: {
                        bold: true
                    },
                    ...thinBorder
                }
            },
            ...createEmptyCells(1),
            {
                v: 'Gross Working Time',
                s: { ...thinBorder }
            },
            ...createEmptyCells(3),
            {
                v: `${gwTime}`,
                s: {
                    font: {
                        bold: true
                    },
                    ...thinBorder
                }
            },
        ]);

        for (let i = 2; i < 5; i++) {
            merges.push(
                {s: {r: i, c: 1}, e: {r: i, c: 2}}, 
                {s: {r: i, c: 3}, e: {r: i, c: 4}}, 
                {s: {r: i, c: 5}, e: {r: i, c: 8}}
            );
        }

        // First Berth

        wsData.push([
            {
                v: 'First Berth',
                s: { ...thinBorder }
            },
            {
                v: `${vprDetails.voyageInfo?.FirstBerthDate?.split("T")[0]}`,
                s: {
                    font: {
                        bold: true
                    },
                    ...thinBorder
                }
            },
            ...createEmptyCells(1),
            {
                v: `${vprDetails.voyageInfo?.FirstBerthTime?.split(":").slice(0,2).join(":") + ' hrs'}`,
                s: {
                    font: {
                        bold: true
                    },
                    ...thinBorder
                }
            },
            ...createEmptyCells(6)
        ]);

        // OPS commence Row

        wsData.push([
            {
                v: 'First OPS Commence',
                s: { ...thinBorder }
            },
            {
                v: `${vprDetails.voyageInfo?.FirstOPSCommenceDate?.split("T")[0]}`,
                s: {
                    font: {
                        bold: true
                    },
                    ...thinBorder
                }
            },
            ...createEmptyCells(1),
            {
                v: `${vprDetails.voyageInfo?.FirstOPSCommenceTime?.split(":").slice(0,2).join(":") + ' hrs'}`,
                s: {
                    font: {
                        bold: true
                    },
                    ...thinBorder
                }
            },
            ...createEmptyCells(6)
        ]);

        // OPS complete Row

        wsData.push([
            {
                v: 'First OPS Complete',
                s: { ...thinBorder }
            },
            {
                v: `${vprDetails.voyageInfo?.FirstOPSCompleteDate?.split("T")[0]}`,
                s: {
                    font: {
                        bold: true
                    },
                    ...thinBorder
                }
            },
            ...createEmptyCells(1),
            {
                v: `${vprDetails.voyageInfo?.FirstOPSCompleteTime?.split(":").slice(0,2).join(":") + ' hrs'}`,
                s: {
                    font: {
                        bold: true
                    },
                    ...thinBorder
                }
            },
            ...createEmptyCells(6)
        ]);

        for (let i = 5; i < 8; i++) {
            merges.push(
                {s: {r: i, c: 1}, e: {r: i, c: 2}}, 
                {s: {r: i, c: 3}, e: {r: i, c: 4}}, 
                {s: {r: i, c: 5}, e: {r: i, c: 9}}
            );
        }        

        // First Berth Shift
        if(vprDetails.voyageInfo?.FirstBerthShiftDate){
            const startRow = wsData.length;
            wsData.push([
                {
                    v: 'First Berth Shift',
                    s: { ...thinBorder }
                },
                {
                    v: `${vprDetails.voyageInfo?.FirstBerthShiftDate?.split("T")[0]}`,
                    s: {
                        font: {
                            bold: true
                        },
                        ...thinBorder
                    }
                },
                ...createEmptyCells(1),
                {
                    v: `${vprDetails.voyageInfo?.FirstBerthShiftTime?.split(":").slice(0,2).join(":") + ' hrs'}`,
                    s: {
                        font: {
                            bold: true
                        },
                        ...thinBorder
                    }
                },
                ...createEmptyCells(6)
            ]);
            wsData.push([
                {
                    v: 'Second Drop Anchor',
                    s: { ...thinBorder }
                },
                {
                    v: `${vprDetails.voyageInfo?.SecondDropAnchorDate?.split("T")[0]}`,
                    s: {
                        font: {
                            bold: true
                        },
                        ...thinBorder
                    }
                },
                ...createEmptyCells(1),
                {
                    v: `${vprDetails.voyageInfo?.SecondDropAnchorTime?.split(":").slice(0,2).join(":") + ' hrs'}`,
                    s: {
                        font: {
                            bold: true
                        },
                        ...thinBorder
                    }
                },
                ...createEmptyCells(6)
            ]);
            wsData.push([
                {
                    v: 'Second Anchor Weigh',
                    s: { ...thinBorder }
                },
                {
                    v: `${vprDetails.voyageInfo?.SecondAnchorWeighDate?.split("T")[0]}`,
                    s: {
                        font: {
                            bold: true
                        },
                        ...thinBorder
                    }
                },
                ...createEmptyCells(1),
                {
                    v: `${vprDetails.voyageInfo?.SecondAnchorWeighTime?.split(":").slice(0,2).join(":") + ' hrs'}`,
                    s: {
                        font: {
                            bold: true
                        },
                        ...thinBorder
                    }
                },
                ...createEmptyCells(6)
            ]);
            wsData.push([
                {
                    v: 'Second Berth',
                    s: { ...thinBorder }
                },
                {
                    v: `${vprDetails.voyageInfo?.SecondBerthDate?.split("T")[0]}`,
                    s: {
                        font: {
                            bold: true
                        },
                        ...thinBorder
                    }
                },
                ...createEmptyCells(1),
                {
                    v: `${vprDetails.voyageInfo?.SecondBerthTime?.split(":").slice(0,2).join(":") + ' hrs'}`,
                    s: {
                        font: {
                            bold: true
                        },
                        ...thinBorder
                    }
                },
                ...createEmptyCells(6)
            ]);
            wsData.push([
                {
                    v: 'Second OPS Commence',
                    s: { ...thinBorder }
                },
                {
                    v: `${vprDetails.voyageInfo?.SecondOPSCommenceDate?.split("T")[0]}`,
                    s: {
                        font: {
                            bold: true
                        },
                        ...thinBorder
                    }
                },
                ...createEmptyCells(1),
                {
                    v: `${vprDetails.voyageInfo?.SecondOPSCommenceTime?.split(":").slice(0,2).join(":") + ' hrs'}`,
                    s: {
                        font: {
                            bold: true
                        },
                        ...thinBorder
                    }
                },
                ...createEmptyCells(6)
            ]);
            wsData.push([
                {
                    v: 'Second OPS Complete',
                    s: { ...thinBorder }
                },
                {
                    v: `${vprDetails.voyageInfo?.SecondOPSCompleteDate?.split("T")[0]}`,
                    s: {
                        font: {
                            bold: true
                        },
                        ...thinBorder
                    }
                },
                ...createEmptyCells(1),
                {
                    v: `${vprDetails.voyageInfo?.SecondOPSCompleteTime?.split(":").slice(0,2).join(":") + ' hrs'}`,
                    s: {
                        font: {
                            bold: true
                        },
                        ...thinBorder
                    }
                },
                ...createEmptyCells(6)
            ]);

            const endRow = wsData.length;

            for (let i = startRow; i < endRow; i++) {
                merges.push(
                    {s: {r: i, c: 1}, e: {r: i, c: 2}}, 
                    {s: {r: i, c: 3}, e: {r: i, c: 4}}, 
                    {s: {r: i, c: 5}, e: {r: i, c: 9}}
                );
            }
        }

        //Second berth shift
        if(vprDetails.voyageInfo?.SecondBerthShiftDate){
            const startRow = wsData.length;

            wsData.push([
                {
                    v: 'Second Berth Shift',
                    s: { ...thinBorder }
                },
                {
                    v: `${vprDetails.voyageInfo?.SecondBerthShiftDate?.split("T")[0]}`,
                    s: {
                        font: {
                            bold: true
                        },
                        ...thinBorder
                    }
                },
                ...createEmptyCells(1),
                {
                    v: `${vprDetails.voyageInfo?.SecondBerthShiftTime?.split(":").slice(0,2).join(":") + ' hrs'}`,
                    s: {
                        font: {
                            bold: true
                        },
                        ...thinBorder
                    }
                },
                ...createEmptyCells(6)
            ]);
            wsData.push([
                {
                    v: 'Third Drop Anchor',
                    s: { ...thinBorder }
                },
                {
                    v: `${vprDetails.voyageInfo?.ThirdDropAnchorDate?.split("T")[0]}`,
                    s: {
                        font: {
                            bold: true
                        },
                        ...thinBorder
                    }
                },
                ...createEmptyCells(1),
                {
                    v: `${vprDetails.voyageInfo?.ThirdDropAnchorTime?.split(":").slice(0,2).join(":") + ' hrs'}`,
                    s: {
                        font: {
                            bold: true
                        },
                        ...thinBorder
                    }
                },
                ...createEmptyCells(6)
            ]);
            wsData.push([
                {
                    v: 'Third Anchor Weigh',
                    s: { ...thinBorder }
                },
                {
                    v: `${vprDetails.voyageInfo?.ThirdAnchorWeighDate?.split("T")[0]}`,
                    s: {
                        font: {
                            bold: true
                        },
                        ...thinBorder
                    }
                },
                ...createEmptyCells(1),
                {
                    v: `${vprDetails.voyageInfo?.ThirdAnchorWeighTime?.split(":").slice(0,2).join(":") + ' hrs'}`,
                    s: {
                        font: {
                            bold: true
                        },
                        ...thinBorder
                    }
                },
                ...createEmptyCells(6)
            ]);
            wsData.push([
                {
                    v: 'Third Berth',
                    s: { ...thinBorder }
                },
                {
                    v: `${vprDetails.voyageInfo?.ThirdBerthDate?.split("T")[0]}`,
                    s: {
                        font: {
                            bold: true
                        },
                        ...thinBorder
                    }
                },
                ...createEmptyCells(1),
                {
                    v: `${vprDetails.voyageInfo?.ThirdBerthTime?.split(":").slice(0,2).join(":") + ' hrs'}`,
                    s: {
                        font: {
                            bold: true
                        },
                        ...thinBorder
                    }
                },
                ...createEmptyCells(6)
            ]);
            wsData.push([
                {
                    v: 'Third OPS Commence',
                    s: { ...thinBorder }
                },
                {
                    v: `${vprDetails.voyageInfo?.ThirdOPSCommenceDate?.split("T")[0]}`,
                    s: {
                        font: {
                            bold: true
                        },
                        ...thinBorder
                    }
                },
                ...createEmptyCells(1),
                {
                    v: `${vprDetails.voyageInfo?.ThirdOPSCommenceTime?.split(":").slice(0,2).join(":") + ' hrs'}`,
                    s: {
                        font: {
                            bold: true
                        },
                        ...thinBorder
                    }
                },
                ...createEmptyCells(6)
            ]);
            wsData.push([
                {
                    v: 'Third OPS Complete',
                    s: { ...thinBorder }
                },
                {
                    v: `${vprDetails.voyageInfo?.ThirdOPSCompleteDate?.split("T")[0]}`,
                    s: {
                        font: {
                            bold: true
                        },
                        ...thinBorder
                    }
                },
                ...createEmptyCells(1),
                {
                    v: `${vprDetails.voyageInfo?.ThirdOPSCompleteTime?.split(":").slice(0,2).join(":") + ' hrs'}`,
                    s: {
                        font: {
                            bold: true
                        },
                        ...thinBorder
                    }
                },
                ...createEmptyCells(6)
            ]);

            const endRow = wsData.length;

            for (let i = startRow; i < endRow; i++) {
                merges.push(
                    {s: {r: i, c: 1}, e: {r: i, c: 2}}, 
                    {s: {r: i, c: 3}, e: {r: i, c: 4}}, 
                    {s: {r: i, c: 5}, e: {r: i, c: 9}}
                );
            }
        }

        //Depature
        const startRow = wsData.length;
            
        wsData.push([
            {
                v: 'Depature',
                s: { ...thinBorder }
            },
            {
                v: `${vprDetails.voyageInfo?.DepatureDate?.split("T")[0]}`,
                s: {
                    font: {
                        bold: true
                    },
                    ...thinBorder
                }
            },
            ...createEmptyCells(1),
            {
                v: `${vprDetails.voyageInfo?.DepatureTime?.split(":").slice(0,2).join(":") + ' hrs'}`,
                s: {
                    font: {
                        bold: true
                    },
                    ...thinBorder
                }
            },
            ...createEmptyCells(6)
        ]);

        const endRow = wsData.length;

        for (let i = startRow; i < endRow; i++) {
            merges.push(
                {s: {r: i, c: 1}, e: {r: i, c: 2}}, 
                {s: {r: i, c: 3}, e: {r: i, c: 4}}, 
                {s: {r: i, c: 5}, e: {r: i, c: 9}}
            );
        }

        // Gross Crane Performance
        wsData.push([
            {
                v: 'Gross Crane Performance',
                s: {
                    ...thinBorder,
                    font: { bold: true },
                    alignment: { horizontal: "center", vertical: "center" }
                }
            },
            ...createEmptyCells(9)
        ]);

        addMainHeadMerges(wsData.length-1, merges);

        // G C P Headings
        wsData.push([
            {
                v: 'Working Bays',
                s: {
                    ...thinBorder,
                    font: { bold: true }
                }
            },
            {
                v: 'Duration',
                s: {
                    ...thinBorder,
                    font: { bold: true },
                    alignment: { horizontal: "center", vertical: "center" }
                }
            },
            ...createEmptyCells(1),
            {
                v: 'Moves',
                s: {
                    ...thinBorder,
                    font: { bold: true },
                    alignment: { horizontal: "center", vertical: "center" }
                }
            },
            ...createEmptyCells(1),
            {
                v: 'Rates',
                s: {
                    ...thinBorder,
                    font: { bold: true },
                    alignment: { horizontal: "center", vertical: "center" }
                }
            },
            ...createEmptyCells(1),
            {
                v: 'Remarks',
                s: {
                    ...thinBorder,
                    font: { bold: true }
                }
            },
            ...createEmptyCells(2)
        ]);
        
        addGcpMerges(wsData.length - 1, merges);

        // G C P data
        vprDetails.craneInfo?.forEach((crane)=>{
            wsData.push([
                {
                    v: `${crane.bay}`,
                    s: { ...thinBorder }
                },
                {
                    v: `${crane.duration}`,
                    s: {
                        ...thinBorder,
                        alignment: { horizontal: "center", vertical: "center" }
                    }
                },
                ...createEmptyCells(1),
                {
                    v: `${crane.rowTotal}`,
                    s: {
                        ...thinBorder,
                        alignment: { horizontal: "center", vertical: "center" }
                    }
                },
                ...createEmptyCells(1),
                {
                    v: `${Number(crane.rowTotal/crane.duration).toFixed(0)}`,
                    s: {
                        ...thinBorder,
                        alignment: { horizontal: "center", vertical: "center" }
                    }
                },
                ...createEmptyCells(1),
                {
                    v: `${crane.crane}`,
                    s: { ...thinBorder }
                },
                ...createEmptyCells(2)
            ]);

            addGcpMerges(wsData.length - 1, merges);
        });

        // G C P Headings
        wsData.push([
            {
                v: 'Total',
                s: {
                    ...thinBorder,
                    font: { bold: true }
                }
            },
            {
                v: `${vprDetails.craneInfo?.reduce((sum, item) => sum + Number(item.duration || 0), 0)}`,
                s: {
                    ...thinBorder,
                    font: { bold: true },
                    alignment: { horizontal: "center", vertical: "center" }
                }
            },
            ...createEmptyCells(1),
            {
                v: `${vprDetails.craneInfo?.reduce((sum, item) => sum + Number(item.rowTotal || 0), 0)}`,
                s: {
                    ...thinBorder,
                    font: { bold: true },
                    alignment: { horizontal: "center", vertical: "center" }
                }
            },
            ...createEmptyCells(1),
            {
                v: '',
                s: {
                    ...thinBorder,
                    font: { bold: true },
                    alignment: { horizontal: "center", vertical: "center" }
                }
            },
            ...createEmptyCells(1),
            {
                v: '',
                s: {
                    ...thinBorder,
                    font: { bold: true }
                }
            },
            ...createEmptyCells(2)
        ]);
        
        addGcpMerges(wsData.length - 1, merges);

        // Delay start row
        wsData.push([
            {
                v: 'Delays- based on heavy hatch',
                s: {
                    ...thinBorder,
                    font: { 
                        bold: true,
                        color: { rgb: '991B1B' } 
                    },
                    alignment: { horizontal: "center", vertical: "center" }
                }
            },
            ...createEmptyCells(9)
        ]);

        addMainHeadMerges(wsData.length-1, merges);

        wsData.push([
            {
                v: 'Reason',
                s: {
                    ...thinBorder,
                    font: { 
                        bold: true
                    }
                }
            },
            ...createEmptyCells(3),
            {
                v: 'Duration',
                s: {
                    ...thinBorder,
                    font: { 
                        bold: true
                    },
                    alignment: { horizontal: "center", vertical: "center" }
                }
            },
            ...createEmptyCells(1),
            {
                v: 'Remarks',
                s: {
                    ...thinBorder,
                    font: { 
                        bold: true
                    }
                }
            },
            ...createEmptyCells(3)
        ]);

        addDelayMerges(wsData.length-1, merges);

        vprDetails.delayInfo?.forEach((delay)=> {
            wsData.push([
                {
                    v: `${delay.reason}`,
                    s: {
                        ...thinBorder,
                        font: { 
                            bold: true
                        }
                    }
                },
                ...createEmptyCells(3),
                {
                    v: `${delay.minutes}`,
                    s: {
                        ...thinBorder,
                        alignment: { horizontal: "center", vertical: "center" }
                    }
                },
                ...createEmptyCells(1),
                {
                    v: '-',
                    s: { ...thinBorder }
                },
                ...createEmptyCells(3)
            ]);

            addDelayMerges(wsData.length-1, merges);
        });

        wsData.push([
            {
                v: 'Total Delay',
                s: {
                    ...thinBorder,
                    font: { 
                        bold: true
                    }
                }
            },
            ...createEmptyCells(3),
            {
                v: `${vprDetails.delayInfo?.reduce((sum, item)=>sum + (item.minutes || 0), 0)}`,
                s: {
                    ...thinBorder,
                    font: { 
                        bold: true
                    },
                    alignment: { horizontal: "center", vertical: "center" }
                }
            },
            ...createEmptyCells(1),
            {
                v: '',
                s: {
                    ...thinBorder,
                    font: { 
                        bold: true
                    }
                }
            },
            ...createEmptyCells(3)
        ]);

        addDelayMerges(wsData.length-1, merges);

        // Productivity start row
        wsData.push([
            {
                v: 'Productivity Ratios -based on heavy hatch',
                s: {
                    ...thinBorder,
                    font: { 
                        bold: true,
                        color: { rgb: '991B1B' } 
                    },
                    alignment: { horizontal: "center", vertical: "center" }
                }
            },
            ...createEmptyCells(9)
        ]);

        addMainHeadMerges(wsData.length-1, merges);

        wsData.push([
            {
                v: 'Gross Vehicle discharged Productivity',
                s: { ...thinBorder }
            },
            ...createEmptyCells(3),
            {
                v: `${grossCraneProductivity}`,
                s: { ...thinBorder }
            },
            ...createEmptyCells(5)
        ]);

        addProductivityMerges(wsData.length-1, merges);

        //Remarks start  row
        wsData.push([
            {
                v: 'Remarks',
                s: {
                    ...thinBorder,
                    font: { bold: true }
                }
            },
            ...createEmptyCells(9)
        ]);

        addMainHeadMerges(wsData.length-1, merges);

        vprDetails.remarks?.forEach((remark)=>{
            wsData.push([
                {
                    v: `${remark}`,
                    s: { ...thinBorder }
                },
                ...createEmptyCells(9)
            ]);

            addMainHeadMerges(wsData.length-1, merges);
        });

        wsData.push([
            {
                v: 'Report Date',
                s: { ...thinBorder }
            },
            {
                v: `${new Date().toISOString().split("T")[0]}`,
                s: {
                    ...thinBorder,
                    alignment: { horizontal: "center", vertical: "center" }
                }
            },
            ...createEmptyCells(8)
        ]);

        for (let i = wsData.length-1; i < wsData.length; i++) {
            merges.push({s: {r: i, c: 1}, e: {r: i, c: 9}});
        }

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        ws["!merges"] = merges;
        
        const colWidths = [{ wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 20 }];

        ws["!cols"] = colWidths;
        XLSX.utils.book_append_sheet(wb, ws, "VPR");
        XLSX.writeFile(wb, `VPR_Vessel_${vesselName}.xlsx`);

    } catch (error) {
        console.log(error);
    }
}