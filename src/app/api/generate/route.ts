import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json({
        archetype: "Стратег дня",
        strength: "Вмієш бачити суть і структуру",
        risk: "Можеш все ускладнити"
    });
}