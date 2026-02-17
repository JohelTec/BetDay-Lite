import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("   PRUEBA DE LÓGICA DE AUTENTICACIÓN");
console.log("   (Simulando el nuevo comportamiento)");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

async function testAuth(email: string, password: string) {
  console.log(`\n🔍 Probando: ${email} / ${password}`);
  
  // Simular el authorize callback
  if (!email || !password) {
    console.log("❌ Retorna: null (credenciales faltantes)");
    return null;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log("❌ Retorna: null (email inválido)");
    return null;
  }
  
  if (password.length < 6) {
    console.log("❌ Retorna: null (contraseña muy corta)");
    return null;
  }
  
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    console.log("❌ Retorna: null (usuario no encontrado)");
    return null;
  }
  
  const isValid = await bcrypt.compare(password, user.password);
  
  if (!isValid) {
    console.log("❌ Retorna: null (contraseña incorrecta)");
    return null;
  }
  
  console.log("✅ Retorna: { id, name, email } (LOGIN EXITOSO)");
  return { id: user.id, name: user.name, email: user.email };
}

async function main() {
  const tests = [
    { email: "auxiliar@mail.com", password: "123456", desc: "Usuario inexistente" },
    { email: "test@example.com", password: "wrongpass", desc: "Contraseña incorrecta" },
    { email: "invalid", password: "123456", desc: "Email inválido" },
    { email: "test@example.com", password: "123", desc: "Contraseña corta" },
    { email: "test@example.com", password: "123456", desc: "Credenciales válidas" },
  ];
  
  for (const test of tests) {
    await testAuth(test.email, test.password);
  }
  
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("   INTERPRETACIÓN EN EL FRONTEND");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("Si authorize retorna NULL → result.ok = false");
  console.log("  → Muestra toast rojo de error");
  console.log("  → Usuario se mantiene en login\n");
  console.log("Si authorize retorna USER → result.ok = true");
  console.log("  → Muestra toast verde de éxito");
  console.log("  → Redirige a página principal\n");
  
  await prisma.$disconnect();
}

main();
