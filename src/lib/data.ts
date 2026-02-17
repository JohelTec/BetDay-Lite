import { Event, Bet, BetStatus } from "./types";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

// Función auxiliar para redondear valores monetarios a 2 decimales
function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

// Función para inicializar los eventos en la base de datos
async function initializeEvents() {
  try {
    const count = await prisma.event.count();
    
    if (count > 0) {
      console.log(`📊 Base de datos ya tiene ${count} eventos`);
      return;
    }

    const leagues = [
      "Premier League",
      "La Liga",
      "Bundesliga",
      "Serie A",
      "Ligue 1",
      "Liga MX",
      "Eredivisie",
      "Liga Portugal",
      "Copa Libertadores",
      "UEFA Champions League",
    ];
    
    const teams = [
      { home: "Manchester United", away: "Liverpool" },
      { home: "Barcelona", away: "Real Madrid" },
      { home: "Bayern Munich", away: "Borussia Dortmund" },
      { home: "Juventus", away: "Inter Milan" },
      { home: "PSG", away: "Marseille" },
      { home: "Arsenal", away: "Chelsea" },
      { home: "Atletico Madrid", away: "Sevilla" },
      { home: "RB Leipzig", away: "Bayer Leverkusen" },
      { home: "AC Milan", away: "Napoli" },
      { home: "Lyon", away: "Monaco" },
      { home: "Manchester City", away: "Tottenham" },
      { home: "Real Sociedad", away: "Valencia" },
      { home: "Freiburg", away: "Wolfsburg" },
      { home: "Roma", away: "Lazio" },
      { home: "Lens", away: "Nice" },
      { home: "América", away: "Chivas" },
      { home: "Tigres", away: "Monterrey" },
      { home: "Ajax", away: "PSV Eindhoven" },
      { home: "Feyenoord", away: "AZ Alkmaar" },
      { home: "Porto", away: "Benfica" },
      { home: "Sporting CP", away: "Braga" },
      { home: "Flamengo", away: "Palmeiras" },
      { home: "River Plate", away: "Boca Juniors" },
      { home: "São Paulo", away: "Corinthians" },
      { home: "West Ham", away: "Newcastle" },
      { home: "Villarreal", away: "Real Betis" },
      { home: "Union Berlin", away: "Eintracht Frankfurt" },
      { home: "Atalanta", away: "Fiorentina" },
      { home: "Lille", away: "Rennes" },
      { home: "Brighton", away: "Aston Villa" },
    ];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventsData = [];
    for (let i = 0; i < 30; i++) {
      const startTime = new Date(today);
      // Distribuir eventos a lo largo del día
      const hourOffset = Math.floor(i / 3);
      const minuteOffset = (i % 3) * 20;
      startTime.setHours(12 + hourOffset, minuteOffset, 0, 0);

      eventsData.push({
        id: `event-${i + 1}`,
        league: leagues[i % leagues.length],
        homeTeam: teams[i].home,
        awayTeam: teams[i].away,
        startTime,
        oddsHome: parseFloat((1.5 + Math.random() * 2.5).toFixed(2)),
        oddsDraw: parseFloat((2.5 + Math.random() * 2).toFixed(2)),
        oddsAway: parseFloat((1.5 + Math.random() * 2.5).toFixed(2)),
      });
    }

    // Usar createMany con skipDuplicates para evitar errores de ID duplicado
    await prisma.event.createMany({
      data: eventsData,
      skipDuplicates: true,
    });

    console.log("✅ Eventos inicializados en la base de datos");
  } catch (error) {
    console.error("❌ Error al inicializar eventos:", error);
    // No lanzar el error, solo registrarlo para no romper la aplicación
  }
}

export async function getEvents(): Promise<Event[]> {
  await initializeEvents();
  
  const events = await prisma.event.findMany({
    orderBy: {
      startTime: 'asc',
    },
  });

  return events.map((event) => ({
    id: event.id,
    league: event.league,
    homeTeam: event.homeTeam,
    awayTeam: event.awayTeam,
    startTime: event.startTime,
    odds: {
      home: event.oddsHome,
      draw: event.oddsDraw,
      away: event.oddsAway,
    },
  }));
}

export async function getEventById(id: string): Promise<Event | undefined> {
  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) return undefined;

  return {
    id: event.id,
    league: event.league,
    homeTeam: event.homeTeam,
    awayTeam: event.awayTeam,
    startTime: event.startTime,
    odds: {
      home: event.oddsHome,
      draw: event.oddsDraw,
      away: event.oddsAway,
    },
  };
}

export async function createBet(
  eventId: string,
  userEmail: string,
  selection: "1" | "X" | "2",
  amount: number
): Promise<Bet | null> {
  const event = await getEventById(eventId);
  if (!event) return null;

  // Validar que el monto sea positivo
  if (amount <= 0) {
    throw new Error("El monto de la apuesta debe ser mayor a 0");
  }

  // Obtener o crear usuario
  let user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    // Nota: Esto es para compatibilidad con código legacy. En producción,
    // los usuarios deberían crearse solo a través del proceso de registro.
    const defaultPassword = await bcrypt.hash("password123", 10);
    user = await prisma.user.create({
      data: {
        email: userEmail,
        name: userEmail.split("@")[0],
        password: defaultPassword,
      },
    });
    console.log(`👤 Usuario creado: ${userEmail}`);
  }

  // Redondear el monto a 2 decimales para evitar problemas de precisión
  const roundedAmount = roundMoney(amount);

  // Verificar que el usuario tenga saldo suficiente
  if (user.balance < roundedAmount) {
    throw new Error(`Saldo insuficiente. Saldo disponible: $${user.balance.toFixed(2)}`);
  }

  let odds: number;
  switch (selection) {
    case "1":
      odds = event.odds.home;
      break;
    case "X":
      odds = event.odds.draw;
      break;
    case "2":
      odds = event.odds.away;
      break;
  }

  // Todas las apuestas inician como PENDING
  const status: BetStatus = "PENDING";

  // Usar transacción para asegurar consistencia
  const result = await prisma.$transaction(async (tx) => {
    // Crear la apuesta con el monto redondeado
    const bet = await tx.bet.create({
      data: {
        eventId,
        userId: user.id,
        selection,
        odds,
        amount: roundedAmount,
        status,
      },
      include: {
        event: true,
      },
    });

    // Descontar el monto del saldo del usuario
    await tx.user.update({
      where: { id: user.id },
      data: {
        balance: {
          decrement: roundedAmount,
        },
      },
    });

    return bet;
  });

  const updatedUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  console.log(`💾 Apuesta guardada en BD:`, {
    betId: result.id,
    userId: user.email,
    event: `${result.event.homeTeam} vs ${result.event.awayTeam}`,
    selection: result.selection,
    amount: result.amount,
    status: result.status,
    saldoAnterior: user.balance,
    saldoActual: updatedUser?.balance,
  });

  console.log(`💾 Apuesta guardada en BD:`, {
    betId: result.id,
    userId: user.email,
    event: `${result.event.homeTeam} vs ${result.event.awayTeam}`,
    selection: result.selection,
    amount: result.amount,
    status: result.status,
    saldoAnterior: user.balance,
    saldoActual: updatedUser?.balance,
  });

  return {
    id: result.id,
    eventId: result.eventId,
    userId: userEmail,
    selection: result.selection as "1" | "X" | "2",
    odds: result.odds,
    amount: result.amount,
    status: result.status as BetStatus,
    createdAt: result.createdAt,
    event: {
      id: result.event.id,
      league: result.event.league,
      homeTeam: result.event.homeTeam,
      awayTeam: result.event.awayTeam,
      startTime: result.event.startTime,
      odds: {
        home: result.event.oddsHome,
        draw: result.event.oddsDraw,
        away: result.event.oddsAway,
      },
    },
  };
}

export async function getBetsByUserId(userEmail: string): Promise<Bet[]> {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      bets: {
        include: {
          event: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!user) {
    console.log(`🔍 Usuario no encontrado: ${userEmail}`);
    return [];
  }

  console.log(`🔍 Apuestas encontradas para ${userEmail}: ${user.bets.length}`);

  return user.bets.map((bet) => ({
    id: bet.id,
    eventId: bet.eventId,
    userId: userEmail,
    selection: bet.selection as "1" | "X" | "2",
    odds: bet.odds,
    amount: bet.amount,
    status: bet.status as BetStatus,
    createdAt: bet.createdAt,
    event: {
      id: bet.event.id,
      league: bet.event.league,
      homeTeam: bet.event.homeTeam,
      awayTeam: bet.event.awayTeam,
      startTime: bet.event.startTime,
      odds: {
        home: bet.event.oddsHome,
        draw: bet.event.oddsDraw,
        away: bet.event.oddsAway,
      },
    },
  }));
}

export async function getBetById(id: string): Promise<Bet | undefined> {
  const bet = await prisma.bet.findUnique({
    where: { id },
    include: {
      event: true,
      user: true,
    },
  });

  if (!bet) return undefined;

  return {
    id: bet.id,
    eventId: bet.eventId,
    userId: bet.user.email,
    selection: bet.selection as "1" | "X" | "2",
    odds: bet.odds,
    amount: bet.amount,
    status: bet.status as BetStatus,
    createdAt: bet.createdAt,
    event: {
      id: bet.event.id,
      league: bet.event.league,
      homeTeam: bet.event.homeTeam,
      awayTeam: bet.event.awayTeam,
      startTime: bet.event.startTime,
      odds: {
        home: bet.event.oddsHome,
        draw: bet.event.oddsDraw,
        away: bet.event.oddsAway,
      },
    },
  };
}

export async function getUserByEmail(email: string): Promise<{ email: string; balance: number } | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      email: true,
      balance: true,
    },
  });

  if (!user) {
    return null;
  }

  return {
    email: user.email,
    balance: user.balance,
  };
}

/**
 * Actualizar el estado de una apuesta y gestionar el saldo del usuario
 */
export async function updateBetStatus(
  betId: string,
  newStatus: BetStatus
): Promise<Bet | null> {
  const bet = await prisma.bet.findUnique({
    where: { id: betId },
    include: {
      event: true,
      user: true,
    },
  });

  if (!bet) {
    throw new Error("Apuesta no encontrada");
  }

  // No se puede cambiar el estado de una apuesta que ya fue resuelta
  if (bet.status !== "PENDING") {
    throw new Error(`La apuesta ya fue resuelta como ${bet.status}`);
  }

  // Usar transacción para asegurar consistencia
  const result = await prisma.$transaction(async (tx) => {
    // Actualizar el estado de la apuesta
    const updatedBet = await tx.bet.update({
      where: { id: betId },
      data: { status: newStatus },
      include: {
        event: true,
        user: true,
      },
    });

    // Si la apuesta es ganada, agregar las ganancias al saldo
    if (newStatus === "WON") {
      // Calcular ganancias y redondear a 2 decimales para evitar errores de precisión
      const winnings = roundMoney(bet.amount * bet.odds);
      
      await tx.user.update({
        where: { id: bet.userId },
        data: {
          balance: {
            increment: winnings,
          },
        },
      });

      console.log(`💰 Apuesta ganada - Ganancias agregadas:`, {
        betId: bet.id,
        usuario: bet.user.email,
        montoApostado: bet.amount,
        cuota: bet.odds,
        ganancias: winnings,
        nuevoSaldo: roundMoney(bet.user.balance + winnings),
      });
    } else if (newStatus === "LOST") {
      console.log(`❌ Apuesta perdida:`, {
        betId: bet.id,
        usuario: bet.user.email,
        montoPerdido: bet.amount,
      });
    }

    return updatedBet;
  });

  return {
    id: result.id,
    eventId: result.eventId,
    userId: result.user.email,
    selection: result.selection as "1" | "X" | "2",
    odds: result.odds,
    amount: result.amount,
    status: result.status as BetStatus,
    createdAt: result.createdAt,
    event: {
      id: result.event.id,
      league: result.event.league,
      homeTeam: result.event.homeTeam,
      awayTeam: result.event.awayTeam,
      startTime: result.event.startTime,
      odds: {
        home: result.event.oddsHome,
        draw: result.event.oddsDraw,
        away: result.event.oddsAway,
      },
    },
  };
}

/**
 * Obtener el saldo actual de un usuario
 */
export async function getUserBalance(email: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { balance: true },
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  return user.balance;
}

/**
 * Resolver apuestas pendientes del usuario de forma aleatoria
 * Esta función se ejecuta cuando el usuario visita su perfil
 */
export async function resolvePendingBets(userEmail: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      bets: {
        where: { status: "PENDING" },
        include: { event: true },
      },
    },
  });

  if (!user || user.bets.length === 0) {
    return;
  }

  // Resolver cada apuesta pendiente de forma aleatoria
  for (const bet of user.bets) {
    // 40% WON, 40% LOST, 20% sigue PENDING
    const random = Math.random();
    let newStatus: BetStatus;
    
    if (random < 0.4) {
      newStatus = "WON";
    } else if (random < 0.8) {
      newStatus = "LOST";
    } else {
      // 20% de probabilidad de seguir pendiente
      newStatus = "PENDING";
    }

    // Si sigue pendiente, no hacemos nada
    if (newStatus === "PENDING") {
      console.log(`⏳ Apuesta ${bet.id} sigue PENDIENTE`);
      continue;
    }

    await prisma.$transaction(async (tx) => {
      // Actualizar el estado de la apuesta
      await tx.bet.update({
        where: { id: bet.id },
        data: { status: newStatus },
      });

      // Si la apuesta es ganada, agregar las ganancias
      if (newStatus === "WON") {
        const winnings = roundMoney(bet.amount * bet.odds);
        await tx.user.update({
          where: { id: user.id },
          data: {
            balance: {
              increment: winnings,
            },
          },
        });
        console.log(`🎉 Apuesta ${bet.id} resuelta como GANADA: +$${winnings.toFixed(2)}`);
      } else {
        console.log(`❌ Apuesta ${bet.id} resuelta como PERDIDA`);
      }
    });
  }
}
