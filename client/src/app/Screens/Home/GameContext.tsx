import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

import { initialGames } from "./constants";
import { GameSession } from "./types";

type GameContextValue = {
  games: GameSession[];
  setGames: Dispatch<SetStateAction<GameSession[]>>;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<GameSession[]>(initialGames);

  return <GameContext.Provider value={{ games, setGames }}>{children}</GameContext.Provider>;
}

export function useGames() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGames must be used within GameProvider");
  return context;
}