import type { Consultation } from "../../types/consultation";

type Props = {
    consultations: Consultation[];
    onPay: (ids: string[]) => void;
};

const ConsultationCart = ({ consultations, onPay }: Props) => {
    //tylko dla zarezerowanaych 
    const cartItems = consultations.filter(c => c.status === "scheduled");

    //jesli brak zarezerwowanych
    if (cartItems.length === 0) {
        return <p></p>;
    }

    //kwoty
    const totalPrice = cartItems.reduce((sum, c) => {
        switch (c.type) {
            case "first": return sum + 200;
            case "control": return sum + 150;
            case "chronic": return sum + 135;
            case "prescription": return sum + 90;
            default: return sum + 100;
        }
    }, 0);
    return (
        <div style={{ padding: 16, border: "1px solid #ccc", borderRadius: 12 }}>
            <h3>🛒 Consultation cart</h3>

            <ul>
                {cartItems.map(c => (
                    <li key={c.id}>
                        {c.date} | {c.patientName} | {c.type}
                    </li>
                ))}
            </ul>

            <p><b>Total:</b> {totalPrice} PLN</p>

            <button
                onClick={() => onPay(cartItems.map(c => c.id))}
            >
                Pay (simulation)
            </button>
        </div>
    );
}

export default ConsultationCart;