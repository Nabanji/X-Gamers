import { View, Text, TextInput, TouchableOpacity, SectionList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type GameSession = {
  id: string;
  gameName: string;
  players: number;
  amount: number;
  paid: boolean;
  time: string;
  date: string;
};

const allGames: GameSession[] = [
  { id: "1", gameName: "FIFA 25", players: 2, amount: 300, paid: true, time: "10:45 AM", date: "Today" },
  { id: "2", gameName: "Call of Duty", players: 4, amount: 600, paid: false, time: "10:10 AM", date: "Today" },
  { id: "3", gameName: "Mortal Kombat", players: 2, amount: 300, paid: true, time: "9:30 AM", date: "Today" },
  { id: "4", gameName: "NBA 2K25", players: 2, amount: 300, paid: false, time: "9:05 AM", date: "Today" },
  { id: "5", gameName: "FIFA 25", players: 2, amount: 300, paid: true, time: "8:20 PM", date: "Yesterday" },
  { id: "6", gameName: "Tekken 8", players: 2, amount: 300, paid: true, time: "6:15 PM", date: "Yesterday" },
  { id: "7", gameName: "Call of Duty", players: 4, amount: 600, paid: false, time: "4:00 PM", date: "Yesterday" },
  { id: "8", gameName: "FIFA 25", players: 2, amount: 300, paid: true, time: "7:40 PM", date: "Mon, Sep 8" },
];

const sections = [
  { title: "Today", data: allGames.filter((g) => g.date === "Today") },
  { title: "Yesterday", data: allGames.filter((g) => g.date === "Yesterday") },
  { title: "Mon, Sep 8", data: allGames.filter((g) => g.date === "Mon, Sep 8") },
];

const totalUnpaid = allGames.filter((g) => !g.paid).reduce((sum, g) => sum + g.amount, 0);

function GameRow({ item }: { item: GameSession }) {
  return (
    <View className="flex-row items-center justify-between bg-white rounded-xl p-4 mb-3 border border-gray-100">
      <View className="flex-row items-center flex-1">
        <View className="w-11 h-11 rounded-full bg-indigo-50 items-center justify-center mr-3">
          <Ionicons name="game-controller" size={20} color="#4F46E5" />
        </View>
        <View className="flex-1">
          <Text className="text-black font-semibold text-base">{item.gameName}</Text>
          <Text className="text-gray-400 text-xs mt-0.5">
            {item.players} players • {item.time}
          </Text>
        </View>
      </View>

      <View className="items-end ml-2">
        <Text className="text-black font-semibold">KES {item.amount}</Text>
        <View
          className={`mt-1 px-2 py-0.5 rounded-full ${
            item.paid ? "bg-green-50" : "bg-red-50"
          }`}
        >
          <Text
            className={`text-xs font-medium ${
              item.paid ? "text-green-600" : "text-red-600"
            }`}
          >
            {item.paid ? "Paid" : "Unpaid"}
          </Text>
        </View>
      </View>
    </View>
  );
}

function FilterPill({ label, active }: { label: string; active: boolean }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={`px-4 py-2 rounded-full mr-2 ${
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
            placeholder="Search games..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 py-3 px-2 text-black"
          />
        </View>

        {/* Filter pills */}
        <View className="flex-row mb-4">
          <FilterPill label="All" active={true} />
          <FilterPill label="Paid" active={false} />
          <FilterPill label="Unpaid" active={false} />
        </View>
      </View>

      {/* List */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GameRow item={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="text-gray-400 text-xs font-semibold uppercase mb-2 mt-1">
            {title}
          </Text>
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}