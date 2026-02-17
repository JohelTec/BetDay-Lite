Este es un proyecto de [Next.js](https://nextjs.org) creado con [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🎲 BetDay Lite - Plataforma de Apuestas Deportivas

Una aplicación moderna de apuestas deportivas construida con Next.js 15+, React 18+, TypeScript, Prisma y NextAuth. Realiza apuestas en eventos deportivos diarios con una interfaz hermosa, responsiva y persistencia real en base de datos.

## 📋 Tabla de Contenidos

- [Inicio Rápido](#-inicio-rápido)
- [Características](#-características)
- [Stack Tecnológico](#️-stack-tecnológico)
- [Esquema de Base de Datos](#️-esquema-de-base-de-datos)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Autenticación](#-autenticación)
- [Características UI/UX](#-características-uiux)
- [Despliegue](#-despliegue)
- [Desarrollo](#-desarrollo)
- [Endpoints API](#-endpoints-api)
- [Rutas Protegidas](#-rutas-protegidas)
- [Documentación](#-documentación)
- [Solución de Problemas](#-solución-de-problemas)
- [Mejoras Futuras](#-mejoras-futuras)

## ⚡ Inicio Rápido

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env  # o crear .env manualmente

# Configurar base de datos
npx prisma generate
npx prisma migrate dev

# Crear usuario de prueba
npm run db:seed

# Iniciar servidor de desarrollo
npm run dev
```

Visita [http://localhost:3000](http://localhost:3000) e inicia sesión con:
- **Email**: test@example.com
- **Contraseña**: 123456

## 🚀 Características

### Características Principales
- **📅 Línea de Tiempo Diaria**: Explora eventos deportivos organizados por hora con mercados de apuestas 1X2
- **🔐 Autenticación Segura**: Autenticación real de usuarios con hash de contraseñas (bcryptjs)
- **💰 Realizar Apuestas**: Realiza apuestas en múltiples eventos deportivos con almacenamiento persistente
- **💵 Gestión de Saldo**: Sistema completo de balance con transacciones atómicas y precisión decimal
  - Cada usuario comienza con $1,000 de saldo virtual
  - Validación de saldo insuficiente antes de apostar
  - Actualización automática al ganar/perder apuestas
  - Precisión de 2 decimales en todas las operaciones
- **🎯 Montos Personalizables**: Elige cuánto apostar con input personalizado ($0.01 - $10,000)
- **👤 Perfil de Usuario**: Visualiza todas tus apuestas con estadísticas detalladas
  - Estados de apuesta: PENDIENTE, GANADA, PERDIDA
  - Estadísticas: tasa de acierto, ganancias/pérdidas, ROI
  - Visualización del saldo actual en tiempo real
- **📊 Detalles de Apuesta**: Vista detallada de apuestas individuales con información completa
- **💾 Persistencia en Base de Datos**: Base de datos SQLite con Prisma ORM
- **🎨 UI Moderna**: Diseño hermoso y responsivo con animaciones suaves
- **📱 Responsivo**: Totalmente optimizado para dispositivos móviles y escritorio

### Características Técnicas
- **Componentes de Servidor**: Aprovechando Next.js 15 App Router para rendimiento óptimo
- **Rutas API**: Endpoints API RESTful para gestión de eventos, apuestas y balance
- **Transacciones Atómicas**: Uso de `prisma.$transaction()` para operaciones de balance consistentes
- **Precisión Decimal**: Función `roundMoney()` para operaciones monetarias exactas (2 decimales)
- **Integración de Base de Datos**: Prisma ORM con SQLite para persistencia de datos
- **Seguridad de Contraseñas**: bcryptjs para hash seguro de contraseñas
- **Validación de Email**: Validación del lado del servidor con patrones regex
- **Validación de Balance**: Verificación de saldo suficiente antes de cada apuesta
- **Scripts de Base de Datos**: Scripts de utilidad para pruebas, gestión y validación
- **Estados de Carga**: UI de suspenso y carga en toda la aplicación
- **Rutas Protegidas**: Protección de rutas basada en middleware
- **Notificaciones Toast**: Retroalimentación en tiempo real usando Sonner
- **Seguridad de Tipos**: Implementación completa de TypeScript

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16.1.6 (soporta características de Next.js 15+)
- **React**: React 19.2.3 (totalmente compatible con APIs de React 18+)
- **TypeScript**: Seguridad de tipos completa
- **Base de Datos**: Prisma 5.22.0 + SQLite
- **Autenticación**: NextAuth 5.0.0 (beta para Next.js 15+)
- **Hash de Contraseñas**: bcryptjs
- **Estilos**: Tailwind CSS 4
- **Iconos**: Lucide React
- **Notificaciones**: Sonner

## 🗄️ Esquema de Base de Datos

### Modelo User
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String   // Hash con bcryptjs
  balance   Float    @default(1000.0)
  bets      Bet[]
  createdAt DateTime @default(now())
}
```

### Modelo Event
```prisma
model Event {
  id        String   @id
  league    String
  homeTeam  String
  awayTeam  String
  startTime DateTime
  oddsHome  Float
  oddsDraw  Float
  oddsAway  Float
  bets      Bet[]
  createdAt DateTime @default(now())
}
```

### Modelo Bet
```prisma
model Bet {
  id        String   @id @default(cuid())
  eventId   String
  userId    String
  selection String   // "1", "X", o "2"
  odds      Float
  amount    Float    // Monto de la apuesta con precisión de 2 decimales
  status    String   // "PENDING", "WON", o "LOST"
  createdAt DateTime @default(now())
  
  event     Event    @relation(fields: [eventId], references: [id])
  user      User     @relation(fields: [userId], references: [id])
}
```

## 💰 Sistema de Gestión de Balance

### Características del Balance

**Saldo Inicial**: Cada usuario comienza con $1,000.00 al registrarse

**Transacciones Atómicas**: Todas las operaciones de balance utilizan `prisma.$transaction()` para garantizar consistencia ACID:
- Crear apuesta → Descontar saldo
- Ganar apuesta → Agregar ganancias (monto × cuota)
- Perder apuesta → Sin cambios (ya descontado al apostar)

**Precisión Decimal**: Función `roundMoney()` para operaciones exactas:
```typescript
function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
```

**Validaciones**:
- ✅ Monto mínimo: $0.01
- ✅ Monto máximo: $10,000.00
- ✅ Verificación de saldo insuficiente
- ✅ Protección contra valores negativos
- ✅ Redondeo automático a 2 decimales

### Flujo de Apuesta

1. **Usuario selecciona monto**: Input personalizable con botones rápidos ($5, $10, $25, $50, $100)
2. **Validación de saldo**: Sistema verifica que `user.balance >= amount`
3. **Transacción atómica**:
   ```typescript
   await prisma.$transaction(async (tx) => {
     // Crear apuesta
     const bet = await tx.bet.create({ ... });
     // Descontar del saldo
     await tx.user.update({
       data: { balance: { decrement: roundedAmount } }
     });
   });
   ```
4. **Actualización en UI**: Balance actualizado automáticamente

### Resolución de Apuestas

**Apuesta Ganada** (Status: WON):
```typescript
const winnings = roundMoney(bet.amount * bet.odds);
await tx.user.update({
  data: { balance: { increment: winnings } }
});
```

**Apuesta Perdida** (Status: LOST):
- No hay cambios en el balance (ya se descontó al apostar)
- El monto apostado se pierde

### Ejemplos de Cálculo

**Ejemplo 1: Apuesta Simple**
```
Balance inicial: $100.00
Apuesta: $20.00 @ 1.67 odds
Balance después de apostar: $80.00
Si GANA → +$33.40 → Balance final: $113.40
Si PIERDE → $0.00 → Balance final: $80.00
```

**Ejemplo 2: Múltiples Apuestas**
```
Balance inicial: $100.00
Apuesta 1: -$20.00 @ 1.67 → Balance: $80.00
Apuesta 1 GANADA: +$33.40 → Balance: $113.40
Apuesta 2: -$10.00 @ 3.50 → Balance: $103.40
Apuesta 2 PERDIDA: $0.00 → Balance final: $103.40
Ganancia neta: +$3.40
```

## 🏗️ Decisiones Clave de Arquitectura

### ¿Por qué Prisma?
- **Seguridad de Tipos**: Tipos TypeScript auto-generados desde el schema
- **Experiencia del Desarrollador**: API intuitiva y excelentes herramientas
- **Migraciones**: Sistema de migración integrado para cambios de schema
- **Agnóstico de Base de Datos**: Fácil cambiar de SQLite a PostgreSQL

### ¿Por qué SQLite (Desarrollo)?
- **Cero Configuración**: No requiere configuración de servidor de base de datos
- **Desarrollo Rápido**: Inicio inmediato sin dependencias externas
- **Pruebas Fáciles**: Simple de resetear y poblar datos
- **Nota de Producción**: Reemplazar con PostgreSQL para despliegues en producción

### ¿Por qué NextAuth?
- **Soporte Oficial**: Mantenido por el equipo de Next.js
- **Flexible**: Soporta múltiples proveedores de autenticación
- **Seguro**: Protección CSRF integrada y manejo seguro de sesiones
- **Integración Next.js**: Integración perfecta con App Router

### ¿Por qué bcryptjs?
- **Seguridad**: Hash de contraseñas estándar de la industria
- **Resistente a Ataques**: Protección contra tablas rainbow y fuerza bruta
- **Configurable**: Rondas de salt ajustables para balance seguridad/rendimiento

### Estructura del Proyecto
- **App Router**: Aprovechando Next.js 15+ App Router para mejor rendimiento
- **Componentes de Servidor**: Por defecto componentes de servidor para tamaño de bundle óptimo
- **Rutas API**: Lógica de negocio centralizada en rutas API
- **Middleware**: Protección de rutas en el edge para mejor rendimiento

## 📦 Instalación

### Requisitos Previos
- **Node.js**: 18.0.0 o superior
- **npm**: 9.0.0 o superior (viene con Node.js)
- **Git**: Para clonar el repositorio

Verifica tus versiones:
```bash
node --version
npm --version
```

### Pasos

1. **Clonar el repositorio**
```bash
git clone <url-de-tu-repositorio>
cd my-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en el directorio raíz:
```env
# Base de Datos
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-clave-secreta-cambiar-en-produccion
```

**Detalles de Variables de Entorno:**

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | Cadena de conexión a la base de datos | `file:./dev.db` (SQLite) o cadena de conexión PostgreSQL |
| `NEXTAUTH_URL` | URL de tu aplicación | `http://localhost:3000` (dev) o `https://tuapp.com` (prod) |
| `NEXTAUTH_SECRET` | Clave secreta para firma JWT | Generar con `openssl rand -base64 32` |

> **Nota**: Para producción, genera una clave secreta segura usando:
> ```bash
> openssl rand -base64 32
> ```

4. **Configurar la base de datos**
```bash
# Generar Prisma Client
npx prisma generate

# Ejecutar migraciones para crear el schema de la base de datos
npx prisma migrate dev

# Crear un usuario de prueba (opcional)
npm run db:seed
```

Esto crea un usuario de prueba con:
- **Email**: test@example.com
- **Contraseña**: 123456
- **Saldo**: $1000

5. **Ejecutar el servidor de desarrollo**
```bash
npm run dev
```

6. **Abrir tu navegador**

Navega a [http://localhost:3000](http://localhost:3000)

## 🎯 Uso

### Autenticación
1. Haz clic en "Iniciar Sesión" en la barra de navegación
2. Usa las credenciales del usuario de prueba (si ejecutaste `npm run db:seed`):
   - **Email**: test@example.com
   - **Contraseña**: 123456
3. O crea una nueva cuenta a través de la página de Registro
4. Serás autenticado y redirigido a la página de inicio con $1000 de saldo inicial

**Requisitos de Autenticación:**
- El email debe tener formato válido (usuario@dominio.com)
- La contraseña debe tener al menos 6 caracteres
- Las contraseñas se cifran de forma segura con bcryptjs

### Realizar Apuestas
1. Explora la línea de tiempo de eventos en la página de inicio
2. Cada evento muestra:
   - Mercado 1X2 (Local/Empate/Visitante)
   - Input para elegir monto de apuesta
   - Botones rápidos: $5, $10, $25, $50, $100
   - Retorno potencial calculado dinámicamente
3. Ingresa o selecciona el monto que deseas apostar
4. Haz clic en cualquier botón de cuota (Local/Empate/Visitante)
5. El sistema validará tu saldo y procesará la apuesta
6. Verás una notificación de éxito y tu balance actualizado
7. La apuesta aparecerá en tu perfil con estado PENDIENTE

**Ejemplo**: Si apuestas $25 en Local con cuota 1.67:
- Balance antes: $100.00
- Balance después: $75.00
- Si ganas: +$41.75 → Balance final: $116.75

### Visualizar Tus Apuestas y Balance
1. Haz clic en "Perfil" en la navegación
2. En la cabecera verás:
   - Tu email
   - **Saldo actual** en una tarjeta destacada
   - Tu nivel de usuario
3. Estadísticas principales:
   - Total de apuestas
   - Apuestas ganadas (color verde)
   - Apuestas perdidas (color rojo)
   - Apuestas pendientes (color amarillo)
4. Estadísticas avanzadas:
   - **Tasa de Acierto**: Porcentaje de apuestas ganadas
   - **Ganancia/Pérdida**: Balance positivo o negativo total
   - **ROI**: Retorno sobre inversión
   - **Cuota Promedio**: Promedio de todas las cuotas apostadas
5. Historial completo de apuestas con detalles
6. Haz clic en cualquier apuesta para ver información detallada

## 📂 Estructura del Proyecto

```
my-app/
├── prisma/
│   ├── schema.prisma                     # Schema de base de datos
│   └── migrations/                       # Migraciones de base de datos
├── scripts/
│   ├── clear-users.ts                    # Limpiar todos los usuarios
│   ├── create-test-user.ts               # Crear usuario de prueba
│   ├── test-credentials.ts               # Probar autenticación
│   └── README.md                         # Documentación de scripts
├── docs/
│   ├── VALIDACION-BD.md                  # Docs de validación de BD
│   └── VALIDACIONES-LOGIN.md             # Docs de validación de login
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts  # Endpoints de NextAuth
│   │   │   ├── events/route.ts               # API de Eventos
│   │   │   └── bets/
│   │   │       ├── route.ts                  # CRUD de Apuestas
│   │   │       └── [id]/route.ts             # Endpoint de apuesta individual
│   │   ├── auth/
│   │   │   ├── signin/page.tsx               # Página de inicio de sesión
│   │   │   └── signup/page.tsx               # Página de registro
│   │   ├── profile/page.tsx                  # Perfil de usuario
│   │   ├── bets/[id]/page.tsx               # Página de detalle de apuesta
│   │   ├── layout.tsx                        # Layout raíz
│   │   ├── page.tsx                          # Página de inicio
│   │   ├── loading.tsx                       # Carga global
│   │   └── not-found.tsx                     # Página 404
│   ├── components/
│   │   ├── Navbar.tsx                        # Componente de navegación
│   │   ├── EventCard.tsx                     # Tarjeta de evento
│   │   ├── BetCard.tsx                       # Tarjeta de apuesta
│   │   └── Loading.tsx                       # Componente de carga
│   ├── lib/
│   │   ├── types.ts                          # Tipos TypeScript
│   │   ├── data.ts                           # Gestión de datos
│   │   └── prisma.ts                         # Cliente Prisma
│   ├── auth.ts                               # Configuración NextAuth
│   └── middleware.ts                         # Protección de rutas
├── .env                                      # Variables de entorno
└── package.json                              # Dependencias y scripts
```

## 🔒 Autenticación

La aplicación usa NextAuth con Prisma y bcryptjs para autenticación segura:

### Características de Seguridad
- **Hash de Contraseñas**: Todas las contraseñas se cifran usando bcryptjs antes de almacenarse
- **Validación de Email**: Validación regex del lado del servidor para formato de email
- **Requisitos de Contraseña**: Mínimo 6 caracteres obligatorio
- **Persistencia en Base de Datos**: Datos de usuario almacenados de forma segura en SQLite vía Prisma
- **Gestión de Sesiones**: Sesiones seguras basadas en JWT

### Flujo de Autenticación
1. El usuario envía credenciales (email + contraseña)
2. El servidor valida formato de email y longitud de contraseña
3. Búsqueda en base de datos encuentra usuario por email
4. La contraseña se compara con la versión cifrada usando bcryptjs
5. En caso de éxito, se genera un token JWT y se crea la sesión

### Recomendaciones para Producción
- **Usar PostgreSQL**: Reemplazar SQLite con PostgreSQL para producción
- **Agregar Rate Limiting**: Implementar limitación de tasa en endpoints de autenticación
- **Habilitar 2FA**: Agregar soporte de autenticación de dos factores
- **Agregar OAuth**: Implementar inicio de sesión social (Google, GitHub, etc.)
- **Usar Variables de Entorno**: Asegurar todas las credenciales sensibles

## 🎨 Características UI/UX

- **Fondos de Gradiente**: Esquemas de color de gradiente modernos
- **Animaciones Suaves**: Transiciones de escala y color en las interacciones
- **Grid Responsivo**: Diseños adaptativos para todos los tamaños de pantalla
- **Indicadores de Estado**: Estados de apuesta codificados por color
- **Estados Vacíos**: Mensajes útiles cuando no hay datos disponibles
- **Estados de Carga**: Pantallas de esqueleto y spinners
- **Notificaciones Toast**: Retroalimentación en tiempo real para acciones del usuario

## 🚀 Despliegue

### Vercel (Recomendado)

1. **Sube tu código a GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <url-de-tu-repositorio>
git push -u origin main
```

2. **Configura una base de datos de producción**
   
   **⚠️ Importante**: SQLite no es adecuado para despliegues serverless como Vercel. Usa una de estas opciones:
   
   - **Opción A - Vercel Postgres** (Recomendada)
     ```bash
     # Agrega Vercel Postgres a tu proyecto
     # Actualiza prisma/schema.prisma datasource a postgresql
     ```
   
   - **Opción B - PostgreSQL Externo**
     - Usa proveedores como Supabase, Railway o Neon
     - Obtén tu cadena de conexión
     - Actualiza la variable de entorno DATABASE_URL

3. **Despliega en Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente Next.js
   - Agrega variables de entorno:
     - `DATABASE_URL`: Tu cadena de conexión PostgreSQL
     - `NEXTAUTH_URL`: Tu URL de producción (ej: https://tu-app.vercel.app)
     - `NEXTAUTH_SECRET`: Genera con `openssl rand -base64 32`

4. **Ejecuta migraciones en producción**
   ```bash
   npx prisma migrate deploy
   ```

5. **¡Listo!** Tu aplicación está ahora en vivo

### Alternativa: Despliegue con Docker

Para auto-hospedaje con SQLite, usa Docker:
```bash
docker build -t betday-lite .
docker run -p 3000:3000 betday-lite
```

## 🔧 Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo
npm run build           # Construir para producción
npm start               # Iniciar servidor de producción
npm run lint            # Ejecutar ESLint

# Base de Datos
npm run db:studio       # Abrir Prisma Studio
npm run db:seed         # Crear usuario de prueba
npm run db:clear        # Limpiar todos los usuarios
npm run db:test         # Probar autenticación

# Testing y Validación
npm run test:login      # Probar validaciones de login
npm run test:db         # Probar credenciales de base de datos
npm run test:user       # Probar validación de usuario
npm run test:balance    # Probar sistema completo de balance
npm run test:decimal    # Probar precisión decimal en operaciones
```

### Construir para Producción
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

### Gestión de Base de Datos

#### Prisma Studio
Visualizar y editar tu base de datos en el navegador:
```bash
npm run db:studio
```

#### Gestión de Usuarios de Prueba
```bash
# Crear usuario de prueba (test@example.com / 123456)
npm run db:seed

# Limpiar todos los usuarios y apuestas
npm run db:clear

# Probar sistema de autenticación
npm run db:test
```

#### Scripts de Validación
```bash
# Probar validaciones de login
npm run test:login

# Probar credenciales de base de datos
npm run test:db

# Probar validación de usuario
npm run test:user

# Probar sistema completo de balance
npm run test:balance

# Probar precisión decimal en operaciones monetarias
npm run test:decimal
```

**Test de Balance**: Valida:
- ✅ Creación de usuario con saldo inicial
- ✅ Descuento correcto al crear apuesta
- ✅ Actualización automática al ganar
- ✅ Validación de saldo insuficiente
- ✅ Balance final después de múltiples operaciones

**Test de Precisión Decimal**: Valida:
- ✅ Operaciones con decimales simples ($10.25)
- ✅ Multiplicaciones con decimales (10.25 × 1.67)
- ✅ Múltiples operaciones pequeñas sin acumulación de error
- ✅ Redondeo correcto a 2 decimales en todos los casos

#### Comandos de Prisma
```bash
# Generar Prisma Client después de cambios en el schema
npx prisma generate

# Crear una nueva migración
npx prisma migrate dev --name nombre_de_tu_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Resetear base de datos (⚠️ elimina todos los datos)
npx prisma migrate reset
```

## 📝 Endpoints API

### Autenticación
- `POST /api/auth/signin` - Iniciar sesión con email y contraseña
- `POST /api/auth/signup` - Crear nueva cuenta de usuario
- `POST /api/auth/signout` - Cerrar sesión del usuario actual

### Eventos
- `GET /api/events` - Obtener todos los eventos del día

### Apuestas
- `POST /api/bets` - Crear una nueva apuesta (requiere autenticación)
  - Body: `{ eventId, selection, amount }`
  - Validaciones: monto > 0, saldo suficiente
  - Efecto: Descuenta `amount` del balance del usuario
  - Respuesta: Apuesta creada con status PENDING
- `GET /api/bets` - Obtener apuestas del usuario actual (requiere autenticación)
- `GET /api/bets/[id]` - Obtener detalles de apuesta específica (requiere autenticación)
- `PATCH /api/bets/[id]` - Actualizar estado de apuesta (administrador)
  - Body: `{ status: "WON" | "LOST" }`
  - Efecto WON: Agrega `amount × odds` al balance del usuario
  - Efecto LOST: Sin cambios en balance

### Balance
- `GET /api/user/balance` - Obtener saldo actual del usuario (requiere autenticación)
  - Respuesta: `{ email, balance }`

### Formatos de Respuesta
Todas las respuestas API siguen el formato JSON estándar:
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

## 🔐 Rutas Protegidas

Las siguientes rutas requieren autenticación (manejadas por middleware):
- `/profile`
- `/bets/[id]`

Los usuarios no autenticados serán redirigidos a la página de inicio de sesión.

## 📚 Documentación

Documentación adicional disponible en el proyecto:

### Guías Generales
- **[DEPLOY.md](DEPLOY.md)**: Guía detallada de despliegue para Vercel y otras plataformas
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)**: Problemas comunes y soluciones

### Documentación Técnica
- **[docs/VALIDACION-BD.md](docs/VALIDACION-BD.md)**: Documentación de validación de base de datos
- **[docs/VALIDACIONES-LOGIN.md](docs/VALIDACIONES-LOGIN.md)**: Flujo de validación de login
- **[docs/SISTEMA-SALDO.md](docs/SISTEMA-SALDO.md)**: Documentación técnica del sistema de balance
- **[docs/IMPLEMENTACION-SALDO.md](docs/IMPLEMENTACION-SALDO.md)**: Resumen de implementación del balance
- **[docs/PRECISION-DECIMAL.md](docs/PRECISION-DECIMAL.md)**: Manejo de precisión decimal en operaciones

### Scripts y Utilidades
- **[scripts/README.md](scripts/README.md)**: Documentación de scripts de base de datos y testing

## 🐛 Solución de Problemas

### Problemas de Base de Datos
```bash
# Resetear base de datos si las migraciones fallan
npx prisma migrate reset

# Regenerar Prisma Client
npx prisma generate
```

### Problemas de Autenticación
```bash
# Verificar que existe el usuario de prueba
npm run db:test

# Verificar credenciales de base de datos
npm run test:db
```

### Errores de Compilación
```bash
# Limpiar caché de Next.js
rm -rf .next

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

Para solución de problemas más detallada, consulta [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

## 🎯 Mejoras Futuras

### Funcionalidades
- **Actualizaciones en Tiempo Real**: Integración de WebSocket para cuotas y marcadores en vivo
- **Marcadores de Partidos en Vivo**: Integración con APIs de datos deportivos
- **Tipos de Apuesta Avanzados**: Over/under, handicap, resultado correcto
- **Boleto de Apuestas**: Múltiples selecciones en una sola apuesta (acumuladas)
- **Características Sociales**: Compartir apuestas, tablas de clasificación, seguir a otros usuarios
- **Historial de Transacciones**: Log detallado de todos los movimientos de balance
- **Notificaciones Push**: Notificaciones de resultados de apuestas en tiempo real

### Balance y Pagos
- **Depósitos Virtuales**: Sistema simulado de recarga de saldo
- **Retiros**: Sistema de retiro de ganancias simulado
- **Historial de Balance**: Gráfica temporal de evolución del saldo
- **Límites Personalizables**: Permitir al usuario establecer límites diarios/semanales
- **Decimal Type**: Migrar de Float a Decimal en Prisma para mayor precisión

### Administración
- **Panel de Administración**: Gestionar eventos, usuarios y apuestas
- **Resolución Manual**: Interface para marcar apuestas como ganadas/perdidas
- **Ajustes de Balance**: Herramientas para administrar saldos de usuarios
- **Reportes**: Estadísticas globales de la plataforma

### Seguridad
- **Autenticación de Dos Factores**: Seguridad mejorada con 2FA
- **Juego Responsable**: Establecer límites de apuestas y autoexclusión
- **Rate Limiting**: Limitar número de apuestas por usuario/tiempo

### Infraestructura
- **Migración PostgreSQL**: Soporte completo de PostgreSQL para producción
- **Caché con Redis**: Mejorar rendimiento con caché de eventos y cuotas
- **CDN**: Optimización de assets estáticos
- **Monitoreo**: Integración con herramientas de APM (Sentry, New Relic)

## 📄 Licencia

Este proyecto es para fines demostrativos y educativos.

## 👨‍💻 Autor

Construido como un desafío técnico para demostrar competencia con tecnologías web modernas incluyendo:
- Next.js 15+ App Router
- React 19 Componentes de Servidor
- Prisma ORM con SQLite
- Autenticación NextAuth
- TypeScript
- Tailwind CSS 4

## 🙏 Agradecimientos

- Equipo de Next.js por el increíble framework
- Equipo de Prisma por el excelente ORM
- Equipo de NextAuth por las soluciones de autenticación
- Vercel por la plataforma de hosting

---

**Nota**: Esta es una aplicación de apuestas demostrativa con fines educativos. Aunque utiliza persistencia real en base de datos y autenticación segura, no involucra dinero real. La aplicación usa eventos y saldos simulados.
