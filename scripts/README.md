# Scripts de Base de Datos

Esta carpeta contiene scripts útiles para la gestión de usuarios en la base de datos.

## Scripts Disponibles

### 1. Limpiar Usuarios (`clear-users.ts`)
Elimina todos los usuarios y sus apuestas de la base de datos.

```bash
npm run db:clear
```

**⚠️ Advertencia:** Esta acción eliminará todos los datos de usuarios y no se puede deshacer.

### 2. Crear Usuario de Prueba (`create-test-user.ts`)
Crea un usuario de prueba con credenciales predefinidas.

```bash
npm run db:seed
```

**Credenciales del usuario de prueba:**
- Email: `test@example.com`
- Contraseña: `123456`
- Saldo inicial: $1000

### 3. Probar Credenciales (`test-credentials.ts`)
Valida que el sistema de autenticación con bcrypt funciona correctamente.

```bash
npm run db:test
```

Este script:
- Busca el usuario de prueba en la base de datos
- Verifica que las contraseñas correctas sean aceptadas
- Verifica que las contraseñas incorrectas sean rechazadas

### 4. Validar Credenciales con BD (`validate-db-credentials.ts`) ⭐ **NUEVO**
Prueba completa de validación de credenciales contra la base de datos.

```bash
npm run test:db
```

Este script realiza:
- ✅ Verificación de conexión a la base de datos
- ✅ Listado de todos los usuarios registrados
- ✅ 5 pruebas de autenticación (correctas/incorrectas)
- ✅ Validación de formato de email
- ✅ Validación de longitud de contraseña
- ✅ Verificación de hash bcrypt
- ✅ Simulación completa del flujo de login

### 5. Pruebas de Validación de Login (`test-login-validations.ts`)
Ejecuta 27 pruebas automáticas de validaciones del sistema de login.

```bash
npm run test:login
```

### 6. Prueba del Sistema de Saldo (`test-balance-system.ts`) 💰 **NUEVO**
Prueba completa del sistema de gestión de saldo de usuario.

```bash
npm run test:balance
```

Este script realiza:
- ✅ Creación de usuario con saldo inicial específico
- ✅ Creación de apuesta y descuento automático del saldo
- ✅ Simulación de apuesta ganada con cálculo de ganancias
- ✅ Validación de saldo insuficiente
- ✅ Simulación de apuesta perdida
- ✅ Resumen completo con historial de transacciones

**Ejemplo de salida:**
```
🧪 === PRUEBA DEL SISTEMA DE GESTIÓN DE SALDO ===

1️⃣ Creando usuario de prueba...
✅ Usuario creado: saldo-test@example.com
   💰 Saldo inicial: $100.00

3️⃣ Creando apuesta de $20...
✅ Apuesta creada
   💸 Monto apostado: $20.00
   💰 Saldo actual: $80.00

4️⃣ Simulando apuesta ganada...
✅ Apuesta ganada
   🎉 Ganancias: $50.00
   💰 Saldo final: $130.00
```

### 7. Abrir Prisma Studio
Para ver y editar los datos de la base de datos visualmente:

```bash
npm run db:studio
```

Se abrirá en http://localhost:5555

## Uso Recomendado

### Desarrollo Inicial
1. Limpiar la base de datos: `npm run db:clear`
2. Crear usuario de prueba: `npm run db:seed`
3. Validar con BD: `npm run test:db`

### Verificar Autenticación
Para verificar que el sistema de autenticación funciona:
```bash
npm run test:db
```

Esto te mostrará:
- ✅ Usuarios en la base de datos
- ✅ Resultados de pruebas de login
- ✅ Credenciales para iniciar sesión
- ✅ Seguridad del hash de contraseñas

### Agregar Usuarios Reales
Para agregar usuarios reales, usa la página de registro en:
```
http://localhost:3000/auth/signup
```

### Verificar Base de Datos
Para ver todos los datos:
```bash
npm run db:studio
```

## Resumen de Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run db:clear` | Eliminar todos los usuarios |
| `npm run db:seed` | Crear usuario de prueba |
| `npm run db:test` | Probar bcrypt básico |
| `npm run test:db` | **Validación completa con BD** ⭐ |
| `npm run test:login` | Pruebas de validaciones (27 tests) |
| `npm run test:balance` | **Pruebas de sistema de saldo** 💰 |
| `npm run db:studio` | Abrir interfaz visual de BD |

## Notas Técnicas

- Las contraseñas se hashean usando **bcryptjs** con 10 rounds de salting
- Cada usuario nuevo recibe un saldo inicial de **$1000**
- Los IDs de usuario se generan usando **cuid**
- La base de datos usa **SQLite** en desarrollo
- El sistema valida formato de email con regex
- Las contraseñas deben tener mínimo **6 caracteres**
