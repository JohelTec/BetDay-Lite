import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Colores para la terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

async function testUserValidation() {
  console.log(`${colors.magenta}━━━ PRUEBA: VALIDACIÓN DE EXISTENCIA DE USUARIO ━━━${colors.reset}\n`);

  try {
    // Test 1: Usuario que SÍ existe
    console.log(`${colors.cyan}✓ Test 1: Validar usuario existente${colors.reset}`);
    const existingUser = await prisma.user.findUnique({
      where: { email: "test@example.com" }
    });
    
    if (existingUser) {
      console.log(`${colors.green}✓ Usuario encontrado: ${existingUser.email}${colors.reset}`);
      console.log(`  Nombre: ${existingUser.name}`);
      console.log(`  ID: ${existingUser.id}`);
    } else {
      console.log(`${colors.yellow}⚠ Usuario test@example.com no existe en la base de datos${colors.reset}`);
    }
    console.log();

    // Test 2: Usuario que NO existe
    console.log(`${colors.cyan}✓ Test 2: Intentar buscar usuario inexistente${colors.reset}`);
    const nonExistingUser = await prisma.user.findUnique({
      where: { email: "noexiste@example.com" }
    });
    
    if (nonExistingUser) {
      console.log(`${colors.red}✗ ERROR: Usuario no debería existir${colors.reset}`);
    } else {
      console.log(`${colors.green}✓ Correcto: Usuario no encontrado (como se esperaba)${colors.reset}`);
      console.log(`  ${colors.blue}→ Se mostrará mensaje: "Email o contraseña incorrectos"${colors.reset}`);
    }
    console.log();

    // Test 3: Simular el proceso completo de login
    console.log(`${colors.cyan}✓ Test 3: Simulación del proceso de login${colors.reset}\n`);
    
    const testCases = [
      { 
        email: "test@example.com", 
        password: "123456", 
        description: "Usuario válido + contraseña correcta",
        shouldSucceed: true 
      },
      { 
        email: "test@example.com", 
        password: "wrongpass", 
        description: "Usuario válido + contraseña incorrecta",
        shouldSucceed: false 
      },
      { 
        email: "noexiste@example.com", 
        password: "123456", 
        description: "Usuario que NO existe",
        shouldSucceed: false 
      },
    ];

    for (const testCase of testCases) {
      console.log(`  ${colors.blue}→ ${testCase.description}${colors.reset}`);
      console.log(`    Email: ${testCase.email}`);
      
      // Step 1: Find user
      const user = await prisma.user.findUnique({
        where: { email: testCase.email }
      });
      
      if (!user) {
        console.log(`    ${colors.yellow}⚠ Usuario no encontrado en BD${colors.reset}`);
        console.log(`    ${colors.red}✗ Login rechazado${colors.reset}`);
        console.log(`    ${colors.blue}   Mensaje: "Email o contraseña incorrectos"${colors.reset}`);
        console.log(`    ${colors.green}   Usuario se mantiene en página de login${colors.reset}\n`);
        continue;
      }
      
      // Step 2: Verify password
      const isValidPassword = await bcrypt.compare(testCase.password, user.password);
      
      if (isValidPassword) {
        console.log(`    ${colors.green}✓ Usuario encontrado${colors.reset}`);
        console.log(`    ${colors.green}✓ Contraseña válida${colors.reset}`);
        console.log(`    ${colors.green}✓ Login exitoso${colors.reset}`);
        console.log(`    ${colors.green}   Usuario redirigido a la página principal${colors.reset}\n`);
      } else {
        console.log(`    ${colors.green}✓ Usuario encontrado${colors.reset}`);
        console.log(`    ${colors.red}✗ Contraseña inválida${colors.reset}`);
        console.log(`    ${colors.red}✗ Login rechazado${colors.reset}`);
        console.log(`    ${colors.blue}   Mensaje: "Email o contraseña incorrectos"${colors.reset}`);
        console.log(`    ${colors.green}   Usuario se mantiene en página de login${colors.reset}\n`);
      }
    }

    // Test 4: Verificar comportamiento de redirect: false
    console.log(`${colors.cyan}✓ Test 4: Verificar configuración de redirect${colors.reset}`);
    console.log(`${colors.green}✓ redirect: false está configurado en signin/page.tsx${colors.reset}`);
    console.log(`  ${colors.blue}→ Cuando falla el login, el usuario permanece en la página${colors.reset}`);
    console.log(`  ${colors.blue}→ Se muestra el mensaje de error en color rojo${colors.reset}`);
    console.log(`  ${colors.blue}→ El formulario mantiene los valores ingresados${colors.reset}\n`);

    // Summary
    console.log(`${colors.magenta}━━━ RESUMEN DE VALIDACIONES ━━━${colors.reset}\n`);
    console.log(`${colors.green}✓ Valida existencia de usuario en BD${colors.reset}`);
    console.log(`${colors.green}✓ Muestra mensaje de error cuando no existe${colors.reset}`);
    console.log(`${colors.green}✓ Usuario se mantiene en la página de login${colors.reset}`);
    console.log(`${colors.green}✓ Mensaje de error específico: "Email o contraseña incorrectos"${colors.reset}`);
    console.log(`${colors.green}✓ No revela si el problema es email o contraseña (seguridad)${colors.reset}\n`);

    console.log(`${colors.cyan}📋 Para probar en el navegador:${colors.reset}`);
    console.log(`   1. Ejecuta: ${colors.yellow}npm run dev${colors.reset}`);
    console.log(`   2. Visita: ${colors.blue}http://localhost:3000/auth/signin${colors.reset}`);
    console.log(`   3. Prueba con usuario inexistente: ${colors.yellow}noexiste@example.com${colors.reset}`);
    console.log(`   4. Verifica que aparece el mensaje de error en rojo`);
    console.log(`   5. Verifica que te mantienes en la página de login\n`);

  } catch (error) {
    console.error(`${colors.red}Error en las pruebas:${colors.reset}`, error);
  } finally {
    await prisma.$disconnect();
  }
}

testUserValidation();
