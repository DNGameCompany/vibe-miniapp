interface TelegramUser {
    id: number;
    is_bot?: boolean;
    first_name?: string;
    last_name?: string;
    username?: string;
    language_code?: string;
}

interface TelegramWebAppInitData {
    user?: TelegramUser;
}

interface TelegramWebApp {
    ready(): void;
    expand(): void;
    openTelegramLink?(url: string): void;
    initDataUnsafe?: TelegramWebAppInitData;
}

interface Telegram {
    WebApp: TelegramWebApp;
}

interface Window {
    Telegram?: Telegram;
}
