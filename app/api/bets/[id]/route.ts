import { NextRequest, NextResponse } from "next/server";
import { getBetById } from "@/lib/data";
import { auth } from "@/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const bet = await getBetById(id);

    if (!bet) {
      return NextResponse.json(
        { error: "Bet not found" },
        { status: 404 }
      );
    }

    if (bet.userId !== session.user.email) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json(bet);
  } catch (error) {
    console.error("❌ Error al obtener apuesta:", error);
    return NextResponse.json(
      { error: "Failed to fetch bet" },
      { status: 500 }
    );
  }
}
