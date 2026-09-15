import { useState } from "react";
import { router } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGames } from "./Screens/Home/GameContext";

export default function Onboarding() {
  const { setStationCount } = useGames();
  const [stationCount, setStationCountInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleContinue = () => {
    const count = Number.parseInt(stationCount, 10);
    if (!Number.isInteger(count) || count < 1 || count > 100) {
      setErrorMessage("Enter a number between 1 and 100.");
      return;
    }

    setStationCount(count);
    router.replace("/(tabs)/home");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50 dark:bg-gray-950"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 72, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1">
          <View className="w-14 h-14 rounded-2xl bg-indigo-600 items-center justify-center mb-7">
            <Ionicons name="business-outline" size={28} color="#fff" />
          </View>
          <Text className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold uppercase tracking-widest">
            X-Gaming Hub
          </Text>
          <Text className="text-gray-950 dark:text-white text-3xl font-bold mt-2">Set up your hub</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-base mt-2 leading-6">
            Tell us how many gaming stations your hub has. We will use them whenever you open a session.
          </Text>

          <View className="mt-10">
            <Text className="text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Number of stations</Text>
            <View className="flex-row items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4">
              <Ionicons name="grid-outline" size={19} color="#9CA3AF" />
              <TextInput
                value={stationCount}
                onChangeText={(value) => {
                  setStationCountInput(value.replace(/[^0-9]/g, ""));
                  setErrorMessage("");
                }}
                keyboardType="number-pad"
                placeholder="e.g. 6"
                placeholderTextColor="#9CA3AF"
                className="flex-1 py-4 px-3 text-gray-950 dark:text-white"
              />
            </View>
            {!!errorMessage && <Text className="text-red-600 text-sm mt-2">{errorMessage}</Text>}
          </View>

          <TouchableOpacity onPress={handleContinue} activeOpacity={0.85} className="bg-indigo-600 rounded-2xl py-4 items-center mt-7">
            <Text className="text-white text-base font-bold">Continue to your hub</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-gray-400 dark:text-gray-500 text-xs text-center mt-10">
          You can update your station setup later.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
