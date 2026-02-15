import { useState } from "react";
import type { SingleAvailability, TimeRange } from "../../types/availability";
import type { AvailabilityInput } from "../../types/availability";

type Props = {
    onAdd: (a: AvailabilityInput) => void;
};

const SingleAvailabilityForm = ({ onAdd }: Props) => {
    const [date, setDate] = useState("");
    const [timeRanges, setTimeRanges] = useState<TimeRange[]>([
        { from: "08:00", to: "09:30" }
    ]);

    const changeTime = (
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

    const handleSubmit = () => {
        const availability: Omit<SingleAvailability, "id" | "doctorId"> = {
            type: "single",
            date,
            timeRanges
        };

        onAdd(availability);
    };

    return (
        <div>
            <h3>Single availability</h3>

            <div>
                <label>
                    Date:
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </label>
            </div>

            <div>
                <p>Hours:</p>
                {timeRanges.map((range, i) => (
                    <div key={i}>
                        <input
                            type="time"
                            value={range.from}
                            onChange={(e) =>
                                changeTime(i, "from", e.target.value)
                            }
                        />
                        {" - "}
                        <input
                            type="time"
                            value={range.to}
                            onChange={(e) =>
                                changeTime(i, "to", e.target.value)
                            }
                        />
                        <button
                            type="button"
                            className="delete-btn"
                            onClick={() =>
                                setTimeRanges(prev => prev.filter((_, index) => index !== i))
                            }
                        >
                            🗑️
                        </button>
                    </div>
                ))}

                <button type="button" onClick={addTimeRange}>
                    + Add hours
                </button>
            </div>

            <button type="button" onClick={handleSubmit}>
                Add availability
            </button>
        </div>
    );
};

export default SingleAvailabilityForm;
