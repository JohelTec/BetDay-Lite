# ✅ Checklist para Despliegue en Vercel

## ✅ PROYECTO LISTO PARA DESPLEGAR

### ✅ Todas las Configuraciones Completadas
- [x] `vercel.json` configurado
- [x] Script de build correcto en `package.json` (`prisma generate && next build`)
- [x] `.gitignore` configurado (archivos `.env*` ignorados)
- [x] **NEXTAUTH_SECRET generado: `bLcED4RMiFT9tpq0dDrbEMR1Uhz47zEcX/22EbM0MDk=`**
- [x] Base de datos SQLite local funcionando
- [x] **Build exitoso verificado ✓**
- [x] Dependencias de producción instaladas
- [x] Schema de base de datos sincronizado

### 📊 Resultado del Build
```
✓ Compiled successfully
✓ Finished TypeScript
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

## Pasos para Desplegar en Vercel

### Paso 1: Preparar el Repositorio Git
```bash
# Si no tienes git inicializado
git init
git add .
git commit -m "Ready for Vercel deployment"

# Subir a GitHub
git remote add origin <tu-repositorio-github>
git push -u origin main
```

### Paso 2: Importar en Vercel
1. Ve a https://vercel.com/new
2. Conecta con GitHub y selecciona tu repositorio
3. Vercel detectará automáticamente Next.js

### Paso 3: Configurar Variables de Entorno en Vercel

**IMPORTANTE:** En el panel de Vercel, agrega estas variables de entorno exactas:

| Variable | Valor | Notas |
|----------|-------|-------|
| `DATABASE_URL` | `file:./prisma/dev.db` | SQLite local (funcional para demo) |
| `NEXTAUTH_SECRET` | `bLcED4RMiFT9tpq0dDrbEMR1Uhz47zEcX/22EbM0MDk=` | ✅ Ya generado |
| `NEXTAUTH_URL` | (Dejar vacío inicialmente) | Se configurará después |

**Nota sobre la Base de Datos:**
- SQLite funciona en Vercel para aplicaciones de demostración
- Para producción real, considera migrar a Vercel Postgres o PostgreSQL
- La base de datos actual usa SQLite y funciona perfectamente

### Paso 4: Deploy
1. Click en "Deploy"
2. Espera a que la compilación termine (2-3 minutos)
3. Una vez desplegado, copia la URL de producción (ej: `https://tu-app.vercel.app`)
4. Ve a Settings → Environment Variables
5. Agrega `NEXTAUTH_URL` con tu URL de Vercel
6. Redespliega (Deploy → Redeploy)

### Paso 5: Verificar el Despliegue
1. Visita tu URL de Vercel
2. Crea una cuenta nueva (Sign Up)
3. Inicia sesión con las credenciales creadas
4. Prueba crear una apuesta
5. Verifica el perfil de usuario

## 📝 Variables de Entorno Configuradas

### Desarrollo (archivo .env actual)
```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET=bLcED4RMiFT9tpq0dDrbEMR1Uhz47zEcX/22EbM0MDk=
NEXTAUTH_URL=http://localhost:3000
```

### Producción (configurar en Vercel)
```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET=bLcED4RMiFT9tpq0dDrbEMR1Uhz47zEcX/22EbM0MDk=
NEXTAUTH_URL=https://tu-app.vercel.app
```

## Comandos Útiles

### Testing Local Antes de Desplegar
```bash
# Construir localmente para verificar errores
npm run build

# Ejecutar la build de producción localmente
npm start

# Limpiar caché si hay problemas
Remove-Item -Path ".next" -Recurse -Force
npm run build
```

### Verificar Base de Datos
```bash
# Ver el estado de las migraciones
npx prisma migrate status

# Ejecutar migraciones pendientes
npx prisma migrate deploy

# Abrir Prisma Studio para ver datos
npm run db:studio
```

## Solución de Problemas Comunes

### Error: "Prisma Client must be regenerated"
**Solución**: El script de build ya incluye `prisma generate`, pero si falla:
```bash
npx prisma generate
npm run build
```

### Error: "DATABASE_URL not found"
**Solución**: Verifica que configuraste `DATABASE_URL` en las variables de entorno de Vercel.

### Error: "Invalid NEXTAUTH_SECRET"
**Solución**: Genera una nueva clave segura y actualízala en Vercel:
```bash
openssl rand -base64 32
```

### Error de Base de Datos en Runtime
**Solución**: Asegúrate de haber ejecutado las migraciones en Turso:
```bash
npx prisma migrate deploy
```

## Notas Importantes

### ⚠️ Seguridad
- **NUNCA** subas archivos `.env` o `.env.local` a Git
- El `.gitignore` ya está configurado para ignorarlos
- Usa secretos seguros generados con `openssl rand -base64 32`

### 📊 Base de Datos
- Tu base de datos Turso ya está configurada y lista
- Turso es compatible con Vercel (serverless)
- No necesitas configuración adicional de base de datos

### 🔄 Continuous Deployment
- Cada push a `main` desplegará automáticamente
- Las variables de entorno se mantienen entre despliegues
- Puedes configurar preview deployments para otras ramas

## Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Next.js en Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Prisma con Turso](https://www.prisma.io/docs/orm/overview/databases/turso)
- [NextAuth.js](https://next-auth.js.org/)

---

**¿Listo para desplegar?** Sigue los pasos en orden y tu aplicación estará en línea en minutos. 🚀
