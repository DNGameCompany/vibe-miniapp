import "@telegram-apps/sdk-react";

declare global {
    interface Window {
        Telegram: {
            WebApp: Telegram.WebApp & {
                initDataUnsafe: {
                    user?: {
                        id: number;
                        first_name: string;
                        last_name?: string;
                        username?: string;
                        language_code?: string;
                    };
                    bot_username?: string;
                    [key: string]: any;
                };
                openTelegramLink: (url: string) => void;
                ready: () => void;
            };
        };
    }
}

export {};