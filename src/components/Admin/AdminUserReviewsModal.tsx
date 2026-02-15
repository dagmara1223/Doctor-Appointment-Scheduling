import { useEffect, useState } from "react";
import type { Review } from "../../types/reviews";
import {
    loadReviewsByUser,
    deleteReviewByAdmin
} from "../../services/firebaseAdminRewievsService";
import "./AdminUserReviewsModal.css";

type Props = {
    userId: string;
    email: string;
    onClose: () => void;
};

const AdminUserReviewsModal = ({ userId, email, onClose }: Props) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReviewsByUser(userId).then(r => {
            setReviews(r);
            setLoading(false);
        });
    }, [userId]);

    const remove = async (id: string) => {
        if (!window.confirm("Usunąć tę opinię?")) return;

        await deleteReviewByAdmin(id);
        setReviews(prev => prev.filter(r => r.id !== id));
    };

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-review-modal" onClick={e => e.stopPropagation()}>
                <h3>Opinie użytkownika</h3>
                <p className="email">{email}</p>

                {loading && <p>Ładowanie…</p>}

                {reviews.length === 0 && !loading && (
                    <p className="empty">Brak opinii</p>
                )}

                {reviews.map(r => (
                    <div key={r.id} className="review-row">
                        <div>
                            <strong>Ocena: {r.rating}/5</strong>
                            <p>{r.comment}</p>
                        </div>

                        <button
                            className="danger-btn small"
                            onClick={() => remove(r.id)}
                        >
                            Usuń
                        </button>
                    </div>
                ))}

                <button className="btn-secondary" onClick={onClose}>
                    Zamknij
                </button>
            </div>
        </div>
    );
};

export default AdminUserReviewsModal;
