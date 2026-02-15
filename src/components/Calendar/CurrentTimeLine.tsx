const SLOT_HEIGHT = 48

const CurrentTimeLine = () => {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();

    const startMinutesFrom8 = 8 * 60;
    const diff = minutes - startMinutesFrom8;

    if (diff < 0 || diff > 16 * 60) {
        return null;
    }
    const top = (diff / 30) * SLOT_HEIGHT;

    return (
        <div
            className="current-time-line"
            style={{ top }}
        />
    );
}

export default CurrentTimeLine;