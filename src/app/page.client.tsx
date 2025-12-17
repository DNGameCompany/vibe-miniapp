"use client";
import { useEffect, useState } from "react";
import { useLaunchParams } from "@telegram-apps/sdk-react";

interface Question {
    id: string;
    text: string;
    category: "pair" | "friends" | "self";
}

// Визначаємо тип для Telegram WebApp
interface TelegramWebApp {
    ready: () => void;
    expand: () => void;
    openTelegramLink?: (url: string) => void;
    colorScheme?: "light" | "dark";
    initDataUnsafe?: { bot_username?: string };
}

const dailyQuestions: Question[] = [
    { id: "1", text: "Що ти найбільше цінуєш у наших стосунках?", category: "pair" },
    { id: "2", text: "Який найсмішніший спогад з друзями?", category: "friends" },
    { id: "3", text: "За що ти сьогодні вдячний собі?", category: "self" },
];

export default function Home() {
    const lp = useLaunchParams();
    const startParam = lp.startParam as string | undefined;

    const user = lp.tgWebAppData?.user;
    const userId = user?.id?.toString() ?? "demo";
    const userName = user?.first_name || "Користувач";

    const [category, setCategory] = useState<"pair" | "friends" | "self">("pair");
    const [partnerId, setPartnerId] = useState<string>("");
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [myAnswer, setMyAnswer] = useState<string>("");
    const [allAnswered, setAllAnswered] = useState<boolean>(false);
    const [tgWebApp, setTgWebApp] = useState<TelegramWebApp | null>(null);

    const today = new Date().toISOString().slice(0, 10);
    const currentQuestion = dailyQuestions.find((q) => q.category === category) ?? dailyQuestions[0];

    // Ініціалізація Telegram WebApp
    useEffect(() => {
        const timer = setTimeout(() => {
            const savedPartner = localStorage.getItem(`pair_${userId}`);

            if (startParam && startParam.startsWith("pair_")) {
                const invitedById = startParam.replace("pair_", "");
                if (invitedById !== userId) {
                    localStorage.setItem(`pair_${userId}`, invitedById);
                    localStorage.setItem(`pair_${invitedById}`, userId);
                    setPartnerId(invitedById); // Тут ESLint вже не буде лаяти
                    return;
                }
            }

            if (savedPartner && savedPartner !== userId) {
                setPartnerId(savedPartner); // І тут теж
            }
        }, 0);

        return () => clearTimeout(timer);
    }, [startParam, userId]);

    // Логіка пари
    useEffect(() => {
        const timer = setTimeout(() => {
            const savedPartner = localStorage.getItem(`pair_${userId}`);

            if (startParam && startParam.startsWith("pair_")) {
                const invitedById = startParam.replace("pair_", "");
                if (invitedById !== userId) {
                    localStorage.setItem(`pair_${userId}`, invitedById);
                    localStorage.setItem(`pair_${invitedById}`, userId);
                    setPartnerId(invitedById);
                    return;
                }
            }

            if (savedPartner && savedPartner !== userId) {
                setPartnerId(savedPartner);
            }
        }, 0);

        return () => clearTimeout(timer);
    }, [startParam, userId]);

    // Завантаження відповідей
    useEffect(() => {
        const timer = setTimeout(() => {
            const key = `answers_${today}_${currentQuestion.id}_${userId}`;
            const saved = localStorage.getItem(key);
            if (!saved) return;

            try {
                const data = JSON.parse(saved) as { answers: Record<string, string>; myAnswer?: string };
                setAnswers(data.answers ?? {});
                setMyAnswer(data.myAnswer ?? "");

                const answered = category === "pair" && partnerId
                    ? !!(data.answers?.[userId] && data.answers?.[partnerId])
                    : !!data.myAnswer;
                setAllAnswered(answered);
            } catch (e) {
                console.error("Помилка localStorage", e);
            }
        }, 0);

        return () => clearTimeout(timer);
    }, [today, currentQuestion.id, userId, category, partnerId]);

    const submitAnswer = () => {
        if (!myAnswer.trim()) return;
        const newAnswers: Record<string, string> = { ...answers, [userId]: myAnswer };
        setAnswers(newAnswers);
        localStorage.setItem(
            `answers_${today}_${currentQuestion.id}_${userId}`,
            JSON.stringify({ answers: newAnswers, myAnswer })
        );

        const answered = category === "pair" && partnerId
            ? !!(newAnswers[userId] && newAnswers[partnerId])
            : !!myAnswer;
        setAllAnswered(answered);
    };

    const shareLink = (link: string) => {
        if (tgWebApp?.openTelegramLink) {
            tgWebApp.openTelegramLink(link);
        } else {
            window.open(link, "_blank"); // fallback для браузера
        }
    };

    const shareToday = () => {
        const botUsername = tgWebApp?.initDataUnsafe?.bot_username || "@vibeminiapp_bot";
        const url = `https://t.me/${botUsername}/app`;
        const text = `Сьогоднішнє питання в «1 Питання на День»:\n\n${currentQuestion.text}\n\nСпробуй і ти! 👉`;
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        shareLink(shareUrl);
    };

    const invitePartner = () => {
        const botUsername = tgWebApp?.initDataUnsafe?.bot_username || "@vibeminiapp_bot";
        const inviteLink = `https://t.me/${botUsername}/app?startapp=pair_${userId}`;
        const text = `${userName} запрошує тебе грати в «1 Питання на День» для пар! 💕`;
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(text)}`;
        shareLink(shareUrl);
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
            <div className="max-w-md mx-auto">
                <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2">
                    1 Питання на День
                </h1>
                <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-8">
                    Привіт, {userName}! 👋
                </p>

                {/* Категорія */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
                    <label className="block text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                        Обери категорію
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as "pair" | "friends" | "self")}
                        className="w-full px-5 py-4 text-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-700 focus:border-purple-500 transition text-gray-800 dark:text-gray-200"
                    >
                        <option value="pair">Для пари 💕</option>
                        <option value="friends">Для друзів 👥</option>
                        <option value="self">Для себе 🌱</option>
                    </select>
                </div>

                {/* Статус пари */}
                {category === "pair" && partnerId && (
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-5 text-white text-center mb-8 shadow-lg">
                        <p className="text-xl font-bold">Ти в парі! 🎉</p>
                        <p className="text-sm opacity-90 mt-1">Чекаємо відповідь партнера...</p>
                    </div>
                )}

                {category === "pair" && !partnerId && (
                    <button
                        type="button"
                        onClick={invitePartner}
                        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-5 rounded-2xl text-xl shadow-lg transition transform hover:scale-105 mb-8"
                    >
                        Запросити партнера 💌
                    </button>
                )}

                {/* Питання */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 leading-relaxed">
                        {currentQuestion.text}
                    </h2>
                </div>

                {/* Відповідь */}
                {!allAnswered ? (
                    <div className="space-y-6">
            <textarea
                value={myAnswer}
                onChange={(e) => setMyAnswer(e.target.value)}
                placeholder="Напиши свою відповідь... ❤️"
                className="w-full px-6 py-5 text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl resize-none h-48 focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-700 focus:border-purple-500 transition shadow-inner text-gray-800 dark:text-gray-200"
            />
                        <button
                            type="button"
                            onClick={submitAnswer}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-5 rounded-2xl text-xl shadow-lg transition transform hover:scale-105"
                        >
                            Надіслати відповідь 🚀
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <h3 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                            Відповіді 🎉
                        </h3>
                        {Object.entries(answers).map(([id, ans]) => (
                            <div
                                key={id}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-l-8 border-purple-500"
                            >
                                <strong className="text-xl text-purple-600 dark:text-purple-400">
                                    {id === userId ? "Ти" : "Партнер"}:
                                </strong>
                                <p className="mt-3 text-lg text-gray-800 dark:text-gray-200 leading-relaxed">{ans}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Шаринг */}
                <button
                    type="button"
                    onClick={shareToday}
                    className="w-full mt-12 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-5 rounded-2xl text-xl shadow-lg transition transform hover:scale-105"
                >
                    Поділитися питанням з друзями 📤
                </button>

                <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    MVP • Відповіді зберігаються локально
                </p>
            </div>
        </main>
    );
}
