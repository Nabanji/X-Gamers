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
import { useSignUp } from "@clerk/expo/legacy";

export default function Register() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const finishSignIn = async (sessionId: string | null) => {
    if (!sessionId || !setActive) return;
    await setActive({ session: sessionId });
    router.replace("/(tabs)/home");
  };

  const handleRegister = async () => {
    if (!isLoaded || !signUp || !setActive || isRegistering || !acceptedTerms) return;

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage("");
    setIsRegistering(true);

    try {
      const nameParts = name.trim().split(/\s+/);
      const result = await signUp.create({
        emailAddress: email.trim(),
        password,
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(" ") || undefined,
        legalAccepted: true,
      });

      if (result.status === "complete") {
        await finishSignIn(result.createdSessionId);
      } else if (result.unverifiedFields.includes("email_address")) {
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setVerificationPending(true);
      } else {
        setErrorMessage("Additional verification is required to finish creating your account.");
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to create your account.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleVerify = async () => {
    if (!signUp || !setActive || !verificationCode.trim() || isVerifying) return;

    setErrorMessage("");
    setIsVerifying(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code: verificationCode.trim() });
      if (result.status === "complete") {
        await finishSignIn(result.createdSessionId);
      } else {
        setErrorMessage("The verification code is not complete yet.");
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Invalid verification code.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50 dark:bg-gray-950"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1">
          <View className="w-14 h-14 rounded-2xl bg-indigo-600 items-center justify-center mb-7">
            <Ionicons name="game-controller" size={28} color="#fff" />
          </View>

          <Text className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold uppercase tracking-widest">X-Gaming Hub</Text>
          <Text className="text-gray-950 dark:text-white text-3xl font-bold mt-2">Create your account</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-base mt-2 leading-6">
            Set up your hub and start keeping every game organized.
          </Text>

          <View className="mt-8">
            <Text className="text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Full name</Text>
            <View className="flex-row items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4">
              <Ionicons name="person-outline" size={19} color="#9CA3AF" />
              <TextInput value={name} onChangeText={setName} placeholder="James Mwangi" placeholderTextColor="#9CA3AF" autoCapitalize="words" className="flex-1 py-4 px-3 text-gray-950 dark:text-white" />
            </View>
          </View>

          <View className="mt-5">
            <Text className="text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Email address</Text>
            <View className="flex-row items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4">
              <Ionicons name="mail-outline" size={19} color="#9CA3AF" />
              <TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor="#9CA3AF" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} className="flex-1 py-4 px-3 text-gray-950 dark:text-white" />
            </View>
          </View>

          <View className="mt-5">
            <Text className="text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Password</Text>
            <View className="flex-row items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4">
              <Ionicons name="lock-closed-outline" size={19} color="#9CA3AF" />
              <TextInput value={password} onChangeText={setPassword} placeholder="Create a password" placeholderTextColor="#9CA3AF" secureTextEntry={!showPassword} className="flex-1 py-4 px-3 text-gray-950 dark:text-white" />
              <TouchableOpacity activeOpacity={0.7} onPress={() => setShowPassword((visible) => !visible)} accessibilityLabel={showPassword ? "Hide password" : "Show password"}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-5">
            <Text className="text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Confirm password</Text>
            <View className="flex-row items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4">
              <Ionicons name="shield-checkmark-outline" size={19} color="#9CA3AF" />
              <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Repeat your password" placeholderTextColor="#9CA3AF" secureTextEntry={!showConfirmPassword} className="flex-1 py-4 px-3 text-gray-950 dark:text-white" />
              <TouchableOpacity activeOpacity={0.7} onPress={() => setShowConfirmPassword((visible) => !visible)} accessibilityLabel={showConfirmPassword ? "Hide confirmed password" : "Show confirmed password"}>
                <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.8} onPress={() => setAcceptedTerms((accepted) => !accepted)} className="flex-row items-center mt-5">
            <View className={`w-5 h-5 rounded-md border items-center justify-center mr-2 ${acceptedTerms ? "bg-indigo-600 border-indigo-600" : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"}`}>
              {acceptedTerms && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text className="text-gray-500 dark:text-gray-400 text-sm flex-1">
              I agree to the <Text className="text-indigo-600 dark:text-indigo-400 font-semibold">Terms & Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          {verificationPending && (
            <View className="bg-indigo-50 dark:bg-indigo-950 rounded-2xl p-4 mt-5">
              <Text className="text-indigo-900 dark:text-indigo-100 text-sm font-semibold">Check your email</Text>
              <Text className="text-indigo-700 dark:text-indigo-200 text-sm mt-1 leading-5">
                Enter the verification code sent to your email address.
              </Text>
              <TextInput
                value={verificationCode}
                onChangeText={setVerificationCode}
                placeholder="Verification code"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                className="bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-800 rounded-xl px-4 py-3 mt-3 text-gray-950 dark:text-white"
              />
              <TouchableOpacity onPress={handleVerify} disabled={isVerifying} className="bg-indigo-600 rounded-xl py-3 items-center mt-3 disabled:opacity-60">
                <Text className="text-white font-semibold">{isVerifying ? "Verifying..." : "Verify email"}</Text>
              </TouchableOpacity>
            </View>
          )}

          {!!errorMessage && <Text className="text-red-600 text-sm text-center mt-3">{errorMessage}</Text>}

          <Pressable
            onPress={handleRegister}
            disabled={isRegistering || verificationPending || !acceptedTerms}
            className="bg-indigo-600 rounded-2xl py-4 items-center mt-7 active:opacity-80 disabled:opacity-60"
          >
            <Text className="text-white text-base font-bold">{isRegistering ? "Creating account..." : "Create account"}</Text>
          </Pressable>

          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            <Text className="text-gray-400 dark:text-gray-500 text-xs font-medium mx-4">OR</Text>
            <View className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
          </View>

          <View className="flex-row justify-center items-center">
            <Text className="text-gray-500 dark:text-gray-400 text-sm">Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/Login")} activeOpacity={0.7}>
              <Text className="text-indigo-600 dark:text-indigo-400 text-sm font-bold ml-1">Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-gray-400 dark:text-gray-500 text-xs text-center mt-10">Your gaming hub, organized.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}