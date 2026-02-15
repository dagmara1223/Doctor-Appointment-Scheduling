import { useEffect, useState } from "react";
import { fetchUsers, setUserBan } from "../../services/firebaseUsersService";

const UsersList = () => {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        fetchUsers().then(setUsers);
    }, []);

    return (
        <table>
            <thead>
                <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Ban</th>
                </tr>
            </thead>
            <tbody>
                {users.map(u => (
                    <tr key={u.uid}>
                        <td>{u.email}</td>
                        <td>{u.role}</td>
                        <td>
                            {u.role !== "ADMIN" && (
                                <button
                                    onClick={async () => {
                                        await setUserBan(u.uid, !u.banned);
                                        setUsers(prev =>
                                            prev.map(x =>
                                                x.uid === u.uid
                                                    ? { ...x, banned: !x.banned }
                                                    : x
                                            )
                                        );
                                    }}
                                >
                                    {u.banned ? "Unban" : "Ban"}
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UsersList;
