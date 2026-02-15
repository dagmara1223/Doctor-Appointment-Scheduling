import type { Consultation } from "../types/consultation";

export const slotsOverlap = (
    startA: number,
    lengthA: number,
    startB: number,
    lengthB: number
) => {
    const endA = startA + lengthA;
    const endB = startB + lengthB;

    return startA < endB && endA > startB;
};

// export const hasConsultationCollision = (
//     dateISO: string,
//     startSlot: number,
//     slotLength: number,
//     consultations: Consultation[]
// ) => {
//     return consultations.some(c => {
//         // anulowane NIE blokują
//         if (c.status === "cancelled") return false;

//         // inny dzień
//         if (c.date !== dateISO) return false;

//         //ale wszystkie pozostałe blokują
//         return slotsOverlap(
//             startSlot,
//             slotLength,
//             c.startSlot,
//             c.slotLength
//         );
//     });
// };

export const hasConsultationCollision = (
    dateISO: string,
    startSlot: number,
    slotLength: number,
    consultations: Consultation[]
) => {
    return consultations.some(c => {
        if (c.status === "cancelled") return false;
        if (c.date !== dateISO) return false;

        return slotsOverlap(
            startSlot,
            slotLength,
            c.startSlot,
            c.slotLength
        );
    });
};


