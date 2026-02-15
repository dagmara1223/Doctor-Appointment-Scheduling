export type UserRole = "GUEST" | "PATIENT" | "DOCTOR" | "ADMIN";
export type DoctorStatus = "PENDING" | "APPROVED" | "REJECTED";

export type AppUser = {
    uid: string;
    email: string;
    displayName?: string | null;
    role: UserRole;
    banned?: boolean;

    //tylko dla lekarza
    fullName?: string;
    specialization?: string;

    doctorStatus?: DoctorStatus;
};
