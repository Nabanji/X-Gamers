import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import { GAMES, initialGames } from "./constants";
import { Session } from "./types";

export type GameOption = {
  id: string;
  name: string;
  active: boolean;
};

type NewSessionInput = Omit<
  Session,
  | "id"
  | "startedAt"
  | "startTime"
  | "status"
  | "rounds"
  | "player1Paid"
  | "player2Paid"
  | "closedAt"
  | "closedTime"
>;

type GameContextValue = {
  games: Session[];
  setGames: Dispatch<SetStateAction<Session[]>>;

  gameOptions: GameOption[];
  setGameOptions: Dispatch<SetStateAction<GameOption[]>>;
  stations: string[];
  setStationCount: (count: number) => void;

  openSession: (data: NewSessionInput) => void;

  recordLoss: (
    sessionId: string,
    loser: "player1" | "player2"
  ) => void;

  undoLastRound: (sessionId: string) => void;

  closeSession: (sessionId: string, hoursPlayed?: number) => void;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Session[]>(initialGames);

  const [gameOptions, setGameOptions] = useState<GameOption[]>(
    GAMES.map((name, index) => ({
      id: `game-${index}`,
      name,
      active: true,
    }))
  );
  const [stationCount, setStationCountState] = useState(6);
  const stations = Array.from({ length: stationCount }, (_, index) => `Station ${index + 1}`);

  const setStationCount = (count: number) => {
    setStationCountState(Math.max(1, Math.floor(count)));
  };

  /**
   * OPEN A NEW CUSTOMER SESSION
   */
  const openSession = (data: NewSessionInput) => {
    const now = new Date();

    const newSession: Session = {
      ...data,

      id: Date.now().toString(),

      startedAt: now.toISOString(),

      startTime: now.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),

      status: "active",

      rounds: [],

      player1Paid: false,
      player2Paid: false,
    };

    setGames((prev) => [newSession, ...prev]);
  };

  /**
   * RECORD THAT A PLAYER LOST A GAME
   */
  const recordLoss = (
    sessionId: string,
    loser: "player1" | "player2"
  ) => {
    setGames((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) {
          return session;
        }

        return {
          ...session,

          rounds: [
            ...session.rounds,

            {
              id: Date.now().toString(),

              loser,

              time: new Date().toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              }),
            },
          ],
        };
      })
    );
  };

  /**
   * UNDO THE LAST RECORDED GAME
   */
  const undoLastRound = (sessionId: string) => {
    setGames((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) {
          return session;
        }

        return {
          ...session,
          rounds: session.rounds.slice(0, -1),
        };
      })
    );
  };

  /**
   * CLOSE CUSTOMER SESSION
   */
  const closeSession = (
    sessionId: string,
    hoursPlayed?: number
  ) => {
    const now = new Date();

    setGames((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) {
          return session;
        }

        return {
          ...session,

          status: "closed",

          closedAt: now.toISOString(),

          closedTime: now.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          }),

          hoursPlayed:
            hoursPlayed ?? session.hoursPlayed,
        };
      })
    );
  };

  return (
    <GameContext.Provider
      value={{
        games,
        setGames,

        gameOptions,
        setGameOptions,
        stations,
        setStationCount,

        openSession,
        recordLoss,
        undoLastRound,
        closeSession,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGames() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error(
      "useGames must be used within GameProvider"
    );
  }

  return context;
}