import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Session } from "../types";
import { getSessionTally } from "../utils/sessionBilling";

export function ActiveSessionCard({
  session,
  onRecordLoss,
  onUndoLast,
  onRequestClose,
}: {
  session: Session;
  onRecordLoss: (sessionId: string, loser: "player1" | "player2") => void;
  onUndoLast: (sessionId: string) => void;
  onRequestClose: (session: Session) => void;
}) {
  const tally = getSessionTally(session);

  return (
    <View className="bg-white dark:bg-gray-900 rounded-2xl p-4 mb-3 border border-indigo-100 dark:border-indigo-900">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
          <Text className="text-black dark:text-white font-semibold text-base">{session.gameName}</Text>
        </View>
        <Text className="text-gray-400 text-xs">
          {session.station} • started {session.startTime}
        </Text>
      </View>

      {tally.isPerGame ? (
        <>
          <View className="flex-row" style={{ gap: 12 }}>
            <TouchableOpacity
              onPress={() => onRecordLoss(session.id, "player1")}
              activeOpacity={0.85}
              className="flex-1 bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-900 rounded-xl py-3 items-center"
            >
              <Text className="text-red-600 text-xs font-medium mb-1">{session.player1} lost</Text>
              <Text className="text-red-700 text-lg font-bold">{tally.p1Losses}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onRecordLoss(session.id, "player2")}
              activeOpacity={0.85}
              className="flex-1 bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-900 rounded-xl py-3 items-center"
            >
              <Text className="text-red-600 text-xs font-medium mb-1">{session.player2} lost</Text>
              <Text className="text-red-700 text-lg font-bold">{tally.p2Losses}</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center justify-between mt-3">
            <TouchableOpacity
              onPress={() => onUndoLast(session.id)}
              disabled={session.rounds.length === 0}
              className="flex-row items-center"
            >
              <Ionicons
                name="arrow-undo-outline"
                size={14}
                color={session.rounds.length === 0 ? "#D1D5DB" : "#6B7280"}
              />
              <Text className={`text-xs ml-1 ${session.rounds.length === 0 ? "text-gray-300" : "text-gray-500"}`}>
                Undo last
              </Text>
            </TouchableOpacity>

            <Text className="text-gray-400 text-xs">
              {tally.totalGames} game{tally.totalGames === 1 ? "" : "s"} • running total KES {tally.totalOwed}
            </Text>
          </View>
        </>
      ) : (
        <Text className="text-gray-400 text-xs mb-3">
          Hourly session • KES {session.hourlyRate}/hr — enter hours when you close
        </Text>
      )}

      <TouchableOpacity
        onPress={() => onRequestClose(session)}
        activeOpacity={0.85}
        className="bg-black dark:bg-gray-800 rounded-xl py-3 items-center mt-3"
      >
        <Text className="text-white text-sm font-semibold">Close Session</Text>
      </TouchableOpacity>
    </View>
  );
}