import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const user = {
  name: "James Mwangi",
  email: "james.mwangi@example.com",
  role: "Hub Owner",
  joined: "Jan 2025",
};

const stats = {
  totalGames: 248,
  totalRevenue: 74200,
  unpaidTotal: 1800,
};

function StatBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <View className="flex-1 items-center">
      <Text className="text-black text-lg font-bold">{value}</Text>
      <Text className="text-gray-400 text-xs mt-0.5">{label}</Text>
    </View>
  );
}

function MenuRow({
  icon,
  label,
  color = "#111827",
  showChevron = true,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color?: string;
  showChevron?: boolean;
}) {
  return (
    <TouchableOpacity activeOpacity={0.7} className="flex-row items-center justify-between py-3.5 px-4">
      <View className="flex-row items-center flex-1">
        <View
          className="w-9 h-9 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: `${color}15` }}
        >
          <Ionicons name={icon} size={18} color={color} />
        </View>
        <Text className="text-black text-base" style={{ color }}>
          {label}
        </Text>
      </View>
      {showChevron && <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />}
    </TouchableOpacity>
  );
}

function MenuGroup({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-white rounded-2xl border border-gray-100 mb-6 divide-y divide-gray-100">
      {children}
    </View>
  );
}

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 60, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-black text-2xl font-bold mb-6">Profile</Text>

        {/* User card */}
        <View className="bg-white rounded-2xl p-5 items-center border border-gray-100 mb-6">
          <View className="w-20 h-20 rounded-full bg-indigo-50 items-center justify-center">
            <Ionicons name="person" size={36} color="#4F46E5" />
          </View>

          <Text className="text-black text-lg font-bold mt-3">{user.name}</Text>
          <Text className="text-gray-400 text-sm mt-0.5">{user.email}</Text>

          <View className="bg-indigo-50 px-3 py-1 rounded-full mt-2">
            <Text className="text-indigo-600 text-xs font-medium">{user.role}</Text>
          </View>

          <View className="flex-row w-full mt-5 pt-4 border-t border-gray-100">
            <StatBlock label="Games Logged" value={stats.totalGames} />
            <View className="w-px bg-gray-100" />
            <StatBlock label="Revenue" value={`KES ${stats.totalRevenue}`} />
            <View className="w-px bg-gray-100" />
            <StatBlock label="Unpaid" value={`KES ${stats.unpaidTotal}`} />
          </View>
        </View>

        {/* Account */}
        <Text className="text-gray-400 text-xs font-semibold uppercase mb-2 ml-1">Account</Text>
        <MenuGroup>
          <MenuRow icon="person-outline" label="Edit Profile" />
          <MenuRow icon="lock-closed-outline" label="Change Password" />
          <MenuRow icon="card-outline" label="Payment Methods" />
        </MenuGroup>

        {/* App */}
        <Text className="text-gray-400 text-xs font-semibold uppercase mb-2 ml-1">App</Text>
        <MenuGroup>
          <MenuRow icon="notifications-outline" label="Notifications" />
          <MenuRow icon="game-controller-outline" label="Manage Games" />
          <MenuRow icon="moon-outline" label="Appearance" />
        </MenuGroup>

        {/* Support */}
        <Text className="text-gray-400 text-xs font-semibold uppercase mb-2 ml-1">Support</Text>
        <MenuGroup>
          <MenuRow icon="help-circle-outline" label="Help Center" />
          <MenuRow icon="document-text-outline" label="Terms & Privacy" />
          <MenuRow icon="information-circle-outline" label="About" showChevron={false} />
        </MenuGroup>

        {/* Logout */}
        <MenuGroup>
          <MenuRow icon="log-out-outline" label="Log Out" color="#DC2626" showChevron={false} />
        </MenuGroup>

        <Text className="text-gray-300 text-xs text-center mt-2">Member since {user.joined}</Text>
      </ScrollView>
    </View>
  );
}