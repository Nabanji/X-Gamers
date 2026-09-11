import { useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GameSession, StatFilter } from "../types";
import { getBill } from "../utils/billing";

export function StatDetailModal({
  visible,
  filter,
  games,
  onClose,
}: {
  visible: boolean;
  filter: StatFilter;
  games: GameSession[];
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      if (filter === "paid") {
        return game.player1Paid && game.player2Paid;
      }
      if (filter === "unpaid") {
        return !game.player1Paid || !game.player2Paid;
      }
      return true;
    });
  }, [filter, games]);

  const title =
    filter === "paid" ? "Paid Games" : filter === "unpaid" ? "Unpaid Games" : "All Games Today";

  const headerColor = filter === "paid" ? "#16A34A" : filter === "unpaid" ? "#DC2626" : "#4F46E5";

  const totalOwedOverall = filteredGames.reduce((sum, game) => {
    const bill = getBill(game);
    let owed = 0;
    if (!game.player1Paid) owed += bill.p1Owes;
    if (!game.player2Paid) owed += bill.p2Owes;
    return sum + owed;
  }, 0);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40 justify-end" onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()} style={{ maxHeight: "90%" }}>
          <View
            className="bg-white rounded-t-3xl px-5 pt-5"
            style={{ maxHeight: "100%", paddingBottom: Math.max(insets.bottom, 16) + 8 }}
          >
            <View className="w-10 h-1.5 bg-gray-200 rounded-full self-center mb-4" />

            <View className="flex-row items-center justify-between mb-5">
              <View>
                <Text className="text-black text-xl font-bold">{title}</Text>
                <Text className="text-gray-400 text-xs mt-0.5">
                  {filteredGames.length} session{filteredGames.length === 1 ? "" : "s"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
              >
                <Ionicons name="close" size={18} color="#374151" />
              </TouchableOpacity>
            </View>

            {filter === "unpaid" && (
              <View
                className="rounded-2xl p-4 mb-4 flex-row items-center justify-between"
                style={{ backgroundColor: `${headerColor}15` }}
              >
                <Text className="text-sm font-medium" style={{ color: headerColor }}>
                  Total unpaid
                </Text>
                <Text className="text-lg font-bold" style={{ color: headerColor }}>
                  KES {totalOwedOverall}
                </Text>
              </View>
            )}

            <ScrollView showsVerticalScrollIndicator={false}>
              {filteredGames.length === 0 ? (
                <View className="items-center justify-center py-16">
                  <Ionicons name="file-tray-outline" size={40} color="#D1D5DB" />
                  <Text className="text-gray-400 mt-3">No games in this category</Text>
                </View>
              ) : (
                filteredGames.map((item) => {
                  const bill = getBill(item);

                  return (
                    <View key={item.id} className="bg-gray-50 rounded-2xl p-4 mb-3 border border-gray-100">
                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center">
                          <View className="w-9 h-9 rounded-full bg-indigo-50 items-center justify-center mr-3">
                            <Ionicons name="game-controller" size={16} color="#4F46E5" />
                          </View>
                          <View>
                            <Text className="text-black font-semibold text-sm">{item.gameName}</Text>
                            <Text className="text-gray-400 text-xs">
                              {item.station} • {item.time}
                            </Text>
                          </View>
                        </View>

                        <View
                          className={`px-2 py-0.5 rounded-full ${
                            item.player1Paid && item.player2Paid ? "bg-green-100" : "bg-red-100"
                          }`}
                        >
                          <Text
                            className={`text-xs font-medium ${
                              item.player1Paid && item.player2Paid ? "text-green-700" : "text-red-700"
                            }`}
                          >
                            {item.player1Paid && item.player2Paid ? "Paid" : "Unpaid"}
                          </Text>
                        </View>
                      </View>

                      {bill.isPerGame ? (
                        <View className="bg-white rounded-xl p-3 mt-2 border border-gray-100">
                          <View className="flex-row items-center justify-between py-2">
                            <View className="flex-1">
                              <Text className="text-gray-700 text-xs font-medium">{item.player1}</Text>
                              <Text className="text-gray-400 text-[11px]">
                                {bill.p1Losses} lost × KES {bill.pricePerGame}
                              </Text>
                            </View>
                            <View className="items-end">
                              <Text className="text-black text-xs font-semibold">KES {bill.p1Owes}</Text>
                              <Text
                                className={`text-[10px] font-semibold mt-0.5 ${
                                  item.player1Paid ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {item.player1Paid ? "Paid" : "Unpaid"}
                              </Text>
                            </View>
                          </View>

                          <View className="flex-row items-center justify-between py-2">
                            <View className="flex-1">
                              <Text className="text-gray-700 text-xs font-medium">{item.player2}</Text>
                              <Text className="text-gray-400 text-[11px]">
                                {bill.p2Losses} lost × KES {bill.pricePerGame}
                              </Text>
                            </View>
                            <View className="items-end">
                              <Text className="text-black text-xs font-semibold">KES {bill.p2Owes}</Text>
                              <Text
                                className={`text-[10px] font-semibold mt-0.5 ${
                                  item.player2Paid ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {item.player2Paid ? "Paid" : "Unpaid"}
                              </Text>
                            </View>
                          </View>

                          <View className="mt-1 pt-2 border-t border-gray-100 flex-row items-center justify-between">
                            <Text className="text-black text-xs font-bold">Total</Text>
                            <Text className="text-black text-sm font-bold">KES {bill.totalOwed}</Text>
                          </View>
                        </View>
                      ) : (
                        <View className="bg-white rounded-xl p-3 mt-2 border border-gray-100">
                          <View className="flex-row items-center justify-between">
                            <Text className="text-gray-600 text-xs">{item.detail}</Text>
                            <Text className="text-black text-sm font-bold">KES {item.amount}</Text>
                          </View>
                          <Text className="text-gray-400 text-[11px] mt-2">Hourly session</Text>
                        </View>
                      )}
                    </View>
                  );
                })
              )}
            </ScrollView>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}