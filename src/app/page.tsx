"use client";

import { useState } from "react";

type Vibe = {
  archetype: string;
  strength: string;
  risk: string;
};

function getTelegramUser(): TelegramUser | null {
  if (typeof window === "undefined") return null;
  if (!window.Telegram?.WebApp) return null;

  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();

  return tg.initDataUnsafe?.user ?? null;
}

export default function Home() {
  const [user] = useState<TelegramUser | null>(() => getTelegramUser());
  const [vibe, setVibe] = useState<Vibe | null>(null);
  const [loading, setLoading] = useState(false);

  const getVibe = async () => {
    setLoading(true);

    const res = await fetch("/api/generate", {
      method: "POST",
    });

    const data: Vibe = await res.json();
    setVibe(data);

    setLoading(false);
  };

  return (
      <main className="p-6 space-y-4">
        <h1 className="text-xl font-bold">Mini App</h1>

        {user && (
            <div className="text-sm opacity-70">
              @{user.username ?? "no-username"} (id: {user.id})
            </div>
        )}

        <button
            onClick={getVibe}
            className="bg-black text-white px-4 py-2 rounded"
            disabled={loading}
        >
          {loading ? "Генеруємо..." : "Отримати вайб"}
        </button>

        {vibe && (
            <div className="border p-4 rounded space-y-2">
              <div>
                <strong>Архетип:</strong> {vibe.archetype}
              </div>
              <div>
                <strong>Сильна сторона:</strong> {vibe.strength}
              </div>
              <div>
                <strong>Ризик:</strong> {vibe.risk}
              </div>
            </div>
        )}
      </main>
  );
}
