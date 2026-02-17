import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function testSpecificUser() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("   PRUEBA DE USUARIO: auxiliar@mail.com");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const testEmail = "auxiliar@mail.com";
  
  // Buscar el usuario
  const user = await prisma.user.findUnique({
    where: { email: testEmail }
  });

  if (!user) {
    console.log("❌ El usuario NO existe en la base de datos");
    console.log(`   Email buscado: ${testEmail}`);
    console.log("\n⚠️  Si el login fue exitoso, hay un PROBLEMA de seguridad");
    console.log("   El sistema está permitiendo login sin validar contra la BD\n");
  } else {
    console.log("✅ El usuario SÍ existe en la base de datos\n");
    console.log(`  📧 Email: ${user.email}`);
    console.log(`  👤 Nombre: ${user.name || 'Sin nombre'}`);
    console.log(`  💰 Saldo: $${user.balance}`);
    console.log(`  🔐 Hash: ${user.password.substring(0, 30)}...`);
    console.log(`  📅 Creado: ${user.createdAt.toLocaleString('es-ES')}\n`);

    // Probar algunas contraseñas comunes
    console.log("🔍 Probando contraseñas comunes:\n");
    const commonPasswords = ["123456", "password", "auxiliar", "123", "12345678"];
    
    for (const pwd of commonPasswords) {
      const isValid = await bcrypt.compare(pwd, user.password);
      if (isValid) {
        console.log(`  ✅ Contraseña encontrada: "${pwd}"`);
        break;
      } else {
        console.log(`  ❌ No es: "${pwd}"`);
      }
    }
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("   TODOS LOS USUARIOS EN LA BASE DE DATOS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const allUsers = await prisma.user.findMany();
  console.log(`Total: ${allUsers.length} usuario(s)\n`);
  
  allUsers.forEach((u, i) => {
    console.log(`${i + 1}. ${u.email} (${u.name || 'Sin nombre'})`);
  });

  await prisma.$disconnect();
}

testSpecificUser();
