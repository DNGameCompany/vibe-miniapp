interface CardProps {
    title: string;
    text: string;
}

export function Card({ title, text }: CardProps) {
    const colors = {
        "Вайб": "from-yellow-400 to-orange-500",
        "Роль": "from-green-400 to-teal-500",
        "Мем / герой": "from-purple-400 to-pink-500",
    };

    const gradient = colors[title as keyof typeof colors] || "from-gray-400 to-gray-600";

    return (
        <div className={`p-6 rounded-2xl bg-gradient-to-r ${gradient} shadow-lg transform hover:scale-105 transition-all duration-300`}>
            <h2 className="text-2xl font-extrabold text-white mb-2 drop-shadow-lg">{title}</h2>
            <p className="text-white/90 text-lg">{text}</p>
        </div>
    );
}
