"use client";

import { useEffect, useState } from "react";
import { useLaunchParams } from "@telegram-apps/sdk-react";

interface Question {
  id: string;
  text: string;
  category: "pair" | "friends" | "self";
}

const dailyQuestions: Question[] = [
  { id: "1", text: "Що ти найбільше цінуєш у наших стосунках?", category: "pair" },
  { id: "2", text: "Який найсмішніший спогад з друзями?", category: "friends" },
  { id: "3", text: "За що ти сьогодні вдячний собі?", category: "self" },
];

export default function Home() {
  const lp = useLaunchParams();
  const startParam = lp.startParam as string | undefined; // Правильна типізація!

  const user = lp.tgWebAppData?.user;
  const userId = user?.id?.toString() ?? "demo";
  const userName = user?.first_name || "Користувач";

  const rawWebApp = typeof window !== "undefined" ? window.Telegram?.WebApp : null;
  const webApp = rawWebApp as (typeof rawWebApp) & {
    initDataUnsafe?: { bot_username?: string };
    openTelegramLink?: (url: string) => void;
  };

  useEffect(() => {
    if (webApp) {
      webApp.ready();
      webApp.expand();
    }
  }, [webApp]);

  const today = new Date().toISOString().slice(0, 10);

  const [category, setCategory] = useState<"pair" | "friends" | "self">("pair");
  const [partnerId, setPartnerId] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [myAnswer, setMyAnswer] = useState<string>("");
  const [allAnswered, setAllAnswered] = useState<boolean>(false);

  // Автоматичне парування через deep link
  useEffect(() => {
    const setupPairing = () => {
      if (startParam && startParam.startsWith("pair_")) {
        const invitedById = startParam.replace("pair_", "");
        if (invitedById !== userId) {
          setPartnerId(invitedById);
          localStorage.setItem(`pair_${userId}`, invitedById);
          localStorage.setItem(`pair_${invitedById}`, userId);
        }
      }

      // Відновлення збереженої пари
      const savedPartner = localStorage.getItem(`pair_${userId}`);
      if (savedPartner && savedPartner !== userId) {
        setPartnerId(savedPartner);
      }
    };

    setupPairing();
  }, [startParam, userId]);

  const currentQuestion = dailyQuestions.find(q => q.category === category) ?? dailyQuestions[0];

  // Завантаження відповідей — асинхронно, щоб уникнути ESLint warning
  useEffect(() => {
    const loadData = async () => {
      const key = `answers_${today}_${currentQuestion.id}_${userId}`;
      const saved = localStorage.getItem(key);

      if (saved) {
        try {
          const data = JSON.parse(saved) as { answers: Record<string, string>; myAnswer?: string };

          // Асинхронний setState
          setTimeout(() => {
            setAnswers(data.answers ?? {});
            setMyAnswer(data.myAnswer ?? "");

            if (category === "pair" && partnerId && data.answers[userId] && data.answers[partnerId]) {
              setAllAnswered(true);
            } else if (category !== "pair" && data.myAnswer) {
              setAllAnswered(true);
            }
          }, 0);
        } catch (e) {
          console.error("Помилка localStorage", e);
        }
      }
    };

    loadData();
  }, [today, currentQuestion.id, userId, category, partnerId]);

  const submitAnswer = () => {
    if (!myAnswer.trim()) return;

    const newAnswers: Record<string, string> = { ...answers, [userId]: myAnswer };
    setAnswers(newAnswers);

    const saveData = { answers: newAnswers, myAnswer };
    localStorage.setItem(`answers_${today}_${currentQuestion.id}_${userId}`, JSON.stringify(saveData));

    if (category === "pair" && partnerId && answers[partnerId]) {
      setAllAnswered(true);
    } else if (category !== "pair") {
      setAllAnswered(true);
    }
  };

  const shareToday = () => {
    if (!webApp?.openTelegramLink) return;

    const text = `Сьогоднішнє питання в «1 Питання на День»:\n\n${currentQuestion.text}\n\nСпробуй і ти! 👉`;
    const botUsername = webApp.initDataUnsafe?.bot_username || "your_bot_username";
    const url = `https://t.me/${botUsername}/app`;

    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    webApp.openTelegramLink(shareUrl);
  };

  const invitePartner = () => {
    if (!webApp?.openTelegramLink) return;

    const botUsername = webApp.initDataUnsafe?.bot_username || "your_bot_username";
    const inviteLink = `https://t.me/${botUsername}/app?startapp=pair_${userId}`;

    const text = `${userName} запрошує тебе в «1 Питання на День» для пар! 💕\n\nЩодня одне глибоке питання — відповідайте разом.\n\nПриєднуйся:`;

    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(text)}`;
    webApp.openTelegramLink(shareUrl);
  };

  return (
      <main className="p-4 max-w-md mx-auto min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center">1 Питання на День</h1>
        <p className="mb-6 text-center text-lg">Привіт, {userName}! 👋</p>

        <div className="mb-8 bg-white rounded-xl shadow p-4">
          <label className="block font-semibold mb-3">Обери категорію:</label>
          <select
              value={category}
              onChange={(e) => setCategory(e.target.value as "pair" | "friends" | "self")}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg"
          >
            <option value="pair">Для пари 💕</option>
            <option value="friends">Для друзів 👥</option>
            <option value="self">Для себе 🌱</option>
          </select>
        </div>

        {category === "pair" && partnerId && (
            <div className="mb-6 bg-green-50 border border-green-300 rounded-xl p-4 text-center">
              <p className="text-green-800 font-medium">Ти в парі! 🎉</p>
            </div>
        )}

        {category === "pair" && !partnerId && (
            <div className="mb-8">
              <button
                  onClick={invitePartner}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 rounded-xl text-xl transition"
              >
                Запросити партнера 💌
              </button>
            </div>
        )}

        <div className="mb-8 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold text-center">{currentQuestion.text}</h2>
        </div>

        {!allAnswered ? (
            <div className="space-y-6">
          <textarea
              value={myAnswer}
              onChange={(e) => setMyAnswer(e.target.value)}
              placeholder="Напиши свою відповідь тут..."
              className="w-full border border-gray-300 rounded-xl px-5 py-4 h-40 resize-none text-lg"
          />
              <button
                  onClick={submitAnswer}
                  disabled={!myAnswer.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl text-xl transition"
              >
                Надіслати відповідь 🚀
              </button>
            </div>
        ) : (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-center">Відповіді 🎉</h3>
              {Object.entries(answers).map(([id, ans]) => (
                  <div key={id} className="bg-white rounded-xl shadow p-5">
                    <strong className="text-lg">{id === userId ? "Ти" : "Партнер"}:</strong>
                    <p className="mt-2 text-lg">{ans}</p>
                  </div>
              ))}
            </div>
        )}

        <button
            onClick={shareToday}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl text-xl mt-10 transition"
        >
          Поділитися сьогоднішнім питанням 📤
        </button>

        <p className="mt-10 text-center text-sm text-gray-600">
          MVP: пари та відповіді зберігаються локально
        </p>
      </main>
  );
}