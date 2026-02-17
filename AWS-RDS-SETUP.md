# 🐘 Configuración para AWS RDS Aurora PostgreSQL

## Variables de Entorno Disponibles (de la imagen)

De tu AWS RDS Aurora PostgreSQL tienes:
- `PGDATABASE` - Nombre de la base de datos
- `PGHOST` - Host del servidor
- `PGPORT` - Puerto (generalmente 5432)
- `PGSSLMODE` - Modo SSL

También necesitarás:
- Usuario de la base de datos
- Contraseña de la base de datos

## Construir las URLs de Conexión

### Formato de URL de PostgreSQL:
```
postgresql://[usuario]:[contraseña]@[host]:[puerto]/[database]?sslmode=[sslmode]
```

### Para tu .env

**IMPORTANTE:** Necesitas obtener el usuario y la contraseña de tu base de datos AWS RDS.

Si las variables de AWS que ves son:
- PGDATABASE=nombre_db
- PGHOST=tu-cluster.cluster-xxxxx.region.rds.amazonaws.com
- PGPORT=5432
- PGSSLMODE=require

Y tu usuario/contraseña son:
- Usuario: postgres (o el que hayas configurado)
- Contraseña: tu_contraseña

Entonces tu `.env` debe ser:

```env
# AWS RDS Aurora PostgreSQL
DATABASE_URL="postgresql://postgres:tu_contraseña@tu-cluster.cluster-xxxxx.region.rds.amazonaws.com:5432/nombre_db?sslmode=require"
DIRECT_URL="postgresql://postgres:tu_contraseña@tu-cluster.cluster-xxxxx.region.rds.amazonaws.com:5432/nombre_db?sslmode=require"

# NextAuth
NEXTAUTH_SECRET=bLcED4RMiFT9tpq0dDrbEMR1Uhz47zEcX/22EbM0MDk=
NEXTAUTH_URL=http://localhost:3000
```

## ¿Cómo Obtener las Credenciales?

### Opción 1: AWS Console
1. Ve a AWS RDS Console
2. Selecciona tu cluster "Día del Día"
3. En la pestaña "Configuration", verás:
   - Endpoint (PGHOST)
   - Port (PGPORT)
   - Master username (usuario)
4. La contraseña la configuraste al crear la BD (no se puede recuperar, solo restablecer)

### Opción 2: Variables de Entorno de AWS
Si tienes acceso a todas las variables de AWS, busca:
- `PGUSER` o similar
- `PGPASSWORD` o similar

### Opción 3: AWS Secrets Manager
Si las credenciales están en Secrets Manager:
1. Ve a AWS Secrets Manager
2. Busca el secreto asociado a tu RDS
3. Revélalo para ver usuario/contraseña

## ⚠️ Si No Tienes la Contraseña

Si no recuerdas/tienes la contraseña:

### Resetear Contraseña en AWS RDS:
1. Ve a AWS RDS Console
2. Selecciona tu cluster
3. Click en "Modify"
4. En "Settings", cambia la contraseña maestra
5. Aplica los cambios inmediatamente

## Ejemplo Completo

Supongamos que tus valores son:
- PGHOST: `rds-betday-q-mthd1ertgzam5f.cluster-xxxxx.us-east-1.rds.amazonaws.com`
- PGPORT: `5432`
- PGDATABASE: `betday`
- PGUSER: `postgres`
- PGPASSWORD: `MiContraseñaSegura123`
- PGSSLMODE: `require`

Tu `.env` quedaría:

```env
DATABASE_URL="postgresql://postgres:MiContraseñaSegura123@rds-betday-q-mthd1ertgzam5f.cluster-xxxxx.us-east-1.rds.amazonaws.com:5432/betday?sslmode=require"
DIRECT_URL="postgresql://postgres:MiContraseñaSegura123@rds-betday-q-mthd1ertgzam5f.cluster-xxxxx.us-east-1.rds.amazonaws.com:5432/betday?sslmode=require"
NEXTAUTH_SECRET=bLcED4RMiFT9tpq0dDrbEMR1Uhz47zEcX/22EbM0MDk=
NEXTAUTH_URL=http://localhost:3000
```

## Una Vez que Tengas las URLs

```bash
# 1. Actualizar .env con las URLs correctas
# 2. Regenerar Prisma Client
npx prisma generate

# 3. Crear las tablas en AWS RDS
npx prisma migrate dev --name init

# 4. Verificar conexión
npm run db:studio

# 5. Crear datos de prueba
npm run db:seed

# 6. Iniciar servidor
npm run dev
```

## Configuración en Vercel (cuando despliegues)

En las variables de entorno de Vercel, agrega:
- `DATABASE_URL`: Tu URL completa de PostgreSQL
- `DIRECT_URL`: La misma URL (para migraciones)
- `NEXTAUTH_SECRET`: `bLcED4RMiFT9tpq0dDrbEMR1Uhz47zEcX/22EbM0MDk=`
- `NEXTAUTH_URL`: Tu URL de Vercel

## Solución de Problemas

### Error: "Connection timed out"
- Verifica que tu IP está en el Security Group de AWS RDS
- En AWS RDS → Security Groups → Inbound rules → Agregar tu IP

### Error: "Authentication failed"
- Usuario o contraseña incorrectos
- Resetea la contraseña en AWS RDS Console

### Error: "SSL required"
- Asegúrate de tener `?sslmode=require` al final de la URL

---

**¿Necesitas ayuda para obtener las credenciales o configurar la conexión?**
