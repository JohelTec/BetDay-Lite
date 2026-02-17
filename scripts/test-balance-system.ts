import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function testBalanceSystem() {
  console.log("\n🧪 === PRUEBA DEL SISTEMA DE GESTIÓN DE SALDO ===\n");

  try {
    // 1. Crear usuario de prueba con saldo específico
    console.log("1️⃣ Creando usuario de prueba...");
    const testEmail = "saldo-test@example.com";

    // Eliminar apuestas y usuario si existe (en orden correcto)
    await prisma.bet.deleteMany({
      where: { user: { email: testEmail } },
    });
    await prisma.user.deleteMany({
      where: { email: testEmail },
    });

    const hashedPassword = await bcrypt.hash("123456", 10);
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        name: "Usuario Prueba Saldo",
        password: hashedPassword,
        balance: 100.0, // Comenzar con $100
      },
    });

    console.log(`✅ Usuario creado: ${user.email}`);
    console.log(`   💰 Saldo inicial: $${user.balance.toFixed(2)}\n`);

    // 2. Obtener un evento
    const event = await prisma.event.findFirst();
    if (!event) {
      throw new Error("No hay eventos disponibles");
    }

    console.log(`2️⃣ Evento seleccionado:`);
    console.log(`   ${event.homeTeam} vs ${event.awayTeam}`);
    console.log(`   Cuota Local (1): ${event.oddsHome.toFixed(2)}\n`);

    // 3. Crear apuesta y verificar descuento de saldo
    console.log("3️⃣ Creando apuesta de $20...");
    const betAmount = 20.0;

    const bet = await prisma.$transaction(async (tx) => {
      const newBet = await tx.bet.create({
        data: {
          eventId: event.id,
          userId: user.id,
          selection: "1",
          odds: event.oddsHome,
          amount: betAmount,
          status: "PENDING",
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: {
          balance: {
            decrement: betAmount,
          },
        },
      });

      return newBet;
    });

    const userAfterBet = await prisma.user.findUnique({
      where: { id: user.id },
    });

    console.log(`✅ Apuesta creada: ID ${bet.id}`);
    console.log(`   💸 Monto apostado: $${bet.amount.toFixed(2)}`);
    console.log(`   💰 Saldo anterior: $${user.balance.toFixed(2)}`);
    console.log(
      `   💰 Saldo actual: $${userAfterBet?.balance.toFixed(2)}\n`
    );

    // 4. Simular apuesta ganada
    console.log("4️⃣ Simulando apuesta ganada...");
    const winnings = bet.amount * bet.odds;

    await prisma.$transaction(async (tx) => {
      await tx.bet.update({
        where: { id: bet.id },
        data: { status: "WON" },
      });

      await tx.user.update({
        where: { id: user.id },
        data: {
          balance: {
            increment: winnings,
          },
        },
      });
    });

    const userAfterWin = await prisma.user.findUnique({
      where: { id: user.id },
    });

    console.log(`✅ Apuesta ganada`);
    console.log(`   🎉 Ganancias: $${winnings.toFixed(2)}`);
    console.log(
      `   💰 Saldo antes de ganar: $${userAfterBet?.balance.toFixed(2)}`
    );
    console.log(`   💰 Saldo final: $${userAfterWin?.balance.toFixed(2)}\n`);

    // 5. Intentar apostar más del saldo disponible
    console.log("5️⃣ Probando validación de saldo insuficiente...");
    const currentBalance = userAfterWin?.balance || 0;
    const excessiveAmount = currentBalance + 50;

    console.log(`   💰 Saldo disponible: $${currentBalance.toFixed(2)}`);
    console.log(`   💸 Intentando apostar: $${excessiveAmount.toFixed(2)}`);

    try {
      await prisma.$transaction(async (tx) => {
        const userCheck = await tx.user.findUnique({
          where: { id: user.id },
        });

        if (!userCheck || userCheck.balance < excessiveAmount) {
          throw new Error(
            `Saldo insuficiente. Saldo disponible: $${userCheck?.balance.toFixed(2)}`
          );
        }

        await tx.bet.create({
          data: {
            eventId: event.id,
            userId: user.id,
            selection: "1",
            odds: event.oddsHome,
            amount: excessiveAmount,
            status: "PENDING",
          },
        });
      });

      console.log("   ❌ ERROR: No se validó el saldo insuficiente\n");
    } catch (error) {
      if (error instanceof Error && error.message.includes("Saldo insuficiente")) {
        console.log(`   ✅ Validación correcta: ${error.message}\n`);
      } else {
        throw error;
      }
    }

    // 6. Crear otra apuesta y marcarla como perdida
    console.log("6️⃣ Creando apuesta que se perderá...");
    const lostBetAmount = 10.0;

    const lostBet = await prisma.$transaction(async (tx) => {
      const newBet = await tx.bet.create({
        data: {
          eventId: event.id,
          userId: user.id,
          selection: "2",
          odds: event.oddsAway,
          amount: lostBetAmount,
          status: "PENDING",
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: {
          balance: {
            decrement: lostBetAmount,
          },
        },
      });

      return newBet;
    });

    const userAfterLostBet = await prisma.user.findUnique({
      where: { id: user.id },
    });

    console.log(`   💸 Monto apostado: $${lostBet.amount.toFixed(2)}`);
    console.log(`   💰 Saldo actual: $${userAfterLostBet?.balance.toFixed(2)}`);

    // Marcar como perdida
    await prisma.bet.update({
      where: { id: lostBet.id },
      data: { status: "LOST" },
    });

    const finalUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    console.log(`   ❌ Apuesta perdida`);
    console.log(`   💰 Saldo final: $${finalUser?.balance.toFixed(2)}\n`);

    // 7. Resumen final
    console.log("📊 === RESUMEN FINAL ===");
    console.log(`   Saldo inicial: $${user.balance.toFixed(2)}`);
    console.log(`   Saldo final: $${finalUser?.balance.toFixed(2)}`);
    console.log(
      `   Diferencia: ${finalUser && finalUser.balance >= user.balance ? "+" : ""}$${((finalUser?.balance || 0) - user.balance).toFixed(2)}\n`
    );

    // Resumen de apuestas
    const allBets = await prisma.bet.findMany({
      where: { userId: user.id },
    });

    console.log("📋 Historial de apuestas:");
    allBets.forEach((b, idx) => {
      const statusEmoji = b.status === "WON" ? "✅" : b.status === "LOST" ? "❌" : "⏳";
      console.log(
        `   ${statusEmoji} Apuesta ${idx + 1}: $${b.amount.toFixed(2)} @ ${b.odds.toFixed(2)} - ${b.status}`
      );
    });

    console.log("\n✅ === PRUEBA COMPLETADA EXITOSAMENTE ===\n");
  } catch (error) {
    console.error("\n❌ Error en la prueba:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

testBalanceSystem();
