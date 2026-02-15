import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import type { Consultation } from "../../types/consultation";
import { loadConsultationsByPatient, updateConsultation } from "../../services/AppDataService";
import type { DataSource } from "../../services/DataSource";
import "./PatientCart.css";
import { loadDoctorById } from "../../services/firebaseUsersService";

const PatientCart = () => {
    const { user } = useAuth();
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [dataSource] = useState<DataSource>("firebase");
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [doctorsMap, setDoctorsMap] = useState<
        Record<string, { fullName?: string; specialization?: string }>
    >({});


    useEffect(() => {
        if (!user) return;
        loadConsultationsByPatient(dataSource, user.uid)
            .then(setConsultations);
    }, [user]);
    useEffect(() => {
        if (!toastMessage) return;

        const timer = setTimeout(() => {
            setToastMessage(null);
        }, 8000);

        return () => clearTimeout(timer);
    }, [toastMessage]);

    useEffect(() => {
        if (consultations.length === 0) return;

        const uniqueDoctorIds = Array.from(
            new Set(consultations.map(c => c.doctorId))
        );

        const map: Record<string, { fullName?: string; specialization?: string }> = {};

        Promise.all(
            uniqueDoctorIds.map(async (doctorId) => {
                const doc = await loadDoctorById(doctorId);
                if (doc) {
                    map[doctorId] = {
                        fullName: doc.fullName,
                        specialization: doc.specialization,
                    };
                }
            })
        ).then(() => {
            setDoctorsMap(map);
        });

    }, [consultations]);



    //kosz
    const scheduled = consultations
        .filter(c => c.status === "scheduled")
        .sort((a, b) => a.date.localeCompare(b.date));

    // wizyty
    const paid = consultations
        .filter(c => c.status === "paid")
        .sort((a, b) => b.date.localeCompare(a.date));

    //anulowane
    const cancelled = consultations
        .filter(c => c.status === "cancelled")
        .sort((a, b) => b.date.localeCompare(a.date));

    const cancelVisit = async (id: string) => {
        if (!confirm("Czy na pewno chcesz anulować wizytę?")) return;

        await updateConsultation(
            "firebase",
            id,
            { status: "cancelled", cancelledBy: "patient" }
        );

        setConsultations(prev =>
            prev.map(c =>
                c.id === id
                    ? { ...c, status: "cancelled", cancelledBy: "patient" }
                    : c
            )
        );
    };

    const payVisit = async (id: string) => {
        await updateConsultation(
            "firebase",
            id,
            { status: "paid" }
        );

        setConsultations(prev =>
            prev.map(c =>
                c.id === id ? { ...c, status: "paid" } : c
            )
        );
        setToastMessage("✅ Wizyta została zarezerwowana");
    };

    return (
        <div className="patient-cart">

            <h2>🛒 Mój koszyk / wizyty</h2>

            {/* koszyk*/}
            <section>
                <h3>Do opłacenia</h3>

                {scheduled.length === 0 && (
                    <p className="empty">Brak wizyt w koszyku</p>
                )}

                {scheduled.map(c => (
                    <div key={c.id} className="visit-card">
                        <div>
                            <strong>{c.date}</strong>
                            <div className="doctor-name">
                                {doctorsMap[c.doctorId]?.fullName ?? "Lekarz"}
                            </div>

                            <span>
                                {c.type} · {8 + Math.floor(c.startSlot / 2)}:
                                {c.startSlot % 2 === 0 ? "00" : "30"}
                            </span>
                        </div>

                        <div className="actions">
                            <button
                                className="primary-btn small"
                                onClick={() => payVisit(c.id)}
                            >
                                Zapłać
                            </button>

                            <button
                                className="danger-btn small"
                                onClick={() => cancelVisit(c.id)}
                            >
                                Anuluj
                            </button>
                        </div>
                    </div>
                ))}
            </section>

            {/*wizyty*/}
            <section>
                <h3>Wizyty</h3>

                {paid.length === 0 && (
                    <p className="empty">Brak odbytych lub zaplanowanych wizyt</p>
                )}

                {paid.map(c => (
                    <div key={c.id} className="visit-card">
                        <div>
                            <strong>{c.date}</strong>
                            <span>Typ: {c.type}</span>
                        </div>
                    </div>
                ))}
            </section>

            {/*anulowane*/}
            <section>
                <h3>Anulowane</h3>

                {cancelled.length === 0 && (
                    <p className="empty">Brak anulowanych wizyt</p>
                )}

                {cancelled.map(c => (
                    <div key={c.id} className="visit-card cancelled">
                        ❌ Wizyta {c.date}{" "}
                        {c.cancelledBy === "doctor"
                            ? "odwołana przez lekarza"
                            : "anulowana przez Ciebie"}
                    </div>
                ))}
            </section>
            {toastMessage && (
                <div className="toast">
                    {toastMessage}
                </div>
            )}


        </div>
    );
};

export default PatientCart;
