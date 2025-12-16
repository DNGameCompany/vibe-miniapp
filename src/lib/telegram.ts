export function getTelegramWebApp() {
    if (typeof window === 'undefined') return null;
    return window.Telegram?.WebApp ?? null;
}

export function initTelegram() {
    const tg = getTelegramWebApp();
    if (!tg) return;

    tg.ready();
    tg.expand();
}
