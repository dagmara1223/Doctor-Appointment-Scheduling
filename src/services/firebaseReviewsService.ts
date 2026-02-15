import { db } from "../firebase";
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    serverTimestamp,
    orderBy,
    updateDoc,
    doc
} from "firebase/firestore";
import type { Review } from "../types/reviews";

export const addReview = async (review: Omit<Review, "id" | "createdAt">) => {
    await addDoc(collection(db, "reviews"), {
        ...review,
        createdAt: serverTimestamp(),
    });
};

export const loadDoctorReviews = async (doctorId: string): Promise<Review[]> => {
    const q = query(
        collection(db, "reviews"),
        where("doctorId", "==", doctorId),
        orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Review));
};

export const hasReviewForConsultation = async (
    consultationId: string,
    patientId: string
): Promise<boolean> => {
    const q = query(
        collection(db, "reviews"),
        where("consultationId", "==", consultationId),
        where("patientId", "==", patientId)
    );

    const snap = await getDocs(q);
    return !snap.empty;
};

//reviews dla lekarza
export const loadReviewsForDoctor = async (doctorId: string): Promise<Review[]> => {
    const q = query(
        collection(db, "reviews"),
        where("doctorId", "==", doctorId),
        orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    return snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
    })) as Review[];
};

//odpowiadanie przez lekarza
export const replyToReview = async (
    reviewId: string,
    replyText: string
) => {
    const ref = doc(db, "reviews", reviewId);

    await updateDoc(ref, {
        doctorReply: {
            text: replyText,
            repliedAt: serverTimestamp(),
        },
    });
};