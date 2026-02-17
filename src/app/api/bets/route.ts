import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createBet, getBetsByUserId } from "@/lib/data";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { eventId, selection, amount } = body;

    if (!eventId || !selection || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const bet = await createBet(eventId, session.user.email, selection, amount);

    if (!bet) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    console.log("✅ Apuesta creada:", {
      betId: bet.id,
      userId: bet.userId,
      event: `${bet.event.homeTeam} vs ${bet.event.awayTeam}`,
      selection: bet.selection,
      odds: bet.odds,
      status: bet.status
    });

    return NextResponse.json(bet, { status: 201 });
  } catch (error) {
    console.error("❌ Error al crear apuesta:", error);
    return NextResponse.json(
      { error: "Failed to create bet" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const bets = await getBetsByUserId(session.user.email);
    
    console.log(`📊 Obteniendo apuestas para ${session.user.email}:`, bets.length, "apuestas encontradas");
    
    return NextResponse.json(bets);
  } catch (error) {
    console.error("❌ Error al obtener apuestas:", error);
    return NextResponse.json(
      { error: "Failed to fetch bets" },
      { status: 500 }
    );
  }
}
