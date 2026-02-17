# Validación de Credenciales con Base de Datos

## 📊 Resumen del Sistema

El sistema de autenticación valida credenciales en **3 capas**:

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Cliente)                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 1. Validación de Formato                               │ │
│  │    ✓ Email con formato válido (regex)                 │ │
│  │    ✓ Contraseña mínimo 6 caracteres                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    SERVIDOR (API)                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 2. Validación de Credenciales (auth.ts)               │ │
│  │    ✓ Re-valida formato email                          │ │
│  │    ✓ Re-valida longitud contraseña                    │ │
│  │    ✓ Busca usuario en base de datos                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   BASE DE DATOS (SQLite)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 3. Verificación de Contraseña                          │ │
│  │    ✓ Usuario existe? (findUnique)                     │ │
│  │    ✓ Comparar hash bcrypt                             │ │
│  │    ✓ Password match? (bcrypt.compare)                 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Flujo de Validación con Base de Datos

### Paso 1: Usuario Ingresa Credenciales
```typescript
Email: test@example.com
Password: 123456
```

### Paso 2: Validación Frontend (Inmediata)
```typescript
// app/auth/signin/page.tsx
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isEmailValid = emailRegex.test(email);
const isPasswordValid = password.length >= 6;

if (!isEmailValid || !isPasswordValid) {
  // Mostrar error en UI
  return;
}
```

### Paso 3: Envío al Servidor
```typescript
const result = await signIn("credentials", {
  email,
  password,
  redirect: false,
});
```

### Paso 4: Validación en auth.ts
```typescript
// auth.ts - authorize function
authorize: async (credentials) => {
  // 1. Validar formato
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(credentials.email)) {
    return null; // ❌ Email inválido
  }
  
  if (credentials.password.length < 6) {
    return null; // ❌ Contraseña muy corta
  }
  
  // 2. Buscar en base de datos
  const user = await prisma.user.findUnique({
    where: { email: credentials.email }
  });
  
  if (!user) {
    return null; // ❌ Usuario no existe
  }
  
  // 3. Verificar contraseña hasheada
  const isValidPassword = await bcrypt.compare(
    credentials.password,
    user.password
  );
  
  if (!isValidPassword) {
    return null; // ❌ Contraseña incorrecta
  }
  
  // ✅ Login exitoso
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}
```

### Paso 5: Consulta a la Base de Datos
```sql
-- Prisma genera esta query
SELECT 
  id, email, name, password, balance, createdAt 
FROM User 
WHERE email = 'test@example.com' 
LIMIT 1;
```

**Resultado de la Query:**
```javascript
{
  id: "cmlppq4yi00009ingtuv99265",
  email: "test@example.com",
  name: "Usuario de Prueba",
  password: "$2b$10$P31OBi.vEHH0joJef80cvu...", // Hash bcrypt
  balance: 1000,
  createdAt: "2026-02-16T21:55:03.000Z"
}
```

### Paso 6: Comparación de Contraseña con bcrypt
```typescript
// bcrypt.compare hace:
// 1. Extrae el salt del hash almacenado
// 2. Hashea la contraseña ingresada con el mismo salt
// 3. Compara los hashes

const plainPassword = "123456";
const hashedPassword = "$2b$10$P31OBi.vEHH0joJef80cvu...";

const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
// isMatch: true ✅
```

### Paso 7: Resultado Final
```typescript
if (result?.ok) {
  // ✅ Redirigir a página principal
  router.push("/");
} else {
  // ❌ Mostrar error
  setError("Email o contraseña incorrectos");
}
```

## 🧪 Pruebas Realizadas

### Test 1: Credenciales Correctas ✅
```
Input:
  Email: test@example.com
  Password: 123456

Proceso:
  1. ✓ Formato de email válido
  2. ✓ Longitud de contraseña válida
  3. ✓ Usuario encontrado en BD
  4. ✓ Hash de contraseña coincide

Resultado: LOGIN EXITOSO
```

### Test 2: Contraseña Incorrecta ✅
```
Input:
  Email: test@example.com
  Password: wrongpassword

Proceso:
  1. ✓ Formato de email válido
  2. ✓ Longitud de contraseña válida
  3. ✓ Usuario encontrado en BD
  4. ✗ Hash de contraseña NO coincide

Resultado: RECHAZADO
```

### Test 3: Usuario No Existe ✅
```
Input:
  Email: noexiste@example.com
  Password: 123456

Proceso:
  1. ✓ Formato de email válido
  2. ✓ Longitud de contraseña válida
  3. ✗ Usuario NO encontrado en BD

Resultado: RECHAZADO
```

### Test 4: Email Inválido ✅
```
Input:
  Email: invalidemail
  Password: 123456

Proceso:
  1. ✗ Formato de email inválido

Resultado: RECHAZADO (antes de consultar BD)
```

### Test 5: Contraseña Corta ✅
```
Input:
  Email: test@example.com
  Password: 123

Proceso:
  1. ✓ Formato de email válido
  2. ✗ Longitud de contraseña inválida (< 6)

Resultado: RECHAZADO (antes de consultar BD)
```

## 📈 Resultados de Pruebas

```
━━━ RESUMEN DE PRUEBAS ━━━
   Total de pruebas: 5
   ✅ Pruebas exitosas: 5
   ❌ Pruebas fallidas: 0

🎉 ¡TODAS LAS PRUEBAS PASARON!
```

## 🔒 Seguridad del Sistema

### Almacenamiento de Contraseñas
- **Nunca** se almacenan contraseñas en texto plano
- Se usa **bcrypt** con 10 rounds de hashing
- Cada contraseña tiene un **salt único**

### Ejemplo de Hash bcrypt:
```
Contraseña original: 123456
Hash almacenado:     $2b$10$P31OBi.vEHH0joJef80cvuav8jKGTzE4hVREr...

Estructura del hash:
  $2b$     = Algoritmo (bcrypt)
  10$      = Rounds (2^10 = 1024 iteraciones)
  P31OBi.. = Salt (aleatorio, único)
  av8jK... = Hash resultante
```

### Protecciones Implementadas
1. ✅ Validación de formato en cliente y servidor
2. ✅ Contraseñas hasheadas con bcrypt
3. ✅ Salt único por contraseña
4. ✅ No se revelan detalles específicos del error (seguridad por oscuridad)
5. ✅ Logs de auditoría en consola del servidor
6. ✅ Re-validación en servidor (no confiar solo en cliente)

## 📝 Comandos de Prueba

### Ejecutar validación completa:
```bash
npm run test:db
```

### Ver usuarios en la base de datos:
```bash
npm run db:studio
```

### Crear usuario de prueba:
```bash
npm run db:seed
```

### Credenciales de prueba:
- **Email:** test@example.com
- **Contraseña:** 123456
- **URL:** http://localhost:3000/auth/signin

## 🎯 Casos de Uso

### ✅ Login Exitoso
```typescript
POST /api/auth/callback/credentials
{
  email: "test@example.com",
  password: "123456"
}

Response: { status: 200, ok: true }
Action: Redirect to "/"
```

### ❌ Login Fallido
```typescript
POST /api/auth/callback/credentials
{
  email: "test@example.com",
  password: "wrongpass"
}

Response: { status: 401, ok: false }
Action: Show error message
```

## 🔍 Logs del Servidor

El sistema registra cada intento de autenticación:

```
Authorization failed: Missing credentials
Authorization failed: Invalid email format
Authorization failed: Password too short
Authorization failed: User not found
Authorization failed: Invalid password
Authorization successful for user: test@example.com
```

## 📚 Archivos Relacionados

- `auth.ts` - Configuración de NextAuth y validación
- `app/api/auth/signup/route.ts` - Registro de usuarios
- `app/auth/signin/page.tsx` - Página de login
- `lib/prisma.ts` - Cliente de Prisma
- `prisma/schema.prisma` - Esquema de base de datos
- `scripts/validate-db-credentials.ts` - Script de pruebas

## 🚀 Próximos Pasos Sugeridos

1. ✅ Validación básica implementada
2. ✅ Pruebas automatizadas creadas
3. ⏳ Agregar rate limiting (prevenir fuerza bruta)
4. ⏳ Implementar 2FA (autenticación de dos factores)
5. ⏳ Agregar recuperación de contraseña
6. ⏳ Implementar logout en todas las sesiones
7. ⏳ Agregar logs persistentes de auditoría
