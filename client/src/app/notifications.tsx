import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useNotifications } from "./NotificationContext";

function SettingRow({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <View className="flex-row items-center px-4 py-4 border-b border-gray-100 dark:border-gray-800">
      <View className="flex-1 pr-4">
        <Text className="text-gray-950 dark:text-white text-base font-semibold">{label}</Text>
        <Text className="text-gray-400 text-sm mt-1 leading-5">{description}</Text>
      </View>
      <TouchableOpacity
        onPress={onToggle}
        accessibilityRole="switch"
        accessibilityState={{ checked: enabled }}
        accessibilityLabel={label}
        className={`w-11 h-6 rounded-full justify-center px-1 ${enabled ? "bg-indigo-600 items-end" : "bg-gray-300 dark:bg-gray-700 items-start"}`}
      >
        <View className="w-4 h-4 rounded-full bg-white" />
      </TouchableOpacity>
    </View>
  );
}

export default function Notifications() {
  const { notifications, setNotifications, unreadCount, markAllRead } = useNotifications();
  const [gameAlerts, setGameAlerts] = useState(true);
  const [paymentReminders, setPaymentReminders] = useState(true);

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 56, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between mb-7">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
            <Ionicons name="arrow-back" size={22} color="#9CA3AF" />
            <Text className="text-gray-950 dark:text-white text-lg font-bold ml-3">Notifications</Text>
          </TouchableOpacity>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllRead}>
              <Text className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold">Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text className="text-gray-400 text-xs font-semibold uppercase mb-2 ml-1">Recent activity</Text>
        <View className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              onPress={() =>
                setNotifications((current) =>
                  current.map((item) => (item.id === notification.id ? { ...item, unread: false } : item))
                )
              }
              activeOpacity={0.75}
              className="flex-row items-start px-4 py-4 border-b border-gray-100 dark:border-gray-800"
            >
              <View className={`w-10 h-10 rounded-full items-center justify-center ${notification.iconBackground}`}>
                <Ionicons name={notification.icon} size={20} color={notification.unread ? "#4F46E5" : "#9CA3AF"} />
              </View>
              <View className="flex-1 ml-3 pr-2">
                <View className="flex-row items-center">
                  <Text className="text-gray-950 dark:text-white text-sm font-semibold flex-1">{notification.title}</Text>
                  {notification.unread && <View className="w-2 h-2 rounded-full bg-indigo-600 ml-2" />}
                </View>
                <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1 leading-5">{notification.message}</Text>
                <Text className="text-gray-400 text-xs mt-2">{notification.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-gray-400 text-xs font-semibold uppercase mt-7 mb-2 ml-1">Preferences</Text>
        <View className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <SettingRow
            label="Game activity"
            description="Get notified when a new game is logged."
            enabled={gameAlerts}
            onToggle={() => setGameAlerts((enabled) => !enabled)}
          />
          <SettingRow
            label="Payment reminders"
            description="Get reminded when player balances are unpaid."
            enabled={paymentReminders}
            onToggle={() => setPaymentReminders((enabled) => !enabled)}
          />
        </View>
      </ScrollView>
    </View>
  );
}
