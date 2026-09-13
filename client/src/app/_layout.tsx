import { Stack } from "expo-router";
import './global.css';
import { GameProvider } from "./Screens/Home/GameContext";
import { ThemeProvider } from "./ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <GameProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </GameProvider>
    </ThemeProvider>
  );
}
