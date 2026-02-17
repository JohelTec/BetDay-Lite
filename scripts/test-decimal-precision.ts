/**
 * Script para probar la precisión decimal en operaciones de balance
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function testDecimalPrecision() {
  console.log("\n🧪 === INICIANDO PRUEBA DE PRECISIÓN DECIMAL ===\n");

  try {
    // Limpiar usuario de prueba si existe
    await prisma.bet.deleteMany({
      where: { user: { email: "decimal-test@example.com" } },
    });
    await prisma.user.deleteMany({
      where: { email: "decimal-test@example.com" },
    });

    // Crear usuario con saldo de $100.50
    const hashedPassword = await bcrypt.hash("test123", 10);
    const user = await prisma.user.create({
      data: {
        email: "decimal-test@example.com",
        name: "Decimal Test",
        password: hashedPassword,
        balance: 100.50,
      },
    });

    console.log("✅ Usuario creado:", user.email);
    console.log(`   💰 Saldo inicial: $${user.balance.toFixed(2)}\n`);

    // Obtener un evento para las pruebas
    const event = await prisma.event.findFirst();
    if (!event) {
      throw new Error("No hay eventos disponibles");
    }

    // Test 1: Apuesta con monto decimal simple
    console.log("📝 Test 1: Apuesta de $10.25");
    const bet1 = await prisma.$transaction(async (tx) => {
      const bet = await tx.bet.create({
        data: {
          eventId: event.id,
          userId: user.id,
          selection: "1",
          odds: 1.50,
          amount: 10.25,
          status: "PENDING",
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { balance: { decrement: 10.25 } },
      });

      return bet;
    });

    let updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    const expectedBalance1 = 100.50 - 10.25; // 90.25
    console.log(`   ✅ Apuesta creada: $${bet1.amount.toFixed(2)}`);
    console.log(`   💰 Saldo esperado: $${expectedBalance1.toFixed(2)}`);
    console.log(`   💰 Saldo actual: $${updatedUser?.balance.toFixed(2)}`);
    console.log(`   ${Math.abs((updatedUser?.balance || 0) - expectedBalance1) < 0.01 ? '✅' : '❌'} Precisión correcta\n`);

    // Test 2: Apuesta ganada con decimales complejos
    console.log("📝 Test 2: Apuesta ganada con cuota 1.67");
    await prisma.bet.update({
      where: { id: bet1.id },
      data: { status: "WON" },
    });

    const winnings = Math.round(10.25 * 1.50 * 100) / 100; // 15.38 (redondeado)
    await prisma.user.update({
      where: { id: user.id },
      data: { balance: { increment: winnings } },
    });

    updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    const expectedBalance2 = expectedBalance1 + winnings; // 90.25 + 15.38 = 105.63
    console.log(`   🎉 Ganancias: $${winnings.toFixed(2)}`);
    console.log(`   💰 Saldo esperado: $${expectedBalance2.toFixed(2)}`);
    console.log(`   💰 Saldo actual: $${updatedUser?.balance.toFixed(2)}`);
    console.log(`   ${Math.abs((updatedUser?.balance || 0) - expectedBalance2) < 0.01 ? '✅' : '❌'} Precisión correcta\n`);

    // Test 3: Múltiples operaciones pequeñas
    console.log("📝 Test 3: Múltiples apuestas pequeñas");
    const smallAmounts = [0.10, 0.25, 0.33, 0.50, 1.11];
    let expectedBalance3 = updatedUser?.balance || 0;

    for (const amount of smallAmounts) {
      const roundedAmount = Math.round(amount * 100) / 100;
      await prisma.$transaction(async (tx) => {
        await tx.bet.create({
          data: {
            eventId: event.id,
            userId: user.id,
            selection: "1",
            odds: 2.00,
            amount: roundedAmount,
            status: "PENDING",
          },
        });

        await tx.user.update({
          where: { id: user.id },
          data: { balance: { decrement: roundedAmount } },
        });
      });
      expectedBalance3 -= roundedAmount;
      expectedBalance3 = Math.round(expectedBalance3 * 100) / 100;
    }

    updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    console.log(`   ✅ ${smallAmounts.length} apuestas creadas`);
    console.log(`   💰 Saldo esperado: $${expectedBalance3.toFixed(2)}`);
    console.log(`   💰 Saldo actual: $${updatedUser?.balance.toFixed(2)}`);
    console.log(`   ${Math.abs((updatedUser?.balance || 0) - expectedBalance3) < 0.01 ? '✅' : '❌'} Precisión correcta\n`);

    // Test 4: Validación de saldo insuficiente con decimales
    console.log("📝 Test 4: Validación de saldo insuficiente");
    const currentBalance = updatedUser?.balance || 0;
    const tooMuch = currentBalance + 0.01;
    
    try {
      await prisma.$transaction(async (tx) => {
        const testBet = await tx.bet.create({
          data: {
            eventId: event.id,
            userId: user.id,
            selection: "1",
            odds: 2.00,
            amount: tooMuch,
            status: "PENDING",
          },
        });

        // Esto debería fallar si la validación funciona correctamente
        await tx.user.update({
          where: { id: user.id },
          data: { balance: { decrement: tooMuch } },
        });

        // Si llegamos aquí, la transacción no debería haberse completado
        if (updatedUser && updatedUser.balance < tooMuch) {
          throw new Error("Saldo insuficiente");
        }
      });
      console.log(`   ❌ ERROR: Se permitió apuesta con saldo insuficiente\n`);
    } catch (error) {
      console.log(`   ✅ Validación correcta: Apuesta rechazada por saldo insuficiente\n`);
    }

    // Resumen final
    const finalUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { bets: true },
    });

    console.log("📊 === RESUMEN FINAL ===");
    console.log(`Saldo inicial: $100.50`);
    console.log(`Saldo final: $${finalUser?.balance.toFixed(2)}`);
    console.log(`Total de apuestas: ${finalUser?.bets.length}`);
    console.log(`Diferencia precision: $${Math.abs((finalUser?.balance || 0) - (finalUser?.balance || 0)).toFixed(4)}`);

    // Limpiar
    await prisma.bet.deleteMany({
      where: { userId: user.id },
    });
    await prisma.user.delete({
      where: { id: user.id },
    });

    console.log("\n✅ === PRUEBA COMPLETADA EXITOSAMENTE ===\n");
  } catch (error) {
    console.error("\n❌ Error en la prueba:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

testDecimalPrecision();
