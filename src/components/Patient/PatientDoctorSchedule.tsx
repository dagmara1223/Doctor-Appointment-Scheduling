import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Calendar from "../Calendar/Calendar";
import ConsultationForm from "../Consultation/ConsultationForm";
import PaymentModal from "../Consultation/PaymentModal";
import type { Availability } from "../../types/availability";
import type { Absence } from "../../types/absence";
import type { Consultation } from "../../types/consultation";
import { loadAvailabilities, loadAbsences } from "../../services/AppDataService";
import { useAuth } from "../../Auth/AuthContext";
import "./PatientDoctorSchedule.css";
import { addConsultation } from "../../services/AppDataService";
import { updateConsultation } from "../../services/AppDataService";
import { loadConsultations, loadConsultationsByPatient } from "../../services/AppDataService";
import type { Review } from "../../types/reviews";
import { loadDoctorReviews } from "../../services/firebaseReviewsService";
import { useSearchParams } from "react-router-dom";
import { useRef } from "react";
import { loadDoctorById } from "../../services/firebaseUsersService";
import { hasConsultationCollision } from "../../types/consultationCollision";

const PatientDoctorSchedule = () => {

    const { doctorId } = useParams<{ doctorId: string }>();
    const { user } = useAuth();

    const [availabilities, setAvailabilities] = useState<Availability[]>([]);
    const [absences, setAbsences] = useState<Absence[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [paymentTarget, setPaymentTarget] =
        useState<Consultation | null>(null);

    const [doctorConsultations, setDoctorConsultations] = useState<Consultation[]>([]);
    const [patientConsultations, setPatientConsultations] = useState<Consultation[]>([]);

    const [selectedSlot, setSelectedSlot] = useState<{
        date: Date;
        slotIndex: number;
    } | null>(null);
    const [searchParams] = useSearchParams();
    const openReview = searchParams.get("review") === "true";
    const reviewRef = useRef<HTMLDivElement>(null);
    const [doctor, setDoctor] = useState<{
        fullName?: string;
        specialization?: string;
    } | null>(null);


    const blockingConsultations = doctorConsultations.filter(
        c => c.status === "paid"
    );


    //czy moze dodawac opinie
    const canReview = patientConsultations.some(
        c =>
            c.patientId === user?.uid &&
            c.doctorId === doctorId &&
            c.status === "paid"
    );

    useEffect(() => {
        if (!doctorId) return;

        loadDoctorById(doctorId)
            .then(setDoctor);
    }, [doctorId]);

    // availabilities + absences
    useEffect(() => {
        if (!doctorId) return;

        loadAvailabilities("firebase", doctorId).then(setAvailabilities);
        loadAbsences("firebase", doctorId).then(setAbsences);
    }, [doctorId]);

    // consultations (potrzebny user!)
    useEffect(() => {
        if (!doctorId) return;

        loadConsultations("firebase", doctorId)
            .then(setDoctorConsultations);
    }, [doctorId]);

    useEffect(() => {
        if (!user) return;

        loadConsultationsByPatient("firebase", user.uid)
            .then(setPatientConsultations);
    }, [user]);


    useEffect(() => {
        if (!doctorId) return;

        loadDoctorReviews(doctorId)
            .then(setReviews);
    }, [doctorId]);

    useEffect(() => {
        if (openReview && canReview) {
            reviewRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [openReview, canReview]);
    const toLocalISODate = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    return (
        <>
            <h2>
                {doctor
                    ? `${doctor.fullName}`
                    : "Doctor schedule"}
            </h2>

            {doctor?.specialization && (
                <p className="doctor-specialization">
                    {doctor.specialization}
                </p>
            )}

            <Calendar
                availabilities={availabilities}
                absences={absences}
                consultations={blockingConsultations}
                onSlotClick={(date, slotIndex) => {
                    if (user?.role !== "PATIENT") return;
                    setSelectedSlot({ date, slotIndex });
                }}
                onConsultationClick={() => { }}
                onRemoveAbsence={() => { }}
            />

            {/* rezerwacje*/}
            {(selectedSlot || paymentTarget) && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        {selectedSlot && (
                            <ConsultationForm
                                date={selectedSlot.date}
                                startSlot={selectedSlot.slotIndex}
                                onSubmit={async (data) => {
                                    const dateISO = toLocalISODate(selectedSlot.date);

                                    const collision = hasConsultationCollision(
                                        dateISO,
                                        selectedSlot.slotIndex,
                                        data.slotLength,
                                        doctorConsultations
                                    );

                                    if (collision) {
                                        alert("⛔ Ten termin koliduje z inną konsultacją. Proszę wybrać inny termin.");
                                        return;
                                    }
                                    const consultation: Consultation = {
                                        id: crypto.randomUUID(),
                                        doctorId: doctorId!,
                                        patientId: user!.uid,
                                        date: toLocalISODate(selectedSlot.date),
                                        startSlot: selectedSlot.slotIndex,
                                        slotLength: data.slotLength,
                                        type: data.type,
                                        patientName: data.patientName,
                                        gender: data.gender,
                                        age: data.age,
                                        notes: data.notes,
                                        status: "scheduled"
                                    };

                                    const saved = await addConsultation(
                                        "firebase",
                                        consultation,
                                        consultation.doctorId,
                                        consultation.patientId
                                    );

                                    setDoctorConsultations(prev => [...prev, saved]);
                                    setPatientConsultations(prev => [...prev, saved]);

                                    setPaymentTarget(saved);
                                    setSelectedSlot(null);

                                }}
                                onClose={() => setSelectedSlot(null)}
                            />
                        )}

                        {paymentTarget && (
                            <PaymentModal
                                consultation={paymentTarget}
                                onCancel={() => setPaymentTarget(null)}
                                onPayLater={() => setPaymentTarget(null)}
                                onPayNow={async () => {
                                    await updateConsultation(
                                        "firebase",
                                        paymentTarget.id,
                                        { status: "paid" }
                                    );

                                    setDoctorConsultations(prev =>
                                        prev.map(c =>
                                            c.id === paymentTarget.id
                                                ? { ...c, status: "paid" }
                                                : c
                                        )
                                    );

                                    setPatientConsultations(prev =>
                                        prev.map(c =>
                                            c.id === paymentTarget.id
                                                ? { ...c, status: "paid" }
                                                : c
                                        )
                                    );

                                    setPaymentTarget(null);
                                }}
                            />
                        )}


                    </div>
                </div>
            )}

        </>
    );
};

export default PatientDoctorSchedule;
