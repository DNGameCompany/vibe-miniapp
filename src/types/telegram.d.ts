export {};

declare global {
    interface Window {
        Telegram?: {
            WebApp?: TelegramWebApp;
        };
    }
}

interface TelegramWebApp {
    ready: () => void;
    expand: () => void;
    sendData?: (data: string) => void;
}
