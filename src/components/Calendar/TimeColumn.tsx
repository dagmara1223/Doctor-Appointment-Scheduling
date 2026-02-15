const TimeColumn = () => {
    const slots: string[] = [];

    // od 8:00 do 23:30
    for (let h = 8; h < 24; h++) {
        slots.push(`${h}:00`);
        slots.push(`${h}:30`);
    }

    return (
        <>
            {slots.map((time) => (
                <div key={time} className="time-slot">
                    {time}
                </div>
            ))}
        </>
    );
};

export default TimeColumn;
