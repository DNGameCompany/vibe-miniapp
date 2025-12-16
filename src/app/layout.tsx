import './globals.css'; // globals.css лежить поруч у src/app

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="uk">
        <body className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        {children}
        </body>
        </html>
    );
}
