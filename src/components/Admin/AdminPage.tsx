import { useState, useEffect } from "react";
import type { AppUser } from "../../types/user";
import {
    fetchUsers, setUserBan, approveDoctor,
    rejectDoctor
} from "../../services/firebaseUsersService";
import "./AdminPage.css";
import AdminUserReviewsModal from "./AdminUserReviewsModal";

const AdminUsersPage = () => {
    const [users, setUsers] = useState<AppUser[]>([]);

    useEffect(() => {
        fetchUsers().then(setUsers);
    }, []);
    const [selectedUser, setSelectedUser] =
        useState<{ uid: string; email: string } | null>(null);


    const toggleBan = async (u: AppUser) => {
        if (u.role !== "PATIENT") return;

        const newValue = !u.banned;

        await setUserBan(u.uid, newValue);

        setUsers(prev =>
            prev.map(x =>
                x.uid === u.uid ? { ...x, banned: newValue } : x
            )
        );
    };

    //approve i reject doctor - funkcje admina
    const approve = async (u: AppUser) => {
        await approveDoctor(u.uid);

        setUsers(prev =>
            prev.map(x =>
                x.uid === u.uid
                    ? { ...x, doctorStatus: "APPROVED" }
                    : x
            )
        );
    };

    const reject = async (u: AppUser) => {
        await rejectDoctor(u.uid);

        setUsers(prev =>
            prev.map(x =>
                x.uid === u.uid
                    ? { ...x, doctorStatus: "REJECTED" }
                    : x
            )
        );
    };


    return (
        <div className="admin-container">
            <h2 className="admin-title">🛡️ Admin Panel</h2>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Actions</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Ban</th>
                        <th>Reviews</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((u) => (
                        <tr key={u.uid}>

                            {/* status */}
                            <td>
                                {u.role === "DOCTOR" ? (
                                    <span
                                        className={`status-badge ${u.doctorStatus?.toLowerCase() || "pending"
                                            }`}
                                    >
                                        {u.doctorStatus || "PENDING"}
                                    </span>
                                ) : (
                                    "—"
                                )}
                            </td>

                            {/* akcje */}
                            <td>
                                {u.role === "DOCTOR" &&
                                    (!u.doctorStatus || u.doctorStatus === "PENDING") ? (
                                    <>
                                        <button
                                            className="approve-btn"
                                            onClick={() => approve(u)}
                                        >
                                            Approve
                                        </button>

                                        <button
                                            className="reject-btn"
                                            onClick={() => reject(u)}
                                        >
                                            Reject
                                        </button>
                                    </>
                                ) : (
                                    <span className="no-action">—</span>
                                )}
                            </td>


                            {/* email */}
                            <td>{u.email}</td>

                            {/* role */}
                            <td>
                                <span className={`role-badge ${u.role.toLowerCase()}`}>
                                    {u.role}
                                </span>
                            </td>

                            {/* ban*/}
                            <td>
                                {u.role === "PATIENT" ? (
                                    <button
                                        className={`ban-btn ${u.banned ? "unban" : "ban"}`}
                                        onClick={() => toggleBan(u)}
                                    >
                                        {u.banned ? "Unban" : "Ban"}
                                    </button>
                                ) : (
                                    <span className="no-action">—</span>
                                )}
                            </td>
                            {/* reviews */}
                            <td>
                                {u.role === "PATIENT" && !u.banned ? (
                                    <button
                                        className="link-btn"
                                        onClick={() =>
                                            setSelectedUser({ uid: u.uid, email: u.email })
                                        }
                                    >
                                        View
                                    </button>
                                ) : (
                                    "—"
                                )}
                            </td>


                        </tr>
                    ))}
                </tbody>


            </table>
            {selectedUser && (
                <AdminUserReviewsModal
                    userId={selectedUser.uid}
                    email={selectedUser.email}
                    onClose={() => setSelectedUser(null)}
                />
            )}

        </div>
    );
};

export default AdminUsersPage;