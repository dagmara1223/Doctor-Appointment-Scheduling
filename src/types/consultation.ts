export type ConsultationStatus =
    | "draft"
    | "scheduled"
    | "paid"
    | "cancelled";

export type Consultation = {
    id: string;

    doctorId: string;
    patientId: string;

    date: string;
    startSlot: number;
    slotLength: number;

    type: string;

    patientName: string;
    gender: string;
    age: number;

    notes?: string;
    files?: string;

    status: ConsultationStatus;
    cancelledBy?: "doctor" | "patient";
};
