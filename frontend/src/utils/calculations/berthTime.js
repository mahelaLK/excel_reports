export const berthTime = (vprDetails) => {
    try {
        const safeDate = (dt) => dt ? dt.split("T")[0] : null;
        const safeTime = (tm) => tm ? tm.split(":").slice(0,2).join(":") : null;

        const voyage = vprDetails.voyageInfo || {};

        const berthPairs = [
            {
                startDate: safeDate(voyage.FirstBerthDate),
                startTime: safeTime(voyage.FirstBerthTime),
                endDate: safeDate(voyage.FirstBerthShiftDate) || safeDate(voyage.DepatureDate),
                endTime: safeTime(voyage.FirstBerthShiftTime) || safeTime(voyage.DepatureTime),
            },
            {
                startDate: safeDate(voyage.SecondBerthDate),
                startTime: safeTime(voyage.SecondBerthTime),
                endDate: safeDate(voyage.SecondBerthShiftDate) || safeDate(voyage.DepatureDate),
                endTime: safeTime(voyage.SecondBerthShiftTime) || safeTime(voyage.DepatureTime),
            },
            {
                startDate: safeDate(voyage.ThirdBerthShiftDate),
                startTime: safeTime(voyage.ThirdBerthShiftTime),
                endDate: safeDate(voyage.DepatureDate),
                endTime: safeTime(voyage.DepatureTime),
            }
        ];

        let totalMinutes = 0;

        berthPairs.forEach(pair => {
            if (pair.startDate && pair.startTime && pair.endDate && pair.endTime) {
                const start = new Date(`${pair.startDate}T${pair.startTime}:00`);
                const end = new Date(`${pair.endDate}T${pair.endTime}:00`);

                const diffMinutes = (end - start) / (1000 * 60);
                if (!isNaN(diffMinutes)) totalMinutes += diffMinutes;
            }
        });

        return (totalMinutes / 60).toFixed(2);
    } catch (error) {
        console.log(error);
    }
}