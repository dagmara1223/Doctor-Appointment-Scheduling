import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from "../../Auth/AuthContext";
import PersistenceSelector from "../../Auth/PersistenceSelector";
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
    };

    return (
        <div className="navbar">
            {/* lewa strona*/}
            <div className="navbar-left">
                <div className="navbar-title" onClick={() => navigate("/")}>
                    🩺 DocApp
                </div>

                {/* pacjent*/}
                {user?.role === "PATIENT" && (
                    <>
                        <button
                            className="navbar-link"
                            onClick={() => navigate("/patient")}
                        >
                            Strona główna
                        </button>

                        <button
                            className="navbar-link"
                            onClick={() => navigate("/patient/doctors")}
                        >
                            Lista lekarzy
                        </button>

                        <button
                            className="navbar-link"
                            onClick={() => navigate("/patient/cart")}
                        >
                            Mój koszyk / wizyty
                        </button>
                    </>
                )}

                {/*doctor */}
                {user?.role === "DOCTOR" && (
                    <>
                        <button
                            className="navbar-link"
                            onClick={() => navigate("/doctor")}
                        >
                            Strona główna
                        </button>

                        <button
                            className="navbar-link"
                            onClick={() => navigate("/doctor/schedule")}
                        >
                            Mój harmonogram
                        </button>

                        <button
                            className="navbar-link"
                            onClick={() => navigate("/doctor/manage")}
                        >
                            Zarządzanie harmonogramem
                        </button>
                    </>
                )}


                {/*admin */}
                {user?.role === "ADMIN" && (
                    <button onClick={() => navigate("/admin")}>
                        Admin panel
                    </button>
                )}

            </div>

            {/* prawa czesc */}
            <div className="navbar-right">
                {!user && (
                    <>
                        <button
                            className="navbar-link"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                        <button
                            className="navbar-link"
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </button>
                    </>
                )}

                {user && (
                    <>
                        <PersistenceSelector />
                        <span className="navbar-user">{user.email}</span>
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;
