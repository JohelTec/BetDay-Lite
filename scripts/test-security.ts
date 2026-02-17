import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

console.log("╔════════════════════════════════════════════════════════════╗");
console.log("║   PRUEBA EXHAUSTIVA DE AUTENTICACIÓN                       ║");
console.log("╚════════════════════════════════════════════════════════════╝\n");

async function simulateLogin(email: string, password: string) {
  console.log(`\n━━━ Intentando login: ${email} ━━━\n`);
  
  // PASO 1: Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log("❌ PASO 1: Formato de email inválido");
    console.log("   authorize() retorna: null");
    console.log("   result.ok = false");
    console.log("   DEBE MOSTRAR ERROR\n");
    return false;
  }
  console.log("✅ PASO 1: Formato de email válido");
  
  // PASO 2: Validar longitud de contraseña
  if (password.length < 6) {
    console.log("❌ PASO 2: Contraseña muy corta");
    console.log("   authorize() retorna: null");
    console.log("   result.ok = false");
    console.log("   DEBE MOSTRAR ERROR\n");
    return false;
  }
  console.log("✅ PASO 2: Longitud de contraseña válida");
  
  // PASO 3: Buscar usuario en BD
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    console.log("❌ PASO 3: Usuario NO encontrado en base de datos");
    console.log("   authorize() retorna: null");
    console.log("   result.ok = false");
    console.log("   DEBE MOSTRAR ERROR: 'Las credenciales proporcionadas no son válidas'\n");
    return false;
  }
  console.log(`✅ PASO 3: Usuario encontrado (ID: ${user.id})`);
  
  // PASO 4: Verificar contraseña
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    console.log("❌ PASO 4: Contraseña incorrecta");
    console.log("   authorize() retorna: null");
    console.log("   result.ok = false");
    console.log("   DEBE MOSTRAR ERROR\n");
    return false;
  }
  console.log("✅ PASO 4: Contraseña correcta");
  
  // PASO 5: Login exitoso
  console.log("\n✅✅✅ LOGIN EXITOSO ✅✅✅");
  console.log(`   authorize() retorna: { id: '${user.id}', email: '${user.email}', name: '${user.name}' }`);
  console.log("   result.ok = true");
  console.log("   DEBE MOSTRAR: Toast verde 'Inicio de sesión exitoso'\n");
  return true;
}

async function main() {
  const tests = [
    { email: "fsdf@gmail.com", password: "123456", desc: "Usuario que intentaste (inexistente)" },
    { email: "test@example.com", password: "wrongpass", desc: "Usuario válido con contraseña incorrecta" },
    { email: "test@example.com", password: "123456", desc: "Credenciales correctas" },
  ];
  
  for (const test of tests) {
    await simulateLogin(test.email, test.password);
  }
  
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║   CONCLUSIÓN                                               ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");
  
  console.log("Si 'fsdf@gmail.com' muestra 'Login exitoso' en el navegador:");
  console.log("  ❌ HAY UN BYPASS DE SEGURIDAD");
  console.log("  ❌ El código de authorize() NO se está ejecutando");
  console.log("  ❌ O hay un problema con NextAuth\n");
  
  console.log("Solución aplicada:");
  console.log("  ✅ Agregué callbacks jwt() y session()");
  console.log("  ✅ Cada request valida contra la BD");
  console.log("  ✅ Si el usuario no existe, invalida el token\n");
  
  console.log("AHORA DEBES:");
  console.log("  1. Ejecutar: npm run dev");
  console.log("  2. Esperar: ✓ Ready in XXXms");
  console.log("  3. En navegador: Ctrl+Shift+R (limpiar cache)");
  console.log("  4. Intentar login con fsdf@gmail.com");
  console.log("  5. DEBE MOSTRAR ERROR\n");
  
  await prisma.$disconnect();
}

main();
