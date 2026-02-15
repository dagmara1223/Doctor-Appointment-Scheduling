import { useState } from "react";
import CyclicAvailabilityForm from "./CyclicAvailabilityForm";
import SingleAvailabilityForm from "./SingleAvailabilityForm";
import type { Availability } from "../../types/availability";

import type { AvailabilityInput } from "../../types/availability";
import "./AvailabilityForm.css";

type Props = {
    availabilities: Availability[];
    onAdd: (a: AvailabilityInput) => void;
};


const AvailabilityForm = ({ onAdd }: Props) => {
    const [option, setOption] = useState<"cyclic" | "single">("cyclic");

    return (
        <div className="availability-form">
            <div className="availability-toggle">
                <button
                    className={option === "cyclic" ? "active" : ""}
                    onClick={() => setOption("cyclic")}
                >
                    Cyclic
                </button>

                <button
                    className={option === "single" ? "active" : ""}
                    onClick={() => setOption("single")}
                >
                    Single
                </button>
            </div>

            {option === "cyclic" && (
                <div className="availability-panel">
                    <CyclicAvailabilityForm onAdd={onAdd} />
                </div>
            )}

            {option === "single" && (
                <div className="availability-panel">
                    <SingleAvailabilityForm onAdd={onAdd} />
                </div>
            )}
        </div>

    );
}

export default AvailabilityForm;