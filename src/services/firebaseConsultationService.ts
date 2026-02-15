import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "firebase/firestore";
import { db } from "../firebase";
import type { Consultation } from "../types/consultation";
import type { DataSource } from "./DataSource";
import { where, query } from "firebase/firestore";

// tworze sciezke
const consultationsRef = collection(db, "consultations");

// CREATE tworzenie
export const createConsultation = async (
    consultation: Omit<Consultation, "id" | "doctorId" | "patientId">,
    doctorId: string,
    patientId: string
) => {
    const docRef = await addDoc(consultationsRef, {
        ...consultation,
        doctorId,
        patientId,
    });

    return docRef.id;
};


//READ odczyt
export const fetchConsultations = async (
    doctorId: string
): Promise<Consultation[]> => {

    const q = query(
        consultationsRef,
        where("doctorId", "==", doctorId)
    );

    const snap = await getDocs(q);

    return snap.docs.map(d => ({
        ...(d.data() as Omit<Consultation, "id">),
        id: d.id,
    }));
};

export const fetchConsultationsByPatient = async (
    patientId: string
): Promise<Consultation[]> => {
    const q = query(
        collection(db, "consultations"),
        where("patientId", "==", patientId)
    );

    const snap = await getDocs(q);
    return snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<Consultation, "id">),
    }));
};

//UPDATE 
export const updateConsultation = async (
    id: string,
    data: Partial<Consultation>
) => {
    const ref = doc(db, "consultations", id);
    await updateDoc(ref, data);
};

//DELETE 
export const deleteConsultation = async (id: string) => {
    const ref = doc(db, "consultations", id);
    await deleteDoc(ref);
};

export const updateConsultationFirebase = async (
    id: string,
    patch: Partial<Consultation>
) => {
    const ref = doc(db, "consultations", id);
    await updateDoc(ref, patch);
};

export const cancelConsultation = (
    src: DataSource,
    id: string
) => {
    if (src === "local") {
        return Promise.resolve();
    }

    return updateConsultationFirebase(id, { status: "cancelled" });
};
