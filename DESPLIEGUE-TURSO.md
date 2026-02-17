# 🚀 Guía de Despliegue con Turso en Vercel

## Resumen Rápido

Turso es una base de datos serverless compatible con SQLite, perfecta para despliegues en Vercel.

## ✅ Prerequisitos

- [ ] Cuenta en Vercel (https://vercel.com)
- [ ] Base de datos Turso creada (ya tienes: `apuesta-total-db-joheltec`)
- [ ] Repositorio en GitHub
- [ ] Token de autenticación de Turso

---

## 📋 Pasos de Configuración

### Paso 1: Instalar Turso CLI (Opcional - para gestión)

```bash
# Windows PowerShell
winget install tursodatabase.turso-cli

# O usar npm
npm install -g @turso/cli
```

### Paso 2: Verificar tu Base de Datos Turso

Tu URL de Turso actual:
```
libsql://apuesta-total-db-joheltec.aws-us-east-1.turso.io
```

Con authToken incluido.

### Paso 3: Actualizar Configuración de Prisma para Turso

#### 3.1. Actualizar `src/lib/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prismaInstance: PrismaClient

if (process.env.NODE_ENV === 'production') {
  // Usar Turso en producción
  const libsql = createClient({
    url: process.env.DATABASE_URL!,
  })
  const adapter = new PrismaLibSql(libsql)
  prismaInstance = new PrismaClient({ adapter })
} else {
  // Usar SQLite local en desarrollo
  prismaInstance = new PrismaClient({
    log: ['query', 'error', 'warn'],
  })
}

export const prisma = globalForPrisma.prisma ?? prismaInstance

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

#### 3.2. Actualizar `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### Paso 4: Crear Schema en Turso

#### Opción A: Usando Turso CLI (Recomendado)

```bash
# Conectar a tu base de datos
turso db shell apuesta-total-db-joheltec

# Luego ejecutar el SQL del schema manualmente
```

#### Opción B: Crear Script de Migración

Crea un archivo `scripts/migrate-turso.ts`:

```typescript
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.DATABASE_URL!,
});

async function migrate() {
  console.log('📊 Migrando schema a Turso...');
  
  // Crear tabla User
  await client.execute(`
    CREATE TABLE IF NOT EXISTS User (
      id TEXT PRIMARY KEY NOT NULL,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      password TEXT NOT NULL,
      balance REAL NOT NULL DEFAULT 1000.0,
      createdAt INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  // Crear tabla Event
  await client.execute(`
    CREATE TABLE IF NOT EXISTS Event (
      id TEXT PRIMARY KEY NOT NULL,
      league TEXT NOT NULL,
      homeTeam TEXT NOT NULL,
      awayTeam TEXT NOT NULL,
      startTime INTEGER NOT NULL,
      oddsHome REAL NOT NULL,
      oddsDraw REAL NOT NULL,
      oddsAway REAL NOT NULL,
      createdAt INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  // Crear tabla Bet
  await client.execute(`
    CREATE TABLE IF NOT EXISTS Bet (
      id TEXT PRIMARY KEY NOT NULL,
      eventId TEXT NOT NULL,
      userId TEXT NOT NULL,
      selection TEXT NOT NULL,
      odds REAL NOT NULL,
      amount REAL NOT NULL,
      status TEXT NOT NULL,
      createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
      FOREIGN KEY (eventId) REFERENCES Event(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
    )
  `);

  console.log('✅ Migración completada');
  client.close();
}

migrate().catch(console.error);
```

Ejecutar:
```bash
npx tsx scripts/migrate-turso.ts
```

### Paso 5: Configurar Variables de Entorno

#### Desarrollo (`.env`)
```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET=bLcED4RMiFT9tpq0dDrbEMR1Uhz47zEcX/22EbM0MDk=
NEXTAUTH_URL=http://localhost:3000
```

#### Producción (Vercel Environment Variables)
```env
DATABASE_URL="libsql://apuesta-total-db-joheltec.aws-us-east-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzEzNTQ2NDksImlkIjoiOGM5NDg1NmItMzI4MC00YWM3LWFkYTYtMDVkMGFkYTA2OTExIiwicmlkIjoiMTE2ZmQ3OWMtYTA2Yy00MzE5LTk4NTMtZGI5YWY4MDgzZTRiIn0.kQclQN8hQrOPGGfwIfyY7z2QbHMzzzmZyqxqs-bEeiPyGKuR3mLIv_iPC4CIwwCRPnb_OuN6it6LjG8xnN_VBQ"
NEXTAUTH_SECRET=bLcED4RMiFT9tpq0dDrbEMR1Uhz47zEcX/22EbM0MDk=
NEXTAUTH_URL=https://tu-app.vercel.app
```

### Paso 6: Actualizar `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

### Paso 7: Verificar Build Local

```bash
# Regenerar Prisma Client
npx prisma generate

# Construir
npm run build

# Si hay errores, ejecutar:
Remove-Item -Path ".next" -Recurse -Force
npm run build
```

### Paso 8: Desplegar en Vercel

#### 8.1. Subir a GitHub
```bash
git add .
git commit -m "Configure Turso database"
git push origin main
```

#### 8.2. Importar en Vercel
1. Ve a https://vercel.com/new
2. Selecciona tu repositorio
3. Configura las variables de entorno:

   | Variable | Valor |
   |----------|-------|
   | `DATABASE_URL` | Tu URL completa de Turso con authToken |
   | `NEXTAUTH_SECRET` | `bLcED4RMiFT9tpq0dDrbEMR1Uhz47zEcX/22EbM0MDk=` |
   | `NEXTAUTH_URL` | (dejar vacío inicialmente) |

#### 8.3. Deploy
1. Click "Deploy"
2. Espera a que termine (2-3 min)
3. Copia la URL de producción
4. Ve a Settings → Environment Variables
5. Agrega `NEXTAUTH_URL` con tu URL
6. Redeploy desde Deployments

---

## 🔧 Comandos Útiles de Turso

```bash
# Ver bases de datos
turso db list

# Ver info de tu base de datos
turso db show apuesta-total-db-joheltec

# Conectar a shell SQL
turso db shell apuesta-total-db-joheltec

# Ver datos
turso db shell apuesta-total-db-joheltec "SELECT * FROM User LIMIT 5"
```

---

## ⚠️ Notas Importantes

### Sobre Driver Adapters
- Asegúrate de tener `@prisma/adapter-libsql` v7.4.0+
- Asegúrate de tener `@libsql/client` v0.17.0+
- El preview feature `driverAdapters` debe estar habilitado

### Sobre Migraciones
- Turso no soporta `prisma migrate` directamente
- Usa `prisma db push` para desarrollo o SQL manual para producción
- Las migraciones se manejan mejor con SQL directo en Turso

### Sobre Performance
- Turso es edge-native y muy rápido
- Compatible con serverless functions de Vercel
- Sin cold starts significativos

---

## 🐛 Solución de Problemas

### Error: "Cannot find module '@prisma/adapter-libsql'"
```bash
npm install @prisma/adapter-libsql@latest @libsql/client@latest
npx prisma generate
```

### Error: "PrismaLibSql is not a constructor"
Verifica que estás usando:
```typescript
import { PrismaLibSql } from '@prisma/adapter-libsql'
```
(Nota: `PrismaLibSql` no `PrismaLibSQL`)

### Error en Build de Vercel
1. Asegúrate que `DATABASE_URL` está configurado en variables de entorno
2. Verifica que `postinstall` ejecuta `prisma generate`
3. Revisa los logs de build en Vercel

### Base de Datos Vacía
Necesitas poblar las tablas después del deploy:
```bash
# Opción 1: Turso CLI
turso db shell apuesta-total-db-joheltec < schema.sql

# Opción 2: Crear endpoint API para seed
# /api/admin/seed con lógica de inicialización
```

---

## ✅ Checklist Final

- [ ] Código actualizado con adaptador Turso
- [ ] Schema creado en base de datos Turso
- [ ] Variables de entorno configuradas localmente
- [ ] Build exitoso localmente
- [ ] Código subido a GitHub
- [ ] Variables de entorno configuradas en Vercel
- [ ] Deploy exitoso en Vercel
- [ ] NEXTAUTH_URL actualizado
- [ ] Redeploy después de configurar NEXTAUTH_URL
- [ ] Testing en producción

---

## 🎯 Resultado Esperado

Una vez completados todos los pasos:
1. ✅ Aplicación desplegada en Vercel
2. ✅ Base de datos Turso conectada y funcional
3. ✅ Autenticación funcionando
4. ✅ Sistema de apuestas operativo
5. ✅ Performance optimizada para serverless

---

## 📚 Recursos Adicionales

- [Turso Docs](https://docs.turso.tech/)
- [Prisma con Turso](https://www.prisma.io/docs/orm/overview/databases/turso)
- [Vercel Deployment](https://vercel.com/docs/concepts/deployments/overview)
- [NextAuth.js](https://next-auth.js.org/getting-started/introduction)

---

**¿Necesitas ayuda?** Revisa los logs de Vercel o ejecuta los comandos localmente para debugging.
