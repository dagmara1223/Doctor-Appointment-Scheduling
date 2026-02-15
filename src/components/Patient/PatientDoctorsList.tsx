import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadDoctors } from "../../services/firebaseUsersService";
import type { DoctorProfile } from "../../types/doctor";

const PatientDoctorsList = () => {
    const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadDoctors().then(rawDoctors =>
            setDoctors(
                rawDoctors.map(d => ({
                    id: d.id,
                    fullName: d.fullName ?? "",
                    specialization: d.specialization ?? "",
                }))
            )
        );
    }, []);

    return (
        <>
            <h2>Doctors</h2>

            {doctors.map(doc => (
                <div
                    key={doc.id}
                    onClick={() => navigate(`/patient/doctors/${doc.id}`)}
                    style={{
                        padding: "12px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        marginBottom: "12px",
                        cursor: "pointer",
                    }}
                >
                    <strong>{doc.fullName}</strong>
                    <div>{doc.specialization}</div>
                </div>
            ))}
        </>
    );
};

export default PatientDoctorsList;
