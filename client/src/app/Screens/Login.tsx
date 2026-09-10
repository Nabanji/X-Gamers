import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Login() {
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text className="text-white text-2xl font-bold">
        Login
      </Text>

      <TouchableOpacity onPress={() => router.push("/Screens/Register")}>
        <Text className="text-blue-500 mt-5">
          Don&apos;t have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}