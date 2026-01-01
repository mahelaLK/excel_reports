export const grossWorkingTime = (vprDetails) => {
    try {
        const opsPairs = [
            {
                startDate: vprDetails.voyageInfo?.FirstOPSCommenceDate?.split("T")[0],
                startTime: vprDetails.voyageInfo?.FirstOPSCommenceTime?.split(":").slice(0,2).join(":"),
                endDate: vprDetails.voyageInfo?.FirstOPSCompleteDate?.split("T")[0],
                endTime: vprDetails.voyageInfo?.FirstOPSCompleteTime?.split(":").slice(0,2).join(":")
            },
            {
                startDate: vprDetails.voyageInfo?.SecondOPSCommenceDate?.split("T")[0],
                startTime: vprDetails.voyageInfo?.SecondOPSCommenceTime?.split(":").slice(0,2).join(":"),
                endDate: vprDetails.voyageInfo?.SecondOPSCompleteDate?.split("T")[0],
                endTime: vprDetails.voyageInfo?.SecondOPSCompleteTime?.split(":").slice(0,2).join(":")
            },
            {
                startDate: vprDetails.voyageInfo?.ThirdOPSCommenceDate?.split("T")[0],
                startTime: vprDetails.voyageInfo?.ThirdOPSCommenceTime?.split(":").slice(0,2).join(":"),
                endDate: vprDetails.voyageInfo?.ThirdOPSCompleteDate?.split("T")[0],
                endTime: vprDetails.voyageInfo?.ThirdOPSCompleteTime?.split(":").slice(0,2).join(":")
            }
        ];

        let totalMinutes = 0;

        opsPairs.forEach(pair => {
            if (pair.startDate && pair.startTime && pair.endDate && pair.endTime) {

                const [sy, sm, sd] = pair.startDate.split("-").map(Number);
                const [sh, smin] = pair.startTime.split(":").map(Number);
                const [ey, em, ed] = pair.endDate.split("-").map(Number);
                const [eh, emin] = pair.endTime.split(":").map(Number);

                // build LOCAL dates (no timezone conversion)
                const start = new Date(sy, sm - 1, sd, sh, smin);
                const end = new Date(ey, em - 1, ed, eh, emin);

                const diffMinutes = (end - start) / (1000 * 60);
                if (!isNaN(diffMinutes)) totalMinutes += diffMinutes;
            }
        });

        return (totalMinutes / 60).toFixed(2);
    } catch (error) {
        console.log(error);
    }
}