import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./AuthForm.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const { user, loading } = useAuth();

    if (!loading && user) {
        return <Navigate to="/" replace />;
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err) {
            setError("Invalid email or password");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Login</h2>

                <form className="auth-form" onSubmit={handleLogin}>
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

                    <button type="submit" className="auth-btn">
                        Login
                    </button>

                    {error && <div className="auth-error">{error}</div>}
                </form>

                <p style={{ marginTop: 12, textAlign: "center" }}>
                    Don’t have an account? <a href="/register">Register</a>
                </p>
            </div>
        </div>
    );
};


export default Login;
