import type { Consultation } from "../../types/consultation";

type Props = {
    consultation: Consultation;
    onCancel: () => void;
    onPayNow: () => void;
    onPayLater: () => void;
};

const priceByType: Record<string, number> = {
    first: 200,
    control: 150,
    chronic: 180,
    prescription: 100
};

const PaymentModal = ({ consultation, onCancel, onPayNow, onPayLater }: Props) => {
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
                width: 420,
                position: "relative"
            }}>
                <button
                    onClick={onCancel}
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

                <h3>💳 Payment</h3>

                <p><b>Patient:</b> {consultation.patientName}</p>
                <p><b>Date:</b> {consultation.date}</p>
                <p><b>Type:</b> {consultation.type}</p>
                <p><b>Duration:</b> {consultation.slotLength * 30} min</p>

                <h4 style={{ marginTop: 12 }}>
                    Total: {priceByType[consultation.type]} PLN
                </h4>
                <button
                    onClick={onPayLater}
                    style={{
                        marginTop: 8,
                        width: "100%",
                        padding: 10,
                        borderRadius: 10,
                        background: "#eee"
                    }}
                >
                    Pay later (add to cart)
                </button>
                <button
                    onClick={onPayNow}
                    style={{
                        marginTop: 12,
                        width: "100%",
                        padding: 10,
                        borderRadius: 10
                    }}
                >
                    Pay (simulation)
                </button>
            </div>
        </div>
    );
};

export default PaymentModal;
