import { View, Text, TouchableOpacity } from "react-native";

export function ChipSelector({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string) => void;
}) {
  return (
    <View className="mb-5">
      <Text className="text-gray-500 text-sm font-medium mb-2">{label}</Text>
      <View className="flex-row flex-wrap">
        {options.map((option) => {
          const active = selected === option;
          return (
            <TouchableOpacity
              key={option}
              onPress={() => onSelect(option)}
              activeOpacity={0.8}
              className={`px-4 py-2 rounded-full mr-2 mb-2 ${active ? "bg-indigo-600" : "bg-gray-100"}`}
            >
              <Text className={`text-sm font-medium ${active ? "text-white" : "text-gray-600"}`}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}