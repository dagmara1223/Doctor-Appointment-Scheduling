import type { ReactNode } from "react";
import "./AppLayout.css";

const AppLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="app-layout">
            <main className="app-content">
                {children}
            </main>
        </div>
    );
};

export default AppLayout;
