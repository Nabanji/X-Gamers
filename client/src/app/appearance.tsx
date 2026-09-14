import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemePreference, useTheme } from "./ThemeContext";

const themes = [
  { id: "light", label: "Light", icon: "sunny-outline" as const, description: "Bright and easy to read" },
  { id: "dark", label: "Dark", icon: "moon-outline" as const, description: "Gentle on your eyes at night" },
  { id: "system", label: "System", icon: "phone-portrait-outline" as const, description: "Follow your device settings" },
];

export default function Appearance() {
  const { theme: selectedTheme, setTheme } = useTheme();

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center mb-7">
          <Ionicons name="arrow-back" size={22} color="#111827" />
          <Text className="text-gray-950 dark:text-wshite text-lg font-bold ml-3">Appearance</Text>
        </TouchableOpacity>

        <Text className="text-gray-400 text-xs font-semibold uppercase mb-2 ml-1">Theme</Text>
        <View className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          {themes.map((theme, index) => {
            const isSelected = selectedTheme === theme.id;
            return (
              <TouchableOpacity
                key={theme.id}
                onPress={() => setTheme(theme.id as ThemePreference)}
                activeOpacity={0.7}
                className={`flex-row items-center px-4 py-4 ${index < themes.length - 1 ? "border-b border-gray-100 dark:border-gray-800" : ""}`}
              >
                <View className={`w-10 h-10 rounded-full items-center justify-center ${isSelected ? "bg-indigo-50 dark:bg-indigo-950" : "bg-gray-50 dark:bg-gray-800"}`}>
                  <Ionicons name={theme.icon} size={20} color={isSelected ? "#4F46E5" : "#6B7280"} />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-gray-950 dark:text-white text-base font-semibold">{theme.label}</Text>
                  <Text className="text-gray-400 text-sm mt-0.5">{theme.description}</Text>
                </View>
                <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${isSelected ? "border-indigo-600" : "border-gray-300 dark:border-gray-600"}`}>
                  {isSelected && <View className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>
    </View>
  );
}