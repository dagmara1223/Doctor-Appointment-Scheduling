import { collection, getDocs, updateDoc, doc, deleteDoc, query, where, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getDocsFromServer } from "firebase/firestore";

import type { AppUser } from "../types/user";

export const loadDoctors = async () => {
    const q = query(
        collection(db, "users"),
        where("role", "==", "DOCTOR"),
        where("banned", "==", false),
        where("doctorStatus", "==", "APPROVED")
    );

    const snap = await getDocsFromServer(q);

    return snap.docs.map(doc => ({
        id: doc.id,
        fullName: doc.data().fullName,
        specialization: doc.data().specialization,
    }));
};

export const fetchUsers = async (): Promise<AppUser[]> => {
    const snap = await getDocs(collection(db, "users"));

    return snap.docs.map(d => {
        const data = d.data();

        return {
            uid: d.id,
            email: data.email,
            role: data.role,
            banned: data.banned ?? false,
            doctorStatus: data.doctorStatus ?? "PENDING"

        } satisfies AppUser;
    });
};


export const setUserBan = async (uid: string, banned: boolean) => {
    await updateDoc(doc(db, "users", uid), { banned });
};

export const deleteUserFromFirestore = async (uid: string) => {
    await deleteDoc(doc(db, "users", uid));
};

export const loadDoctorById = async (doctorId: string) => {
    const snap = await getDoc(doc(db, "users", doctorId));
    if (!snap.exists()) return null;
    return snap.data();
};

export const approveDoctor = async (uid: string) => {
    await updateDoc(doc(db, "users", uid), {
        doctorStatus: "APPROVED"
    });
};

export const rejectDoctor = async (uid: string) => {
    await updateDoc(doc(db, "users", uid), {
        doctorStatus: "REJECTED"
    });
};