export type BetOption = "1" | "X" | "2";

export type BetStatus = "PENDING" | "WON" | "LOST";

export interface Event {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  startTime: Date;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
}

export interface Bet {
  id: string;
  eventId: string;
  userId: string;
  selection: BetOption;
  odds: number;
  amount: number;
  status: BetStatus;
  createdAt: Date;
  event: Event;
}

export interface CreateBetData {
  eventId: string;
  selection: BetOption;
  amount: number;
}
