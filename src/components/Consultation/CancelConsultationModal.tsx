import type { Consultation } from "../../types/consultation";

type Props = {
    consultation: Consultation;
    onConfirm: () => void;
    onClose: () => void;
};

const CancelConsultationModal = ({ consultation, onConfirm, onClose }: Props) => {
    return (
        <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999
        }}>
            <div style={{
                background: "white",
                padding: 24,
                borderRadius: 16,
                width: 380,
                position: "relative"
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        border: "none",
                        background: "transparent",
                        fontSize: 18,
                        cursor: "pointer"
                    }}
                >
                    ✖
                </button>

                <h3>Cancel consultation</h3>

                <p>
                    Are you sure you want to cancel consultation for
                    <b> {consultation.patientName}</b> on{" "}
                    <b>{consultation.date}</b>?
                </p>

                <button
                    onClick={onConfirm}
                    style={{
                        marginTop: 12,
                        background: "#e57373",
                        color: "white",
                        width: "100%",
                        padding: 10,
                        borderRadius: 10
                    }}
                >
                    Cancel consultation
                </button>
            </div>
        </div>
    );
};

export default CancelConsultationModal;
