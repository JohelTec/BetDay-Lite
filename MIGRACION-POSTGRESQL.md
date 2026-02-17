# 🐘 Migración a PostgreSQL con Vercel Postgres

## Pasos para Configurar Vercel Postgres

### Paso 1: Crear Base de Datos en Vercel

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto (o créalo si aún no está desplegado)
3. Ve a la pestaña **Storage**
4. Click en **Create Database**
5. Selecciona **Postgres**
6. Asigna un nombre a tu base de datos (ej: `betday-lite-db`)
7. Selecciona la región más cercana a ti
8. Click **Create**

### Paso 2: Obtener la Cadena de Conexión

Una vez creada la base de datos:

1. Ve a la pestaña **.env.local** en el dashboard de Vercel Postgres
2. Verás varias variables de entorno, necesitas:
   - `POSTGRES_URL` (para migraciones)
   - `POSTGRES_PRISMA_URL` (para el cliente de Prisma)

Copialas, se verán así:
```env
POSTGRES_URL="postgres://default:password@host.region.postgres.vercel-storage.com:5432/verceldb"
POSTGRES_PRISMA_URL="postgres://default:password@host-pooler.region.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
```

### Paso 3: Configurar Variables de Entorno Locales

Actualiza tu archivo `.env`:

```env
# PostgreSQL Database
DATABASE_URL="TU_POSTGRES_PRISMA_URL_AQUI"
DIRECT_URL="TU_POSTGRES_URL_AQUI"

# NextAuth
NEXTAUTH_SECRET=bLcED4RMiFT9tpq0dDrbEMR1Uhz47zEcX/22EbM0MDk=
NEXTAUTH_URL=http://localhost:3000
```

**Importante:** 
- `DATABASE_URL` = `POSTGRES_PRISMA_URL` (con pooling)
- `DIRECT_URL` = `POSTGRES_URL` (sin pooling, para migraciones)

### Paso 4: Actualizar Schema de Prisma

El schema ya está actualizado para PostgreSQL. Verifica que sea correcto:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### Paso 5: Regenerar Prisma Client

```bash
npx prisma generate
```

### Paso 6: Ejecutar Migraciones

```bash
# Crear y aplicar migración inicial
npx prisma migrate dev --name init

# Esto creará las tablas en PostgreSQL
```

Si aparece un error sobre la base de datos no estar vacía:
```bash
npx prisma migrate deploy
```

### Paso 7: (Opcional) Seed de Datos Iniciales

```bash
# Crear usuario de prueba
npm run db:seed
```

### Paso 8: Verificar Conexión

```bash
# Abrir Prisma Studio para ver la base de datos
npm run db:studio
```

### Paso 9: Iniciar Servidor de Desarrollo

```bash
npm run dev
```

Visita http://localhost:3000 y verifica que todo funcione correctamente.

---

## Configuración en Vercel (Producción)

### Variables de Entorno en Vercel

Una vez que despliegues tu proyecto en Vercel:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Las variables de Vercel Postgres se configurarán automáticamente si creaste la BD desde el dashboard
4. Asegúrate de tener también:
   - `NEXTAUTH_SECRET`: `bLcED4RMiFT9tpq0dDrbEMR1Uhz47zEcX/22EbM0MDk=`
   - `NEXTAUTH_URL`: `https://tu-app.vercel.app`

### Deploy Automático

Las migraciones se ejecutarán automáticamente al desplegar si tienes:

```json
// package.json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

**Nota:** El comando actual ya incluye `prisma generate`, solo falta agregar `prisma migrate deploy`.

---

## Diferencias: SQLite vs PostgreSQL

### Cambios en los Tipos de Datos

| Modelo | Campo | SQLite | PostgreSQL |
|--------|-------|--------|-----------|
| User | createdAt | DateTime | TIMESTAMP |
| Event | startTime | DateTime | TIMESTAMP |
| Bet | amount | Float | DECIMAL |

### Ventajas de PostgreSQL

✅ **Mejor para Producción**
- Soporta múltiples conexiones concurrentes
- Mejor integridad de datos
- Tipos de datos más precisos (DECIMAL para dinero)

✅ **Escalabilidad**
- Maneja grandes volúmenes de datos
- Mejor rendimiento con muchos usuarios

✅ **Compatible con Vercel**
- Integración nativa
- Connection pooling automático
- Sin problemas de serverless

---

## Solución de Problemas

### Error: "Can't reach database server"

**Solución:** Verifica que:
1. La URL de conexión es correcta
2. Tu IP está permitida (Vercel Postgres permite todas por defecto)
3. Las variables de entorno están configuradas

### Error: "Migration failed"

**Solución:**
```bash
# Resetear migraciones (⚠️ elimina datos)
npx prisma migrate reset

# O aplicar forzadamente
npx prisma migrate deploy --force
```

### Error: "P1001: Can't connect"

**Solución:** Asegúrate de usar `POSTGRES_PRISMA_URL` (con pooler) para `DATABASE_URL`.

---

## Comandos Útiles

```bash
# Ver estado de migraciones
npx prisma migrate status

# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Resetear base de datos (desarrollo)
npx prisma migrate reset

# Ver datos en el navegador
npm run db:studio
```

---

## Checklist de Migración

- [ ] Crear base de datos en Vercel
- [ ] Copiar URLs de conexión
- [ ] Actualizar `.env` con DATABASE_URL y DIRECT_URL
- [ ] Verificar schema.prisma (provider = "postgresql")
- [ ] Ejecutar `npx prisma generate`
- [ ] Ejecutar `npx prisma migrate dev --name init`
- [ ] Verificar con `npm run db:studio`
- [ ] Crear usuario de prueba con `npm run db:seed`
- [ ] Probar localmente con `npm run dev`
- [ ] Configurar variables en Vercel
- [ ] Actualizar script de build si es necesario
- [ ] Deploy a Vercel

---

## Resultado Esperado

✅ Base de datos PostgreSQL funcionando  
✅ Conexión local exitosa  
✅ Migraciones aplicadas  
✅ Datos de prueba creados  
✅ Aplicación funcionando correctamente  
✅ Lista para desplegar en Vercel  

**¿Dudas?** Consulta la documentación de [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) o [Prisma PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql).
