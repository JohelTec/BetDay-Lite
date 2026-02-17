import { NextRequest, NextResponse } from "next/server";
import { getBetById, updateBetStatus } from "@/lib/data";
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

/**
 * Actualizar el estado de una apuesta (WON, LOST)
 * Solo se pueden actualizar apuestas PENDING
 */
export async function PATCH(
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
    const body = await request.json();
    const { status } = body;

    if (!status || !["WON", "LOST", "PENDING"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be WON, LOST, or PENDING" },
        { status: 400 }
      );
    }

    // Verificar que la apuesta pertenece al usuario
    const existingBet = await getBetById(id);
    if (!existingBet) {
      return NextResponse.json(
        { error: "Bet not found" },
        { status: 404 }
      );
    }

    if (existingBet.userId !== session.user.email) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const updatedBet = await updateBetStatus(id, status);

    console.log("✅ Apuesta actualizada:", {
      betId: updatedBet?.id,
      nuevoEstado: status,
      usuario: session.user.email,
    });

    return NextResponse.json(updatedBet);
  } catch (error) {
    console.error("❌ Error al actualizar apuesta:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("ya fue resuelta")) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      if (error.message.includes("no encontrada")) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to update bet" },
      { status: 500 }
    );
  }
}
