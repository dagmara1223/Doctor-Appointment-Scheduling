import { useState } from "react";
import type { Consultation } from "../../types/consultation";

export type ConsultationFormData = {
    slotLength: number;
    type: "first" | "control" | "chronic" | "prescription";
    patientName: string;
    gender: "female" | "male";
    age: number;
    notes?: string;
};


type Props = {
    date: Date;
    startSlot: number;
    onSubmit: (data: ConsultationFormData) => void;
    onClose: () => void;
};


const SLOT_MINUTES = 30;
const DAY_START_HOUR = 8;

const slotToTime = (slot: number) => {
    const totalMinutes = DAY_START_HOUR * 60 + slot * SLOT_MINUTES;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
};

const ConsultationForm = ({ date, startSlot, onSubmit, onClose }: Props) => {
    const [slotLength, setSlotLength] = useState(1); // 1 = 30 min
    const [type, setType] = useState("first");
    const [name, setName] = useState("");
    const [gender, setGender] = useState("female");
    const [age, setAge] = useState(18);
    const [notes, setNotes] = useState("");

    //godziny konsultacji
    const startTime = slotToTime(startSlot);
    const endTime = slotToTime(startSlot + slotLength);

    //formatowanie godziny daty
    const formattedDate = date.toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });


    const handleSubmit = () => {
        if (!name.trim()) {
            alert("Imię pacjenta jest wymagane");
            return;
        }

        if (age < 0 || age > 120) {
            alert("Podaj poprawny wiek");
            return;
        }

        onSubmit({
            slotLength,
            type: type as ConsultationFormData["type"],
            patientName: name.trim(),
            gender: gender as "female" | "male",
            age,
            notes,
        });
    };


    return (
        <div style={{
            background: "white",
            padding: 20,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            maxWidth: 400
        }}>
            <div
                style={{
                    background: "#f5f6f8",
                    padding: "10px 14px",
                    borderRadius: 8,
                    marginBottom: 16,
                    fontSize: 14,
                }}
            >
                <strong>Reservation:</strong><br />
                {formattedDate} • {startTime} – {endTime}
            </div>

            <h3>Zarezerwuj konsultację</h3>

            <div>
                <label>Długość:</label>
                <select
                    value={slotLength}
                    onChange={(e) => setSlotLength(Number(e.target.value))}
                >
                    <option value={1}>30 min</option>
                    <option value={2}>60 min</option>
                    <option value={3}>90 min</option>
                </select>
            </div>

            <div>
                <label>Typ:</label>
                <select value={type} onChange={e => setType(e.target.value)}>
                    <option value="first">First visit</option>
                    <option value="control">Control</option>
                    <option value="chronic">Chronic disease</option>
                    <option value="prescription">Prescription</option>
                </select>
            </div>

            <div>
                <label>Imię i nazwisko:</label>
                <input value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div>
                <label>Płeć:</label>
                <select value={gender} onChange={e => setGender(e.target.value)}>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                </select>
            </div>

            <div>
                <label>Wiek:</label>
                <input
                    type="number"
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                />
            </div>

            <div>
                <label>Problem:</label>
                <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                />
            </div>

            <div style={{ marginTop: 12 }}>
                <button onClick={handleSubmit} disabled={!name.trim() || age <= 0}>Reserve</button>
                <button onClick={onClose} style={{ marginLeft: 8 }}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ConsultationForm;
