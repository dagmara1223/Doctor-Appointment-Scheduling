import { useState } from "react";
import type { Absence } from "../../types/absence";
import "./AbsenceForm.css";

type Props = {
    onAdd: (a: Omit<Absence, "id" | "doctorId">) => void;
};

const AbsenceForm = ({ onAdd }: Props) => {
    const [date, setDate] = useState("");

    const handleSubmit = () => {
        onAdd({
            date,
        });
    };

    return (
        <div className="absence-form">
            <h4>Add absence (full day)</h4>

            <div className="absence-row">
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                />

                <button
                    className="primary-btn"
                    onClick={handleSubmit}
                    disabled={!date}
                >
                    Add
                </button>
            </div>
        </div>
    );
};

export default AbsenceForm;
