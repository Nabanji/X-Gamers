import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable, TextInput } from "react-native";
import { Session } from "../types";
import { getSessionTally } from "../utils/sessionBilling";

export function CloseSessionModal({
  visible,
  session,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  session: Session | null;
  onClose: () => void;
  onConfirm: (sessionId: string, hoursPlayed?: number) => void;
}) {
  const [hours, setHours] = useState("");

  if (!session) return null;

  const tally = getSessionTally(session);
  const needsHours = !tally.isPerGame;

  const handleConfirm = () => {
    onConfirm(session.id, needsHours ? parseFloat(hours) || 0 : undefined);
    setHours("");
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 items-center justify-center px-6" onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-900 rounded-2xl p-5 w-full">
          <Text className="text-black dark:text-white text-lg font-bold mb-1">Close Session</Text>
          <Text className="text-gray-400 text-xs mb-4">
            {session.player1} vs {session.player2} • {session.gameName}
          </Text>

          {needsHours ? (
            <View className="mb-4">
              <Text className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Hours played</Text>
              <TextInput
                value={hours}
                onChangeText={setHours}
                keyboardType="numeric"
                placeholder="e.g. 1.5"
                placeholderTextColor="#9CA3AF"
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-black dark:text-white"
              />
            </View>
          ) : (
            <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 mb-4">
              <View className="flex-row items-center justify-between py-1">
                <Text className="text-gray-600 dark:text-gray-300 text-sm">{session.player1}</Text>
                <Text className="text-black dark:text-white text-sm font-semibold">{tally.p1Losses} lost — KES {tally.p1Owes}</Text>
              </View>
              <View className="flex-row items-center justify-between py-1">
                <Text className="text-gray-600 dark:text-gray-300 text-sm">{session.player2}</Text>
                <Text className="text-black dark:text-white text-sm font-semibold">{tally.p2Losses} lost — KES {tally.p2Owes}</Text>
              </View>
            </View>
          )}

          <View className="flex-row" style={{ gap: 10 }}>
            <TouchableOpacity onPress={onClose} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 items-center">
              <Text className="text-gray-600 dark:text-gray-300 font-semibold text-sm">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={needsHours && !hours}
              className={`flex-1 py-3 rounded-xl items-center ${needsHours && !hours ? "bg-gray-200" : "bg-indigo-600"}`}
            >
              <Text className={`font-semibold text-sm ${needsHours && !hours ? "text-gray-400" : "text-white"}`}>
                Confirm & Close
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}