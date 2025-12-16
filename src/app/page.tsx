'use client';

import { useEffect, useState } from 'react';
import { initTelegram, getTelegramWebApp } from '@/lib/telegram';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

interface Profile {
  vibe: string;
  role: string;
  meme: string;
}

export default function Home() {
  const [data, setData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initTelegram();
  }, []);

  async function generate() {
    setLoading(true);
    const res = await fetch('/api/generate', { method: 'POST' });
    const json: Profile = await res.json();
    setData(json);
    setLoading(false);
  }

  function share() {
    const tg = getTelegramWebApp();
    if (!tg || !data) return;
    tg.sendData?.(
        `Сьогодні я — ${data.vibe}\n${data.role}\n${data.meme}`
    );
  }

  return (
      <div className="w-full max-w-md p-6 space-y-6 bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 rounded-3xl shadow-2xl">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 text-center drop-shadow-lg">
          Хто ти<br />сьогодні?
        </h1>

        {!data && (
            <div className="flex justify-center">
              <Button onClick={generate}>
                {loading ? 'Думаю…' : 'Отримати профайл'}
              </Button>
            </div>
        )}

        {data && (
            <div className="space-y-4 animate-fadeIn">
              <Card title="Вайб" text={data.vibe} />
              <Card title="Роль" text={data.role} />
              <Card title="Мем / герой" text={data.meme} />

              <div className="flex justify-center">
                <Button onClick={share}>
                  Поділитись
                </Button>
              </div>
            </div>
        )}
      </div>
  );
}
