import type { Availability } from "../../types/availability";

type Props = {
    availabilities: Availability[];
    onRemove?: (id: string) => void;
};

const AvailabilityList = ({ availabilities, onRemove }: Props) => {
    if (availabilities.length === 0) {
        return <p>Brak dostępności</p>;
    }

    return (
        <ul>
            {availabilities.map(a => (
                <li key={a.id} style={{ marginBottom: 8 }}>
                    {a.type === "single" && (
                        <>Single: {a.date}</>
                    )}

                    {a.type === "cyclic" && (
                        <>Cyclic: {a.startDate} → {a.endDate}</>
                    )}

                    {onRemove && (
                        <button
                            style={{ marginLeft: 8 }}
                            onClick={() => onRemove(a.id)}
                        >
                            🗑️
                        </button>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default AvailabilityList;
