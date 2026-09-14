import { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GameSession, PaymentType, Winner } from "../types";
import { STATIONS } from "../constants";
import { ChipSelector } from "./ChipSelector";

export function NewGameModal({
  visible,
  onClose,
  onSubmit,
  gameOptions,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (session: Omit<GameSession, "id" | "time" | "createdAt" | "player1Paid" | "player2Paid">) => void;
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

  const [amountPerGame, setAmountPerGame] = useState("");
  const [numberOfGames, setNumberOfGames] = useState("");

  const [hourlyRate, setHourlyRate] = useState("");
  const [numberOfHours, setNumberOfHours] = useState("");

  const [player1Wins, setPlayer1Wins] = useState("");
  const [player2Wins, setPlayer2Wins] = useState("");

  const derivedWinner: Winner = useMemo(() => {
    if (paymentType !== "per-game") return null;
    if (player1Wins === "" || player2Wins === "") return null;

    const p1 = parseInt(player1Wins, 10);
    const p2 = parseInt(player2Wins, 10);

    if (p1 > p2) return "player1";
    if (p2 > p1) return "player2";
    return "draw";
  }, [paymentType, player1Wins, player2Wins]);

  const total = useMemo(() => {
    if (paymentType === "per-game") {
      const rate = parseFloat(amountPerGame) || 0;
      const count = parseFloat(numberOfGames) || 0;
      return rate * count;
    }
    const rate = parseFloat(hourlyRate) || 0;
    const hours = parseFloat(numberOfHours) || 0;
    return rate * hours;
  }, [paymentType, amountPerGame, numberOfGames, hourlyRate, numberOfHours]);

  const isValid =
    !!game &&
    !!station &&
    !!team1.trim() &&
    !!player1.trim() &&
    !!team2.trim() &&
    !!player2.trim() &&
    (paymentType === "per-game"
      ? !!amountPerGame && !!numberOfGames && derivedWinner !== null
      : !!hourlyRate && !!numberOfHours);

  const resetForm = () => {
    setGame(null);
    setStation(null);
    setTeam1("");
    setPlayer1("");
    setTeam2("");
    setPlayer2("");
    setPaymentType("per-game");
    setAmountPerGame("");
    setNumberOfGames("");
    setHourlyRate("");
    setNumberOfHours("");
    setPlayer1Wins("");
    setPlayer2Wins("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!isValid || !game || !station) return;

    const detail = paymentType === "per-game" ? `${numberOfGames} games` : `${numberOfHours} hrs`;
    const isPerGame = paymentType === "per-game";

    onSubmit({
      gameName: game,
      station,
      team1: team1.trim(),
      player1: player1.trim(),
      team2: team2.trim(),
      player2: player2.trim(),
      amount: total,
      detail,
      winner: isPerGame ? derivedWinner : undefined,
      player1Wins: isPerGame ? parseInt(player1Wins, 10) || 0 : undefined,
      player2Wins: isPerGame ? parseInt(player2Wins, 10) || 0 : undefined,
      pricePerGame: isPerGame ? parseFloat(amountPerGame) || 0 : undefined,
    });

    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <Pressable className="flex-1 bg-black/40 justify-end" onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="w-full"
          style={{ maxHeight: "100%" }}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View
              className="bg-white rounded-t-3xl px-5 pt-5"
              style={{ maxHeight: "88%", paddingBottom: Math.max(insets.bottom, 16) + 8 }}
            >
              <View className="w-10 h-1.5 bg-gray-200 rounded-full self-center mb-4" />

              <View className="flex-row items-center justify-between mb-5">
                <Text className="text-black text-xl font-bold">Log New Game</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                >
                  <Ionicons name="close" size={18} color="#374151" />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 16 }}
              >
                <ChipSelector label="Game" options={gameOptions} selected={game} onSelect={setGame} />
                <ChipSelector label="Station" options={STATIONS} selected={station} onSelect={setStation} />

                <View className="mb-5">
                  <Text className="text-gray-500 text-sm font-medium mb-3">Match Details</Text>

                  <View className="mb-3">
                    <Text className="text-gray-500 text-xs font-medium mb-2">Player 1</Text>
                    <TextInput
                      value={player1}
                      onChangeText={setPlayer1}
                      placeholder="Enter player 1 name"
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="words"
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black"
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

                <Text className="text-gray-500 text-sm font-medium mb-2">Payment Type</Text>

                <View className="flex-row bg-gray-100 rounded-xl p-1 mb-5">
                  <TouchableOpacity
                    onPress={() => setPaymentType("per-game")}
                    className={`flex-1 py-2.5 rounded-lg items-center ${
                      paymentType === "per-game" ? "bg-white" : ""
                    }`}
                    style={paymentType === "per-game" ? { shadowOpacity: 0.05, elevation: 1 } : undefined}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        paymentType === "per-game" ? "text-indigo-600" : "text-gray-500"
                      }`}
                    >
                      Per Game
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setPaymentType("per-hour")}
                    className={`flex-1 py-2.5 rounded-lg items-center ${
                      paymentType === "per-hour" ? "bg-white" : ""
                    }`}
                    style={paymentType === "per-hour" ? { shadowOpacity: 0.05, elevation: 1 } : undefined}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        paymentType === "per-hour" ? "text-indigo-600" : "text-gray-500"
                      }`}
                    >
                      Per Hour
                    </Text>
                  </TouchableOpacity>
                </View>

                {paymentType === "per-game" ? (
                  <View className="flex-row mb-5" style={{ gap: 12 }}>
                    <View className="flex-1">
                      <Text className="text-gray-500 text-sm font-medium mb-2">Amount per game (KES)</Text>
                      <TextInput
                        value={amountPerGame}
                        onChangeText={setAmountPerGame}
                        keyboardType="numeric"
                        placeholder="e.g. 150"
                        placeholderTextColor="#9CA3AF"
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black"
                      />
                    </View>

                    <View className="flex-1">
                      <Text className="text-gray-500 text-sm font-medium mb-2">Number of games</Text>
                      <TextInput
                        value={numberOfGames}
                        onChangeText={(v) => setNumberOfGames(v.replace(/[^0-9]/g, ""))}
                        keyboardType="numeric"
                        placeholder="e.g. 2"
                        placeholderTextColor="#9CA3AF"
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black"
                      />
                    </View>
                  </View>
                ) : (
                  <View className="flex-row mb-5" style={{ gap: 12 }}>
                    <View className="flex-1">
                      <Text className="text-gray-500 text-sm font-medium mb-2">Rate per hour (KES)</Text>
                      <TextInput
                        value={hourlyRate}
                        onChangeText={setHourlyRate}
                        keyboardType="numeric"
                        placeholder="e.g. 200"
                        placeholderTextColor="#9CA3AF"
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black"
                      />
                    </View>

                    <View className="flex-1">
                      <Text className="text-gray-500 text-sm font-medium mb-2">Number of hours</Text>
                      <TextInput
                        value={numberOfHours}
                        onChangeText={setNumberOfHours}
                        keyboardType="numeric"
                        placeholder="e.g. 1.5"
                        placeholderTextColor="#9CA3AF"
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black"
                      />
                    </View>
                  </View>
                )}

                {paymentType === "per-game" && (
                  <View className="mb-5">
                    <Text className="text-gray-500 text-sm font-medium mb-2">Wins</Text>

                    <View className="flex-row" style={{ gap: 12 }}>
                      <View className="flex-1">
                        <Text className="text-gray-400 text-xs mb-1">{player1.trim() || "Player 1"}</Text>
                        <TextInput
                          value={player1Wins}
                          onChangeText={(v) => setPlayer1Wins(v.replace(/[^0-9]/g, ""))}
                          keyboardType="numeric"
                          placeholder="0"
                          placeholderTextColor="#9CA3AF"
                          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black text-center"
                        />
                      </View>

                      <View className="flex-1">
                        <Text className="text-gray-400 text-xs mb-1">{player2.trim() || "Player 2"}</Text>
                        <TextInput
                          value={player2Wins}
                          onChangeText={(v) => setPlayer2Wins(v.replace(/[^0-9]/g, ""))}
                          keyboardType="numeric"
                          placeholder="0"
                          placeholderTextColor="#9CA3AF"
                          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black text-center"
                        />
                      </View>
                    </View>

                    <View
                      className={`rounded-xl p-3 flex-row items-center justify-between mt-3 ${
                        derivedWinner === "draw" ? "bg-amber-50" : "bg-indigo-50"
                      }`}
                    >
                      <View className="flex-row items-center">
                        <Ionicons
                          name={
                            derivedWinner === null
                              ? "help-circle"
                              : derivedWinner === "draw"
                              ? "git-compare"
                              : "trophy"
                          }
                          size={14}
                          color={
                            derivedWinner === null
                              ? "#6B7280"
                              : derivedWinner === "draw"
                              ? "#D97706"
                              : "#4F46E5"
                          }
                        />
                        <Text
                          className={`text-xs font-medium ml-1.5 ${
                            derivedWinner === null
                              ? "text-gray-500"
                              : derivedWinner === "draw"
                              ? "text-amber-700"
                              : "text-indigo-600"
                          }`}
                        >
                          Result
                        </Text>
                      </View>

                      <Text
                        className={`text-sm font-bold ${
                          derivedWinner === null
                            ? "text-gray-500"
                            : derivedWinner === "draw"
                            ? "text-amber-700"
                            : "text-indigo-700"
                        }`}
                      >
                        {derivedWinner === null
                          ? "Enter both win counts"
                          : derivedWinner === "draw"
                          ? `Draw ${parseInt(player1Wins, 10) || 0} — ${parseInt(player2Wins, 10) || 0}`
                          : `${
                              derivedWinner === "player1" ? player1.trim() || "Player 1" : player2.trim() || "Player 2"
                            } won ${Math.max(parseInt(player1Wins, 10) || 0, parseInt(player2Wins, 10) || 0)} — ${Math.min(
                              parseInt(player1Wins, 10) || 0,
                              parseInt(player2Wins, 10) || 0
                            )}`}
                      </Text>
                    </View>
                  </View>
                )}

                <View className="bg-indigo-50 rounded-2xl p-4 flex-row items-center justify-between">
                  <Text className="text-indigo-600 text-sm font-medium">Total</Text>
                  <Text className="text-indigo-700 text-lg font-bold">KES {total || 0}</Text>
                </View>
              </ScrollView>

              <View style={{ paddingTop: 12 }}>
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={!isValid}
                  activeOpacity={0.85}
                  className={`rounded-2xl py-4 items-center ${isValid ? "bg-indigo-600" : "bg-gray-200"}`}
                >
                  <Text className={`font-semibold text-base ${isValid ? "text-white" : "text-gray-400"}`}>
                    Save Game
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