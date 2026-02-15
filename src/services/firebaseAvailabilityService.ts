import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc
} from "firebase/firestore";
import { db } from "../firebase";
import type { Availability, TimeRange, AvailabilityInput } from "../types/availability";
import { query, where } from "firebase/firestore";



type AvailabilityFromDB =
    | {
        type: "single";
        date: string;
        timeRanges: TimeRange[];
        doctorId: string;
    }
    | {
        type: "cyclic";
        startDate: string;
        endDate: string;
        daysOfWeek: number[];
        timeRanges: TimeRange[];
        doctorId: string;
    };



const ref = collection(db, "availabilities");

export const fetchAvailabilities = async (
    doctorId: string
): Promise<Availability[]> => {

    const q = query(
        ref,
        where("doctorId", "==", doctorId)
    );

    const snap = await getDocs(q);

    return snap.docs.map(d => {
        const data = d.data() as AvailabilityFromDB;

        return {
            ...data,
            id: d.id,
        };
    });
};

export const createAvailability = async (
    data: AvailabilityInput,
    doctorId: string
): Promise<string> => {
    const docRef = await addDoc(ref, {
        ...data,
        doctorId,
    });
    return docRef.id;
};

export const deleteAvailability = async (id: string) => {
    await deleteDoc(doc(db, "availabilities", id));
};
