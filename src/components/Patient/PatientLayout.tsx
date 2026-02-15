import { Outlet } from "react-router-dom";

const PatientLayout = () => {
    return (
        <div style={{ padding: "24px" }}>
            <Outlet />
        </div>
    );
};

export default PatientLayout;
