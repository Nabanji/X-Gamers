import { useMemo, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { GameListItem } from "./Home/components/GameListItem";
import { GameBillModal } from "./Home/components/GameBillModal";
import { useGames } from "./Home/GameContext";
import { GameSession } from "./Home/types";

export default function GamesScreen() {
  const { games, setGames } = useGames();
  const [selectedGame, setSelectedGame] = useState<GameSession | null>(null);
  const sortedGames = useMemo(() => [...games].sort((a, b) => b.createdAt - a.createdAt), [games]);

  const togglePlayerPayment = (player: "player1" | "player2") => {
    if (!selectedGame) return;
    setGames((previousGames) =>
      previousGames.map((game) =>
        game.id === selectedGame.id
          ? { ...game, [`${player}Paid`]: !game[`${player}Paid`] }
          : game
      )
    );
    setSelectedGame((game) => (game ? { ...game, [`${player}Paid`]: !game[`${player}Paid`] } : game));
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 60, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-black text-2xl font-bold">All Games</Text>
        </View>

        {sortedGames.map((game) => (
          <GameListItem key={game.id} item={game} onPress={setSelectedGame} />
        ))}
      </ScrollView>

      <GameBillModal
        visible={selectedGame !== null}
        session={selectedGame}
        onClose={() => setSelectedGame(null)}
        onTogglePayment={togglePlayerPayment}
      />
    </View>
  );
}