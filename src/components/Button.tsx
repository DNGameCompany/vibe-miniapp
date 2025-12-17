import { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
}

export function Button({ children, onClick }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className="
        px-6 py-3
        rounded-xl
        font-semibold
        bg-gray-700
        hover:bg-gray-600
        active:scale-95
        transition
        shadow-md
      "
        >
            {children}
        </button>
    );
}
