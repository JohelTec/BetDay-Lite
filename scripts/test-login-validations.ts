import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

// Color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const log = {
  success: (msg: string) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg: string) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg: string) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  test: (msg: string) => console.log(`${colors.cyan}🧪 ${msg}${colors.reset}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
};

async function testLoginValidations() {
  const testEmail = "test@example.com";
  const testPassword = "123456";

  log.info("Iniciando pruebas de validación de inicio de sesión...\n");

  try {
    // Test 1: Find user
    log.test("Test 1: Buscar usuario en base de datos");
    const user = await prisma.user.findUnique({
      where: { email: testEmail },
    });

    if (!user) {
      log.error("Usuario de prueba no encontrado");
      log.warning("Ejecuta 'npm run db:seed' para crear el usuario de prueba");
      return;
    }
    log.success(`Usuario encontrado: ${user.email}\n`);

    // Test 2: Email format validation
    log.test("Test 2: Validar formato de email");
    const validEmails = ["test@example.com", "user@domain.co.uk", "name+tag@email.com"];
    const invalidEmails = ["invalid", "test@", "@example.com", "test @example.com"];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    validEmails.forEach(email => {
      const isValid = emailRegex.test(email);
      if (isValid) {
        log.success(`Email válido: ${email}`);
      } else {
        log.error(`Email debería ser válido pero falló: ${email}`);
      }
    });

    invalidEmails.forEach(email => {
      const isValid = emailRegex.test(email);
      if (!isValid) {
        log.success(`Email inválido correctamente rechazado: ${email}`);
      } else {
        log.error(`Email inválido aceptado incorrectamente: ${email}`);
      }
    });
    console.log();

    // Test 3: Password length validation
    log.test("Test 3: Validar longitud de contraseña");
    const shortPasswords = ["", "1", "12", "123", "1234", "12345"];
    const validPasswords = ["123456", "password", "mypass123"];

    shortPasswords.forEach(pwd => {
      if (pwd.length < 6) {
        log.success(`Contraseña corta rechazada: "${pwd}" (${pwd.length} caracteres)`);
      } else {
        log.error(`Contraseña corta aceptada: "${pwd}"`);
      }
    });

    validPasswords.forEach(pwd => {
      if (pwd.length >= 6) {
        log.success(`Contraseña válida: "${pwd}" (${pwd.length} caracteres)`);
      } else {
        log.error(`Contraseña válida rechazada: "${pwd}"`);
      }
    });
    console.log();

    // Test 4: Password comparison
    log.test("Test 4: Comparar contraseñas con bcrypt");
    
    log.info("Probando contraseña correcta...");
    const isCorrectPassword = await bcrypt.compare(testPassword, user.password);
    if (isCorrectPassword) {
      log.success("Contraseña correcta aceptada");
    } else {
      log.error("Contraseña correcta rechazada (ERROR)");
    }

    log.info("Probando contraseña incorrecta...");
    const isWrongPassword = await bcrypt.compare("wrongpassword", user.password);
    if (!isWrongPassword) {
      log.success("Contraseña incorrecta rechazada");
    } else {
      log.error("Contraseña incorrecta aceptada (ERROR)");
    }

    log.info("Probando contraseña vacía...");
    const isEmptyPassword = await bcrypt.compare("", user.password);
    if (!isEmptyPassword) {
      log.success("Contraseña vacía rechazada");
    } else {
      log.error("Contraseña vacía aceptada (ERROR)");
    }
    console.log();

    // Test 5: Complete login flow simulation
    log.test("Test 5: Simular flujo completo de inicio de sesión");
    
    const testCases = [
      { email: testEmail, password: testPassword, expected: true, description: "Credenciales correctas" },
      { email: testEmail, password: "wrongpass", expected: false, description: "Contraseña incorrecta" },
      { email: "nonexistent@example.com", password: testPassword, expected: false, description: "Usuario no existe" },
      { email: "invalid-email", password: testPassword, expected: false, description: "Email con formato inválido" },
      { email: testEmail, password: "12345", expected: false, description: "Contraseña muy corta" },
      { email: "", password: testPassword, expected: false, description: "Email vacío" },
      { email: testEmail, password: "", expected: false, description: "Contraseña vacía" },
    ];

    for (const testCase of testCases) {
      const { email, password, expected, description } = testCase;
      
      // Validate email format
      const isEmailValid = emailRegex.test(email);
      const isPasswordValid = password.length >= 6;
      
      if (!isEmailValid || !isPasswordValid) {
        if (!expected) {
          log.success(`${description} - Rechazado en validación de formato`);
        } else {
          log.error(`${description} - ERROR: Debería pasar validación de formato`);
        }
        continue;
      }

      // Try to find user and compare password
      const foundUser = await prisma.user.findUnique({
        where: { email },
      });

      if (!foundUser) {
        if (!expected) {
          log.success(`${description} - Usuario no encontrado`);
        } else {
          log.error(`${description} - ERROR: Usuario debería existir`);
        }
        continue;
      }

      const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
      
      if (isPasswordCorrect === expected) {
        log.success(`${description} - Resultado correcto`);
      } else {
        log.error(`${description} - ERROR: Resultado inesperado`);
      }
    }

    console.log();
    log.success("🎉 Todas las pruebas de validación completadas!");
    
  } catch (error) {
    log.error(`Error durante las pruebas: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}

// Run tests
testLoginValidations();
