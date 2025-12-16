"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

type Vibe = {
  archetype: string;
  description: string;
  strength: string;
  advice: string;
  risk: string;
  compatibility: string;
};

export default function Home() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [vibe, setVibe] = useState<Vibe | null>(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tg: TelegramWebApp | null =
      typeof window !== "undefined" ? window.Telegram?.WebApp ?? null : null;

  useEffect(() => {
    if (!tg) return;

    tg.ready();
    tg.expand();

    if (tg.initDataUnsafe?.user) {
      setUser(tg.initDataUnsafe.user);
    }

    // Particles background
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: { x: number; y: number; size: number; speedX: number; speedY: number }[] = [];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: Math.random() * 0.6 - 0.3,
        speedY: Math.random() * 0.6 - 0.3,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.fillStyle = "rgba(255, 215, 0, 0.9)";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#ffd700";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [tg]);

  const getVibe = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", { method: "POST" });
      const data: Vibe = await res.json();
      setVibe(data);

      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#ffd700", "#ff6b6b", "#9d4edd", "#5e17eb"],
        ticks: 200,
        gravity: 0.8,
        decay: 0.94,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const shareVibe = () => {
    if (!vibe || !tg) return;

    const text = `Мій містичний вайб сьогодні ✨\n\n🎴 *${vibe.archetype}*\n📜 ${vibe.description}\n\n💫 *Сила:* ${vibe.strength}\n🧿 *Порада:* ${vibe.advice}\n⚡ *Ризик:* ${vibe.risk}\n❤️ *Сумісність:* ${vibe.compatibility}\n\nДізнайся свій вайб 👉 t.me/your_vibe_bot`;

    tg.openTelegramLink?.(`https://t.me/share/url?url=&text=${encodeURIComponent(text)}`);
  };

  return (
      <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-purple-950 via-black to-indigo-950 text-white">
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-70" />

        <div className="absolute w-96 h-96 rounded-full bg-purple-700/40 blur-3xl top-[-100px] left-[-100px] animate-pulse" />
        <div className="absolute w-80 h-80 rounded-full bg-yellow-500/30 blur-3xl bottom-[-80px] right-[-80px] animate-pulse delay-1000" />

        <motion.h1
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-5xl sm:text-6xl font-bold text-center mb-10 tracking-wider drop-shadow-2xl"
            style={{ textShadow: "0 0 30px rgba(255,215,0,0.6)" }}
        >
          Твій Містичний Вайб ✨
        </motion.h1>

        {user && (
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xl mb-12 opacity-90"
            >
              Привіт, <span className="font-bold text-yellow-300">@{user.username ?? "мандрівнику"}</span>
            </motion.p>
        )}

        <motion.button
            whileHover={{ scale: 1.12, boxShadow: "0 0 40px rgba(255,215,0,0.7)" }}
            whileTap={{ scale: 0.95 }}
            onClick={getVibe}
            disabled={loading}
            className="relative px-16 py-6 rounded-full text-xl font-bold bg-gradient-to-r from-purple-800/80 to-indigo-800/80 backdrop-blur-md border border-yellow-500/40 shadow-2xl overflow-hidden z-10"
        >
        <span className="relative z-10 drop-shadow-lg">
          {loading ? "Відкриваємо космос..." : "Отримати вайб"}
        </span>
          <div className="absolute inset-0 bg-yellow-500/10 animate-pulse" />
        </motion.button>

        <AnimatePresence>
          {vibe && (
              <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 1, type: "spring", stiffness: 200 }}
                  className="mt-16 w-full max-w-lg px-6"
              >
                <div
                    className="p-8 rounded-3xl"
                    style={{
                      background: "rgba(255, 255, 255, 0.06)",
                      backdropFilter: "blur(24px)",
                      border: "1px solid rgba(255, 215, 0, 0.35)",
                      boxShadow:
                          "0 10px 40px rgba(157, 78, 221, 0.5), inset 0 0 30px rgba(255, 215, 0, 0.15)",
                    }}
                >
                  <div className="text-center mb-8">
                    <motion.div
                        animate={{ rotate: [0, 8, -8, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="text-7xl mb-4"
                    >
                      🎴
                    </motion.div>
                    <h2 className="text-4xl font-bold text-yellow-300 drop-shadow-lg">
                      {vibe.archetype}
                    </h2>
                  </div>

                  <p className="text-lg leading-relaxed italic mb-8 opacity-95 text-center">
                    {vibe.description}
                  </p>

                  <div className="space-y-5 text-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">💫</span>
                      <div><strong>Сила дня:</strong> {vibe.strength}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">🧿</span>
                      <div><strong>Порада:</strong> {vibe.advice}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">⚡</span>
                      <div><strong>Ризик:</strong> {vibe.risk}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">❤️</span>
                      <div><strong>Сумісність:</strong> {vibe.compatibility}</div>
                    </div>
                  </div>

                  <motion.button
                      whileHover={{ scale: 1.06, boxShadow: "0 0 30px rgba(255,215,0,0.9)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={shareVibe}
                      className="mt-10 w-full py-5 rounded-full bg-gradient-to-r from-yellow-600 to-purple-700 font-bold text-xl shadow-2xl"
                  >
                    Поділитися магією ✨
                  </motion.button>
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      </main>
  );
}
