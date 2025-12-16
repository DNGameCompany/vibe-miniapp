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
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-4xl font-semibold leading-tight">
          Хто ти<br />сьогодні?
        </h1>

        {!data && (
            <Button onClick={generate}>
              {loading ? 'Думаю…' : 'Отримати профайл'}
            </Button>
        )}

        {data && (
            <div className="space-y-4">
              <Card title="Вайб" text={data.vibe} />
              <Card title="Роль" text={data.role} />
              <Card title="Мем / герой" text={data.meme} />

              <Button onClick={share}>
                Поділитись
              </Button>
            </div>
        )}
      </div>
  );
}
