import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function StatCard({
  label,
  value,
  icon,
  color,
  onPress,
}: {
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="flex-1 bg-white rounded-2xl p-4 mx-1 shadow-sm border border-gray-100"
    >
      <View
        className="w-9 h-9 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: `${color}20` }}
      >
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text className="text-xl font-bold text-black">{value}</Text>
      <Text className="text-xs text-gray-500 mt-0.5">{label}</Text>
    </TouchableOpacity>
  );
}