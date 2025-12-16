"use client";

import { useState } from "react";

type Vibe = {
  archetype: string;
  strength: string;
  risk: string;
};

export default function Home() {
  const [user] = useState<TelegramUser | null>(() => {
    if (typeof window === "undefined") return null;
    const tg = window.Telegram?.WebApp;
    if (!tg) return null;
    tg.ready();
    tg.expand();
    return tg.initDataUnsafe?.user ?? null;
  });

  const [vibe, setVibe] = useState<Vibe | null>(null);
  const [loading, setLoading] = useState(false);

  const getVibe = async () => {
    setLoading(true);
    const res = await fetch("/api/generate", { method: "POST" });
    const data: Vibe = await res.json();
    setVibe(data);
    setLoading(false);
  };

  const shareVibe = () => {
    if (!vibe) return;
    const text = `Мій вайб сьогодні:\n🎭 ${vibe.archetype}\n💪 ${vibe.strength}\n⚠️ ${vibe.risk}\nХочеш свій? 👉 t.me/your_bot`;
    window.Telegram?.WebApp?.openTelegramLink?.(
        `https://t.me/share/url?url=&text=${encodeURIComponent(text)}`
    );
  };

  return (
      <main className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-b from-purple-100 via-indigo-50 to-pink-50 font-sans">

        {/* Заголовок */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-indigo-700 mb-6 animate-fade-in">
          Твій Вайб Сьогодні
        </h1>

        {/* Привітання користувача */}
        {user && (
            <p className="text-center text-gray-600 text-sm sm:text-base mb-4 animate-fade-in">
              Привіт, <span className="font-medium">@{user.username ?? "користувач"}</span>!
            </p>
        )}

        {/* Кнопка отримати вайб */}
        <button
            onClick={getVibe}
            disabled={loading}
            className="w-full sm:w-64 bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 mb-6 font-semibold"
        >
          {loading ? "Генеруємо..." : "Отримати вайб"}
        </button>

        {/* Карточка з результатом */}
        {vibe && (
            <div className="w-full sm:w-80 bg-white p-6 rounded-3xl shadow-2xl border border-gray-200 space-y-4 animate-fade-in transform transition-all duration-500 hover:scale-105">

              <div className="flex items-center gap-2 text-lg font-semibold">
                <span>🎭</span> Архетип: <span className="text-indigo-600">{vibe.archetype}</span>
              </div>

              <div className="flex items-center gap-2 text-base">
                <span>💪</span> Сильна сторона: {vibe.strength}
              </div>

              <div className="flex items-center gap-2 text-base">
                <span>⚠️</span> Ризик дня: {vibe.risk}
              </div>

              <button
                  onClick={shareVibe}
                  className="w-full bg-indigo-500 text-white py-2 rounded-2xl shadow hover:bg-indigo-600 transition transform hover:-translate-y-1 font-semibold mt-4"
              >
                Поділитись у чат
              </button>
            </div>
        )}
      </main>
  );
}
