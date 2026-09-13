import { useState } from "react";
import { router } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

function PasswordField({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <View className="mb-5">
      <Text className="text-gray-700 text-sm font-semibold mb-2">{label}</Text>
      <View className="flex-row items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4">
        <Ionicons name="lock-closed-outline" size={19} color="#9CA3AF" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          className="flex-1 py-4 px-3 text-gray-950 dark:text-white"
          placeholder="Enter password"
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity onPress={() => setVisible((isVisible) => !isVisible)}>
          <Ionicons name={visible ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50 dark:bg-gray-950"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center mb-7">
          <Ionicons name="arrow-back" size={22} color="#111827" />
          <Text className="text-gray-950 dark:text-white text-lg font-bold ml-3">Change Password</Text>
        </TouchableOpacity>

        <Text className="text-gray-500 text-base leading-6 mb-7">
          Keep your account secure with a strong password you do not use elsewhere.
        </Text>
        <View className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <PasswordField label="Current password" value={currentPassword} onChangeText={setCurrentPassword} />
          <PasswordField label="New password" value={newPassword} onChangeText={setNewPassword} />
          <PasswordField label="Confirm new password" value={confirmation} onChangeText={setConfirmation} />
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            className="bg-indigo-600 rounded-2xl py-4 items-center mt-1"
          >
            <Text className="text-white text-base font-bold">Update password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}