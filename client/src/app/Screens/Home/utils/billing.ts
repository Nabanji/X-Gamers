import { GameSession } from "../types";

export function getBill(item: GameSession) {
  const isPerGame = item.player1Wins !== undefined;
  const gamesMatch = item.detail?.match(/(\d+)\s*games?/i);
  const totalGames = gamesMatch ? parseInt(gamesMatch[1], 10) : 0;

  const p1Wins = item.player1Wins ?? 0;
  const p2Wins = item.player2Wins ?? 0;

  const pricePerGame =
    item.pricePerGame ?? (totalGames > 0 ? Math.round(item.amount / totalGames) : 0);

  const p1Losses = p2Wins;
  const p2Losses = p1Wins;

  const p1Owes = isPerGame ? p1Losses * pricePerGame : 0;
  const p2Owes = isPerGame ? p2Losses * pricePerGame : 0;

  return {
    isPerGame,
    totalGames,
    pricePerGame,
    p1Wins,
    p2Wins,
    p1Losses,
    p2Losses,
    p1Owes,
    p2Owes,
    totalOwed: p1Owes + p2Owes,
  };
}