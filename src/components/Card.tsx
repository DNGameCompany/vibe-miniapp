interface CardProps {
    title: string;
    text: string;
}

export function Card({ title, text }: CardProps) {
    return (
        <div className="rounded-3xl bg-white/5 p-6 space-y-2">
            <p className="text-sm text-[var(--muted)] uppercase tracking-wide">
                {title}
            </p>
            <p className="text-xl leading-snug">
                {text}
            </p>
        </div>
    );
}
