import { useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SectionList, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGames } from "./Home/GameContext";
import { GameSession } from "./Home/types";
import { STATIONS } from "./Home/constants";
import { GameBillModal } from "./Home/components/GameBillModal";

type PaymentFilter = "all" | "paid" | "unpaid";
type DateFilter = "all" | "today" | "week" | "month";

const dateFilters: { label: string; value: DateFilter }[] = [
  { label: "All dates", value: "all" },
  { label: "Today", value: "today" },
  { label: "This week", value: "week" },
  { label: "This month", value: "month" },
];

function getDateLabel(timestamp: number) {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function GameRow({ item, onPress }: { item: GameSession; onPress: () => void }) {
  const isPaid = item.player1Paid && item.player2Paid;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="flex-row items-center justify-between bg-white rounded-xl p-4 mb-3 border border-gray-100"
    >
      <View className="flex-row items-center flex-1">
        <View className="w-11 h-11 rounded-full bg-indigo-50 items-center justify-center mr-3">
          <Ionicons name="game-controller" size={20} color="#4F46E5" />
        </View>
        <View className="flex-1">
          <Text className="text-black font-semibold text-base">{item.gameName}</Text>
          <Text className="text-gray-400 text-xs mt-0.5">
            2 players • {getDateLabel(item.createdAt)} • {item.time}
          </Text>
        </View>
      </View>

      <View className="items-end ml-2">
        <Text className="text-black font-semibold">KES {item.amount}</Text>
        <View
          className={`mt-1 px-2 py-0.5 rounded-full ${
            isPaid ? "bg-green-50" : "bg-red-50"
          }`}
        >
          <Text
            className={`text-xs font-medium ${
              isPaid ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPaid ? "Paid" : "Unpaid"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function FilterPill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={`px-4 py-2.5 rounded-xl mr-2 ${
        active ? "bg-indigo-600" : "bg-white border border-gray-200"
      }`}
    >
      <Text className={`text-sm font-medium ${active ? "text-white" : "text-gray-500"}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function HistoryScreen() {
  const { games, setGames } = useGames();
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [stationFilter, setStationFilter] = useState("all");
  const [selectedGame, setSelectedGame] = useState<GameSession | null>(null);

  const filteredGames = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    return games
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt)
      .filter((game) => {
      const matchesSearch =
        !normalizedQuery ||
        game.gameName.toLowerCase().includes(normalizedQuery);
      const isPaid = game.player1Paid && game.player2Paid;
      const matchesPayment =
        paymentFilter === "all" ||
        (paymentFilter === "paid" && isPaid) ||
        (paymentFilter === "unpaid" && !isPaid);
      const gameDate = new Date(game.createdAt);
      const matchesDate =
        dateFilter === "all" ||
        (dateFilter === "today" && gameDate.toDateString() === now.toDateString()) ||
        (dateFilter === "week" && gameDate >= startOfWeek) ||
        (dateFilter === "month" &&
          gameDate.getFullYear() === now.getFullYear() &&
          gameDate.getMonth() === now.getMonth());
      const matchesStation = stationFilter === "all" || game.station === stationFilter;

      return matchesSearch && matchesPayment && matchesDate && matchesStation;
    });
  }, [dateFilter, games, paymentFilter, searchQuery, stationFilter]);

  const filteredSections = useMemo(
    () => Array.from(new Set(filteredGames.map((game) => getDateLabel(game.createdAt))))
      .map((title) => ({
        title,
        data: filteredGames.filter((game) => getDateLabel(game.createdAt) === title),
      }))
      .filter((section) => section.data.length > 0),
    [filteredGames]
  );

  const totalUnpaid = filteredGames
    .filter((game) => !(game.player1Paid && game.player2Paid))
    .reduce((sum, game) => sum + game.amount, 0);

  return (
    <View className="flex-1 bg-gray-50">
      <View style={{ paddingHorizontal: 16, paddingTop: 60 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-5">
          <Text className="text-black text-2xl font-bold">History</Text>
          <View className="bg-red-50 px-3 py-1.5 rounded-full flex-row items-center">
            <Ionicons name="alert-circle" size={14} color="#DC2626" />
            <Text className="text-red-600 text-xs font-medium ml-1">
              KES {totalUnpaid} owed
            </Text>
          </View>
        </View>

        {/* Search */}
        <View className="flex-row items-center bg-white rounded-xl px-3 border border-gray-100 mb-4">
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search games..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 py-3 px-2 text-black"
          />
        </View>

        {/* Filter pills */}
        <View className="mb-4">
          <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">
            Payment status
          </Text>
          <View className="flex-row bg-white rounded-xl p-1 border border-gray-100">
            {[
              { label: "All", value: "all" as const },
              { label: "Paid", value: "paid" as const },
              { label: "Unpaid", value: "unpaid" as const },
            ].map((filter) => (
              <TouchableOpacity
                key={filter.value}
                activeOpacity={0.8}
                onPress={() => setPaymentFilter(filter.value)}
                className={`flex-1 items-center py-2.5 rounded-lg ${
                  paymentFilter === filter.value ? "bg-indigo-600" : ""
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    paymentFilter === filter.value ? "text-white" : "text-gray-500"
                  }`}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">
            Date range
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dateFilters.map((filter) => (
              <FilterPill
                key={filter.value}
                label={filter.label}
                active={dateFilter === filter.value}
                onPress={() => setDateFilter(filter.value)}
              />
            ))}
          </ScrollView>
        </View>

        <View className="mb-5">
          <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">
            Station
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <FilterPill label="All stations" active={stationFilter === "all"} onPress={() => setStationFilter("all")} />
            {STATIONS.map((station) => (
              <FilterPill
                key={station}
                label={station}
                active={stationFilter === station}
                onPress={() => setStationFilter(station)}
              />
            ))}
          </ScrollView>
        </View>
      </View>

      {/* List */}
      <SectionList
        sections={filteredSections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GameRow item={item} onPress={() => setSelectedGame(item)} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="text-gray-400 text-xs font-semibold uppercase mb-2 mt-1">
            {title}
          </Text>
        )}
        ListEmptyComponent={
          <Text className="text-gray-400 text-center mt-8">No games found</Text>
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
      <GameBillModal
        visible={selectedGame !== null}
        session={selectedGame}
        onClose={() => setSelectedGame(null)}
        onTogglePayment={(player) => {
          if (!selectedGame) return;
          setGames((previousGames) =>
            previousGames.map((game) =>
              game.id === selectedGame.id
                ? { ...game, [`${player}Paid`]: !game[`${player}Paid`] }
                : game
            )
          );
          setSelectedGame((game) =>
            game ? { ...game, [`${player}Paid`]: !game[`${player}Paid`] } : game
          );
        }}
      />
    </View>
  );
}