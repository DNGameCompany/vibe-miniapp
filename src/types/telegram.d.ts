export {};

declare global {
    interface Window {
        Telegram?: {
            WebApp: TelegramWebApp;
        };
    }

    interface TelegramWebApp {
        ready(): void;
        expand(): void;
        initDataUnsafe?: {
            user?: TelegramUser;
        };
    }

    interface TelegramUser {
        id: number;
        username?: string;
        first_name?: string;
        last_name?: string;
    }
}
