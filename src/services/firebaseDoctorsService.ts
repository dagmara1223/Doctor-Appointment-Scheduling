import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import type { DoctorProfile } from "../types/doctor";
import { getDoc, doc } from "firebase/firestore";

export const fetchDoctors = async (): Promise<DoctorProfile[]> => {
    const q = query(
        collection(db, "users"),
        where("role", "==", "DOCTOR")
    );

    const snap = await getDocs(q);

    return snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<DoctorProfile, "id">),
    }));
};
export const loadDoctorProfile = async (doctorId: string) => {
    const snap = await getDoc(doc(db, "users", doctorId));
    if (!snap.exists()) return null;
    return snap.data();
};