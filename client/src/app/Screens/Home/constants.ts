import { GameSession } from "./types";

export const GAMES = ["FC26", "Call of Duty", "Mortal Kombat", "NBA 2K25", "Tekken 8"];

export const STATIONS = ["Station 1", "Station 2", "Station 3", "Station 4", "Station 5", "Station 6"];

export const initialGames: GameSession[] = [
  {
    id: "1",
    gameName: "FC26",
    station: "Station 1",
    team1: "Manchester United",
    player1: "Prince",
    team2: "Real Madrid",
    player2: "Brian",
    amount: 450,
    player1Paid: true,
    player2Paid: true,
    time: "10:45 AM",
    detail: "3 games",
    player1Wins: 2,
    player2Wins: 1,
    winner: "player1",
    pricePerGame: 150,
    createdAt: Date.now() - 15 * 60 * 1000,
  },
  {
    id: "2",
    gameName: "Call of Duty",
    station: "Station 3",
    team1: "Team Alpha",
    player1: "Kevin",
    team2: "Team Bravo",
    player2: "Mike",
    amount: 600,
    player1Paid: false,
    player2Paid: false,
    time: "10:10 AM",
    detail: "2 hrs",
    winner: "player2",
    createdAt: Date.now() - 50 * 60 * 1000,
  },
];