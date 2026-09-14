import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

function PolicySection({ title, children }: { title: string; children: string }) {
  return (
    <View className="mb-6">
      <Text className="text-gray-950 dark:text-white text-base font-bold mb-2">{title}</Text>
      <Text className="text-gray-500 dark:text-gray-400 text-sm leading-6">{children}</Text>
    </View>
  );
}

export default function TermsPrivacy() {
  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center mb-7">
          <Ionicons name="arrow-back" size={22} color="#9CA3AF" />
          <Text className="text-gray-950 dark:text-white text-lg font-bold ml-3">Terms & Privacy</Text>
        </TouchableOpacity>

        <View className="bg-indigo-600 rounded-2xl p-5 mb-7">
          <View className="w-11 h-11 rounded-full bg-white/15 items-center justify-center mb-4">
            <Ionicons name="shield-checkmark-outline" size={24} color="#fff" />
          </View>
          <Text className="text-white text-xl font-bold">Your data, your hub</Text>
          <Text className="text-indigo-100 text-sm leading-5 mt-2">
            These terms explain how X-Gaming helps you manage your game hub and how your information is handled.
          </Text>
          <Text className="text-indigo-200 text-xs mt-4">Last updated September 14, 2026</Text>
        </View>

        <View className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <PolicySection title="Using X-Gaming">
            X-Gaming is a management tool for recording game sessions, tracking player payments, and reviewing hub activity. You are responsible for keeping your account details accurate and for the records you create.
          </PolicySection>
          <PolicySection title="Your information">
            We use the information you provide to operate your hub, display your profile, and organize game and payment records. Do not store sensitive financial credentials or passwords in game notes.
          </PolicySection>
          <PolicySection title="Game and payment records">
            Records belong to your hub and should be reviewed for accuracy. X-Gaming does not independently verify player names, match results, or payment status entered by a hub owner.
          </PolicySection>
          <PolicySection title="Account security">
            Keep your password private and contact support if you suspect unauthorized access. You are responsible for activity performed through your account.
          </PolicySection>
          <PolicySection title="Changes to these terms">
            We may update these terms as the product changes. The latest version will always be available from this screen, with the revision date shown above.
          </PolicySection>
        </View>

        <View className="items-center mt-7">
          <Text className="text-gray-400 text-sm text-center">Questions about your account or data?</Text>
          <TouchableOpacity onPress={() => Linking.openURL("mailto:support@x-gaming.example")} className="mt-2">
            <Text className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold">Contact support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
