import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GameSession } from "../types";
import { getBill } from "../utils/billing";

export function GameListItem({
  item,
  onPress,
}: {
  item: GameSession;
  onPress: (item: GameSession) => void;
}) {
  const bill = getBill(item);
  const loggedDate = new Date(item.createdAt).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(item)}
      className="bg-white dark:bg-gray-900 rounded-xl p-4 mb-3 border border-gray-100 dark:border-gray-800"
    >
      <View className="flex-row items-center">
        <View className="flex-row items-center flex-1">
          <View className="w-11 h-11 rounded-full bg-indigo-50 items-center justify-center mr-3">
            <Ionicons name="game-controller" size={20} color="#4F46E5" />
          </View>
          <View className="flex-1">
            <Text className="text-black dark:text-white font-semibold text-base">{item.gameName}</Text>
            <Text className="text-gray-400 text-xs mt-0.5">
              {item.station} • {item.detail} • {loggedDate} • {item.time}
            </Text>

            <View className="flex-row items-center mt-2">
              <View className="w-6 h-6 rounded-full bg-gray-100 items-center justify-center mr-2">
                <Ionicons name="person-outline" size={13} color="#6B7280" />
              </View>
              <Text className="text-gray-700 text-sm font-semibold">{item.player1}</Text>
              <View className={`ml-2 px-2 py-0.5 rounded-full ${item.player1Paid ? "bg-green-50" : "bg-red-50"}`}>
                <Text className={`text-[10px] font-semibold ${item.player1Paid ? "text-green-600" : "text-red-600"}`}>
                  {item.player1Paid ? "Paid" : "Unpaid"}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mt-1 ml-8">
              <Text className="text-gray-400 text-xs mr-2">vs</Text>
              <Text className="text-gray-700 text-sm font-semibold">{item.player2}</Text>
              <View className={`ml-2 px-2 py-0.5 rounded-full ${item.player2Paid ? "bg-green-50" : "bg-red-50"}`}>
                <Text className={`text-[10px] font-semibold ${item.player2Paid ? "text-green-600" : "text-red-600"}`}>
                  {item.player2Paid ? "Paid" : "Unpaid"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="items-end ml-2">
          <Text className="text-black dark:text-white font-semibold">KES {item.amount}</Text>
          <View className={`mt-1 px-2 py-0.5 rounded-full ${item.player1Paid && item.player2Paid ? "bg-green-50" : "bg-red-50"}`}>
            <Text className={`text-xs font-medium ${item.player1Paid && item.player2Paid ? "text-green-600" : "text-red-600"}`}>
              {item.player1Paid && item.player2Paid ? "Paid" : "Unpaid"}
            </Text>
          </View>
        </View>
      </View>

      {bill.isPerGame && (
        <View className="mt-3 pt-3 border-t border-gray-100 flex-row items-center justify-between">
          <Text className="text-gray-400 text-[11px]">{item.player1}: KES {bill.p1Owes}</Text>
          <Text className="text-gray-400 text-[11px]">{item.player2}: KES {bill.p2Owes}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}