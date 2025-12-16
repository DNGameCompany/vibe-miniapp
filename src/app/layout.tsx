import Script from "next/script";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="uk">
        <head>
            <Script
                src="https://telegram.org/js/telegram-web-app.js"
                strategy="afterInteractive"
            />
        </head>
        <body>{children}</body>
        </html>
    );
}