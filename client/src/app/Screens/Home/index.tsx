import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { View, ScrollView, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { GameSession, StatFilter } from "./types";
import { getBill } from "./utils/billing";

import { StatCard } from "./components/StatCard";
import { GameListItem } from "./components/GameListItem";
import { StatDetailModal } from "./components/StatDetailModal";
import { GameBillModal } from "./components/GameBillModal";
import { NewGameModal } from "./components/NewGameModal";
import { useGames } from "./GameContext";

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const { games, setGames } = useGames();
  const [statFilter, setStatFilter] = useState<StatFilter>(null);
  const [statModalVisible, setStatModalVisible] = useState(false);
  const [billModalVisible, setBillModalVisible] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameSession | null>(null);

  const stats = useMemo(() => {
    const gamesToday = games.length;

    const paidPlayers = games.reduce(
      (count, g) => count + (g.player1Paid ? 1 : 0) + (g.player2Paid ? 1 : 0),
      0
    );

    const unpaidPlayers = games.reduce(
      (count, g) => count + (!g.player1Paid ? 1 : 0) + (!g.player2Paid ? 1 : 0),
      0
    );

    const revenueToday = games.reduce((sum, game) => {
      const bill = getBill(game);
      if (bill.isPerGame) {
        return sum + (game.player1Paid ? bill.p1Owes : 0) + (game.player2Paid ? bill.p2Owes : 0);
      }
      return game.player1Paid && game.player2Paid ? sum + game.amount : sum;
    }, 0);

    return { gamesToday, paidPlayers, unpaidPlayers, revenueToday };
  }, [games]);

  const handleAddGame = (
    session: Omit<GameSession, "id" | "time" | "createdAt" | "player1Paid" | "player2Paid">
  ) => {
    const time = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    setGames((prev) => [
      { ...session, id: Date.now().toString(), time, createdAt: Date.now(), player1Paid: false, player2Paid: false },
      ...prev,
    ]);
  };

  const recentGames = useMemo(
    () => [...games].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3),
    [games]
  );

  const openStatDetail = (filter: StatFilter) => {
    setStatFilter(filter);
    setStatModalVisible(true);
  };

  const openBill = (session: GameSession) => {
    setSelectedGame(session);
    setBillModalVisible(true);
  };

  const togglePlayerPayment = (player: "player1" | "player2") => {
    if (!selectedGame) return;
    setGames((prev) =>
      prev.map((g) =>
        g.id !== selectedGame.id ? g : { ...g, [`${player}Paid`]: !g[`${player}Paid`] }
      )
    );
    setSelectedGame((prev) => (prev ? { ...prev, [`${player}Paid`]: !prev[`${player}Paid`] } : prev));
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 60, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-gray-400 text-sm">Welcome back 👋</Text>
            <Text className="text-black dark:text-white text-2xl font-bold mt-0.5">Game Hub</Text>
          </View>
          <TouchableOpacity className="w-11 h-11 rounded-full bg-white dark:bg-gray-900 items-center justify-center border border-gray-100 dark:border-gray-800">
            <Ionicons name="notifications-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View className="flex-row mb-3 -mx-1">
          <StatCard label="Games Today" value={stats.gamesToday} icon="game-controller-outline" color="#4F46E5" onPress={() => openStatDetail("all")} />
          <StatCard label="Paid Players" value={stats.paidPlayers} icon="checkmark-circle-outline" color="#16A34A" onPress={() => openStatDetail("paid")} />
          <StatCard label="Unpaid Players" value={stats.unpaidPlayers} icon="alert-circle-outline" color="#DC2626" onPress={() => openStatDetail("unpaid")} />
        </View>

        <View className="bg-black rounded-2xl p-4 mb-6 flex-row items-center justify-between">
          <View>
            <Text className="text-gray-300 text-xs">Revenue Today</Text>
            <Text className="text-white text-2xl font-bold mt-1">KES {stats.revenueToday}</Text>
          </View>
          <Ionicons name="trending-up" size={28} color="#4ADE80" />
        </View>

        <TouchableOpacity
          className="flex-row items-center justify-center bg-indigo-600 rounded-2xl py-4 mb-6"
          activeOpacity={0.85}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text className="text-white font-semibold text-base ml-2">Log New Game</Text>
        </TouchableOpacity>

        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-black dark:text-white text-lg font-bold">Recent Games</Text>
          <TouchableOpacity onPress={() => router.push("/games")}>
            <Text className="text-indigo-600 text-sm font-medium">See all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={recentGames}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <GameListItem item={item} onPress={openBill} />}
        />
      </ScrollView>

      <NewGameModal visible={modalVisible} onClose={() => setModalVisible(false)} onSubmit={handleAddGame} />
      <StatDetailModal visible={statModalVisible} filter={statFilter} games={games} onClose={() => setStatModalVisible(false)} />
      <GameBillModal visible={billModalVisible} session={selectedGame} onClose={() => setBillModalVisible(false)} onTogglePayment={togglePlayerPayment} />
    </View>
  );
}