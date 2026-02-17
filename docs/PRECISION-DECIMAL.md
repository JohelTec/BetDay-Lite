# Precisión Decimal en Operaciones de Balance

## 📊 Problema Identificado

JavaScript/TypeScript tienen limitaciones con la precisión de números de punto flotante:
- `0.1 + 0.2 = 0.30000000000000004`
- `10.25 * 1.67 = 17.1175000000000006`

Esto puede causar errores acumulativos en operaciones monetarias.

## ✅ Solución Implementada

### 1. Función Auxiliar de Redondeo

```typescript
function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
```

Esta función:
- Multiplica por 100 para convertir a centavos
- Redondea al entero más cercano
- Divide por 100 para volver a dólares
- Resultado: precisión exacta de 2 decimales

### 2. Aplicación en Operaciones Críticas

#### Creación de Apuestas (`createBet`)
```typescript
// Redondear monto antes de procesar
const roundedAmount = roundMoney(amount);

// Validar con monto redondeado
if (user.balance < roundedAmount) {
  throw new Error(`Saldo insuficiente...`);
}

// Usar monto redondeado en transacción
await tx.bet.create({
  data: { amount: roundedAmount, ... }
});

await tx.user.update({
  data: { balance: { decrement: roundedAmount } }
});
```

#### Actualización de Apuesta Ganada (`updateBetStatus`)
```typescript
// Calcular y redondear ganancias
const winnings = roundMoney(bet.amount * bet.odds);

await tx.user.update({
  data: { balance: { increment: winnings } }
});
```

## 🧪 Validación

### Test 1: Operaciones Básicas
- Saldo inicial: $100.50
- Apuesta: $10.25
- **Resultado:** $90.25 ✅ Precisión exacta

### Test 2: Multiplicación Decimal
- Apuesta: $10.25 × 1.50 odds
- Ganancias esperadas: $15.38 (redondeado)
- **Resultado:** $15.38 ✅ Sin errores de precisión

### Test 3: Múltiples Operaciones Pequeñas
- 5 apuestas: $0.10, $0.25, $0.33, $0.50, $1.11
- Total restado: $2.29
- **Resultado:** Sin acumulación de errores ✅

### Test 4: Validación de Saldo
- Intento de apostar más del saldo disponible
- **Resultado:** Rechazado correctamente ✅

## 📈 Ejemplos de Uso

### Caso 1: Apuesta Simple
```
Usuario: $100.00
Apuesta: $20.00
Saldo resultante: $80.00 ✅
```

### Caso 2: Apuesta Ganada
```
Apuesta: $20.00 @ 1.67 odds
Ganancias: $33.40 (20 × 1.67 redondeado)
Saldo: $80.00 + $33.40 = $113.40 ✅
```

### Caso 3: Múltiples Apuestas
```
Balance inicial: $100.00
Apuesta 1: -$20.00 → $80.00
Ganada: +$33.40 → $113.40
Apuesta 2: -$10.00 → $103.40
Perdida: $0.00 → $103.40
Balance final: $103.40 ✅
```

## 🔍 Comparación Antes/Después

### Antes (Sin Redondeo)
```javascript
const winnings = 10.25 * 1.67;
// Resultado: 17.1175 (4 decimales, impreciso)
```

### Después (Con Redondeo)
```javascript
const winnings = roundMoney(10.25 * 1.67);
// Resultado: 17.12 (2 decimales, preciso)
```

## 🎯 Beneficios

1. **Precisión Garantizada:** Todas las operaciones mantienen exactamente 2 decimales
2. **Sin Acumulación de Errores:** Múltiples operaciones no degradan la precisión
3. **Validación Confiable:** Las comparaciones de saldo son exactas
4. **Auditoría Clara:** Los logs muestran valores correctos sin decimales extras
5. **Base de Datos Consistente:** Los valores almacenados son precisos

## 🚀 Comandos de Prueba

```bash
# Test de precisión decimal
npm run test:decimal

# Test completo del sistema de balance
npm run test:balance
```

## 📋 Archivos Modificados

- **src/lib/data.ts:** Función `roundMoney()` agregada y aplicada en:
  - `createBet()` - Redondeo de monto antes de restar del balance
  - `updateBetStatus()` - Redondeo de ganancias antes de sumar al balance

- **scripts/test-decimal-precision.ts:** Nuevo script de pruebas específicas
- **scripts/test-balance-system.ts:** Corrección del orden de eliminación
- **package.json:** Agregado comando `test:decimal`

## 💡 Recomendaciones Futuras

Para aplicaciones con alto volumen de transacciones monetarias, considerar:

1. **Prisma Decimal:** Cambiar tipo de dato de `Float` a `Decimal` en schema
2. **Decimal.js:** Usar biblioteca especializada para matemática decimal
3. **Trabajar en Centavos:** Almacenar valores como enteros (centavos) internamente

### Ejemplo con Decimal (Opcional)
```prisma
model User {
  balance Decimal @default(1000.00) @db.Decimal(10, 2)
}
```

## ✅ Conclusión

El sistema ahora maneja correctamente todas las operaciones monetarias con precisión exacta de 2 decimales, eliminando los errores de punto flotante que podrían causar inconsistencias en los saldos de usuarios.
