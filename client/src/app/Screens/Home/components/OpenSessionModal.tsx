import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, Modal, TextInput,
  KeyboardAvoidingView, Platform, Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Session, PaymentType } from "../types";
import { STATIONS } from "../constants";
import { ChipSelector } from "./ChipSelector";

type NewSessionInput = Omit<
  Session,
  "id" | "startedAt" | "startTime" | "status" | "rounds" | "player1Paid" | "player2Paid"
>;

export function OpenSessionModal({
  visible,
  onClose,
  onSubmit,
  gameOptions,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (session: NewSessionInput) => void;
  gameOptions: string[];
}) {
  const insets = useSafeAreaInsets();

  const [game, setGame] = useState<string | null>(null);
  const [station, setStation] = useState<string | null>(null);

  const [team1, setTeam1] = useState("");
  const [player1, setPlayer1] = useState("");
  const [team2, setTeam2] = useState("");
  const [player2, setPlayer2] = useState("");

  const [paymentType, setPaymentType] = useState<PaymentType>("per-game");
  const [pricePerGame, setPricePerGame] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");

  const isValid =
    !!game &&
    !!station &&
    !!team1.trim() &&
    !!player1.trim() &&
    !!team2.trim() &&
    !!player2.trim() &&
    (paymentType === "per-game" ? !!pricePerGame : !!hourlyRate);

  const resetForm = () => {
    setGame(null);
    setStation(null);
    setTeam1("");
    setPlayer1("");
    setTeam2("");
    setPlayer2("");
    setPaymentType("per-game");
    setPricePerGame("");
    setHourlyRate("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!isValid || !game || !station) return;

    onSubmit({
      gameName: game,
      station,
      team1: team1.trim(),
      player1: player1.trim(),
      team2: team2.trim(),
      player2: player2.trim(),
      paymentType,
      pricePerGame: paymentType === "per-game" ? parseFloat(pricePerGame) || 0 : undefined,
      hourlyRate: paymentType === "per-hour" ? parseFloat(hourlyRate) || 0 : undefined,
    });

    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <Pressable className="flex-1 bg-black/40 justify-end" onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ height: "85%", width: "100%" }}
        >
          <Pressable onPress={(e) => e.stopPropagation()} style={{ flex: 1 }}>
            <View
              className="bg-white dark:bg-gray-900 rounded-t-3xl px-5 pt-5"
              style={{ flex: 1, paddingBottom: Math.max(insets.bottom, 16) }}
            >
              <View className="w-10 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full self-center mb-4" />

              <View className="flex-row items-center justify-between mb-5">
                <Text className="text-black dark:text-white text-xl font-bold">Open Session</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center"
                >
                  <Ionicons name="close" size={18} color="#374151" />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                contentContainerStyle={{ paddingBottom: 4 }}
              >
                <ChipSelector label="Game" options={gameOptions} selected={game} onSelect={setGame} />
                <ChipSelector label="Station" options={STATIONS} selected={station} onSelect={setStation} />

                <View className="mb-5">
                  <Text className="text-gray-500 text-sm font-medium mb-3">Players</Text>

                  <View className="mb-3">
                    <Text className="text-gray-500 text-xs font-medium mb-2">Player 1</Text>
                    <TextInput
                      value={player1}
                      onChangeText={setPlayer1}
                      placeholder="Enter player 1 name"
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="words"
                      className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-black dark:text-white"
                    />
                  </View>

                  <View className="mb-3">
                    <Text className="text-gray-500 text-xs font-medium mb-2">Team 1</Text>
                    <TextInput
                      value={team1}
                      onChangeText={setTeam1}
                      placeholder="Enter team 1 name"
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="words"
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black"
                    />
                  </View>

                  <View className="mb-3">
                    <Text className="text-gray-500 text-xs font-medium mb-2">Player 2</Text>
                    <TextInput
                      value={player2}
                      onChangeText={setPlayer2}
                      placeholder="Enter player 2 name"
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="words"
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black"
                    />
                  </View>

                  <View>
                    <Text className="text-gray-500 text-xs font-medium mb-2">Team 2</Text>
                    <TextInput
                      value={team2}
                      onChangeText={setTeam2}
                      placeholder="Enter team 2 name"
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="words"
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black"
                    />
                  </View>
                </View>

                <Text className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Payment Type</Text>

                <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-5">
                  <TouchableOpacity
                    onPress={() => setPaymentType("per-game")}
                    className={`flex-1 py-2.5 rounded-lg items-center ${paymentType === "per-game" ? "bg-white dark:bg-gray-700" : ""}`}
                    style={paymentType === "per-game" ? { shadowOpacity: 0.05, elevation: 1 } : undefined}
                  >
                    <Text className={`text-sm font-semibold ${paymentType === "per-game" ? "text-indigo-600" : "text-gray-500"}`}>
                      Per Game
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setPaymentType("per-hour")}
                    className={`flex-1 py-2.5 rounded-lg items-center ${paymentType === "per-hour" ? "bg-white dark:bg-gray-700" : ""}`}
                    style={paymentType === "per-hour" ? { shadowOpacity: 0.05, elevation: 1 } : undefined}
                  >
                    <Text className={`text-sm font-semibold ${paymentType === "per-hour" ? "text-indigo-600" : "text-gray-500"}`}>
                      Per Hour
                    </Text>
                  </TouchableOpacity>
                </View>

                {paymentType === "per-game" ? (
                  <View className="mb-5">
                    <Text className="text-gray-500 text-sm font-medium mb-2">Amount per game (KES)</Text>
                    <TextInput
                      value={pricePerGame}
                      onChangeText={setPricePerGame}
                      keyboardType="numeric"
                      placeholder="e.g. 150"
                      placeholderTextColor="#9CA3AF"
                      className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-black dark:text-white"
                    />
                    <Text className="text-gray-400 text-xs mt-2">
                      You&apos;ll tap who lost after each game — the total updates automatically.
                    </Text>
                  </View>
                ) : (
                  <View className="mb-5">
                    <Text className="text-gray-500 text-sm font-medium mb-2">Rate per hour (KES)</Text>
                    <TextInput
                      value={hourlyRate}
                      onChangeText={setHourlyRate}
                      keyboardType="numeric"
                      placeholder="e.g. 200"
                      placeholderTextColor="#9CA3AF"
                      className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-black dark:text-white"
                    />
                    <Text className="text-gray-400 text-xs mt-2">
                      You&apos;ll enter total hours when you close the session.
                    </Text>
                  </View>
                )}
              </ScrollView>

              <View style={{ paddingTop: 12 }}>
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={!isValid}
                  activeOpacity={0.85}
                  className={`rounded-2xl py-4 items-center ${isValid ? "bg-indigo-600" : "bg-gray-200"}`}
                >
                  <Text className={`font-semibold text-base ${isValid ? "text-white" : "text-gray-400"}`}>
                    Start Session
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}