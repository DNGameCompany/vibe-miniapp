import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="uk">
        <body className="min-h-screen flex items-center justify-center px-5">
        {children}
        </body>
        </html>
    );
}
