import {
    collection,
    getDocs,
    query,
    where,
    deleteDoc,
    doc
} from "firebase/firestore";
import { db } from "../firebase";
import type { Review } from "../types/reviews";

export const loadReviewsByUser = async (userId: string): Promise<Review[]> => {
    const q = query(
        collection(db, "reviews"),
        where("patientId", "==", userId)
    );

    const snap = await getDocs(q);

    return snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<Review, "id">),
    }));
};

export const deleteReviewByAdmin = async (reviewId: string) => {
    await deleteDoc(doc(db, "reviews", reviewId));
};
