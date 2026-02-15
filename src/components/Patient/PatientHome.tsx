import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import type { Consultation } from "../../types/consultation";
import { loadConsultationsByPatient } from "../../services/AppDataService";
import type { DataSource } from "../../services/DataSource";
import ReviewModal from "../Reviews/ReviewModal.tsx";
import "./PatientHome.css";
import { updateConsultation } from "../../services/AppDataService";
import { onSnapshot, query, where, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { loadDoctorById } from "../../services/firebaseUsersService.ts";


type Notification = {
    id: string;
    patientId: string;
    consultationId: string;
    message: string;
    createdAt: string;
    read: boolean;
};

const PatientHome = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [dataSource] = useState<DataSource>("firebase");
    const [reviewTarget, setReviewTarget] = useState<{
        doctorId: string;
        consultationId: string;
    } | null>(null);
    const [doctorsMap, setDoctorsMap] = useState<
        Record<string, { fullName?: string; specialization?: string }>
    >({});

    //funckja testowa dat 2
    const toLocalISODate = (d: Date) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    };

    const isPastVisit = (c: Consultation) => {
        const todayISO = toLocalISODate(new Date());

        // dzień wcześniejszy
        if (c.date < todayISO) return true;

        // dzień przyszły
        if (c.date > todayISO) return false;

        // dokładnie dziś → sprawdzamy slot
        const now = new Date();

        // przed 8:00 rano NIC nie jest przeszłe
        if (now.getHours() < 8) return false;

        const nowSlot =
            (now.getHours() - 8) * 2 +
            (now.getMinutes() >= 30 ? 1 : 0);

        return c.startSlot + c.slotLength <= nowSlot;
    };


    // useEffect(() => {
    //     if (!user) return;
    //     loadConsultationsByPatient(dataSource, user.uid)
    //         .then(setConsultations);
    // }, [user]);

    //zastosowanie realTime snapshot
    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "consultations"),
            where("patientId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(q, snapshot => {
            const data: Consultation[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Consultation[];

            setConsultations(data);
        });

        return () => unsubscribe();
    }, [user]);

    const upcoming = consultations
        .filter(c => c.status === "paid")
        .filter(c => !isPastVisit(c))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 3);

    const pastVisits = consultations
        .filter(c => c.status === "paid")
        .filter(isPastVisit)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 3);


    const history = consultations
        .filter(c => c.status !== "scheduled")
        .sort((a, b) => b.date.localeCompare(a.date));


    //anulowane 
    const cancelledVisits = consultations.filter(c =>
        c.patientId === user?.uid &&
        c.status === "cancelled"
    );

    const cancelVisit = async (id: string) => {
        if (!confirm("Czy na pewno chcesz anulować wizytę?")) return;

        try {
            await updateConsultation(
                "firebase",
                id,
                { status: "cancelled", cancelledBy: "patient" }
            );

            // aktualizacja UI
            setConsultations(prev =>
                prev.map(c =>
                    c.id === id ? { ...c, status: "cancelled", cancelledBy: "patient" } : c
                )
            );
        } catch (e) {
            console.error(e);
            alert("Nie udało się anulować wizyty");
        }
    };
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



    return (
        <div className="patient-home">
            {/* === CTA === */}
            <div className="cta-card">
                <h2>🩺 Umów nową wizytę</h2>
                <p>Przeglądaj lekarzy i dostępne terminy</p>
                <button
                    className="primary-btn"
                    onClick={() => navigate("/patient/doctors")}
                >
                    Przejdź do listy lekarzy
                </button>
            </div>

            {user?.banned && (
                <div className="ban-alert">
                    <strong>⚠️ Twoje konto zostało zablokowane</strong>
                    <p>
                        Administrator zablokował możliwość dodawania opinii oraz ocen lekarzy. Możesz dalej korzystać z serwisu, ale niektóre funkcje mogą być ograniczone.
                        <br />
                        W razie wątpliwości skontaktuj się z infolinią:
                    </p>
                    <p className="ban-contact">
                        ☎️ <strong> 123 123 123</strong> <br />
                        📧 dagmara@twojapomoc.pl
                    </p>
                </div>
            )}

            {/* nadchodzace wizyty*/}
            <section className="upcoming-section">
                <h3>Nadchodzące wizyty</h3>

                {upcoming.length === 0 && (
                    <p className="empty">
                        Nie masz jeszcze zaplanowanych wizyt
                    </p>
                )}

                <div className="visit-list">
                    {upcoming.map(c => (
                        <div key={c.id} className="visit-card">
                            <div>
                                <strong>{c.date}</strong>
                                <span>
                                    {c.type} · {
                                        8 + Math.floor(c.startSlot / 2)
                                    }:{
                                        c.startSlot % 2 === 0 ? "00" : "30"
                                    }
                                </span>
                                <div className="doctor-info">
                                    👨‍⚕️ {doctorsMap[c.doctorId]?.fullName ?? "Lekarz"}{" "}
                                    {doctorsMap[c.doctorId]?.specialization && (
                                        <small>({doctorsMap[c.doctorId].specialization})</small>
                                    )}
                                </div>
                            </div>

                            <button
                                className="link-btn"
                                onClick={() =>
                                    navigate(`/patient/doctors/${c.doctorId}`)
                                }
                            >
                                Zobacz lekarza
                            </button>
                            <button
                                className="danger-btn small"
                                onClick={() => cancelVisit(c.id)}
                            >
                                Anuluj wizytę
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="notifications-card">
                <h3>Powiadomienia</h3>

                {cancelledVisits.length === 0 && (
                    <p className="empty">Brak nowych powiadomień</p>
                )}

                {cancelledVisits.map(c => (
                    <div key={c.id} className="notification warning">
                        ❗ Wizyta w dniu <strong>{c.date}</strong>{" "}
                        {c.cancelledBy === "doctor"
                            ? "została odwołana przez lekarza"
                            : "została przez Ciebie anulowana"}
                    </div>
                ))}
            </section>

            <section className="past-visits-section">
                <h3>Ostatnie wizyty</h3>

                {pastVisits.length === 0 && (
                    <p className="empty">Brak zakończonych wizyt</p>
                )}

                <div className="visit-list">
                    {pastVisits.map(c => (
                        <div key={c.id} className="visit-card">
                            <div>
                                <strong>{c.date}</strong>
                                <span> Type: {c.type}</span>
                            </div>

                            <button
                                className="primary-btn small"
                                onClick={() =>
                                    setReviewTarget({
                                        doctorId: c.doctorId,
                                        consultationId: c.id,
                                    })
                                }
                            >
                                Dodaj opinię
                            </button>

                        </div>
                    ))}
                </div>
            </section>


            {reviewTarget && (
                <ReviewModal
                    doctorId={reviewTarget.doctorId}
                    consultationId={reviewTarget.consultationId}
                    onClose={() => setReviewTarget(null)}
                />
            )}


        </div>
    );
};

export default PatientHome;
