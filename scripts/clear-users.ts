import { prisma } from "../src/lib/prisma";

async function clearUsers() {
  try {
    // Delete all bets first (due to foreign key constraint)
    const deletedBets = await prisma.bet.deleteMany({});
    console.log(`✅ Eliminadas ${deletedBets.count} apuestas`);

    // Delete all users
    const deletedUsers = await prisma.user.deleteMany({});
    console.log(`✅ Eliminados ${deletedUsers.count} usuarios`);

    console.log("\n🎉 Base de datos limpiada exitosamente!");
    console.log("Ahora puedes registrar nuevos usuarios desde la página de registro.");
  } catch (error) {
    console.error("❌ Error al limpiar la base de datos:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearUsers();
