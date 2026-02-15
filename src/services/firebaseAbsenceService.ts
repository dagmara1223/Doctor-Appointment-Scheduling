import { collection, getDocs, doc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { Absence } from "../types/absence";
import { query, where } from "firebase/firestore";

const absencesRef = collection(db, "absences");

export const fetchAbsences = async (doctorId: string): Promise<Absence[]> => {
    const q = query(
        collection(db, "absences"),
        where("doctorId", "==", doctorId)
    );

    const snap = await getDocs(q);

    return snap.docs.map(d => ({
        ...(d.data() as Omit<Absence, "id">),
        id: d.id,
    }));
};


export const createAbsence = async (
    absence: Omit<Absence, "id" | "doctorId">,
    doctorId: string
) => {
    const docRef = await addDoc(collection(db, "absences"), {
        ...absence,
        doctorId,
    });
    return docRef.id;
};

export const deleteAbsence = async (id: string) => {
    const ref = doc(db, "absences", id);
    await deleteDoc(ref);
};
