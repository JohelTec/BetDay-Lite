# 🚀 Guía Completa: Vercel Postgres para BetDay Lite

## 📋 Ventajas de Vercel Postgres

✅ **Integración Simple** - Configuración automática con tu proyecto Vercel
✅ **Sin Configuración de Red** - No necesitas configurar IPs o security groups
✅ **Connection Pooling** - Optimizado para serverless automáticamente
✅ **Gratis para Comenzar** - Plan hobby incluye PostgreSQL
✅ **Variables Automáticas** - Se integran directamente en tu proyecto

---

## 🎯 Paso a Paso: Configurar Vercel Postgres

### Paso 1: Crear Cuenta en Vercel (si no tienes)

1. Ve a https://vercel.com/signup
2. Regístrate con GitHub, GitLab o email
3. Confirma tu cuenta

### Paso 2: Subir tu Proyecto a GitHub

```bash
# Si no tienes git inicializado
git init

# Agregar archivos
git add .

# Hacer commit
git commit -m "Ready for Vercel deployment"

# Crear repositorio en GitHub y conectarlo
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git

# Subir código
git push -u origin main
```

### Paso 3: Crear Proyecto en Vercel

1. Ve a https://vercel.com/new
2. Click en "Import Git Repository"
3. Autoriza Vercel para acceder a GitHub
4. Selecciona tu repositorio
5. **NO HAGAS DEPLOY TODAVÍA** - Click en "Skip for now" o cierra

### Paso 4: Crear Base de Datos Vercel Postgres

#### Opción A: Desde el Dashboard del Proyecto

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Pestaña **Storage**
4. Click en **Create Database**
5. Selecciona **Postgres**
6. Configuración:
   ```
   Database Name: betday-lite-db
   Region: Washington, D.C., USA (iad1) [o la más cercana a ti]
   ```
7. Click **Create**

#### Opción B: Crear Standalone Database

1. Ve a https://vercel.com/dashboard/stores
2. Click **Create Database**
3. Selecciona **Postgres**
4. Sigue los mismos pasos de arriba

### Paso 5: Conectar Database con tu Proyecto

Si creaste la BD standalone:
1. En la página de tu base de datos
2. Pestaña **Settings**
3. Sección **Connected Projects**
4. Click **Connect Project**
5. Selecciona tu proyecto

### Paso 6: Obtener Variables de Entorno

1. En la página de tu base de datos Vercel Postgres
2. Pestaña **`.env.local`**
3. Verás todas las variables necesarias:

```env
POSTGRES_URL="postgres://default:xxxxx@xxx-xxx-xxx.us-east-1.postgres.vercel-storage.com:5432/verceldb"
POSTGRES_PRISMA_URL="postgres://default:xxxxx@xxx-xxx-xxx.us-east-1.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NO_SSL="postgres://default:xxxxx@xxx-xxx-xxx.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=disable"
POSTGRES_URL_NON_POOLING="postgres://default:xxxxx@xxx-xxx-xxx.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require"
POSTGRES_USER="default"
POSTGRES_HOST="xxx-xxx-xxx.us-east-1.postgres.vercel-storage.com"
POSTGRES_PASSWORD="xxxxx"
POSTGRES_DATABASE="verceldb"
```

### Paso 7: Configurar Variables Locales

Actualiza tu `.env`:

```env
# Vercel Postgres
DATABASE_URL="COPIA_AQUI_TU_POSTGRES_PRISMA_URL"
DIRECT_URL="COPIA_AQUI_TU_POSTGRES_URL_NON_POOLING"

# NextAuth
NEXTAUTH_SECRET=bLcED4RMiFT9tpq0dDrbEMR1Uhz47zEcX/22EbM0MDk=
NEXTAUTH_URL=http://localhost:3000
```

**IMPORTANTE:**
- `DATABASE_URL` = `POSTGRES_PRISMA_URL` (con pooler, para la app)
- `DIRECT_URL` = `POSTGRES_URL_NON_POOLING` (sin pooler, para migraciones)

### Paso 8: Instalar Prisma y Generar Cliente

```bash
# Ya deberías tener Prisma instalado, pero por si acaso:
npm install prisma @prisma/client

# Generar Prisma Client
npx prisma generate
```

### Paso 9: Aplicar Migraciones

```bash
# Crear la migración inicial y aplicarla
npx prisma migrate dev --name init
```

Esto creará todas las tablas (User, Event, Bet) en tu base de datos Vercel Postgres.

### Paso 10: Verificar Conexión

```bash
# Abrir Prisma Studio para ver tu base de datos
npm run db:studio
```

Deberías ver tus tablas vacías pero creadas correctamente.

### Paso 11: Crear Datos de Prueba (Opcional)

```bash
# Crear usuario de prueba
npm run db:seed
```

### Paso 12: Probar Localmente

```bash
# Iniciar servidor de desarrollo
npm run dev
```

Visita http://localhost:3000 y prueba:
- Registro de usuario
- Inicio de sesión
- Crear apuestas

---

## 🌐 Despliegue en Vercel

### Paso 13: Variables de Entorno en Vercel

Las variables se configuran automáticamente cuando conectas la BD al proyecto, pero verifica:

1. Ve a tu proyecto en Vercel
2. **Settings** → **Environment Variables**
3. Deberían estar estas variables (agregadas automáticamente):
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - Y otras...

4. **Agrega manualmente:**
   - `NEXTAUTH_SECRET`: `bLcED4RMiFT9tpq0dDrbEMR1Uhz47zEcX/22EbM0MDk=`
   - `NEXTAUTH_URL`: (déjalo vacío por ahora, lo agregarás después del primer deploy)

5. **IMPORTANTE**: También agrega para que Prisma use las correctas:
   - `DATABASE_URL`: (valor de `POSTGRES_PRISMA_URL`)
   - `DIRECT_URL`: (valor de `POSTGRES_URL_NON_POOLING`)

### Paso 14: Deploy

1. Ve a tu proyecto en Vercel
2. Pestaña **Deployments**
3. Click en **Deploy** (o haz push a main en GitHub)
4. Espera a que compile (2-3 minutos)

El script de build ejecutará:
```bash
prisma generate && prisma migrate deploy && next build
```

Esto aplicará las migraciones automáticamente en Vercel Postgres.

### Paso 15: Configurar NEXTAUTH_URL

1. Una vez desplegado, copia la URL de producción (ej: `https://betday-lite.vercel.app`)
2. Ve a **Settings** → **Environment Variables**
3. Edita `NEXTAUTH_URL` y agrégala con tu URL de Vercel
4. Redeploy desde **Deployments** → **Redeploy**

---

## 🎉 ¡Listo!

Tu aplicación ahora está:
- ✅ Desplegada en Vercel
- ✅ Conectada a Vercel Postgres
- ✅ Con migraciones aplicadas
- ✅ Lista para usar

---

## 📊 Verificar Base de Datos en Producción

### Opción 1: Vercel Postgres Dashboard

1. Ve a tu base de datos en Vercel
2. Pestaña **Data**
3. Ejecuta consultas SQL:

```sql
-- Ver usuarios
SELECT * FROM "User";

-- Ver eventos
SELECT * FROM "Event";

-- Ver apuestas
SELECT * FROM "Bet";
```

### Opción 2: Desde tu Local con Producción

Temporalmente cambia tu `.env` para apuntar a producción:

```bash
# Usar las URLs de producción
npm run db:studio
```

⚠️ Ten cuidado, estarás modificando datos de producción.

---

## 🔧 Comandos Útiles

```bash
# Ver estado de migraciones
npx prisma migrate status

# Crear nueva migración
npx prisma migrate dev --name nombre_de_migracion

# Aplicar migraciones en producción (manual)
npx prisma migrate deploy

# Ver datos en navegador
npm run db:studio

# Resetear base de datos (⚠️ elimina todo)
npx prisma migrate reset
```

---

## 🐛 Solución de Problemas Comunes

### Error: "Can't reach database server"

**Causa:** URL incorrecta o problemas de conexión

**Solución:**
1. Verifica que copiaste correctamente las URLs
2. Asegúrate de usar `POSTGRES_PRISMA_URL` para `DATABASE_URL`
3. Reinicia el servidor de desarrollo

### Error: "Migration failed"

**Causa:** Base de datos no vacía o conflicto

**Solución:**
```bash
# En desarrollo (⚠️ elimina datos)
npx prisma migrate reset

# En producción, ejecuta manualmente las migraciones
npx prisma migrate deploy
```

### Error: "Authentication failed"

**Causa:** Variables de entorno incorrectas

**Solución:**
1. Regenera las credenciales en Vercel Postgres
2. Actualiza tus archivos `.env`
3. Reinicia el servidor

### Build Falla en Vercel

**Causa:** Variables de entorno no configuradas en Vercel

**Solución:**
1. Verifica que `DATABASE_URL` y `DIRECT_URL` estén en Vercel
2. Agrega `NEXTAUTH_SECRET`
3. Redeploy

---

## 💡 Tips y Mejores Prácticas

### Seguridad
- ✅ Nunca subas archivos `.env` a Git
- ✅ Usa secretos diferentes para desarrollo y producción
- ✅ Revisa los logs de Vercel para detectar problemas

### Performance
- ✅ Usa `POSTGRES_PRISMA_URL` (con pooler) para la aplicación
- ✅ Usa `POSTGRES_URL_NON_POOLING` solo para migraciones
- ✅ Considera usar Prisma Accelerate para caché

### Desarrollo
- ✅ Usa base de datos diferente para desarrollo (SQLite local está bien)
- ✅ Nunca hagas `prisma migrate reset` en producción
- ✅ Siempre prueba migraciones localmente primero

---

## 📚 Recursos Útiles

- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma con PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [NextAuth.js](https://next-auth.js.org/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## 🎯 Checklist de Deploy

- [ ] Proyecto subido a GitHub
- [ ] Proyecto importado en Vercel
- [ ] Base de datos Vercel Postgres creada
- [ ] Base de datos conectada al proyecto
- [ ] Variables de entorno copiadas a `.env` local
- [ ] `DATABASE_URL` y `DIRECT_URL` configuradas
- [ ] `npx prisma generate` ejecutado
- [ ] `npx prisma migrate dev --name init` ejecutado
- [ ] Aplicación probada localmente
- [ ] Variables de entorno configuradas en Vercel
- [ ] `NEXTAUTH_SECRET` agregado en Vercel
- [ ] Deploy realizado
- [ ] `NEXTAUTH_URL` actualizado con URL de producción
- [ ] Redeploy después de configurar `NEXTAUTH_URL`
- [ ] Aplicación funcionando en producción

---

**¿Algún paso no está claro o necesitas ayuda con alguna parte específica?**
