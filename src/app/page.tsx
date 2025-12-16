"use client";

import { useState, useEffect } from "react";

type Vibe = {
  archetype: string;
  strength: string;
  risk: string;
};

export default function Home() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [vibe, setVibe] = useState<Vibe | null>(null);
  const [loading, setLoading] = useState(false);

  // Lazy init Telegram user після першого рендера
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;
    tg.ready();
    tg.expand();
    if (tg.initDataUnsafe?.user) setUser(tg.initDataUnsafe.user);
  }, []);

  const getVibe = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", { method: "POST" });
      const data: Vibe = await res.json();
      setVibe(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const shareVibe = () => {
    if (!vibe) return;
    const text = `Мій вайб сьогодні:\n🎭 ${vibe.archetype}\n💪 ${vibe.strength}\n⚠️ ${vibe.risk}\nХочеш свій? 👉 t.me/your_bot`;
    window.Telegram?.WebApp?.openTelegramLink?.(
        `https://t.me/share/url?url=&text=${encodeURIComponent(text)}`
    );
  };

  return (
      <main
          className="min-h-screen flex flex-col justify-center items-center p-6 font-sans relative overflow-hidden"
          style={{
            background:
                "radial-gradient(circle at 30% 30%, #7f5af0, #0ea5e9 70%)",
          }}
      >
        {/* Абстрактні форми на фоні */}
        <div className="absolute w-[400px] h-[400px] bg-pink-300/30 rounded-full top-[-100px] left-[-100px] blur-3xl animate-fade-in-slow"></div>
        <div className="absolute w-[300px] h-[300px] bg-yellow-300/20 rounded-full bottom-[-80px] right-[-50px] blur-2xl animate-fade-in-slow"></div>

        {/* Заголовок */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 text-center drop-shadow-lg animate-fade-in">
          Твій Вайб Сьогодні
        </h1>

        {/* Привітання користувача */}
        {user && (
            <p className="text-center text-white/80 text-sm sm:text-base mb-6 animate-fade-in">
              Привіт, <span className="font-medium">@{user.username ?? "користувач"}</span>!
            </p>
        )}

        {/* Кнопка генерації */}
        <button
            onClick={getVibe}
            disabled={loading}
            className="relative px-8 py-3 rounded-3xl bg-white/20 backdrop-blur-md text-white font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition transform mb-6"
        >
          {loading ? "Генеруємо..." : "Отримати вайб"}
        </button>

        {/* Карточка результату */}
        {vibe && (
            <div className="mt-6 w-full sm:w-80 p-6 bg-white/20 backdrop-blur-lg rounded-3xl border border-white/30 shadow-2xl space-y-4 text-white animate-slide-up transform transition-all duration-500 hover:scale-105">
              <div className="flex items-center gap-3 text-xl font-semibold">
                <span>🎭</span> Архетип: {vibe.archetype}
              </div>
              <div className="flex items-center gap-3">
                <span>💪</span> Сильна сторона: {vibe.strength}
              </div>
              <div className="flex items-center gap-3">
                <span>⚠️</span> Ризик дня: {vibe.risk}
              </div>

              <button
                  onClick={shareVibe}
                  className="w-full py-2 rounded-2xl bg-white/25 backdrop-blur-md hover:bg-white/40 text-white font-semibold shadow-inner transition transform hover:-translate-y-1 mt-4"
              >
                Поділитись у чат
              </button>
            </div>
        )}
      </main>
  );
}
