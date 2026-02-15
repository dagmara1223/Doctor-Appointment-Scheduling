import type { Consultation } from "../types/consultation";
import type { Absence } from "../types/absence";
import type { Availability } from "../types/availability";

export const IsConsultationCancelled = (
    consultation: Consultation,
    availabilities: Availability[],
    absences: Absence[]
): boolean => {
    const dateIS = consultation.date;
    const date = new Date(dateIS);

    //czy absence
    for (const abs of absences) {
        if (abs.date === dateIS) {
            return true;
        }
    }

    //czy jakakolwiek availability
    let hasValAv = false;
    for (const av of availabilities) {
        if (av.type === 'single') {
            if (av.date !== dateIS) continue;
            for (const range of av.timeRanges) {
                const [hH, hM] = range.from.split(":").map(Number);
                const [mH, mM] = range.to.split(":").map(Number);

                const fromSpace = (hH - 8) * 2 + (hM >= 30 ? 1 : 0);
                const toSpace = (mH - 8) * 2 + (mM > 0 ? 1 : 0);

                const endSpace = consultation.startSlot + consultation.slotLength;

                if (consultation.startSlot < toSpace && endSpace > fromSpace) {
                    hasValAv = true;
                }
            }
        }
        if (av.type === "cyclic") {
            const start = new Date(av.startDate);
            const end = new Date(av.endDate);

            if (date < start || date > end) continue;
            if (!av.daysOfWeek.includes(date.getDay())) continue;

            for (const range of av.timeRanges) {
                const [hH, hM] = range.from.split(":").map(Number);
                const [mH, mM] = range.to.split(":").map(Number);

                const fromSlot = (hH - 8) * 2 + (hM >= 30 ? 1 : 0);
                const toSlot = (mH - 8) * 2 + (mM > 0 ? 1 : 0);

                const endSlot = consultation.startSlot + consultation.slotLength;

                if (
                    consultation.startSlot < toSlot &&
                    endSlot > fromSlot
                ) {
                    hasValAv = true;
                }
            }
        }
    }

    return !hasValAv;
};