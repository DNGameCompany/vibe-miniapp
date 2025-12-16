import { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
}

export function Button({ children, onClick }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className="w-full text-center py-4 rounded-2xl bg-white text-black font-medium text-lg transition active:scale-[0.98]"
        >
            {children}
        </button>
    );
}
