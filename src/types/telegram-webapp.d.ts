import "@telegram-apps/sdk-react";

// Розширюємо існуючий тип Telegram.WebApp з SDK
declare global {
    interface Window {
        Telegram: {
            WebApp: Telegram.WebApp & {
                // Розширюємо initDataUnsafe правильними типами
                initDataUnsafe: {
                    user?: {
                        id: number;
                        first_name: string;
                        last_name?: string;
                        username?: string;
                        language_code?: string;
                        is_premium?: boolean;
                        allows_write_to_pm?: boolean;
                    };
                    bot_username?: string;
                    query_id?: string;
                    start_param?: string;
                    chat?: {
                        id: number;
                        type: string;
                        title?: string;
                        username?: string;
                    };
                    // Додаємо індексну сигнатуру для інших можливих полів
                    [key: string]: unknown;
                };

                // Додаємо метод, якого бракує в типах SDK
                openTelegramLink: (url: string) => void;
            };
        };
    }
}

export {};