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

function Field({
  icon,
  label,
  value,
  onChangeText,
  keyboardType,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: "default" | "email-address";
}) {
  return (
    <View className="mb-5">
      <Text className="text-gray-700 text-sm font-semibold mb-2">{label}</Text>
      <View className="flex-row items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4">
        <Ionicons name={icon} size={19} color="#9CA3AF" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={keyboardType === "email-address" ? "none" : "words"}
          className="flex-1 py-4 px-3 text-gray-950 dark:text-white"
        />
      </View>
    </View>
  );
}

export default function EditProfile() {
  const [name, setName] = useState("James Mwangi");
  const [email, setEmail] = useState("james.mwangi@example.com");

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
          <Text className="text-gray-950 dark:text-white text-lg font-bold ml-3">Edit Profile</Text>
        </TouchableOpacity>

        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-indigo-50 items-center justify-center">
            <Ionicons name="person" size={42} color="#4F46E5" />
          </View>
          <TouchableOpacity activeOpacity={0.7} className="mt-3">
            <Text className="text-indigo-600 text-sm font-semibold">Change photo</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <Field icon="person-outline" label="Full name" value={name} onChangeText={setName} />
          <Field
            icon="mail-outline"
            label="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            className="bg-indigo-600 rounded-2xl py-4 items-center mt-1"
          >
            <Text className="text-white text-base font-bold">Save changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}