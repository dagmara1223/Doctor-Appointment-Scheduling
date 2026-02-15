type Props = {
    className?: string;
    onClick?: () => void;
    children?: React.ReactNode;
    title?: string;
};

const TimeSlot = ({ className, onClick, children, title }: Props) => {
    return (
        <div className={`calendar-slot ${className ?? ""}`} onClick={onClick} title={title}>
            {children}
        </div>
    );
};

export default TimeSlot;
