import { useState } from "react";
import { router } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 72, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1">
          <View className="w-14 h-14 rounded-2xl bg-indigo-600 items-center justify-center mb-7">
            <Ionicons name="game-controller" size={28} color="#fff" />
          </View>

          <Text className="text-indigo-600 text-sm font-semibold uppercase tracking-widest">
            X-Gaming Hub
          </Text>
          <Text className="text-gray-950 text-3xl font-bold mt-2">Welcome back</Text>
          <Text className="text-gray-500 text-base mt-2 leading-6">
            Sign in to manage your games, players, and daily revenue.
          </Text>

          <View className="mt-9">
            <Text className="text-gray-700 text-sm font-semibold mb-2">Email address</Text>
            <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4">
              <Ionicons name="mail-outline" size={19} color="#9CA3AF" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="flex-1 py-4 px-3 text-gray-950"
              />
            </View>
          </View>

          <View className="mt-5">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-700 text-sm font-semibold">Password</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="text-indigo-600 text-sm font-semibold">Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4">
              <Ionicons name="lock-closed-outline" size={19} color="#9CA3AF" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                className="flex-1 py-4 px-3 text-gray-950"
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowPassword((visible) => !visible)}
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          </View>

          <Pressable
            onPress={() => router.replace("/(tabs)/home")}
            className="bg-indigo-600 rounded-2xl py-4 items-center mt-7 active:opacity-80"
          >
            <Text className="text-white text-base font-bold">Sign in</Text>
          </Pressable>

          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="text-gray-400 text-xs font-medium mx-4">OR</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          <View className="flex-row justify-center items-center">
            <Text className="text-gray-500 text-sm">Don&apos;t have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/Register")} activeOpacity={0.7}>
              <Text className="text-indigo-600 text-sm font-bold ml-1">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-gray-400 text-xs text-center mt-10">
          Your gaming hub, organized.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}