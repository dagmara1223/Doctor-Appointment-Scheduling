import { useAuth } from "../../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "./DoctorHome.css";
import { loadReviewsForDoctor, replyToReview } from "../../services/firebaseReviewsService";
import type { Review } from "../../types/reviews";
import { useEffect, useState } from "react";

const DoctorHome = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [replyText, setReplyText] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!user?.uid) return;

        loadReviewsForDoctor(user.uid).then(setReviews);
    }, [user]);


    return (
        <div className="doctor-home">
            <h2>👋 Witaj, doktorze</h2>
            <p>Zarządzaj swoim harmonogramem i wizytami.</p>

            <div className="doctor-home-actions">
                <button
                    className="primary-btn"
                    onClick={() => navigate("/doctor/schedule")}
                >
                    📅 Przejdź do harmonogramu
                </button>

                <button
                    className="secondary-btn"
                    onClick={() => navigate("/doctor/manage")}
                >
                    ⚙️ Zarządzaj dostępnością
                </button>
            </div>

            <section className="doctor-info">
                <h3>🧠 Wskazówka</h3>
                <p>
                    Pamiętaj, aby regularnie aktualizować dostępność oraz sprawdzać
                    odwołane wizyty.
                </p>
            </section>
            <section className="doctor-reviews">
                <h3>📝 Opinie pacjentów</h3>

                {reviews.length === 0 && (
                    <p className="empty">Nie masz jeszcze opinii</p>
                )}

                {reviews.map(r => (
                    <div key={r.id} className="review-card">

                        <div className="review-header">
                            <strong>{r.patientName}</strong>
                            <span>⭐ {r.rating}/5</span>
                        </div>

                        <p className="review-comment">{r.comment}</p>

                        {/* odpowiedz lekarza */}
                        {r.doctorReply ? (
                            <div className="doctor-reply">
                                <strong>Odpowiedź lekarza:</strong>
                                <p>{r.doctorReply.text}</p>
                            </div>
                        ) : (
                            <div className="reply-form">
                                <textarea
                                    placeholder="Odpowiedz pacjentowi..."
                                    value={replyText[r.id] ?? ""}
                                    onChange={e =>
                                        setReplyText(prev => ({
                                            ...prev,
                                            [r.id]: e.target.value,
                                        }))
                                    }
                                />

                                <button
                                    className="btn-primary small"
                                    disabled={!replyText[r.id]?.trim()}
                                    onClick={async () => {
                                        await replyToReview(r.id, replyText[r.id]);
                                        setReplyText(prev => ({ ...prev, [r.id]: "" }));

                                        // 🔄 refresh opinii
                                        loadReviewsForDoctor(user!.uid).then(setReviews);
                                    }}
                                >
                                    Odpowiedz
                                </button>
                            </div>
                        )}

                    </div>
                ))}

            </section>

        </div>
    );
};

export default DoctorHome;
