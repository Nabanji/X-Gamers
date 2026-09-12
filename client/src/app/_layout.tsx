import { Stack } from "expo-router";
import './global.css';
import { GameProvider } from "./Screens/Home/GameContext";

export default function RootLayout() {
  return (
    <GameProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </GameProvider>
  );
}
