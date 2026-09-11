import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Station = {
  id: string;
  name: string;
  currentGame: string | null;
  pricePerSession: number;
  status: "free" | "in-use";
  startedAt?: string;
};

const stations: Station[] = [
  { id: "1", name: "Station 1", currentGame: "FIFA 25", pricePerSession: 150, status: "in-use", startedAt: "10:45 AM" },
  { id: "2", name: "Station 2", currentGame: null, pricePerSession: 150, status: "free" },
  { id: "3", name: "Station 3", currentGame: "Call of Duty", pricePerSession: 200, status: "in-use", startedAt: "10:10 AM" },
  { id: "4", name: "Station 4", currentGame: null, pricePerSession: 150, status: "free" },
  { id: "5", name: "Station 5", currentGame: "Mortal Kombat", pricePerSession: 150, status: "in-use", startedAt: "9:30 AM" },
  { id: "6", name: "Station 6", currentGame: null, pricePerSession: 200, status: "free" },
];

const summary = {
  total: stations.length,
  inUse: stations.filter((s) => s.status === "in-use").length,
  free: stations.filter((s) => s.status === "free").length,
};

function SummaryPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View className="flex-1 bg-white rounded-2xl p-4 mx-1 border border-gray-100 items-center">
      <Text className="text-xl font-bold" style={{ color }}>
        {value}
      </Text>
      <Text className="text-gray-400 text-xs mt-0.5">{label}</Text>
    </View>
  );
}

function StationCard({ station }: { station: Station }) {
  const isFree = station.status === "free";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="bg-white rounded-2xl p-4 mb-3 border border-gray-100"
      style={{ width: "48%" }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="w-10 h-10 rounded-full bg-indigo-50 items-center justify-center">
          <Ionicons name="game-controller" size={20} color="#4F46E5" />
        </View>
        <View className={`px-2 py-0.5 rounded-full ${isFree ? "bg-green-50" : "bg-orange-50"}`}>
          <Text className={`text-xs font-medium ${isFree ? "text-green-600" : "text-orange-600"}`}>
            {isFree ? "Free" : "In Use"}
          </Text>
        </View>
      </View>

      <Text className="text-black font-semibold text-base">{station.name}</Text>

      {isFree ? (
        <Text className="text-gray-400 text-xs mt-1">Available now</Text>
      ) : (
        <>
          <Text className="text-gray-500 text-xs mt-1">{station.currentGame}</Text>
          <Text className="text-gray-300 text-xs mt-0.5">Since {station.startedAt}</Text>
        </>
      )}

      <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <Text className="text-gray-400 text-xs">Per session</Text>
        <Text className="text-black text-sm font-semibold">KES {station.pricePerSession}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function GamesScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 60, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-black text-2xl font-bold">Stations</Text>
          <TouchableOpacity className="w-11 h-11 rounded-full bg-indigo-600 items-center justify-center">
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Summary */}
        <View className="flex-row mb-6 -mx-1">
          <SummaryPill label="Total" value={summary.total} color="#111827" />
          <SummaryPill label="In Use" value={summary.inUse} color="#EA580C" />
          <SummaryPill label="Free" value={summary.free} color="#16A34A" />
        </View>

        {/* Station grid */}
        <View className="flex-row flex-wrap justify-between">
          {stations.map((station) => (
            <StationCard key={station.id} station={station} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}