import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isDoctor, setIsDoctor] = useState(false);
    const [fullName, setFullName] = useState("");
    const [specialization, setSpecialization] = useState("");


    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (isDoctor && (!fullName || !specialization)) {
            setError("Wypełnij wszystkie pola dla rejestracji lekarza");
            return;
        }

        try {
            const cred = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = cred.user;

            // zapis do firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                role: isDoctor ? "DOCTOR" : "PATIENT",
                fullName: isDoctor ? fullName : null,
                specialization: isDoctor ? specialization : null,
                doctorStatus: isDoctor ? "PENDING" : null,
                banned: false,
                createdAt: serverTimestamp(),
            });


            navigate("/");
        } catch (err: any) {
            setError(err.message || "Registration failed");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Register</h2>

                <form className="auth-form" onSubmit={handleRegister}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="checkbox">
                        <input
                            type="checkbox"
                            checked={isDoctor}
                            onChange={e => setIsDoctor(e.target.checked)}
                        />
                        I am a doctor
                    </label>
                    {isDoctor && (
                        <>
                            <label>Full name</label>
                            <input
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                required
                            />

                            <label>Specialization</label>
                            <input
                                value={specialization}
                                onChange={e => setSpecialization(e.target.value)}
                                required
                            />
                        </>
                    )}

                    <button type="submit" className="auth-btn">
                        Register
                    </button>

                    {error && <div className="auth-error">{error}</div>}
                </form>
            </div>
        </div>
    );
};

export default Register;
