import { Session } from "./types";

export const GAMES = ["FC26", "Call of Duty", "Mortal Kombat", "NBA 2K25", "Tekken 8"];

export const STATIONS = ["Station 1", "Station 2", "Station 3", "Station 4", "Station 5", "Station 6"];

export const initialGames: Session[] = [
  {
    id: "1",
    gameName: "FC26",
    station: "Station 1",
    team1: "Manchester United",
    player1: "Prince",
    team2: "Real Madrid",
    player2: "Brian",
    paymentType: "per-game",
    pricePerGame: 150,
    status: "closed",
    startedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    startTime: "10:45 AM",
    player1Paid: true,
    player2Paid: true,
    rounds: [
      { id: "1-1", loser: "player2", time: "10:50 AM" },
      { id: "1-2", loser: "player2", time: "10:55 AM" },
      { id: "1-3", loser: "player1", time: "11:00 AM" },
    ],
  },
  {
    id: "2",
    gameName: "Call of Duty",
    station: "Station 3",
    team1: "Team Alpha",
    player1: "Kevin",
    team2: "Team Bravo",
    player2: "Mike",
    paymentType: "per-hour",
    hourlyRate: 300,
    status: "closed",
    startedAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    startTime: "10:10 AM",
    closedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    closedTime: "10:20 AM",
    hoursPlayed: 2,
    player1Paid: false,
    player2Paid: false,
    rounds: [],
  },
];