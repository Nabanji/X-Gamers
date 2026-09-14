import { Stack } from "expo-router";
import './global.css';
import { GameProvider } from "./Screens/Home/GameContext";
import { ThemeProvider } from "./ThemeContext";
import { NotificationProvider } from "./NotificationContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <GameProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </GameProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
