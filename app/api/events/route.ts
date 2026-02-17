import { NextResponse } from "next/server";
import { getEvents } from "@/lib/data";

export async function GET() {
  try {
    const events = await getEvents();
    return NextResponse.json(events);
  } catch (error) {
    console.error("❌ Error al obtener eventos:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
