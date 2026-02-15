import type { Absence } from "../types/absence";
import type { Availability } from "../types/availability";
import type { Consultation } from "../types/consultation"

//magazyn
const STORAGE_KEY = "doctor_calendar_data";

type StorageShape = {
    consultations: Consultation[];
    availabilities: Availability[];
    absences: Absence[];
};

//parsing
const loadStorage = (): StorageShape => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        const empty: StorageShape = {
            consultations: [],
            availabilities: [],
            absences: []
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(empty));
        return empty;
    }
    return JSON.parse(raw);
};
const saveStorage = (data: StorageShape) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

//konsultacje
export const getConsultations = (): Consultation[] => {
    return loadStorage().consultations;
};
export const saveConsultations = (consultations: Consultation[]) => {
    const storage = loadStorage();
    saveStorage({ ...storage, consultations });
};

//dostepnosc
export const getAvailabilities = (): Availability[] => {
    return loadStorage().availabilities;
};
export const saveAvailabilities = (availabilities: Availability[]) => {
    const storage = loadStorage();
    saveStorage({ ...storage, availabilities });
};

//nieobecnosci
export const getAbsences = (): Absence[] => {
    return loadStorage().absences;
};
export const saveAbsences = (absences: Absence[]) => {
    const storage = loadStorage();
    saveStorage({ ...storage, absences });
};
