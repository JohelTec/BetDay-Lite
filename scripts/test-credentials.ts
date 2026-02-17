import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function testCredentials() {
  const testEmail = "test@example.com";
  const testPassword = "123456";
  const wrongPassword = "wrongpass";

  try {
    console.log("🔍 Buscando usuario...");
    const user = await prisma.user.findUnique({
      where: { email: testEmail },
    });

    if (!user) {
      console.log("❌ Usuario no encontrado");
      return;
    }

    console.log(`✅ Usuario encontrado: ${user.name} (${user.email})`);
    console.log(`💰 Saldo: $${user.balance}`);
    
    // Test with correct password
    console.log("\n🔑 Probando con contraseña correcta...");
    const isValidCorrect = await bcrypt.compare(testPassword, user.password);
    if (isValidCorrect) {
      console.log("✅ ¡Contraseña correcta! Autenticación exitosa");
    } else {
      console.log("❌ Contraseña incorrecta (ERROR - debería ser correcta)");
    }

    // Test with wrong password
    console.log("\n🔑 Probando con contraseña incorrecta...");
    const isValidWrong = await bcrypt.compare(wrongPassword, user.password);
    if (!isValidWrong) {
      console.log("✅ Contraseña rechazada correctamente");
    } else {
      console.log("❌ Contraseña incorrecta aceptada (ERROR)");
    }

    console.log("\n🎉 Sistema de validación funcionando correctamente!");
  } catch (error) {
    console.error("❌ Error al probar credenciales:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testCredentials();
