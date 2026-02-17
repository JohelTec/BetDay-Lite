import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function createTestUser() {
  try {
    // Create a test user
    const hashedPassword = await bcrypt.hash("123456", 10);
    
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        name: "Usuario de Prueba",
        password: hashedPassword,
        balance: 1000.0,
      },
    });

    console.log("✅ Usuario de prueba creado exitosamente!");
    console.log("\n📧 Email: test@example.com");
    console.log("🔑 Contraseña: 123456");
    console.log(`💰 Saldo: $${user.balance}`);
    console.log(`\n🆔 ID: ${user.id}`);
    console.log("📅 Creado: " + user.createdAt.toLocaleString());
    
    console.log("\n✨ Puedes iniciar sesión con estas credenciales");
  } catch (error) {
    console.error("❌ Error al crear usuario de prueba:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
