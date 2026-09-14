import { useState } from "react";
import { Alert, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useGames, type GameOption } from "./Home/GameContext";

const iconColor = "#9CA3AF";

export default function ManageGamesScreen() {
  const router = useRouter();
  const { games, gameOptions, setGameOptions } = useGames();
  const [editingGame, setEditingGame] = useState<GameOption | null>(null);
  const [draftName, setDraftName] = useState("");

  const openEditor = (game?: GameOption) => {
    setEditingGame(game ?? { id: "", name: "", active: true });
    setDraftName(game?.name ?? "");
  };

  const saveGame = () => {
    const name = draftName.trim();
    if (!name) return;

    const duplicate = gameOptions.some(
      (game) => game.id !== editingGame?.id && game.name.toLowerCase() === name.toLowerCase()
    );
    if (duplicate) {
      Alert.alert("Game already exists", "Choose a different game name.");
      return;
    }

    setGameOptions((previous) =>
      editingGame?.id
        ? previous.map((game) => (game.id === editingGame.id ? { ...game, name } : game))
        : [...previous, { id: Date.now().toString(), name, active: true }]
    );
    setEditingGame(null);
    setDraftName("");
  };

  const removeGame = (game: GameOption) => {
    const isUsed = games.some((session) => session.gameName === game.name);
    if (isUsed) {
      Alert.alert(
        "Game is in use",
        "This game has logged sessions, so it cannot be deleted. Archive it to hide it from new game entries?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Archive",
            onPress: () =>
              setGameOptions((previous) =>
                previous.map((option) => (option.id === game.id ? { ...option, active: false } : option))
              ),
          },
        ]
      );
      return;
    }

    Alert.alert("Delete game?", `Remove ${game.name} from the game catalog?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setGameOptions((previous) => previous.filter((option) => option.id !== game.id)),
      },
    ]);
  };

  const toggleArchived = (game: GameOption) => {
    setGameOptions((previous) =>
      previous.map((option) => (option.id === game.id ? { ...option, active: !option.active } : option))
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 56, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between mb-7">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
            <Ionicons name="arrow-back" size={22} color={iconColor} />
            <Text className="text-gray-950 dark:text-white text-lg font-bold ml-3">Manage Games</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openEditor()}
            className="w-10 h-10 rounded-full bg-indigo-600 items-center justify-center"
            accessibilityLabel="Add game"
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text className="text-gray-400 text-xs font-semibold uppercase mb-2 ml-1">Game catalog</Text>
        <View className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          {gameOptions.map((game) => {
            const isUsed = games.some((session) => session.gameName === game.name);
            return (
              <View key={game.id} className="flex-row items-center px-4 py-4 border-b border-gray-100 dark:border-gray-800">
                <View className={`w-10 h-10 rounded-full items-center justify-center ${game.active ? "bg-indigo-50 dark:bg-indigo-950" : "bg-gray-100 dark:bg-gray-800"}`}>
                  <Ionicons name="game-controller-outline" size={20} color={game.active ? "#4F46E5" : iconColor} />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-gray-950 dark:text-white text-base font-semibold">{game.name}</Text>
                  <Text className="text-gray-400 text-xs mt-0.5">
                    {game.active ? (isUsed ? "In use" : "Available") : "Archived"}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => openEditor(game)} className="p-2" accessibilityLabel={`Edit ${game.name}`}>
                  <Ionicons name="pencil-outline" size={19} color={iconColor} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => (game.active ? removeGame(game) : toggleArchived(game))} className="p-2" accessibilityLabel={game.active ? `Archive or delete ${game.name}` : `Restore ${game.name}`}>
                  <Ionicons name={game.active ? "archive-outline" : "refresh-outline"} size={20} color={game.active ? "#DC2626" : "#16A34A"} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <Modal visible={editingGame !== null} transparent animationType="fade" onRequestClose={() => setEditingGame(null)}>
        <Pressable className="flex-1 bg-black/40 justify-center px-5" onPress={() => setEditingGame(null)}>
          <Pressable className="bg-white dark:bg-gray-900 rounded-2xl p-5" onPress={(event) => event.stopPropagation()}>
            <Text className="text-gray-950 dark:text-white text-xl font-bold">
              {editingGame?.id ? "Rename game" : "Add game"}
            </Text>
            <TextInput
              value={draftName}
              onChangeText={setDraftName}
              placeholder="Game name"
              placeholderTextColor="#9CA3AF"
              autoFocus
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 mt-4 text-gray-950 dark:text-white"
            />
            <View className="flex-row justify-end mt-5">
              <TouchableOpacity onPress={() => setEditingGame(null)} className="px-4 py-3 mr-2">
                <Text className="text-gray-500 dark:text-gray-400 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveGame} className="bg-indigo-600 rounded-xl px-5 py-3">
                <Text className="text-white font-semibold">Save</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
