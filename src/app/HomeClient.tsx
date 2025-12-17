"use client";

import dynamic from "next/dynamic";

// Динамічний імпорт без SSR — тепер дозволено, бо це Client Component
const DynamicHome = dynamic(() => import("./page.client"), {
    ssr: false,
});

export default function HomeClient() {
    return <DynamicHome />;
}