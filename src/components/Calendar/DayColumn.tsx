import TimeSlot from "./TimeSlot";
import type { Availability } from "../../types/availability";
import type { Absence } from "../../types/absence";
import type { Consultation } from "../../types/consultation";

type Props = {
    day: Date;
    isToday: boolean;
    availabilities: Availability[];
    absences: Absence[];
    consultations: Consultation[];
    onSlotClick: (day: Date, slotIndex: number) => void;
    onConsultationClick: (c: Consultation) => void;
};

const DayColumn = ({ day, isToday, availabilities, absences, consultations, onSlotClick, onConsultationClick }: Props) => {
    const now = new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isAbsenceActive = (absenceDateStr: string) => {
        const d = new Date(absenceDateStr);
        d.setHours(0, 0, 0, 0);
        return d >= today; // tylko dziś i przyszłość
    };

    const currentSlot =
        (now.getHours() - 8) * 2 +
        (now.getMinutes() >= 30 ? 1 : 0);

    const absenceForDay = absences.find(a => {
        const d = new Date(a.date);
        d.setHours(0, 0, 0, 0);

        return isAbsenceActive(a.date) && d.toDateString() === day.toDateString();
    });

    const isAbsentDay = !!absenceForDay;

    const normalizeDate = (d: Date) =>
        new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const toLocalISODate = (d: Date) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    };


    const getConsultationForSlot = (slotIndex: number) => {
        return consultations.find(c => {
            if (c.status === "cancelled") return false;
            if (c.date !== toLocalISODate(day)) return false;

            const start = c.startSlot;
            const end = c.startSlot + c.slotLength;

            return slotIndex >= start && slotIndex < end;
        });
    };

    const isSlotAvailable = (slotIndex: number) => {
        if (absences.some(a =>
            isAbsenceActive(a.date) &&
            new Date(a.date).toDateString() === day.toDateString()
        )) {
            return false;
        }
        return availabilities.some(a => {

            //single day
            if (a.type === "single") {
                const sameDay =
                    new Date(a.date).toDateString() === day.toDateString();

                if (!sameDay) return false;

                return a.timeRanges.some(range => {
                    const [fromH, fromM] = range.from.split(":").map(Number);
                    const [toH, toM] = range.to.split(":").map(Number);

                    const fromSlot = (fromH - 8) * 2 + (fromM >= 30 ? 1 : 0);
                    const toSlot = (toH - 8) * 2 + (toM > 0 ? 1 : 0);

                    return slotIndex >= fromSlot && slotIndex < toSlot;
                });
            }

            //cyclic days
            if (a.type === "cyclic") {
                const date = normalizeDate(day);
                const start = normalizeDate(new Date(a.startDate));
                const end = normalizeDate(new Date(a.endDate));

                if (date < start || date > end) return false;

                if (!a.daysOfWeek.includes(date.getDay())) return false;

                return a.timeRanges.some(range => {
                    const [fromH, fromM] = range.from.split(":").map(Number);
                    const [toH, toM] = range.to.split(":").map(Number);

                    const fromSlot = (fromH - 8) * 2 + (fromM >= 30 ? 1 : 0);
                    const toSlot = (toH - 8) * 2 + (toM > 0 ? 1 : 0);

                    return slotIndex >= fromSlot && slotIndex < toSlot;
                });
            }


            return false;
        });
    };


    const isPastConsultation = (c: Consultation) => {
        const todayISO = toLocalISODate(new Date());

        // dzień przeszły
        if (c.date < todayISO) return true;

        // dzień przyszły
        if (c.date > todayISO) return false;

        // dokładnie dziś to sprawdzam godzine
        const now = new Date();

        // jeśli jesteśmy przed 8:00 rano to nic nie przesylam 
        if (now.getHours() < 8) return false;

        const nowSlot =
            (now.getHours() - 8) * 2 +
            (now.getMinutes() >= 30 ? 1 : 0);

        return c.startSlot + c.slotLength <= nowSlot;
    };


    const isPastSlot = (slotIndex: number) => {
        const todayISO = toLocalISODate(new Date());
        const dayISO = toLocalISODate(day);

        if (dayISO < todayISO) return true;
        if (dayISO > todayISO) return false;

        const now = new Date();
        if (now.getHours() < 8) return false;

        const nowSlot =
            (now.getHours() - 8) * 2 +
            (now.getMinutes() >= 30 ? 1 : 0);

        return slotIndex < nowSlot;
    };


    return (
        <div
            className={`day-column 
                ${isToday ? "today-column" : ""} 
                ${isAbsentDay ? "absent-day" : ""}
            `}
        >

            {Array.from({ length: 32 }).map((_, i) => {
                const consultation = getConsultationForSlot(i);
                const reserved = !!consultation;
                const isPast = consultation ? isPastConsultation(consultation) : false;

                return (
                    <TimeSlot
                        key={i}
                        className={
                            isAbsentDay
                                ? "absent"
                                : reserved
                                    ? isPast
                                        ? "reserved past-visit"
                                        : `reserved ${consultation!.type}`
                                    : isSlotAvailable(i)
                                        ? isPastSlot(i)
                                            ? "available past-availability"
                                            : "available"
                                        : isToday && i < currentSlot
                                            ? "past"
                                            : ""
                        }
                        onClick={() => {
                            if (consultation) {
                                onConsultationClick(consultation);
                                return;
                            }
                            if (isPastSlot(i)) return;

                            if (!isSlotAvailable(i)) return;
                            if (isAbsentDay) return;

                            onSlotClick(day, i);
                        }}
                        title={
                            reserved
                                ? `${consultation!.type.toUpperCase()}
                            Patient: ${consultation!.patientName}
                            ${consultation!.notes ? "Notes: " + consultation!.notes : ""}`
                                : undefined
                        }

                    >
                        {reserved && <span className="slot-label">Reserved</span>}
                    </TimeSlot>
                );
            })}

        </div>
    );
};

export default DayColumn;