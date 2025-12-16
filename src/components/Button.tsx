import { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
}

export function Button({ children, onClick }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className="px-8 py-4 font-bold text-lg rounded-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
                       text-white shadow-[0_4px_15px_rgba(255,0,150,0.4)]
                       hover:scale-105 hover:shadow-[0_6px_20px_rgba(255,0,150,0.6)]
                       active:scale-95 transition-all duration-300"
        >
            {children}
        </button>
    );
}
