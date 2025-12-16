declare module "canvas-confetti" {
    interface Options {
        particleCount?: number;
        angle?: number;
        spread?: number;
        startVelocity?: number;
        decay?: number;
        gravity?: number;
        drift?: number;
        ticks?: number;
        origin?: { x?: number; y?: number };
        colors?: string[];
        shape?: string;
        scalar?: number;
        [key: string]: unknown; // замість any для ESLint
    }

    function confetti(opts?: Options): void;
    export = confetti;
}
