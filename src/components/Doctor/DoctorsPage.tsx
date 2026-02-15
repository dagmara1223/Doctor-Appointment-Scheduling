import { useState, useEffect } from "react";
import AvailabilityForm from "../Availability/AvailabilityForm";
import Calendar from "../Calendar/Calendar";
import "./DoctorsPage.css";
import type { Availability } from "../../types/availability";
import type { Absence } from "../../types/absence";
import AbsenceForm from "../Absence/AbsenceForm";
import type { Consultation } from "../../types/consultation";
import CancelConsultationModal from "../Consultation/CancelConsultationModal";
import type { DataSource } from "../../services/DataSource";
import type { AvailabilityInput } from "../../types/availability";

import {
    loadConsultations,
    loadAvailabilities,
    loadAbsences,
    addConsultation as addConsultationService,
    addAvailability as addAvailabilityService,
    addAbsence as addAbsenceService,
    removeAvailability as removeAvailabilityService,
    removeAbsence as removeAbsenceService
} from "../../services/AppDataService";

import { IsConsultationCancelled } from "../../utils/availabilityConflict";
import { hasConsultationCollision } from "../../types/consultationCollision";
import { useAuth } from "../../Auth/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { updateConsultationFirebase } from "../../services/firebaseConsultationService";

const DoctorPage = () => {

    const { user } = useAuth();
    if (!user) return null;

    if (
        user.role === "DOCTOR" &&
        user.doctorStatus !== "APPROVED"
    ) {
        return (
            <div style={{ padding: "40px", textAlign: "center" }}>
                <h2>⛔ Dostęp zablokowany</h2>
                <p>
                    Konto lekarza nie zostało jeszcze zatwierdzone przez administratora.
                </p>
            </div>
        );
    }

    //magazyn
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [availabilities, setAvailabilities] = useState<Availability[]>([]);
    const [absences, setAbsences] = useState<Absence[]>([]);
    const [showManageAvail, setShowManageAvail] = useState(false);
    const [showManageAbsence, setShowManageAbsence] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const isManageView = location.pathname === "/doctor/manage";
    const closeManageModal = () => navigate("/doctor/schedule");



    //dynamic i local storage
    const [dataSource, setDataSource] =
        useState<DataSource>("firebase");

    //today dla absences zeby nie dzialalo wstecz
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const absencesActive = absences.filter(a => {
        const d = new Date(a.date);
        d.setHours(0, 0, 0, 0);
        return d >= today;
    });
    const isDoctor = user?.email?.endsWith("@doctor.com");

    useEffect(() => {
        if (!user || user.role !== "DOCTOR") return;

        const doctorId = user.uid;

        loadAvailabilities(dataSource, doctorId).then(setAvailabilities);
        loadAbsences(dataSource, doctorId).then(setAbsences);
        loadConsultations(dataSource, doctorId).then(setConsultations);
    }, [dataSource, user]);




    useEffect(() => {
        if (availabilities.length === 0 && absences.length === 0) return;
        const cancelled: Consultation[] = [];

        const updatedConsultations = consultations.map(c => {
            const cDate = new Date(c.date);
            cDate.setHours(0, 0, 0, 0);
            if (cDate < today) return c; // nie chcemy przeszlosci
            if (
                c.status !== "cancelled" &&
                IsConsultationCancelled(c, availabilities, absencesActive)
            ) {
                cancelled.push(c);
                return { ...c, status: "cancelled" as const, cancelledBy: "doctor" as const };
            }
            return c;
        });

        if (cancelled.length > 0) {
            cancelled.forEach(c => {
                updateConsultationFirebase(c.id, {
                    status: "cancelled",
                    cancelledBy: "doctor",
                });
            });


            const message = cancelled
                .map(c =>
                    `Wizyta w dniu ${c.date} dla ${c.patientName} została odwołana przez lekarza.`
                )
                .join("\n");
            setConsultations(updatedConsultations);
            alert(message);
        }
    }, [availabilities, absences]);

    // dostepnosc
    const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);

    const handleAddAvailability = async (
        availability: AvailabilityInput
    ) => {
        if (!user) return;

        await addAvailabilityService(
            dataSource,
            availability,
            user.uid
        );

        const fresh = await loadAvailabilities(dataSource, user.uid);
        setAvailabilities(fresh);
    };



    const handleRemoveAvailability = async (id: string) => {
        await removeAvailabilityService(dataSource, id);
        setAvailabilities(prev => prev.filter(a => a.id !== id));
    };

    //dodawanie nieobecnosci

    const handleAddAbsence = async (
        absence: Omit<Absence, "id" | "doctorId">
    ) => {
        if (!user) return;

        const saved = await addAbsenceService(
            dataSource,
            absence,
            user.uid
        );

        setAbsences(prev => [...prev, saved]);
    };


    //usuwanie nieobecnosci
    const handleRemoveAbsence = async (id: string) => {
        await removeAbsenceService(dataSource, id);
        setAbsences(prev => prev.filter(a => a.id !== id));
    };

    //rezerwacja wizyty
    const [selectedSlot, setSelectedSlot] = useState<{
        date: Date;
        slotIndex: number;
    } | null>(null);

    const handleSlotClick = (date: Date, slotIndex: number) => {
        setSelectedSlot({ date, slotIndex });
    };

    const [pendingConsultation, setPendingConsultation] =
        useState<Consultation | null>(null);

    // platnosc
    const handlePayment = (ids: string[]) => {
        setConsultations(prev =>
            prev.map(c =>
                ids.includes(c.id)
                    ? { ...c, status: "paid" }
                    : c
            )
        );

        alert("Payment successful");
    };

    // dodatnie mozliwosci rezerwacji dlugiej - 1h; 1.5h nawet jesli availability jest podzielone na sekcje 
    const isVisitFullyAvailable = (
        startSlot: number,
        length: number,
        availabilities: Availability[],
        day: Date
    ) => {
        const slots = Array.from({ length }, (_, i) => startSlot + i);

        return slots.every(slot =>
            availabilities.some(a => {
                if (a.type === "single") {
                    if (new Date(a.date).toDateString() !== day.toDateString()) return false;
                }

                if (a.type === "cyclic") {
                    const date = new Date(day);
                    const start = new Date(a.startDate);
                    const end = new Date(a.endDate);
                    if (date < start || date > end) return false;
                    if (!a.daysOfWeek.includes(date.getDay())) return false;
                }

                return a.timeRanges.some(range => {
                    const [fromH, fromM] = range.from.split(":").map(Number);
                    const [toH, toM] = range.to.split(":").map(Number);

                    const fromSlot = (fromH - 8) * 2 + (fromM >= 30 ? 1 : 0);
                    const toSlot = (toH - 8) * 2 + (toM > 0 ? 1 : 0);

                    return slot >= fromSlot && slot < toSlot;
                });
            })
        );
    };

    //usuwanie konsultacji
    const [selectedConsultation, setSelectedConsultation] =
        useState<Consultation | null>(null);

    const handleConsultationClick = (c: Consultation) => {
        setSelectedConsultation(c);
    };
    const cancelConsultation = async (id: string) => {
        try {
            await updateConsultationFirebase(id, {
                status: "cancelled",
                cancelledBy: "doctor",
            });

            setConsultations(prev =>
                prev.map(c =>
                    c.id === id
                        ? { ...c, status: "cancelled", cancelledBy: "doctor" }
                        : c
                )
            );
        } catch (e) {
            console.error(e);
            alert("Nie udało się anulować wizyty");
        }
    };

    useEffect(() => {
        if (isManageView) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isManageView]);


    return (
        <div className="doctor-page">


            {/*usuwanie konsultacji */}
            {selectedConsultation && (
                <CancelConsultationModal
                    consultation={selectedConsultation}
                    onClose={() => setSelectedConsultation(null)}
                    onConfirm={() => {
                        cancelConsultation(selectedConsultation.id);
                        setSelectedConsultation(null);
                    }}
                />
            )}


            {/* calendar */}
            <Calendar availabilities={availabilities} absences={absences}
                onRemoveAbsence={handleRemoveAbsence}
                consultations={consultations.filter(c => c.status === "paid")}
                onSlotClick={handleSlotClick}
                onConsultationClick={handleConsultationClick} />

            {isManageView && (
                <div
                    className="modal-backdrop"
                    onClick={() => navigate("/doctor")}
                >
                    <div
                        className="modal-card"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3>Zarządzanie harmonogramem</h3>
                            <button
                                className="modal-close"
                                onClick={closeManageModal}
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>


                        {/* availability */}
                        <section>
                            <h4>Add availability</h4>
                            <AvailabilityForm
                                availabilities={availabilities}
                                onAdd={handleAddAvailability}
                            />
                        </section>

                        <hr />

                        <section>
                            <h4>Manage availabilities ({availabilities.length})</h4>
                            <div
                                className="accordion-header"
                                onClick={() => setShowManageAvail(v => !v)}
                            >
                                <span>
                                    Manage availabilities
                                    <small>({availabilities.length})</small>
                                </span>
                                <span className="arrow">
                                    {showManageAvail ? "▾" : "▸"}
                                </span>
                            </div>

                            {showManageAvail && (
                                <div className="accordion-body">
                                    <div className="manage-list">
                                        {availabilities.length === 0 && (
                                            <p className="empty">No availabilities</p>
                                        )}

                                        {availabilities.map(a => (
                                            <div key={a.id} className="manage-row">
                                                <div className="manage-info">
                                                    <strong>{a.type === "cyclic" ? "Cyclic" : "Single"}</strong>
                                                    <span>
                                                        {a.type === "cyclic"
                                                            ? `${a.startDate} → ${a.endDate}`
                                                            : a.date}
                                                    </span>
                                                </div>

                                                <button
                                                    className="icon-btn danger"
                                                    onClick={() => handleRemoveAvailability(a.id)}
                                                    title="Remove"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}


                        </section>

                        <hr />

                        {/* absences */}
                        <section>
                            <h4>Add absence</h4>
                            <AbsenceForm onAdd={handleAddAbsence} />
                        </section>

                        <section>
                            <h4>Manage absences ({absences.length})</h4>
                            <div
                                className="accordion-header"
                                onClick={() => setShowManageAbsence(v => !v)}
                            >
                                <span>
                                    Manage absences
                                    <small>({absences.length})</small>
                                </span>
                                <span className="arrow">
                                    {showManageAbsence ? "▾" : "▸"}
                                </span>
                            </div>

                            {showManageAbsence && (
                                <div className="accordion-body">
                                    <div className="manage-list">
                                        {absences.length === 0 && (
                                            <p className="empty">No absences</p>
                                        )}

                                        {absences.map(a => (
                                            <div key={a.id} className="manage-row">
                                                <div className="manage-info">
                                                    <strong>Absence</strong>
                                                    <span>{a.date}</span>
                                                </div>

                                                <button
                                                    className="icon-btn danger"
                                                    onClick={() => handleRemoveAbsence(a.id)}
                                                    title="Remove absence"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </section>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DoctorPage;
