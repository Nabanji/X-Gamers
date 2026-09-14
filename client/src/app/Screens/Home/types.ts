export type PaymentType = "per-game" | "per-hour";
export type SessionStatus = "active" | "closed";

export type RoundResult = {
  id: string;
  loser: "player1" | "player2";
  time: string;
};

export type Session = {
  id: string;
  gameName: string;
  station: string;

  team1: string;
  player1: string;
  team2: string;
  player2: string;

  paymentType: PaymentType;
  pricePerGame?: number; // set when paymentType === "per-game"
  hourlyRate?: number;   // set when paymentType === "per-hour"

  status: SessionStatus;

  startedAt: string;  // ISO timestamp
  startTime: string;  // display, e.g. "10:45 AM"
  closedAt?: string;
  closedTime?: string;

  rounds: RoundResult[]; // one entry per completed game — this IS your win/loss log

  hoursPlayed?: number; // filled in when closing an hourly session

  player1Paid: boolean;
  player2Paid: boolean;
};