import { useState } from "react";
import "./HealthQuiz.css";

type Question = {
    id: number;
    text: string;
    options: { label: string; score: number }[];
};

type Props = {
    questions: Question[];
    onClose: () => void;
};

const HealthCheckModal = ({ questions, onClose }: Props) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);

    const current = questions[step];

    const handleAnswer = (score: number) => {
        const next = [...answers, score];
        setAnswers(next);

        if (step + 1 < questions.length) {
            setStep(step + 1);
        } else {
            // wynik
            setStep(questions.length);
        }
    };


    const total = answers.reduce((a, b) => a + b, 0);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="health-modal" onClick={e => e.stopPropagation()}>
                {step < questions.length ? (
                    <>
                        <h3>{current.text}</h3>

                        {current.options.map(o => (
                            <button
                                key={o.label}
                                className="option-btn"
                                onClick={() => handleAnswer(o.score)}
                            >
                                {o.label}
                            </button>
                        ))}

                        <small>Pytanie {step + 1} / {questions.length}</small>
                    </>
                ) : (
                    <>
                        <h3>Twój wynik</h3>

                        {total <= 3 && (
                            <p>✅ Wygląda na to, że dbasz o zdrowie. Zalecana wizyta kontrolna.</p>
                        )}
                        {total > 3 && total <= 6 && (
                            <p>🟡 Warto rozważyć badania i poprawić styl życia.</p>
                        )}
                        {total > 6 && (
                            <p>🔴 Zalecana wizyta kontrolna oraz wykonanie badań kontrolnych.</p>
                        )}

                        <small>
                            Quiz ma charakter informacyjny i nie stanowi diagnozy.
                        </small>

                        <button className="btn-primary" onClick={onClose}>
                            Zamknij
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default HealthCheckModal;
