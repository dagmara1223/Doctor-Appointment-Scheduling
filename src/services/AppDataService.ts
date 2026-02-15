import type { DataSource } from "./DataSource";
import type { Consultation } from "../types/consultation";
import type { Availability } from "../types/availability";
import type { Absence } from "../types/absence";
import type { AvailabilityInput } from "../types/availability";

//local storage 
import {
    getConsultations as getLocalConsultations,
    saveConsultations as saveLocalConsultations,
    getAvailabilities as getLocalAvailabilities,
    saveAvailabilities as saveLocalAvailabilities,
    getAbsences as getLocalAbsences,
    saveAbsences as saveLocalAbsences
} from "./ConsultationService";

// firebase
import {
    fetchConsultations,
    fetchConsultationsByPatient,
    createConsultation,
    deleteConsultation,
    updateConsultationFirebase
} from "./firebaseConsultationService";
import {
    fetchAvailabilities,
    createAvailability,
    deleteAvailability
} from "./firebaseAvailabilityService";
import {
    fetchAbsences,
    createAbsence,
    deleteAbsence
} from "./firebaseAbsenceService";
import { fetchDoctors } from "./firebaseDoctorsService";

export const loadDoctors = () => {
    return fetchDoctors();
};


export const loadConsultations = (
    src: DataSource,
    doctorId: string
): Promise<Consultation[]> => {
    if (src === "local") {
        return Promise.resolve(getLocalConsultations());
    }
    return fetchConsultations(doctorId);
};

export const loadConsultationsByPatient = (
    src: DataSource,
    patientId: string
): Promise<Consultation[]> => {
    if (src === "local") {
        return Promise.resolve([]);
    }
    return fetchConsultationsByPatient(patientId);
};


export const addConsultation = async (
    src: DataSource,
    c: Consultation,
    doctorId: string,
    patientId: string
): Promise<Consultation> => {
    if (src === "local") {
        const all = getLocalConsultations();
        saveLocalConsultations([...all, c]);
        return c;
    }

    const { id: _ignore, ...data } = c;

    const docId = await createConsultation(
        data,
        doctorId,
        patientId
    );

    return { ...data, doctorId, patientId, id: docId };
};


export const removeConsultation = (src: DataSource, id: string) => {
    if (src === "local") {
        saveLocalConsultations(
            getLocalConsultations().filter(c => c.id !== id)
        );
        return Promise.resolve();
    }
    return deleteConsultation(id);
};


export const loadAvailabilities = (
    src: DataSource,
    doctorId: string
) => {
    if (src === "local") {
        return Promise.resolve(getLocalAvailabilities());
    }
    return fetchAvailabilities(doctorId);
};

export const addAvailability = async (
    src: DataSource,
    a: AvailabilityInput,
    doctorId: string
): Promise<Availability> => {
    if (src === "local") {
        const withId: Availability = {
            ...a,
            doctorId,
            id: crypto.randomUUID(),
        };
        saveLocalAvailabilities([...getLocalAvailabilities(), withId]);
        return withId;
    }

    const id = await createAvailability(a, doctorId);
    return { ...a, doctorId, id };
};



export const loadAbsences = (
    src: DataSource,
    doctorId: string
) => {
    if (src === "local") {
        return Promise.resolve(getLocalAbsences());
    }
    return fetchAbsences(doctorId);
};

export const addAbsence = async (
    src: DataSource,
    a: Omit<Absence, "id" | "doctorId">,
    doctorId: string
): Promise<Absence> => {
    if (src === "local") {
        const withId = { ...a, doctorId, id: crypto.randomUUID() };
        saveLocalAbsences([...getLocalAbsences(), withId]);
        return withId;
    }

    const id = await createAbsence(a, doctorId);
    return { ...a, doctorId, id };
};


export const removeAvailability = (src: DataSource, id: string) => {
    if (src === "local") {
        saveLocalAvailabilities(
            getLocalAvailabilities().filter(a => a.id !== id)
        );
        return Promise.resolve();
    }
    return deleteAvailability(id);
};

export const removeAbsence = (src: DataSource, id: string) => {
    if (src === "local") {
        saveLocalAbsences(
            getLocalAbsences().filter(a => a.id !== id)
        );
        return Promise.resolve();
    }
    return deleteAbsence(id);
};

export const updateConsultation = (
    src: DataSource,
    id: string,
    patch: Partial<Consultation>
) => {
    if (src === "local") {
        const all = getLocalConsultations().map(c =>
            c.id === id ? { ...c, ...patch } : c
        );
        saveLocalConsultations(all);
        return Promise.resolve();
    }
    return updateConsultationFirebase(id, patch);
};


