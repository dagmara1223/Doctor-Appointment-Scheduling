import CalendarHeader from "./CalendarHeader";
import TimeColumn from "./TimeColumn";
import DayColumn from "./DayColumn";
import { getStartOfWeek, addDays, isSameDay } from "../../utils/CalendarHelper";
import "./Calendar.css";
import { useLayoutEffect, useRef, useState } from "react";
import CurrentTimeLine from "./CurrentTimeLine";
import type { Availability } from "../../types/availability";
import type { Absence } from "../../types/absence";
import type { Consultation } from "../../types/consultation";

type Props = {
    availabilities: Availability[];
    absences: Absence[];
    onRemoveAbsence: (id: string) => void;
    consultations: Consultation[];
    onSlotClick: (date: Date, slotIndex: number) => void;
    onConsultationClick: (c: Consultation) => void;
};

const Calendar = ({ availabilities, absences, consultations, onSlotClick, onConsultationClick }: Props) => {
    const [weekStart, setWeekStart] = useState(getStartOfWeek(new Date()));
    const bodyRef = useRef<HTMLDivElement>(null);

    const days = Array.from({ length: 7 }).map((_, i) =>
        addDays(weekStart, i)
    );
    useLayoutEffect(() => {
        const el = bodyRef.current;
        if (!el) return;

        el.scrollTop = 0;
    }, []);

    return (
        <div className="calendar-container">
            <div className="calendar-scroll">
                <CalendarHeader
                    days={days}
                    consultations={consultations}
                    prevWeek={() => setWeekStart(addDays(weekStart, -7))}
                    nextWeek={() => setWeekStart(addDays(weekStart, 7))}
                />

                <div className="calendar-body" >
                    <CurrentTimeLine />
                    <div className="time-column">
                        <TimeColumn />
                    </div>

                    {days.map((date, i) => (
                        <DayColumn
                            key={i}
                            day={date}
                            isToday={isSameDay(date, new Date())}
                            availabilities={availabilities}
                            absences={absences}
                            consultations={consultations}
                            onSlotClick={onSlotClick}
                            onConsultationClick={onConsultationClick}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
