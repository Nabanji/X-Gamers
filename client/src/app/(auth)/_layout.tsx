import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-950">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}