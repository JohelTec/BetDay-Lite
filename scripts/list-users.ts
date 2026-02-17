import { prisma } from "@/lib/prisma";

async function listUsers() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("   USUARIOS EN LA BASE DE DATOS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      password: true,
      balance: true,
      createdAt: true,
    },
  });

  if (users.length === 0) {
    console.log("❌ No hay usuarios en la base de datos\n");
    return;
  }

  console.log(`Total de usuarios: ${users.length}\n`);

  users.forEach((user, index) => {
    console.log(`Usuario ${index + 1}:`);
    console.log(`  📧 Email: ${user.email}`);
    console.log(`  👤 Nombre: ${user.name || 'Sin nombre'}`);
    console.log(`  💰 Saldo: $${user.balance}`);
    console.log(`  🔐 Hash: ${user.password.substring(0, 30)}...`);
    console.log(`  📅 Creado: ${user.createdAt.toLocaleString('es-ES')}`);
    console.log();
  });

  await prisma.$disconnect();
}

listUsers();
