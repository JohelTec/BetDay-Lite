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
- **💵 Saldo de Usuario**: Cada usuario comienza con $1000 de saldo virtual
- **👤 Perfil de Usuario**: Visualiza todas tus apuestas con su estado (PENDIENTE, GANADA, PERDIDA)
- **📊 Detalles de Apuesta**: Vista detallada de apuestas individuales con información completa
- **💾 Persistencia en Base de Datos**: Base de datos SQLite con Prisma ORM
- **🎨 UI Moderna**: Diseño hermoso y responsivo con animaciones suaves
- **📱 Responsivo**: Totalmente optimizado para dispositivos móviles y escritorio

### Características Técnicas
- **Componentes de Servidor**: Aprovechando Next.js 15 App Router para rendimiento óptimo
- **Rutas API**: Endpoints API RESTful para gestión de eventos y apuestas
- **Integración de Base de Datos**: Prisma ORM con SQLite para persistencia de datos
- **Seguridad de Contraseñas**: bcryptjs para hash seguro de contraseñas
- **Validación de Email**: Validación del lado del servidor con patrones regex
- **Scripts de Base de Datos**: Scripts de utilidad para pruebas y gestión de base de datos
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
  amount    Float
  status    String   // "PENDING", "WON", o "LOST"
  createdAt DateTime @default(now())
}
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
2. Cada evento muestra el mercado 1X2 (Local/Empate/Visitante)
3. Haz clic en cualquier botón de cuota para realizar una apuesta
4. Verás una notificación de éxito y la apuesta se guardará

### Visualizar Tus Apuestas
1. Haz clic en "Perfil" en la navegación
2. Visualiza todas tus apuestas con su estado
3. Ve estadísticas: Total, Ganadas, Perdidas y Apuestas Pendientes
4. Haz clic en cualquier tarjeta de apuesta para ver información detallada

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
```

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
  - Body: `{ eventId, selection, odds, amount }`
- `GET /api/bets` - Obtener apuestas del usuario actual (requiere autenticación)
- `GET /api/bets/[id]` - Obtener detalles de apuesta específica (requiere autenticación)

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

- **[DEPLOY.md](DEPLOY.md)**: Guía detallada de despliegue para Vercel y otras plataformas
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)**: Problemas comunes y soluciones
- **[docs/VALIDACION-BD.md](docs/VALIDACION-BD.md)**: Documentación de validación de base de datos
- **[docs/VALIDACIONES-LOGIN.md](docs/VALIDACIONES-LOGIN.md)**: Flujo de validación de login
- **[scripts/README.md](scripts/README.md)**: Documentación de scripts de base de datos

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

- **Actualizaciones en Tiempo Real**: Integración de WebSocket para cuotas y marcadores en vivo
- **Marcadores de Partidos en Vivo**: Integración con APIs de datos deportivos
- **Tipos de Apuesta Avanzados**: Over/under, handicap, resultado correcto
- **Boleto de Apuestas**: Múltiples selecciones en una sola apuesta
- **Gestión de Saldo de Usuario**: Depósitos, retiros, historial de transacciones
- **Características Sociales**: Compartir apuestas, tablas de clasificación, seguir a otros usuarios
- **Migración PostgreSQL**: Soporte completo de PostgreSQL para producción
- **Panel de Administración**: Gestionar eventos, usuarios y apuestas
- **Notificaciones Push**: Notificaciones de resultados de apuestas en tiempo real
- **Autenticación de Dos Factores**: Seguridad mejorada con 2FA
- **Juego Responsable**: Establecer límites de apuestas y autoexclusión
- **Panel de Analíticas**: Estadísticas e insights de apuestas

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
