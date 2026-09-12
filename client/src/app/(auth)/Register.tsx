import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Register() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      
      <Text className="text-black text-2xl font-bold">
        Create Account
      </Text>

      {/* Register form goes here */}


      <TouchableOpacity
        onPress={() => router.push("/Screens/Login")}
      >
        <Text className="text-blue-500 mt-5">
          Already have an account? Login
        </Text>
      </TouchableOpacity>

    </View>
  );
}