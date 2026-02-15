import { formatDate, isSameDay } from "../../utils/CalendarHelper";
import type { Consultation } from "../../types/consultation";
import "./CalendarHeader.css";

interface Props {
    days: Date[],
    consultations: Consultation[];
    prevWeek: () => void;
    nextWeek: () => void;
};

const dayNams = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const CalendarHeader = ({ days, consultations, prevWeek, nextWeek }: Props) => {
    const toLocalISODate = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="calendar-header">
            <button className="nav-btn nav-left" onClick={prevWeek}>◀</button>
            <button className="nav-btn nav-right" onClick={nextWeek}>▶</button>

            <div className="time-header" />

            {days.map((date, i) => {
                const dateISO = toLocalISODate(date);

                const visitsCount = consultations.filter(c =>
                    c.status !== "cancelled" &&
                    c.date === dateISO
                ).length;

                const isToday = isSameDay(date, new Date());

                return (
                    <div
                        key={i}
                        className={`day-header ${isToday ? "today" : ""}`}
                    >
                        <div className="day-name">{dayNams[i]}</div>
                        <div className='day-date'>{formatDate(date)}</div>
                        <div className='day-count'>
                            {visitsCount} visit{visitsCount !== 1 ? "s" : ""}
                        </div>
                    </div>
                )
            })}
        </div>
    );
};
export default CalendarHeader;