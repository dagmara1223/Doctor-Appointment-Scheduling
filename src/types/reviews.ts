import { Timestamp } from "firebase/firestore"

export type Review = {
    id: string;
    doctorId: string;
    patientId: string;
    consultationId: string;
    patientName: string;
    rating: number;  // 1–5
    comment: string;
    createdAt: Timestamp;

    doctorReply?: {
        text: string;
        repliedAt: Timestamp;
    };
}


