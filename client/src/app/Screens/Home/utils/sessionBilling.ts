import { Session } from "../types";

export function getSessionTally(session: Session) {
  const p1Losses = session.rounds.filter((r) => r.loser === "player1").length;
  const p2Losses = session.rounds.filter((r) => r.loser === "player2").length;

  const isPerGame = session.paymentType === "per-game";
  const rate = isPerGame ? session.pricePerGame ?? 0 : session.hourlyRate ?? 0;

  const p1Owes = isPerGame ? p1Losses * rate : 0;
  const p2Owes = isPerGame ? p2Losses * rate : 0;

  const hourlyTotal = !isPerGame ? (session.hoursPlayed ?? 0) * rate : 0;

  return {
    isPerGame,
    rate,
    totalGames: session.rounds.length,
    p1Losses,
    p2Losses,
    p1Owes,
    p2Owes,
    totalOwed: isPerGame ? p1Owes + p2Owes : hourlyTotal,
  };
}

export function getBill(session: Session) {
  const tally = getSessionTally(session);

  return {
    ...tally,
    p1Wins: tally.p2Losses,
    p2Wins: tally.p1Losses,
    p1Losses: tally.p1Losses,
    p2Losses: tally.p2Losses,
  };
}