import { useState } from "react";
import type { CyclicAvailability, TimeRange } from "../../types/availability";
import type { AvailabilityInput } from "../../types/availability";

const DAYS = [
    { label: "mon", value: 1 },
    { label: "tue", value: 2 },
    { label: "wed", value: 3 },
    { label: "thu", value: 4 },
    { label: "fri", value: 5 },
    { label: "sat", value: 6 },
    { label: "sun", value: 0 },
];

type Props = {
    onAdd: (a: AvailabilityInput) => void;
};

const CyclicAvailabilityForm = ({ onAdd }: Props) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
    const [timeRanges, setTimeRanges] = useState<TimeRange[]>([
        { from: "08:00", to: "09:30" },
    ]);

    const toggleDay = (day: number) => {
        if (daysOfWeek.includes(day)) {
            setDaysOfWeek(daysOfWeek.filter(d => d !== day));
        } else {
            setDaysOfWeek([...daysOfWeek, day]);
        }
    };

    const updateTimeRange = (
        index: number,
        field: "from" | "to",
        value: string
    ) => {
        const copy = [...timeRanges];
        copy[index] = { ...copy[index], [field]: value };
        setTimeRanges(copy);
    };

    const addTimeRange = () => {
        setTimeRanges([...timeRanges, { from: "16:00", to: "20:30" }]);
    };

    const removeTimeRange = (index: number) => {
        setTimeRanges(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        const availability: Omit<CyclicAvailability, "id" | "doctorId"> = {
            type: "cyclic",
            startDate,
            endDate,
            daysOfWeek: daysOfWeek,
            timeRanges,
        };

        onAdd(availability);
    };

    return (
        <div>
            <h3>Cyclic availability</h3>

            <div>
                <label>
                    From:
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </label>

                <label>
                    To:
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </label>
            </div>

            <div>
                <p>Days of week:</p>
                {DAYS.map(day => (
                    <label key={day.value}>
                        <input
                            type="checkbox"
                            checked={daysOfWeek.includes(day.value)}
                            onChange={() => toggleDay(day.value)}
                        />
                        {day.label}
                    </label>
                ))}
            </div>

            <div>
                <p>Time ranges:</p>
                {timeRanges.map((range, i) => (
                    <div key={i}>
                        <input
                            type="time"
                            value={range.from}
                            onChange={e => updateTimeRange(i, "from", e.target.value)}
                        />
                        {" - "}
                        <input
                            type="time"
                            value={range.to}
                            onChange={e => updateTimeRange(i, "to", e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => removeTimeRange(i)}
                            title="Remove"
                            style={{ cursor: "pointer" }}
                        >
                            🗑️
                        </button>
                    </div>
                ))}

                <button type="button" onClick={addTimeRange}>
                    + Add time range
                </button>
            </div>

            <button type="button" onClick={handleSubmit}>
                Add availability
            </button>
        </div>
    );
};

export default CyclicAvailabilityForm;
