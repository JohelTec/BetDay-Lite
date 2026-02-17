import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserBalance } from "@/lib/data";

/**
 * Obtener el saldo actual del usuario autenticado
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const balance = await getUserBalance(session.user.email);

    return NextResponse.json({ 
      email: session.user.email,
      balance: balance 
    });
  } catch (error) {
    console.error("❌ Error al obtener saldo:", error);
    
    if (error instanceof Error && error.message.includes("no encontrado")) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch balance" },
      { status: 500 }
    );
  }
}
