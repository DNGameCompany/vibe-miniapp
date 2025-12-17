"use client";
import { useEffect } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (typeof window !== "undefined" && window.Telegram?.WebApp) {
            const colorScheme = window.Telegram.WebApp.colorScheme;
            document.body.classList.toggle("dark", colorScheme === "dark");
        }
    }, []);

    return (
        <html lang="uk">
        <body className="bg-gray-50 dark:bg-gray-900">{children}</body>
        </html>
    );
}
