import { Stack } from "expo-router";
import { ClerkProvider } from "@clerk/expo";
import './global.css';
import { GameProvider } from "./Screens/Home/GameContext";
import { ThemeProvider } from "./ThemeContext";
import { NotificationProvider } from "./NotificationContext";
import { tokenCache } from "../lib/tokenCache";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ThemeProvider>
        <NotificationProvider>
          <GameProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </GameProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}