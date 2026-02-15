import GuestDoctorsList from "./GuestDoctorsList";
import { useState } from "react";
import "./GuestHome.css";
import HealthCheckModal from "./HealthQuiz";

const questions = [
    {
        id: 1,
        text: "Kiedy ostatnio wykonywałeś/aś badania krwi?",
        options: [
            { label: "Mniej niż rok temu", score: 0 },
            { label: "1–2 lata temu", score: 1 },
            { label: "Ponad 2 lata temu / nie pamiętam", score: 2 },
        ],
    },
    {
        id: 2,
        text: "Czy regularnie mierzysz ciśnienie krwi?",
        options: [
            { label: "Tak", score: 0 },
            { label: "Rzadko", score: 1 },
            { label: "Nigdy", score: 2 },
        ],
    },
    {
        id: 3,
        text: "Czy ostatnio odczuwasz zmęczenie, zawroty głowy lub bóle głowy?",
        options: [
            { label: "Nie", score: 0 },
            { label: "Czasami", score: 1 },
            { label: "Często", score: 2 },
        ],
    },
    {
        id: 4,
        text: "Czy masz zdiagnozowane choroby przewlekłe?",
        options: [
            { label: "Nie", score: 0 },
            { label: "Tak", score: 2 },
        ],
    },
    {
        id: 5,
        text: "Ile masz lat?",
        options: [
            { label: "Poniżej 30", score: 0 },
            { label: "30–50", score: 1 },
            { label: "50+", score: 2 },
        ],
    },
];

const GuestHome = () => {
    const [quizOpen, setQuizOpen] = useState(false);
    return (
        <div className="guest-home">
            <div className="health-cta" onClick={() => setQuizOpen(true)}>
                🩺 Sprawdź, czy warto wykonać badania kontrolne
            </div>

            <section className="hero">
                <h1>Zdrowie na wyciągnięcie ręki</h1>
                <p>
                    Przeglądaj dostępnych lekarzy i umawiaj wizyty online
                    szybko, bez kolejek i telefonów.
                </p>

                <div className="hero-actions">
                    <a href="/register" className="btn-primary">
                        Zarejestruj się
                    </a>
                    <a href="/login" className="btn-secondary">
                        Zaloguj się
                    </a>
                </div>
            </section>

            <section className="doctors-section">
                <GuestDoctorsList />
            </section>
            {quizOpen && (
                <HealthCheckModal
                    questions={questions}
                    onClose={() => setQuizOpen(false)}
                />
            )}
        </div>

    );
};
export default GuestHome;
