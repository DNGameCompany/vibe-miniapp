import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <Script
                src="https://telegram.org/js/telegram-web-app.js"
                strategy="afterInteractive" // скрипт завантажується після рендера
            />
        </head>
        <body>{children}</body>
        </html>
    );
}
