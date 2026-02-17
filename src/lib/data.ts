import { Event, Bet, BetStatus } from "./types";
import { prisma } from "./prisma";

// Función para inicializar los eventos en la base de datos
async function initializeEvents() {
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

  for (let i = 0; i < 30; i++) {
    const startTime = new Date(today);
    // Distribuir eventos a lo largo del día
    const hourOffset = Math.floor(i / 3);
    const minuteOffset = (i % 3) * 20;
    startTime.setHours(12 + hourOffset, minuteOffset, 0, 0);

    await prisma.event.create({
      data: {
        id: `event-${i + 1}`,
        league: leagues[i % leagues.length],
        homeTeam: teams[i].home,
        awayTeam: teams[i].away,
        startTime,
        oddsHome: parseFloat((1.5 + Math.random() * 2.5).toFixed(2)),
        oddsDraw: parseFloat((2.5 + Math.random() * 2).toFixed(2)),
        oddsAway: parseFloat((1.5 + Math.random() * 2.5).toFixed(2)),
      },
    });
  }

  console.log("✅ Eventos inicializados en la base de datos");
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

  // Obtener o crear usuario
  let user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: userEmail,
        name: userEmail.split("@")[0],
      },
    });
    console.log(`👤 Usuario creado: ${userEmail}`);
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

  // Randomly determine status for demo purposes
  const randomStatus = Math.random();
  let status: BetStatus = "PENDING";
  if (randomStatus < 0.3) {
    status = "WON";
  } else if (randomStatus < 0.5) {
    status = "LOST";
  }

  const bet = await prisma.bet.create({
    data: {
      eventId,
      userId: user.id,
      selection,
      odds,
      amount,
      status,
    },
    include: {
      event: true,
    },
  });

  console.log(`💾 Apuesta guardada en BD:`, {
    betId: bet.id,
    userId: user.email,
    event: `${bet.event.homeTeam} vs ${bet.event.awayTeam}`,
    selection: bet.selection,
    status: bet.status,
  });

  return {
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
