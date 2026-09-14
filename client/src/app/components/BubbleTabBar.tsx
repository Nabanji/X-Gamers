import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";

// Derive the exact prop type expo-router's <Tabs tabBar={...}> expects,
// instead of importing (a slightly different) BottomTabBarProps directly.
type TabBarProps = NonNullable<ComponentProps<typeof Tabs>["tabBar"]> extends (
  props: infer P
) => any
  ? P
  : never;

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  home: "home",
  games: "game-controller",
  history: "time",
  profile: "person",
};

export function BubbleTabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.bubble}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = (options.title as string) ?? route.name;
          const isFocused = state.index === index;
          const iconName = ICONS[route.name] ?? "ellipse";

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.8}
              style={[styles.tabItem, isFocused && styles.tabItemActive]}
            >
              <Ionicons
                name={isFocused ? iconName : (`${iconName}-outline` as keyof typeof Ionicons.glyphMap)}
                size={22}
                color={isFocused ? "#fff" : "#6B7280"}
              />
              {isFocused && <Text style={styles.label}>{label}</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  bubble: {
    flexDirection: "row",
    backgroundColor: "#111827",
    borderRadius: 32,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 24,
    minWidth: 48,
  },
  tabItemActive: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 18,
  },
  label: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
});