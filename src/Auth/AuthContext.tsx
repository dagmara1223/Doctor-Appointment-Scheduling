import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase";
import type { AppUser } from "../types/user";
import { setPersistence, browserLocalPersistence, browserSessionPersistence, inMemoryPersistence } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

type AuthContextType = {
    user: AppUser | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

export const setAuthPersistence = async (mode: "LOCAL" | "SESSION" | "NONE") => {
    switch (mode) {
        case "LOCAL":
            await setPersistence(auth, browserLocalPersistence);
            break;

        case "SESSION":
            await setPersistence(auth, browserSessionPersistence);
            break;

        case "NONE":
            await setPersistence(auth, inMemoryPersistence);
            break;
    }
};


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            if (!u) {
                setUser(null);
                setLoading(false);
                return;
            }

            const snap = await getDoc(doc(db, "users", u.uid));

            if (!snap.exists()) {
                setUser({
                    uid: u.uid,
                    email: u.email ?? "",
                    displayName: u.displayName,
                    role: "PATIENT",
                    banned: false
                });
            } else {
                setUser({
                    uid: u.uid,
                    ...(snap.data() as Omit<AppUser, "uid">),
                });
            }

            setLoading(false);
        });

        return () => unsub();
    }, []);


    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);