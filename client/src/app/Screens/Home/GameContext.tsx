import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

import { GAMES, initialGames } from "./constants";
import { GameSession } from "./types";

export type GameOption = {
  id: string;
  name: string;
  active: boolean;
};

type GameContextValue = {
  games: GameSession[];
  setGames: Dispatch<SetStateAction<GameSession[]>>;
  gameOptions: GameOption[];
  setGameOptions: Dispatch<SetStateAction<GameOption[]>>;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<GameSession[]>(initialGames);
  const [gameOptions, setGameOptions] = useState<GameOption[]>(
    GAMES.map((name, index) => ({ id: `game-${index}`, name, active: true }))
  );

  return (
    <GameContext.Provider value={{ games, setGames, gameOptions, setGameOptions }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGames() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGames must be used within GameProvider");
  return context;
}