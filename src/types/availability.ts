export type TimeRange = {
    from: string; // "08:00"
    to: string;   // "12:30"
};

type BaseAvailability = {
    id: string;
    doctorId: string;
};

export type AvailabilityInput =
    | {
        type: "single";
        date: string;
        timeRanges: TimeRange[];
    }
    | {
        type: "cyclic";
        startDate: string;
        endDate: string;
        daysOfWeek: number[];
        timeRanges: TimeRange[];
    };


export type CyclicAvailability = BaseAvailability & {
    type: "cyclic";
    startDate: string; // "2025-02-01"
    endDate: string;   // "2025-03-12"
    daysOfWeek: number[]; // 0=Sun ... 6=Sat
    timeRanges: TimeRange[];
};

export type SingleAvailability = BaseAvailability & {
    type: "single";
    date: string; // "2025-02-10"
    timeRanges: TimeRange[];
};

export type Availability = CyclicAvailability | SingleAvailability;
