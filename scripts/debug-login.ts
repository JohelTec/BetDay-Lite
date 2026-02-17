import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Simular exactamente lo que hace auth.ts
async function testLoginLogic(email: string, password: string) {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`🔍 Probando login con: ${email}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Step 1: Validate credentials exist
  if (!email || !password) {
    console.log("❌ RECHAZADO: Email y contraseña son requeridos");
    return false;
  }
  console.log("✅ Paso 1: Credenciales proporcionadas");

  // Step 2: Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log("❌ RECHAZADO: Formato de email inválido");
    return false;
  }
  console.log("✅ Paso 2: Formato de email válido");

  // Step 3: Validate password length
  if (password.length < 6) {
    console.log("❌ RECHAZADO: La contraseña debe tener al menos 6 caracteres");
    return false;
  }
  console.log("✅ Paso 3: Longitud de contraseña válida");

  // Step 4: Find user in database
  console.log("\n🔍 Buscando usuario en la base de datos...");
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    console.log("❌ RECHAZADO: Usuario no encontrado en BD");
    console.log("   Mensaje para usuario: 'Email o contraseña incorrectos'");
    return false;
  }
  console.log(`✅ Paso 4: Usuario encontrado (ID: ${user.id})`);

  // Step 5: Verify password
  console.log("\n🔐 Verificando contraseña...");
  console.log(`   Hash en BD: ${user.password.substring(0, 20)}...`);
  
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    console.log("❌ RECHAZADO: Contraseña incorrecta");
    console.log("   Mensaje para usuario: 'Email o contraseña incorrectos'");
    return false;
  }
  console.log("✅ Paso 5: Contraseña válida");

  console.log("\n🎉 LOGIN EXITOSO");
  console.log(`   Usuario: ${user.name || user.email}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Saldo: $${user.balance}`);
  
  return true;
}

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("   PRUEBA DE LÓGICA DE AUTENTICACIÓN");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const tests = [
    {
      name: "Credenciales correctas",
      email: "test@example.com",
      password: "123456",
      shouldPass: true,
    },
    {
      name: "Usuario inexistente",
      email: "random@email.com",
      password: "123456",
      shouldPass: false,
    },
    {
      name: "Contraseña incorrecta",
      email: "test@example.com",
      password: "wrongpassword",
      shouldPass: false,
    },
    {
      name: "Email inválido",
      email: "notanemail",
      password: "123456",
      shouldPass: false,
    },
    {
      name: "Contraseña muy corta",
      email: "test@example.com",
      password: "123",
      shouldPass: false,
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await testLoginLogic(test.email, test.password);
    
    if (result === test.shouldPass) {
      passed++;
      console.log(`\n✅ Test '${test.name}': PASÓ\n`);
    } else {
      failed++;
      console.log(`\n❌ Test '${test.name}': FALLÓ (esperado: ${test.shouldPass}, obtenido: ${result})\n`);
    }
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("              RESUMEN DE TESTS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Total: ${tests.length}`);
  console.log(`✅ Pasaron: ${passed}`);
  console.log(`❌ Fallaron: ${failed}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  if (failed > 0) {
    console.log("⚠️  ¡HAY PROBLEMAS CON LA LÓGICA DE AUTENTICACIÓN!");
    console.log("   La validación NO está funcionando correctamente.\n");
  } else {
    console.log("✅ La lógica de autenticación está funcionando correctamente.");
    console.log("   Si siguen pasando credenciales aleatorias, el problema");
    console.log("   está en otro lugar (middleware, rutas protegidas, etc.)\n");
  }

  await prisma.$disconnect();
}

main();
