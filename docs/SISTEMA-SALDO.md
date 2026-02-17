# Sistema de Gestión de Saldo de Usuario

## 📋 Descripción General

El sistema de gestión de saldo permite:
- **Descontar el monto** del saldo del usuario al crear una apuesta
- **Validar saldo suficiente** antes de permitir apuestas
- **Agregar ganancias** automáticamente cuando una apuesta es ganada
- **Transacciones atómicas** para garantizar consistencia de datos

## 🔄 Flujo de Apuestas

### 1. Crear Apuesta (POST /api/bets)

```typescript
// Request
{
  "eventId": "event-1",
  "selection": "1",  // "1" (Local), "X" (Empate), "2" (Visitante)
  "amount": 50.0
}
```

**Proceso:**
1. Valida que el usuario tenga sesión activa
2. Valida que el monto sea positivo
3. Verifica que el usuario tenga saldo suficiente
4. Crea la apuesta con estado `PENDING`
5. Descuenta el monto del saldo del usuario
6. Todo ocurre en una transacción atómica

**Respuestas:**
- `201`: Apuesta creada exitosamente
- `400`: Saldo insuficiente o monto inválido
- `401`: Usuario no autenticado
- `404`: Evento no encontrado

### 2. Actualizar Estado de Apuesta (PATCH /api/bets/[id])

```typescript
// Request
{
  "status": "WON"  // "WON", "LOST", o "PENDING"
}
```

**Proceso:**
1. Verifica que la apuesta exista y pertenezca al usuario
2. Valida que la apuesta esté en estado `PENDING`
3. Actualiza el estado de la apuesta
4. Si es `WON`, agrega las ganancias al saldo: `amount * odds`
5. Si es `LOST`, no hay cambios en el saldo (ya se descontó al crear)

**Respuestas:**
- `200`: Estado actualizado exitosamente
- `400`: Apuesta ya fue resuelta o estado inválido
- `401`: Usuario no autenticado
- `403`: La apuesta no pertenece al usuario
- `404`: Apuesta no encontrada

### 3. Consultar Saldo (GET /api/user/balance)

```typescript
// Response
{
  "email": "user@example.com",
  "balance": 1050.50
}
```

## 💡 Características Principales

### Validación de Saldo

```typescript
// En lib/data.ts - createBet()
if (user.balance < amount) {
  throw new Error(`Saldo insuficiente. Saldo disponible: $${user.balance.toFixed(2)}`);
}
```

### Transacciones Atómicas

Todas las operaciones que modifican el saldo usan transacciones Prisma para garantizar consistencia:

```typescript
await prisma.$transaction(async (tx) => {
  // Crear apuesta
  const bet = await tx.bet.create({ ... });
  
  // Actualizar saldo
  await tx.user.update({
    where: { id: user.id },
    data: { balance: { decrement: amount } }
  });
  
  return bet;
});
```

### Cálculo de Ganancias

Cuando una apuesta es marcada como `WON`:

```
Ganancias = Monto Apostado × Cuota
```

**Ejemplo:**
- Apuesta: $50
- Cuota: 2.50
- Ganancias: $50 × 2.50 = $125.00

El usuario recibe las ganancias completas (incluyendo su apuesta original).

## 📊 Estados de Apuesta

| Estado | Descripción | Impacto en Saldo |
|--------|-------------|------------------|
| `PENDING` | Apuesta creada, esperando resultado | Saldo descontado al crear |
| `WON` | Apuesta ganada | Se agregan ganancias (amount × odds) |
| `LOST` | Apuesta perdida | Sin cambios (ya se descontó) |

## 🧪 Pruebas

### Ejecutar Script de Prueba

```bash
npm run test:balance
```

Este script prueba:
1. ✅ Creación de usuario con saldo inicial
2. ✅ Descuento de saldo al crear apuesta
3. ✅ Actualización a estado ganado y agregado de ganancias
4. ✅ Validación de saldo insuficiente
5. ✅ Apuesta perdida (sin devolución)
6. ✅ Resumen completo del historial

### Ejemplo de Salida

```
🧪 === PRUEBA DEL SISTEMA DE GESTIÓN DE SALDO ===

1️⃣ Creando usuario de prueba...
✅ Usuario creado: saldo-test@example.com
   💰 Saldo inicial: $100.00

2️⃣ Evento seleccionado:
   Manchester United vs Liverpool
   Cuota Local (1): 2.50

3️⃣ Creando apuesta de $20...
✅ Apuesta creada: ID clmxxx...
   💸 Monto apostado: $20.00
   💰 Saldo anterior: $100.00
   💰 Saldo actual: $80.00

4️⃣ Simulando apuesta ganada...
✅ Apuesta ganada
   🎉 Ganancias: $50.00
   💰 Saldo antes de ganar: $80.00
   💰 Saldo final: $130.00

...
```

## 🔐 Seguridad

### Validaciones Implementadas

1. **Autenticación**: Todas las operaciones requieren sesión activa
2. **Autorización**: Solo el dueño puede actualizar sus apuestas
3. **Validación de Monto**: El monto debe ser mayor a 0
4. **Saldo Suficiente**: Se verifica antes de crear la apuesta
5. **Estado Inmutable**: No se puede cambiar el estado de apuestas ya resueltas

### Transacciones ACID

Todas las operaciones críticas usan transacciones de Prisma para garantizar:
- **Atomicidad**: Todo o nada
- **Consistencia**: El saldo siempre es correcto
- **Aislamiento**: Operaciones concurrentes no interfieren
- **Durabilidad**: Los cambios son permanentes

## 📝 Ejemplos de Uso

### Cliente Frontend

```typescript
// Crear apuesta
async function placeBet(eventId: string, selection: string, amount: number) {
  const response = await fetch('/api/bets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventId, selection, amount })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  
  return await response.json();
}

// Actualizar estado de apuesta (solo para pruebas o admin)
async function updateBetStatus(betId: string, status: 'WON' | 'LOST') {
  const response = await fetch(`/api/bets/${betId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  
  return await response.json();
}

// Obtener saldo
async function getBalance() {
  const response = await fetch('/api/user/balance');
  const data = await response.json();
  return data.balance;
}
```

### Manejo de Errores

```typescript
try {
  await placeBet('event-1', '1', 100);
} catch (error) {
  if (error.message.includes('Saldo insuficiente')) {
    alert('No tienes suficiente saldo para esta apuesta');
  } else if (error.message === 'Unauthorized') {
    // Redirigir a login
  } else {
    alert('Error al crear la apuesta');
  }
}
```

## 🎯 Mejoras Futuras

- [ ] Límites de apuesta máxima/mínima configurables
- [ ] Historial de transacciones de saldo
- [ ] Sistema de bonos y promociones
- [ ] Límites de pérdida diaria/semanal (juego responsable)
- [ ] Notificaciones de cambios de saldo
- [ ] Dashboard de administrador para gestionar saldos
- [ ] Exportar historial de transacciones (CSV, PDF)

## 📚 Referencias

- [Prisma Transactions](https://www.prisma.io/docs/concepts/components/prisma-client/transactions)
- [NextAuth.js](https://next-auth.js.org/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
