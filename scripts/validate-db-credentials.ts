import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

// Colores para output en terminal
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
};

const log = {
  success: (msg: string) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg: string) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg: string) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  step: (msg: string) => console.log(`${colors.cyan}🔹 ${msg}${colors.reset}`),
  title: (msg: string) => console.log(`\n${colors.magenta}━━━ ${msg} ━━━${colors.reset}\n`),
};

async function validateCredentialsWithDB() {
  log.title("PRUEBA DE VALIDACIÓN DE CREDENCIALES CON BASE DE DATOS");

  try {
    // Paso 1: Verificar conexión a la base de datos
    log.step("Paso 1: Verificando conexión con la base de datos...");
    await prisma.$queryRaw`SELECT 1`;
    log.success("Conexión a la base de datos establecida\n");

    // Paso 2: Contar usuarios en la base de datos
    log.step("Paso 2: Contando usuarios en la base de datos...");
    const userCount = await prisma.user.count();
    log.info(`Total de usuarios en la base de datos: ${userCount}`);
    
    if (userCount === 0) {
      log.error("No hay usuarios en la base de datos");
      log.info("Ejecuta 'npm run db:seed' para crear un usuario de prueba\n");
      return;
    }
    log.success(`Encontrados ${userCount} usuario(s)\n`);

    // Paso 3: Obtener todos los usuarios
    log.step("Paso 3: Listando usuarios en la base de datos...");
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        balance: true,
        createdAt: true,
      },
    });

    users.forEach((user, index) => {
      console.log(`\n   Usuario ${index + 1}:`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   👤 Nombre: ${user.name || "Sin nombre"}`);
      console.log(`   💰 Saldo: $${user.balance}`);
      console.log(`   📅 Creado: ${user.createdAt.toLocaleString()}`);
    });
    console.log();

    // Paso 4: Probar credenciales del usuario de prueba
    log.title("PRUEBAS DE AUTENTICACIÓN");

    const testEmail = "test@example.com";
    const testPassword = "123456";

    log.step("Paso 4: Buscando usuario de prueba...");
    const testUser = await prisma.user.findUnique({
      where: { email: testEmail },
    });

    if (!testUser) {
      log.error(`Usuario con email ${testEmail} no encontrado`);
      log.info("Creando usuario de prueba...\n");
      
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      const newUser = await prisma.user.create({
        data: {
          email: testEmail,
          name: "Usuario de Prueba",
          password: hashedPassword,
          balance: 1000.0,
        },
      });
      
      log.success(`Usuario creado: ${newUser.email}`);
      log.info(`ID: ${newUser.id}`);
      log.info(`Contraseña (texto plano): ${testPassword}\n`);
    } else {
      log.success(`Usuario encontrado: ${testUser.email}`);
      log.info(`ID: ${testUser.id}`);
      log.info(`Nombre: ${testUser.name}\n`);
    }

    // Paso 5: Simular proceso de login completo
    log.title("SIMULACIÓN DE PROCESO DE LOGIN");

    const loginTests = [
      {
        email: testEmail,
        password: testPassword,
        shouldPass: true,
        description: "Credenciales correctas",
      },
      {
        email: testEmail,
        password: "wrongpassword",
        shouldPass: false,
        description: "Contraseña incorrecta",
      },
      {
        email: "noexiste@example.com",
        password: testPassword,
        shouldPass: false,
        description: "Usuario no existe",
      },
      {
        email: "invalidemail",
        password: testPassword,
        shouldPass: false,
        description: "Email con formato inválido",
      },
      {
        email: testEmail,
        password: "123",
        shouldPass: false,
        description: "Contraseña muy corta (< 6 caracteres)",
      },
    ];

    let passedTests = 0;
    let failedTests = 0;

    for (const test of loginTests) {
      log.step(`Probando: ${test.description}`);
      console.log(`   📧 Email: ${test.email}`);
      console.log(`   🔑 Password: ${test.password}`);

      // Validación 1: Formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(test.email)) {
        if (!test.shouldPass) {
          log.success("   Rechazado: Email con formato inválido");
          passedTests++;
        } else {
          log.error("   ERROR: Email válido rechazado por formato");
          failedTests++;
        }
        console.log();
        continue;
      }

      // Validación 2: Longitud de contraseña
      if (test.password.length < 6) {
        if (!test.shouldPass) {
          log.success("   Rechazado: Contraseña muy corta");
          passedTests++;
        } else {
          log.error("   ERROR: Contraseña válida rechazada por longitud");
          failedTests++;
        }
        console.log();
        continue;
      }

      // Validación 3: Usuario existe en BD
      const user = await prisma.user.findUnique({
        where: { email: test.email },
      });

      if (!user) {
        if (!test.shouldPass) {
          log.success("   Rechazado: Usuario no existe en la base de datos");
          passedTests++;
        } else {
          log.error("   ERROR: Usuario debería existir en la BD");
          failedTests++;
        }
        console.log();
        continue;
      }

      log.info(`   Usuario encontrado en BD: ${user.email}`);

      // Validación 4: Comparar contraseña hasheada
      const isPasswordValid = await bcrypt.compare(test.password, user.password);

      if (isPasswordValid) {
        if (test.shouldPass) {
          log.success("   ✓ LOGIN EXITOSO - Credenciales válidas");
          log.info(`   Sesión iniciada para: ${user.name} (${user.email})`);
          passedTests++;
        } else {
          log.error("   ERROR: Login debería fallar pero pasó");
          failedTests++;
        }
      } else {
        if (!test.shouldPass) {
          log.success("   Rechazado: Contraseña incorrecta");
          passedTests++;
        } else {
          log.error("   ERROR: Contraseña correcta rechazada");
          failedTests++;
        }
      }
      console.log();
    }

    // Paso 6: Resumen de resultados
    log.title("RESUMEN DE PRUEBAS");
    console.log(`   Total de pruebas: ${loginTests.length}`);
    console.log(`   ${colors.green}✅ Pruebas exitosas: ${passedTests}${colors.reset}`);
    console.log(`   ${colors.red}❌ Pruebas fallidas: ${failedTests}${colors.reset}`);
    
    if (failedTests === 0) {
      log.success("\n🎉 ¡TODAS LAS PRUEBAS PASARON! El sistema de validación funciona correctamente.\n");
      
      log.title("INFORMACIÓN PARA INICIAR SESIÓN");
      console.log(`   📧 Email: ${testEmail}`);
      console.log(`   🔑 Contraseña: ${testPassword}`);
      console.log(`   🌐 URL: http://localhost:3000/auth/signin\n`);
    } else {
      log.error(`\n⚠️  ${failedTests} prueba(s) fallaron. Revisa la configuración.\n`);
    }

    // Paso 7: Verificar integridad de hash
    log.title("VERIFICACIÓN DE SEGURIDAD");
    
    const user = await prisma.user.findUnique({
      where: { email: testEmail },
    });

    if (user) {
      log.step("Verificando hash de contraseña...");
      console.log(`   Hash almacenado: ${user.password.substring(0, 30)}...`);
      
      const isBcryptHash = user.password.startsWith("$2a$") || 
                           user.password.startsWith("$2b$") || 
                           user.password.startsWith("$2y$");
      
      if (isBcryptHash) {
        log.success("Hash de contraseña válido (bcrypt detectado)");
        
        const rounds = user.password.split("$")[2];
        log.info(`Rounds de hashing: ${rounds}`);
      } else {
        log.error("ADVERTENCIA: La contraseña no está usando bcrypt");
      }
      console.log();
    }

  } catch (error) {
    log.error(`Error durante las pruebas: ${error}`);
    console.error(error);
  } finally {
    await prisma.$disconnect();
    log.info("Conexión a la base de datos cerrada");
  }
}

// Ejecutar pruebas
validateCredentialsWithDB();
