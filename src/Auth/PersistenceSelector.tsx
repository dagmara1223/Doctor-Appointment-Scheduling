import { useEffect, useState } from "react";
import { setAuthPersistence, useAuth } from "./AuthContext";
import "./PersistenceSelector.css";

type Mode = "LOCAL" | "SESSION" | "NONE";

const PersistenceSelector = () => {
    const { user } = useAuth();

    // tylko admin
    if (!user || user.role !== "ADMIN") {
        return null;
    }
    const [mode, setMode] = useState<Mode>("LOCAL");

    useEffect(() => {
        const saved = localStorage.getItem("auth_persistence") as Mode | null;
        if (saved) {
            setMode(saved);
        }
    }, []);

    const changeMode = async (newMode: Mode) => {
        await setAuthPersistence(newMode);
        setMode(newMode);
        localStorage.setItem("auth_persistence", newMode);
    };

    return (
        <div className="persistence">
            <button className="persistence-toggle">
                Auth: {mode} ▾
            </button>

            <div className="persistence-menu">
                <button
                    className={mode === "LOCAL" ? "active" : ""}
                    onClick={() => changeMode("LOCAL")}
                >
                    LOCAL
                </button>

                <button
                    className={mode === "SESSION" ? "active" : ""}
                    onClick={() => changeMode("SESSION")}
                >
                    SESSION
                </button>

                <button
                    className={mode === "NONE" ? "active" : ""}
                    onClick={() => changeMode("NONE")}
                >
                    NONE
                </button>
            </div>
        </div>
    );
};

export default PersistenceSelector;
