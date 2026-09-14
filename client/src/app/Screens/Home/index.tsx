import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Session } from "./types";
import { getSessionTally } from "./utils/sessionBilling";
import { ActiveSessionCard } from "./components/ActiveSessionCard";
import { CloseSessionModal } from "./components/CloseSessionModal";
import { OpenSessionModal } from "./components/OpenSessionModal";
import { useGames } from "./GameContext";
import { useNotifications } from "../../NotificationContext";

export default function HomeScreen() {
  const router = useRouter();
  const { games, gameOptions, openSession, recordLoss, undoLastRound, closeSession } = useGames();
  const { unreadCount, addNotification } = useNotifications();
  const [openModalVisible, setOpenModalVisible] = useState(false);
  const [sessionToClose, setSessionToClose] = useState<Session | null>(null);

  const activeSessions = useMemo(() => games.filter((session) => session.status === "active"), [games]);
  const totalRevenue = useMemo(
    () => games.reduce((total, session) => total + getSessionTally(session).totalOwed, 0),
    [games]
  );

  const handleOpenSession = (session: Parameters<typeof openSession>[0]) => {
    openSession(session);
    addNotification({
      icon: "play-circle-outline",
      iconBackground: "bg-green-50 dark:bg-green-950",
      title: "Session started",
      message: `${session.gameName} at ${session.station} is now active.`,
      time: "Just now",
    });
  };

  const handleCloseSession = (sessionId: string, hoursPlayed?: number) => {
    closeSession(sessionId, hoursPlayed);
    setSessionToClose(null);
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
            <Text className="text-gray-400 text-sm">Welcome back</Text>
            <Text className="text-black dark:text-white text-2xl font-bold mt-0.5">Game Hub</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/notifications")}
            accessibilityLabel={unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"}
            className="w-11 h-11 rounded-full bg-white dark:bg-gray-900 items-center justify-center border border-gray-100 dark:border-gray-800"
          >
            <Ionicons name="notifications-outline" size={20} color="#9CA3AF" />
            {unreadCount > 0 && (
              <View className="absolute -right-0.5 -top-0.5 min-w-4 h-4 rounded-full bg-red-600 items-center justify-center px-1">
                <Text className="text-white text-[10px] font-bold">{unreadCount > 9 ? "9+" : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-row mb-6">
          <View className="flex-1 bg-white dark:bg-gray-900 rounded-2xl p-4 mr-2 border border-gray-100 dark:border-gray-800">
            <Text className="text-gray-400 text-xs">Active sessions</Text>
            <Text className="text-black dark:text-white text-2xl font-bold mt-1">{activeSessions.length}</Text>
          </View>
          <View className="flex-1 bg-black rounded-2xl p-4 ml-2">
            <Text className="text-gray-300 text-xs">Revenue</Text>
            <Text className="text-white text-xl font-bold mt-1">KES {totalRevenue}</Text>
          </View>
        </View>

        <TouchableOpacity
          className="flex-row items-center justify-center bg-indigo-600 rounded-2xl py-4 mb-6"
          activeOpacity={0.85}
          onPress={() => setOpenModalVisible(true)}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text className="text-white font-semibold text-base ml-2">Open New Session</Text>
        </TouchableOpacity>

        <Text className="text-gray-400 text-xs font-semibold uppercase mb-2 ml-1">Active now</Text>
        {activeSessions.length === 0 ? (
          <View className="bg-white dark:bg-gray-900 rounded-2xl p-6 items-center border border-gray-100 dark:border-gray-800">
            <Ionicons name="game-controller-outline" size={28} color="#9CA3AF" />
            <Text className="text-gray-500 dark:text-gray-400 text-sm mt-3">No active sessions</Text>
          </View>
        ) : (
          activeSessions.map((session) => (
            <ActiveSessionCard
              key={session.id}
              session={session}
              onRecordLoss={recordLoss}
              onUndoLast={undoLastRound}
              onRequestClose={setSessionToClose}
            />
          ))
        )}
      </ScrollView>

      <OpenSessionModal
        visible={openModalVisible}
        onClose={() => setOpenModalVisible(false)}
        onSubmit={handleOpenSession}
        gameOptions={gameOptions.filter((option) => option.active).map((option) => option.name)}
      />
      <CloseSessionModal
        visible={sessionToClose !== null}
        session={sessionToClose}
        onClose={() => setSessionToClose(null)}
        onConfirm={handleCloseSession}
      />
    </View>
  );
}
