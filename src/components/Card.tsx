interface Card {
    title: string;
    text: string;
}

export function Card({ title, text }: Card) {
    return (
        <div className="p-4 bg-gray-700 border border-gray-600 rounded-xl shadow-sm">
            <h2 className="font-semibold text-gray-200">{title}</h2>
            <p className="mt-1 text-gray-300">{text}</p>
        </div>
    );
}
