export type PaymentType = "per-game" | "per-hour";
export type Winner = "player1" | "player2" | "draw" | null;

export type GameSession = {
  id: string;
  gameName: string;
  station: string;
  team1: string;
  player1: string;
  team2: string;
  player2: string;
  amount: number;
  player1Paid: boolean;
  player2Paid: boolean;
  time: string;
  detail: string;
  winner?: Winner;
  player1Wins?: number;
  player2Wins?: number;
  pricePerGame?: number;
};

export type StatFilter = "all" | "paid" | "unpaid" | null;