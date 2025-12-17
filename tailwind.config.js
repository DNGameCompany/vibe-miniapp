/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Додаємо підтримку Telegram теми (опціонально)
                tg: {
                    bg: "var(--tg-theme-bg-color)",
                    text: "var(--tg-theme-text-color)",
                    hint: "var(--tg-theme-hint-color)",
                    link: "var(--tg-theme-link-color)",
                    button: "var(--tg-theme-button-color)",
                    buttonText: "var(--tg-theme-button-text-color)",
                },
            },
        },
    },
    plugins: [],
};