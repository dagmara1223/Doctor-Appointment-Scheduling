import { useEffect, useState } from "react";
import { addReview } from "../../services/firebaseReviewsService";
import { useAuth } from "../../Auth/AuthContext";
import "./ReviewModal.css";
import { loadDoctorProfile } from "../../services/firebaseDoctorsService";
import { hasReviewForConsultation } from "../../services/firebaseReviewsService";

type Props = {
    doctorId: string;
    consultationId: string;
    onClose: () => void;
};

const ReviewModal = ({ doctorId, consultationId, onClose }: Props) => {
    const { user } = useAuth();

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [doctor, setDoctor] = useState<any>(null);
    const [alreadyReviewed, setAlreadyReviewed] = useState(false);

    useEffect(() => {
        hasReviewForConsultation(consultationId, user!.uid)
            .then(setAlreadyReviewed);
    }, []);


    useEffect(() => {
        loadDoctorProfile(doctorId).then(setDoctor);
    }, [doctorId]);

    if (user?.banned) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="review-modal" onClick={e => e.stopPropagation()}>
                    <h3>Nie możesz dodać opinii</h3>

                    <p className="ban-info">
                        Twoje konto zostało zablokowane przez administratora.
                        <br />
                        Dodawanie opinii i ocen jest niedostępne.
                    </p>

                    <button className="btn-primary" onClick={onClose}>
                        Zamknij
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="review-modal"
                onClick={(e) => e.stopPropagation()}
            >

                {/* header */}
                <div className="review-header">
                    <h3>Dodaj opinię</h3>
                    <p className="doctor-name">{doctor?.fullName}</p>

                    {doctor?.specialization && (
                        <span className="specialization">
                            {doctor.specialization}
                        </span>
                    )}
                </div>

                {alreadyReviewed ? (
                    <div className="review-already">
                        <p style={{ color: "#c0392b", marginBottom: 16 }}>
                            ✔️ Opinia tej wizyty została już dodana.
                        </p>

                        <button className="btn-primary" onClick={onClose}>
                            Zamknij
                        </button>
                    </div>
                ) : (<>
                    {/* forms */}
                    < div className="review-form">
                        <div className="review-row">
                            <label>Ocena</label>
                            <select
                                value={rating}
                                onChange={(e) => setRating(+e.target.value)}
                            >
                                {[5, 4, 3, 2, 1].map(v => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                        </div>

                        <textarea
                            placeholder="Napisz opinię..."
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                        />
                    </div>

                    {/* akcje */}
                    <div className="review-actions">
                        <button className="btn-secondary" onClick={onClose}>
                            Anuluj
                        </button>

                        <button
                            className="btn-primary"
                            onClick={async () => {
                                await addReview({
                                    doctorId,
                                    patientId: user!.uid,
                                    patientName: user!.email!,
                                    consultationId,
                                    rating,
                                    comment,
                                });
                                onClose();
                            }}
                        >
                            Dodaj
                        </button>
                    </div>
                </>)}

            </div>
        </div >
    );

};

export default ReviewModal;
