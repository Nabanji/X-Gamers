import { View, Text, ScrollView, TouchableOpacity, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GameSession } from "../types";
import { getBill } from "../utils/billing";

export function GameBillModal({
  visible,
  session,
  onClose,
  onTogglePayment,
}: {
  visible: boolean;
  session: GameSession | null;
  onClose: () => void;
  onTogglePayment: (player: "player1" | "player2") => void;
}) {
  const insets = useSafeAreaInsets();

  if (!session) return null;

  const bill = getBill(session);

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
                <Text className="text-black text-xl font-bold">Bill</Text>
                <Text className="text-gray-400 text-xs mt-0.5">
                  {session.gameName} • {session.station} • {session.time}
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
              >
                <Ionicons name="close" size={18} color="#374151" />
              </TouchableOpacity>
            </View>

            <View
              className={`px-3 py-1.5 rounded-full self-start mb-4 ${
                session.player1Paid && session.player2Paid ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  session.player1Paid && session.player2Paid ? "text-green-600" : "text-red-600"
                }`}
              >
                {session.player1Paid && session.player2Paid ? "Fully Paid" : "Payment Pending"}
              </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {bill.isPerGame ? (
                <>
                  <View className="bg-gray-50 rounded-2xl p-4 mb-3">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-gray-500 text-xs">Series</Text>
                      <Text className="text-black text-sm font-semibold">
                        {session.player1} {bill.p1Wins} — {bill.p2Wins} {session.player2}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-gray-500 text-xs">Price per game</Text>
                      <Text className="text-black text-sm font-semibold">KES {bill.pricePerGame}</Text>
                    </View>
                  </View>

                  {/* PLAYER 1 */}
                  <View className="bg-white border border-gray-100 rounded-2xl p-4 mb-3">
                    <View className="flex-row items-center mb-3">
                      <View className="w-9 h-9 rounded-full bg-indigo-50 items-center justify-center mr-3">
                        <Text className="text-indigo-600 text-sm font-bold">1</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-black font-semibold">{session.player1}</Text>
                        <Text className="text-gray-400 text-xs">{session.team1}</Text>
                      </View>
                      <View
                        className={`px-2.5 py-1 rounded-full ${session.player1Paid ? "bg-green-50" : "bg-red-50"}`}
                      >
                        <Text
                          className={`text-[10px] font-bold ${
                            session.player1Paid ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {session.player1Paid ? "PAID" : "UNPAID"}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center justify-between py-1">
                      <Text className="text-gray-500 text-xs">Wins / Losses</Text>
                      <Text className="text-black text-sm font-medium">
                        {bill.p1Wins} / {bill.p1Losses}
                      </Text>
                    </View>

                    <View className="mt-2 pt-3 border-t border-gray-100 flex-row items-center justify-between">
                      <Text className="text-black font-semibold">Owes</Text>
                      <Text className="text-black font-bold text-base">KES {bill.p1Owes}</Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => onTogglePayment("player1")}
                      activeOpacity={0.8}
                      className={`mt-3 rounded-xl p-3 flex-row items-center justify-between ${
                        session.player1Paid ? "bg-green-50" : "bg-red-50"
                      }`}
                    >
                      <View className="flex-row items-center">
                        <Ionicons
                          name={session.player1Paid ? "checkmark-circle" : "ellipse-outline"}
                          size={21}
                          color={session.player1Paid ? "#16A34A" : "#DC2626"}
                        />
                        <Text
                          className={`ml-2 text-sm font-semibold ${
                            session.player1Paid ? "text-green-700" : "text-red-700"
                          }`}
                        >
                          {session.player1Paid ? "Payment received" : "Payment unpaid"}
                        </Text>
                      </View>
                      <Text
                        className={`text-xs font-semibold ${
                          session.player1Paid ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {session.player1Paid ? "Undo" : "Mark Paid"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* PLAYER 2 */}
                  <View className="bg-white border border-gray-100 rounded-2xl p-4 mb-3">
                    <View className="flex-row items-center mb-3">
                      <View className="w-9 h-9 rounded-full bg-indigo-50 items-center justify-center mr-3">
                        <Text className="text-indigo-600 text-sm font-bold">2</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-black font-semibold">{session.player2}</Text>
                        <Text className="text-gray-400 text-xs">{session.team2}</Text>
                      </View>
                      <View
                        className={`px-2.5 py-1 rounded-full ${session.player2Paid ? "bg-green-50" : "bg-red-50"}`}
                      >
                        <Text
                          className={`text-[10px] font-bold ${
                            session.player2Paid ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {session.player2Paid ? "PAID" : "UNPAID"}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center justify-between py-1">
                      <Text className="text-gray-500 text-xs">Wins / Losses</Text>
                      <Text className="text-black text-sm font-medium">
                        {bill.p2Wins} / {bill.p2Losses}
                      </Text>
                    </View>

                    <View className="mt-2 pt-3 border-t border-gray-100 flex-row items-center justify-between">
                      <Text className="text-black font-semibold">Owes</Text>
                      <Text className="text-black font-bold text-base">KES {bill.p2Owes}</Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => onTogglePayment("player2")}
                      activeOpacity={0.8}
                      className={`mt-3 rounded-xl p-3 flex-row items-center justify-between ${
                        session.player2Paid ? "bg-green-50" : "bg-red-50"
                      }`}
                    >
                      <View className="flex-row items-center">
                        <Ionicons
                          name={session.player2Paid ? "checkmark-circle" : "ellipse-outline"}
                          size={21}
                          color={session.player2Paid ? "#16A34A" : "#DC2626"}
                        />
                        <Text
                          className={`ml-2 text-sm font-semibold ${
                            session.player2Paid ? "text-green-700" : "text-red-700"
                          }`}
                        >
                          {session.player2Paid ? "Payment received" : "Payment unpaid"}
                        </Text>
                      </View>
                      <Text
                        className={`text-xs font-semibold ${
                          session.player2Paid ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {session.player2Paid ? "Undo" : "Mark Paid"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className="bg-black rounded-2xl p-4 flex-row items-center justify-between">
                    <View>
                      <Text className="text-gray-300 text-xs">Total Session</Text>
                      <Text className="text-white text-2xl font-bold mt-1">KES {bill.totalOwed}</Text>
                    </View>
                    <Ionicons name="cash-outline" size={28} color="#4ADE80" />
                  </View>
                </>
              ) : (
                <View className="bg-white border border-gray-100 rounded-2xl p-4">
                  <Text className="text-gray-500 text-xs font-medium mb-3">Hourly session</Text>
                  <View className="flex-row items-center justify-between py-1.5">
                    <Text className="text-gray-500 text-xs">Duration</Text>
                    <Text className="text-black text-sm font-medium">{session.detail}</Text>
                  </View>
                  <View className="mt-2 pt-3 border-t border-gray-100 flex-row items-center justify-between">
                    <Text className="text-black font-semibold">Total</Text>
                    <Text className="text-black font-bold text-base">KES {session.amount}</Text>
                  </View>
                  <Text className="text-gray-400 text-xs mt-3">
                    Hourly sessions are charged as one session rather than being split per player.
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}