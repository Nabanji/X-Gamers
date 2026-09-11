import { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GAMES = [
  "FC26",
  "Call of Duty",
  "Mortal Kombat",
  "NBA 2K25",
  "Tekken 8",
];

const STATIONS = [
  "Station 1",
  "Station 2",
  "Station 3",
  "Station 4",
  "Station 5",
  "Station 6",
];

type PaymentType = "per-game" | "per-hour";
type Winner = "player1" | "player2" | "draw" | null;

type GameSession = {
  id: string;
  gameName: string;
  station: string;
  team1: string;
  player1: string;
  team2: string;
  player2: string;
  amount: number;

  // Individual payment status
  player1Paid: boolean;
  player2Paid: boolean;

  time: string;
  detail: string;
  winner?: Winner;
  player1Wins?: number;
  player2Wins?: number;
  pricePerGame?: number;
};

// --------------------------------------------------
// INITIAL GAMES
// --------------------------------------------------

const initialGames: GameSession[] = [
  {
    id: "1",
    gameName: "FC26",
    station: "Station 1",
    team1: "Manchester United",
    player1: "Prince",
    team2: "Real Madrid",
    player2: "Brian",
    amount: 450,

    // Both players have paid
    player1Paid: true,
    player2Paid: true,

    time: "10:45 AM",
    detail: "3 games",
    player1Wins: 2,
    player2Wins: 1,
    winner: "player1",
    pricePerGame: 150,
  },
  {
    id: "2",
    gameName: "Call of Duty",
    station: "Station 3",
    team1: "Team Alpha",
    player1: "Kevin",
    team2: "Team Bravo",
    player2: "Mike",
    amount: 600,

    // Neither player has paid
    player1Paid: false,
    player2Paid: false,

    time: "10:10 AM",
    detail: "2 hrs",
    winner: "player2",
  },
];

// --------------------------------------------------
// STAT CARD
// --------------------------------------------------

function StatCard({
  label,
  value,
  icon,
  color,
  onPress,
}: {
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="flex-1 bg-white rounded-2xl p-4 mx-1 shadow-sm border border-gray-100"
    >
      <View
        className="w-9 h-9 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: `${color}20` }}
      >
        <Ionicons name={icon} size={18} color={color} />
      </View>

      <Text className="text-xl font-bold text-black">{value}</Text>

      <Text className="text-xs text-gray-500 mt-0.5">{label}</Text>
    </TouchableOpacity>
  );
}

// --------------------------------------------------
// BILL CALCULATOR
// --------------------------------------------------

function getBill(item: GameSession) {
  const isPerGame = item.player1Wins !== undefined;

  const gamesMatch = item.detail?.match(/(\d+)\s*games?/i);

  const totalGames = gamesMatch
    ? parseInt(gamesMatch[1], 10)
    : 0;

  const p1Wins = item.player1Wins ?? 0;
  const p2Wins = item.player2Wins ?? 0;

  const pricePerGame =
    item.pricePerGame ??
    (totalGames > 0
      ? Math.round(item.amount / totalGames)
      : 0);

  /*
   * The number of games Player 1 lost is equal to
   * Player 2's wins.
   */
  const p1Losses = p2Wins;

  /*
   * The number of games Player 2 lost is equal to
   * Player 1's wins.
   */
  const p2Losses = p1Wins;

  const p1Owes = isPerGame
    ? p1Losses * pricePerGame
    : 0;

  const p2Owes = isPerGame
    ? p2Losses * pricePerGame
    : 0;

  return {
    isPerGame,
    totalGames,
    pricePerGame,

    p1Wins,
    p2Wins,

    p1Losses,
    p2Losses,

    p1Owes,
    p2Owes,

    totalOwed: p1Owes + p2Owes,
  };
}

// --------------------------------------------------
// STAT DETAIL MODAL
// --------------------------------------------------

type StatFilter = "all" | "paid" | "unpaid" | null;

function StatDetailModal({
  visible,
  filter,
  games,
  onClose,
}: {
  visible: boolean;
  filter: StatFilter;
  games: GameSession[];
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      if (filter === "paid") {
        return game.player1Paid && game.player2Paid;
      }

      if (filter === "unpaid") {
        return !game.player1Paid || !game.player2Paid;
      }

      return true;
    });
  }, [filter, games]);

  const title =
    filter === "paid"
      ? "Paid Games"
      : filter === "unpaid"
      ? "Unpaid Games"
      : "All Games Today";

  const headerColor =
    filter === "paid"
      ? "#16A34A"
      : filter === "unpaid"
      ? "#DC2626"
      : "#4F46E5";

  /*
   * Calculate individual player debts.
   */
  const totalOwedOverall = filteredGames.reduce(
    (sum, game) => {
      const bill = getBill(game);

      let owed = 0;

      if (!game.player1Paid) {
        owed += bill.p1Owes;
      }

      if (!game.player2Paid) {
        owed += bill.p2Owes;
      }

      /*
       * Hourly sessions are not split between players.
       * We therefore don't include them in individual debt.
       */
      return sum + owed;
    },
    0
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/40 justify-end"
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{ maxHeight: "90%" }}
        >
          <View
            className="bg-white rounded-t-3xl px-5 pt-5"
            style={{
              maxHeight: "100%",
              paddingBottom: Math.max(insets.bottom, 16) + 8,
            }}
          >
            <View className="w-10 h-1.5 bg-gray-200 rounded-full self-center mb-4" />

            <View className="flex-row items-center justify-between mb-5">
              <View>
                <Text className="text-black text-xl font-bold">
                  {title}
                </Text>

                <Text className="text-gray-400 text-xs mt-0.5">
                  {filteredGames.length} session
                  {filteredGames.length === 1 ? "" : "s"}
                </Text>
              </View>

              <TouchableOpacity
                onPress={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
              >
                <Ionicons
                  name="close"
                  size={18}
                  color="#374151"
                />
              </TouchableOpacity>
            </View>

            {filter === "unpaid" && (
              <View
                className="rounded-2xl p-4 mb-4 flex-row items-center justify-between"
                style={{
                  backgroundColor: `${headerColor}15`,
                }}
              >
                <Text
                  className="text-sm font-medium"
                  style={{ color: headerColor }}
                >
                  Total unpaid
                </Text>

                <Text
                  className="text-lg font-bold"
                  style={{ color: headerColor }}
                >
                  KES {totalOwedOverall}
                </Text>
              </View>
            )}

            <ScrollView
              showsVerticalScrollIndicator={false}
            >
              {filteredGames.length === 0 ? (
                <View className="items-center justify-center py-16">
                  <Ionicons
                    name="file-tray-outline"
                    size={40}
                    color="#D1D5DB"
                  />

                  <Text className="text-gray-400 mt-3">
                    No games in this category
                  </Text>
                </View>
              ) : (
                filteredGames.map((item) => {
                  const bill = getBill(item);

                  return (
                    <View
                      key={item.id}
                      className="bg-gray-50 rounded-2xl p-4 mb-3 border border-gray-100"
                    >
                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center">
                          <View className="w-9 h-9 rounded-full bg-indigo-50 items-center justify-center mr-3">
                            <Ionicons
                              name="game-controller"
                              size={16}
                              color="#4F46E5"
                            />
                          </View>

                          <View>
                            <Text className="text-black font-semibold text-sm">
                              {item.gameName}
                            </Text>

                            <Text className="text-gray-400 text-xs">
                              {item.station} • {item.time}
                            </Text>
                          </View>
                        </View>

                        <View
                          className={`px-2 py-0.5 rounded-full ${
                            item.player1Paid &&
                            item.player2Paid
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          <Text
                            className={`text-xs font-medium ${
                              item.player1Paid &&
                              item.player2Paid
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                          >
                            {item.player1Paid &&
                            item.player2Paid
                              ? "Paid"
                              : "Unpaid"}
                          </Text>
                        </View>
                      </View>

                      {bill.isPerGame ? (
                        <View className="bg-white rounded-xl p-3 mt-2 border border-gray-100">
                          {/* PLAYER 1 */}
                          <View className="flex-row items-center justify-between py-2">
                            <View className="flex-1">
                              <Text className="text-gray-700 text-xs font-medium">
                                {item.player1}
                              </Text>

                              <Text className="text-gray-400 text-[11px]">
                                {bill.p1Losses} lost × KES{" "}
                                {bill.pricePerGame}
                              </Text>
                            </View>

                            <View className="items-end">
                              <Text className="text-black text-xs font-semibold">
                                KES {bill.p1Owes}
                              </Text>

                              <Text
                                className={`text-[10px] font-semibold mt-0.5 ${
                                  item.player1Paid
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {item.player1Paid
                                  ? "Paid"
                                  : "Unpaid"}
                              </Text>
                            </View>
                          </View>

                          {/* PLAYER 2 */}
                          <View className="flex-row items-center justify-between py-2">
                            <View className="flex-1">
                              <Text className="text-gray-700 text-xs font-medium">
                                {item.player2}
                              </Text>

                              <Text className="text-gray-400 text-[11px]">
                                {bill.p2Losses} lost × KES{" "}
                                {bill.pricePerGame}
                              </Text>
                            </View>

                            <View className="items-end">
                              <Text className="text-black text-xs font-semibold">
                                KES {bill.p2Owes}
                              </Text>

                              <Text
                                className={`text-[10px] font-semibold mt-0.5 ${
                                  item.player2Paid
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {item.player2Paid
                                  ? "Paid"
                                  : "Unpaid"}
                              </Text>
                            </View>
                          </View>

                          <View className="mt-1 pt-2 border-t border-gray-100 flex-row items-center justify-between">
                            <Text className="text-black text-xs font-bold">
                              Total
                            </Text>

                            <Text className="text-black text-sm font-bold">
                              KES {bill.totalOwed}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <View className="bg-white rounded-xl p-3 mt-2 border border-gray-100">
                          <View className="flex-row items-center justify-between">
                            <Text className="text-gray-600 text-xs">
                              {item.detail}
                            </Text>

                            <Text className="text-black text-sm font-bold">
                              KES {item.amount}
                            </Text>
                          </View>

                          <Text className="text-gray-400 text-[11px] mt-2">
                            Hourly session
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })
              )}
            </ScrollView>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// --------------------------------------------------
// GAME BILL MODAL
// --------------------------------------------------

function GameBillModal({
  visible,
  session,
  onClose,
  onTogglePayment,
}: {
  visible: boolean;
  session: GameSession | null;
  onClose: () => void;

  // This lets HomeScreen update individual payments
  onTogglePayment: (
    player: "player1" | "player2"
  ) => void;
}) {
  const insets = useSafeAreaInsets();

  if (!session) return null;

  const bill = getBill(session);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/40 justify-end"
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{ maxHeight: "90%" }}
        >
          <View
            className="bg-white rounded-t-3xl px-5 pt-5"
            style={{
              maxHeight: "100%",
              paddingBottom: Math.max(insets.bottom, 16) + 8,
            }}
          >
            <View className="w-10 h-1.5 bg-gray-200 rounded-full self-center mb-4" />

            {/* HEADER */}
            <View className="flex-row items-center justify-between mb-5">
              <View>
                <Text className="text-black text-xl font-bold">
                  Bill
                </Text>

                <Text className="text-gray-400 text-xs mt-0.5">
                  {session.gameName} • {session.station} •{" "}
                  {session.time}
                </Text>
              </View>

              <TouchableOpacity
                onPress={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
              >
                <Ionicons
                  name="close"
                  size={18}
                  color="#374151"
                />
              </TouchableOpacity>
            </View>

            {/* OVERALL STATUS */}
            <View
              className={`px-3 py-1.5 rounded-full self-start mb-4 ${
                session.player1Paid &&
                session.player2Paid
                  ? "bg-green-50"
                  : "bg-red-50"
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  session.player1Paid &&
                  session.player2Paid
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {session.player1Paid &&
                session.player2Paid
                  ? "Fully Paid"
                  : "Payment Pending"}
              </Text>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
            >
              {bill.isPerGame ? (
                <>
                  {/* SERIES INFORMATION */}
                  <View className="bg-gray-50 rounded-2xl p-4 mb-3">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-gray-500 text-xs">
                        Series
                      </Text>

                      <Text className="text-black text-sm font-semibold">
                        {session.player1} {bill.p1Wins} —{" "}
                        {bill.p2Wins} {session.player2}
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between">
                      <Text className="text-gray-500 text-xs">
                        Price per game
                      </Text>

                      <Text className="text-black text-sm font-semibold">
                        KES {bill.pricePerGame}
                      </Text>
                    </View>
                  </View>

                  {/* ================================
                      PLAYER 1
                  ================================= */}
                  <View className="bg-white border border-gray-100 rounded-2xl p-4 mb-3">
                    <View className="flex-row items-center mb-3">
                      <View className="w-9 h-9 rounded-full bg-indigo-50 items-center justify-center mr-3">
                        <Text className="text-indigo-600 text-sm font-bold">
                          1
                        </Text>
                      </View>

                      <View className="flex-1">
                        <Text className="text-black font-semibold">
                          {session.player1}
                        </Text>

                        <Text className="text-gray-400 text-xs">
                          {session.team1}
                        </Text>
                      </View>

                      {/* Small payment badge */}
                      <View
                        className={`px-2.5 py-1 rounded-full ${
                          session.player1Paid
                            ? "bg-green-50"
                            : "bg-red-50"
                        }`}
                      >
                        <Text
                          className={`text-[10px] font-bold ${
                            session.player1Paid
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {session.player1Paid
                            ? "PAID"
                            : "UNPAID"}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center justify-between py-1">
                      <Text className="text-gray-500 text-xs">
                        Wins / Losses
                      </Text>

                      <Text className="text-black text-sm font-medium">
                        {bill.p1Wins} / {bill.p1Losses}
                      </Text>
                    </View>

                    <View className="mt-2 pt-3 border-t border-gray-100 flex-row items-center justify-between">
                      <Text className="text-black font-semibold">
                        Owes
                      </Text>

                      <Text className="text-black font-bold text-base">
                        KES {bill.p1Owes}
                      </Text>
                    </View>

                    {/* PLAYER 1 PAYMENT BUTTON */}
                    <TouchableOpacity
                      onPress={() =>
                        onTogglePayment("player1")
                      }
                      activeOpacity={0.8}
                      className={`mt-3 rounded-xl p-3 flex-row items-center justify-between ${
                        session.player1Paid
                          ? "bg-green-50"
                          : "bg-red-50"
                      }`}
                    >
                      <View className="flex-row items-center">
                        <Ionicons
                          name={
                            session.player1Paid
                              ? "checkmark-circle"
                              : "ellipse-outline"
                          }
                          size={21}
                          color={
                            session.player1Paid
                              ? "#16A34A"
                              : "#DC2626"
                          }
                        />

                        <Text
                          className={`ml-2 text-sm font-semibold ${
                            session.player1Paid
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {session.player1Paid
                            ? "Payment received"
                            : "Payment unpaid"}
                        </Text>
                      </View>

                      <Text
                        className={`text-xs font-semibold ${
                          session.player1Paid
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {session.player1Paid
                          ? "Undo"
                          : "Mark Paid"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* ================================
                      PLAYER 2
                  ================================= */}
                  <View className="bg-white border border-gray-100 rounded-2xl p-4 mb-3">
                    <View className="flex-row items-center mb-3">
                      <View className="w-9 h-9 rounded-full bg-indigo-50 items-center justify-center mr-3">
                        <Text className="text-indigo-600 text-sm font-bold">
                          2
                        </Text>
                      </View>

                      <View className="flex-1">
                        <Text className="text-black font-semibold">
                          {session.player2}
                        </Text>

                        <Text className="text-gray-400 text-xs">
                          {session.team2}
                        </Text>
                      </View>

                      {/* Small payment badge */}
                      <View
                        className={`px-2.5 py-1 rounded-full ${
                          session.player2Paid
                            ? "bg-green-50"
                            : "bg-red-50"
                        }`}
                      >
                        <Text
                          className={`text-[10px] font-bold ${
                            session.player2Paid
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {session.player2Paid
                            ? "PAID"
                            : "UNPAID"}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center justify-between py-1">
                      <Text className="text-gray-500 text-xs">
                        Wins / Losses
                      </Text>

                      <Text className="text-black text-sm font-medium">
                        {bill.p2Wins} / {bill.p2Losses}
                      </Text>
                    </View>

                    <View className="mt-2 pt-3 border-t border-gray-100 flex-row items-center justify-between">
                      <Text className="text-black font-semibold">
                        Owes
                      </Text>

                      <Text className="text-black font-bold text-base">
                        KES {bill.p2Owes}
                      </Text>
                    </View>

                    {/* PLAYER 2 PAYMENT BUTTON */}
                    <TouchableOpacity
                      onPress={() =>
                        onTogglePayment("player2")
                      }
                      activeOpacity={0.8}
                      className={`mt-3 rounded-xl p-3 flex-row items-center justify-between ${
                        session.player2Paid
                          ? "bg-green-50"
                          : "bg-red-50"
                      }`}
                    >
                      <View className="flex-row items-center">
                        <Ionicons
                          name={
                            session.player2Paid
                              ? "checkmark-circle"
                              : "ellipse-outline"
                          }
                          size={21}
                          color={
                            session.player2Paid
                              ? "#16A34A"
                              : "#DC2626"
                          }
                        />

                        <Text
                          className={`ml-2 text-sm font-semibold ${
                            session.player2Paid
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {session.player2Paid
                            ? "Payment received"
                            : "Payment unpaid"}
                        </Text>
                      </View>

                      <Text
                        className={`text-xs font-semibold ${
                          session.player2Paid
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {session.player2Paid
                          ? "Undo"
                          : "Mark Paid"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* TOTAL */}
                  <View className="bg-black rounded-2xl p-4 flex-row items-center justify-between">
                    <View>
                      <Text className="text-gray-300 text-xs">
                        Total Session
                      </Text>

                      <Text className="text-white text-2xl font-bold mt-1">
                        KES {bill.totalOwed}
                      </Text>
                    </View>

                    <Ionicons
                      name="cash-outline"
                      size={28}
                      color="#4ADE80"
                    />
                  </View>
                </>
              ) : (
                /* HOURLY SESSION */
                <View className="bg-white border border-gray-100 rounded-2xl p-4">
                  <Text className="text-gray-500 text-xs font-medium mb-3">
                    Hourly session
                  </Text>

                  <View className="flex-row items-center justify-between py-1.5">
                    <Text className="text-gray-500 text-xs">
                      Duration
                    </Text>

                    <Text className="text-black text-sm font-medium">
                      {session.detail}
                    </Text>
                  </View>

                  <View className="mt-2 pt-3 border-t border-gray-100 flex-row items-center justify-between">
                    <Text className="text-black font-semibold">
                      Total
                    </Text>

                    <Text className="text-black font-bold text-base">
                      KES {session.amount}
                    </Text>
                  </View>

                  <Text className="text-gray-400 text-xs mt-3">
                    Hourly sessions are charged as one session
                    rather than being split per player.
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// --------------------------------------------------
// CHIP SELECTOR
// --------------------------------------------------

function ChipSelector({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string) => void;
}) {
  return (
    <View className="mb-5">
      <Text className="text-gray-500 text-sm font-medium mb-2">
        {label}
      </Text>

      <View className="flex-row flex-wrap">
        {options.map((option) => {
          const active = selected === option;

          return (
            <TouchableOpacity
              key={option}
              onPress={() => onSelect(option)}
              activeOpacity={0.8}
              className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                active
                  ? "bg-indigo-600"
                  : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  active
                    ? "text-white"
                    : "text-gray-600"
                }`}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// --------------------------------------------------
// NEW GAME MODAL
// --------------------------------------------------

function NewGameModal({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (
    session: Omit<
      GameSession,
      "id" | "time" | "player1Paid" | "player2Paid"
    >
  ) => void;
}) {
  const insets = useSafeAreaInsets();

  const [game, setGame] = useState<string | null>(null);
  const [station, setStation] = useState<string | null>(
    null
  );

  const [team1, setTeam1] = useState("");
  const [player1, setPlayer1] = useState("");

  const [team2, setTeam2] = useState("");
  const [player2, setPlayer2] = useState("");

  const [paymentType, setPaymentType] =
    useState<PaymentType>("per-game");

  const [amountPerGame, setAmountPerGame] = useState("");
  const [numberOfGames, setNumberOfGames] =
    useState("");

  const [hourlyRate, setHourlyRate] = useState("");
  const [numberOfHours, setNumberOfHours] =
    useState("");

  const [player1Wins, setPlayer1Wins] = useState("");
  const [player2Wins, setPlayer2Wins] = useState("");

  const derivedWinner: Winner = useMemo(() => {
    if (paymentType !== "per-game") return null;

    if (
      player1Wins === "" ||
      player2Wins === ""
    ) {
      return null;
    }

    const p1 = parseInt(player1Wins, 10);
    const p2 = parseInt(player2Wins, 10);

    if (p1 > p2) return "player1";
    if (p2 > p1) return "player2";

    return "draw";
  }, [
    paymentType,
    player1Wins,
    player2Wins,
  ]);

  const total = useMemo(() => {
    if (paymentType === "per-game") {
      const rate =
        parseFloat(amountPerGame) || 0;

      const count =
        parseFloat(numberOfGames) || 0;

      return rate * count;
    }

    const rate =
      parseFloat(hourlyRate) || 0;

    const hours =
      parseFloat(numberOfHours) || 0;

    return rate * hours;
  }, [
    paymentType,
    amountPerGame,
    numberOfGames,
    hourlyRate,
    numberOfHours,
  ]);

  const isValid =
    !!game &&
    !!station &&
    !!team1.trim() &&
    !!player1.trim() &&
    !!team2.trim() &&
    !!player2.trim() &&
    (paymentType === "per-game"
      ? !!amountPerGame &&
        !!numberOfGames &&
        derivedWinner !== null
      : !!hourlyRate && !!numberOfHours);

  const resetForm = () => {
    setGame(null);
    setStation(null);

    setTeam1("");
    setPlayer1("");

    setTeam2("");
    setPlayer2("");

    setPaymentType("per-game");

    setAmountPerGame("");
    setNumberOfGames("");

    setHourlyRate("");
    setNumberOfHours("");

    setPlayer1Wins("");
    setPlayer2Wins("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!isValid || !game || !station) return;

    const detail =
      paymentType === "per-game"
        ? `${numberOfGames} games`
        : `${numberOfHours} hrs`;

    const isPerGame =
      paymentType === "per-game";

    onSubmit({
      gameName: game,
      station,

      team1: team1.trim(),
      player1: player1.trim(),

      team2: team2.trim(),
      player2: player2.trim(),

      amount: total,

      detail,

      winner: isPerGame
        ? derivedWinner
        : undefined,

      player1Wins: isPerGame
        ? parseInt(player1Wins, 10) || 0
        : undefined,

      player2Wins: isPerGame
        ? parseInt(player2Wins, 10) || 0
        : undefined,

      pricePerGame: isPerGame
        ? parseFloat(amountPerGame) || 0
        : undefined,
    });

    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <Pressable
        className="flex-1 bg-black/40 justify-end"
        onPress={handleClose}
      >
        <KeyboardAvoidingView
          behavior={
            Platform.OS === "ios"
              ? "padding"
              : undefined
          }
          className="w-full"
          style={{ maxHeight: "100%" }}
        >
          <Pressable
            onPress={(e) =>
              e.stopPropagation()
            }
          >
            <View
              className="bg-white rounded-t-3xl px-5 pt-5"
              style={{
                maxHeight: "88%",
                paddingBottom:
                  Math.max(
                    insets.bottom,
                    16
                  ) + 8,
              }}
            >
              <View className="w-10 h-1.5 bg-gray-200 rounded-full self-center mb-4" />

              <View className="flex-row items-center justify-between mb-5">
                <Text className="text-black text-xl font-bold">
                  Log New Game
                </Text>

                <TouchableOpacity
                  onPress={handleClose}
                  className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                >
                  <Ionicons
                    name="close"
                    size={18}
                    color="#374151"
                  />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                  paddingBottom: 16,
                }}
              >
                <ChipSelector
                  label="Game"
                  options={GAMES}
                  selected={game}
                  onSelect={setGame}
                />

                <ChipSelector
                  label="Station"
                  options={STATIONS}
                  selected={station}
                  onSelect={setStation}
                />

                {/* MATCH DETAILS */}
                <View className="mb-5">
                  <Text className="text-gray-500 text-sm font-medium mb-3">
                    Match Details
                  </Text>

                  {/* PLAYER 1 */}
                  <View className="mb-3">
                    <Text className="text-gray-500 text-xs font-medium mb-2">
                      Player 1
                    </Text>

                    <TextInput
                      value={player1}
                      onChangeText={setPlayer1}
                      placeholder="Enter player 1 name"
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="words"
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black"
                    />
                  </View>

                  {/* TEAM 1 */}
                  <View className="mb-3">
                    <Text className="text-gray-500 text-xs font-medium mb-2">
                      Team 1
                    </Text>

                    <TextInput
                      value={team1}
                      onChangeText={setTeam1}
                      placeholder="Enter team 1 name"
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="words"
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black"
                    />
                  </View>

                  {/* PLAYER 2 */}
                  <View className="mb-3">
                    <Text className="text-gray-500 text-xs font-medium mb-2">
                      Player 2
                    </Text>

                    <TextInput
                      value={player2}
                      onChangeText={setPlayer2}
                      placeholder="Enter player 2 name"
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="words"
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black"
                    />
                  </View>

                  {/* TEAM 2 */}
                  <View>
                    <Text className="text-gray-500 text-xs font-medium mb-2">
                      Team 2
                    </Text>

                    <TextInput
                      value={team2}
                      onChangeText={setTeam2}
                      placeholder="Enter team 2 name"
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="words"
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black"
                    />
                  </View>
                </View>

                {/* PAYMENT TYPE */}
                <Text className="text-gray-500 text-sm font-medium mb-2">
                  Payment Type
                </Text>

                <View className="flex-row bg-gray-100 rounded-xl p-1 mb-5">
                  <TouchableOpacity
                    onPress={() =>
                      setPaymentType(
                        "per-game"
                      )
                    }
                    className={`flex-1 py-2.5 rounded-lg items-center ${
                      paymentType ===
                      "per-game"
                        ? "bg-white"
                        : ""
                    }`}
                    style={
                      paymentType ===
                      "per-game"
                        ? {
                            shadowOpacity: 0.05,
                            elevation: 1,
                          }
                        : undefined
                    }
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        paymentType ===
                        "per-game"
                          ? "text-indigo-600"
                          : "text-gray-500"
                      }`}
                    >
                      Per Game
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      setPaymentType(
                        "per-hour"
                      )
                    }
                    className={`flex-1 py-2.5 rounded-lg items-center ${
                      paymentType ===
                      "per-hour"
                        ? "bg-white"
                        : ""
                    }`}
                    style={
                      paymentType ===
                      "per-hour"
                        ? {
                            shadowOpacity: 0.05,
                            elevation: 1,
                          }
                        : undefined
                    }
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        paymentType ===
                        "per-hour"
                          ? "text-indigo-600"
                          : "text-gray-500"
                      }`}
                    >
                      Per Hour
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* PER GAME */}
                {paymentType ===
                "per-game" ? (
                  <View
                    className="flex-row mb-5"
                    style={{ gap: 12 }}
                  >
                    <View className="flex-1">
                      <Text className="text-gray-500 text-sm font-medium mb-2">
                        Amount per game (KES)
                      </Text>

                      <TextInput
                        value={
                          amountPerGame
                        }
                        onChangeText={
                          setAmountPerGame
                        }
                        keyboardType="numeric"
                        placeholder="e.g. 150"
                        placeholderTextColor="#9CA3AF"
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black"
                      />
                    </View>

                    <View className="flex-1">
                      <Text className="text-gray-500 text-sm font-medium mb-2">
                        Number of games
                      </Text>

                      <TextInput
                        value={
                          numberOfGames
                        }
                        onChangeText={(v) =>
                          setNumberOfGames(
                            v.replace(
                              /[^0-9]/g,
                              ""
                            )
                          )
                        }
                        keyboardType="numeric"
                        placeholder="e.g. 2"
                        placeholderTextColor="#9CA3AF"
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black"
                      />
                    </View>
                  </View>
                ) : (
                  /* PER HOUR */
                  <View
                    className="flex-row mb-5"
                    style={{ gap: 12 }}
                  >
                    <View className="flex-1">
                      <Text className="text-gray-500 text-sm font-medium mb-2">
                        Rate per hour (KES)
                      </Text>

                      <TextInput
                        value={hourlyRate}
                        onChangeText={
                          setHourlyRate
                        }
                        keyboardType="numeric"
                        placeholder="e.g. 200"
                        placeholderTextColor="#9CA3AF"
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black"
                      />
                    </View>

                    <View className="flex-1">
                      <Text className="text-gray-500 text-sm font-medium mb-2">
                        Number of hours
                      </Text>

                      <TextInput
                        value={
                          numberOfHours
                        }
                        onChangeText={
                          setNumberOfHours
                        }
                        keyboardType="numeric"
                        placeholder="e.g. 1.5"
                        placeholderTextColor="#9CA3AF"
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black"
                      />
                    </View>
                  </View>
                )}

                {/* WINS */}
                {paymentType ===
                  "per-game" && (
                  <View className="mb-5">
                    <Text className="text-gray-500 text-sm font-medium mb-2">
                      Wins
                    </Text>

                    <View
                      className="flex-row"
                      style={{ gap: 12 }}
                    >
                      <View className="flex-1">
                        <Text className="text-gray-400 text-xs mb-1">
                          {player1.trim() ||
                            "Player 1"}
                        </Text>

                        <TextInput
                          value={
                            player1Wins
                          }
                          onChangeText={(v) =>
                            setPlayer1Wins(
                              v.replace(
                                /[^0-9]/g,
                                ""
                              )
                            )
                          }
                          keyboardType="numeric"
                          placeholder="0"
                          placeholderTextColor="#9CA3AF"
                          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black text-center"
                        />
                      </View>

                      <View className="flex-1">
                        <Text className="text-gray-400 text-xs mb-1">
                          {player2.trim() ||
                            "Player 2"}
                        </Text>

                        <TextInput
                          value={
                            player2Wins
                          }
                          onChangeText={(v) =>
                            setPlayer2Wins(
                              v.replace(
                                /[^0-9]/g,
                                ""
                              )
                            )
                          }
                          keyboardType="numeric"
                          placeholder="0"
                          placeholderTextColor="#9CA3AF"
                          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black text-center"
                        />
                      </View>
                    </View>

                    {/* RESULT */}
                    <View
                      className={`rounded-xl p-3 flex-row items-center justify-between mt-3 ${
                        derivedWinner ===
                        "draw"
                          ? "bg-amber-50"
                          : "bg-indigo-50"
                      }`}
                    >
                      <View className="flex-row items-center">
                        <Ionicons
                          name={
                            derivedWinner ===
                            null
                              ? "help-circle"
                              : derivedWinner ===
                                "draw"
                              ? "git-compare"
                              : "trophy"
                          }
                          size={14}
                          color={
                            derivedWinner ===
                            null
                              ? "#6B7280"
                              : derivedWinner ===
                                "draw"
                              ? "#D97706"
                              : "#4F46E5"
                          }
                        />

                        <Text
                          className={`text-xs font-medium ml-1.5 ${
                            derivedWinner ===
                            null
                              ? "text-gray-500"
                              : derivedWinner ===
                                "draw"
                              ? "text-amber-700"
                              : "text-indigo-600"
                          }`}
                        >
                          Result
                        </Text>
                      </View>

                      <Text
                        className={`text-sm font-bold ${
                          derivedWinner ===
                          null
                            ? "text-gray-500"
                            : derivedWinner ===
                              "draw"
                            ? "text-amber-700"
                            : "text-indigo-700"
                        }`}
                      >
                        {derivedWinner ===
                        null
                          ? "Enter both win counts"
                          : derivedWinner ===
                            "draw"
                          ? `Draw ${parseInt(
                              player1Wins,
                              10
                            ) || 0} — ${
                              parseInt(
                                player2Wins,
                                10
                              ) || 0
                            }`
                          : `${
                              derivedWinner ===
                              "player1"
                                ? player1.trim() ||
                                  "Player 1"
                                : player2.trim() ||
                                  "Player 2"
                            } won ${Math.max(
                              parseInt(
                                player1Wins,
                                10
                              ) || 0,
                              parseInt(
                                player2Wins,
                                10
                              ) || 0
                            )} — ${Math.min(
                              parseInt(
                                player1Wins,
                                10
                              ) || 0,
                              parseInt(
                                player2Wins,
                                10
                              ) || 0
                            )}`}
                      </Text>
                    </View>
                  </View>
                )}

                {/* TOTAL */}
                <View className="bg-indigo-50 rounded-2xl p-4 flex-row items-center justify-between">
                  <Text className="text-indigo-600 text-sm font-medium">
                    Total
                  </Text>

                  <Text className="text-indigo-700 text-lg font-bold">
                    KES {total || 0}
                  </Text>
                </View>
              </ScrollView>

              {/* SAVE */}
              <View style={{ paddingTop: 12 }}>
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={!isValid}
                  activeOpacity={0.85}
                  className={`rounded-2xl py-4 items-center ${
                    isValid
                      ? "bg-indigo-600"
                      : "bg-gray-200"
                  }`}
                >
                  <Text
                    className={`font-semibold text-base ${
                      isValid
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                  >
                    Save Game
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

// --------------------------------------------------
// HOME SCREEN
// --------------------------------------------------

export default function HomeScreen() {
  const [modalVisible, setModalVisible] =
    useState(false);

  const [games, setGames] =
    useState<GameSession[]>(initialGames);

  const [statFilter, setStatFilter] =
    useState<StatFilter>(null);

  const [statModalVisible, setStatModalVisible] =
    useState(false);

  const [billModalVisible, setBillModalVisible] =
    useState(false);

  const [selectedGame, setSelectedGame] =
    useState<GameSession | null>(null);

  // ------------------------------------------------
  // DASHBOARD STATS
  // ------------------------------------------------

  const stats = useMemo(() => {
    const gamesToday = games.length;

    /*
     * Count individual players who have paid.
     */
    const paidPlayers = games.reduce(
      (count, game) => {
        return (
          count +
          (game.player1Paid ? 1 : 0) +
          (game.player2Paid ? 1 : 0)
        );
      },
      0
    );

    /*
     * Count individual players who haven't paid.
     */
    const unpaidPlayers = games.reduce(
      (count, game) => {
        return (
          count +
          (!game.player1Paid ? 1 : 0) +
          (!game.player2Paid ? 1 : 0)
        );
      },
      0
    );

    /*
     * Revenue today.
     *
     * For per-game sessions:
     * only count money that has actually been paid.
     *
     * For hourly sessions:
     * currently the session is treated as one payment.
     */
    const revenueToday = games.reduce(
      (sum, game) => {
        const bill = getBill(game);

        if (bill.isPerGame) {
          const player1PaidAmount =
            game.player1Paid
              ? bill.p1Owes
              : 0;

          const player2PaidAmount =
            game.player2Paid
              ? bill.p2Owes
              : 0;

          return (
            sum +
            player1PaidAmount +
            player2PaidAmount
          );
        }

        /*
         * For hourly games, the entire amount
         * is counted only when both players have
         * been marked as paid.
         */
        if (
          game.player1Paid &&
          game.player2Paid
        ) {
          return sum + game.amount;
        }

        return sum;
      },
      0
    );

    return {
      gamesToday,
      paidPlayers,
      unpaidPlayers,
      revenueToday,
    };
  }, [games]);

  // ------------------------------------------------
  // ADD NEW GAME
  // ------------------------------------------------

  const handleAddGame = (
    session: Omit<
      GameSession,
      "id" | "time" | "player1Paid" | "player2Paid"
    >
  ) => {
    const now = new Date();

    const time = now.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    const newSession: GameSession = {
      ...session,

      id: Date.now().toString(),

      time,

      /*
       * New games start unpaid for BOTH players.
       */
      player1Paid: false,
      player2Paid: false,
    };

    setGames((prev) => [
      newSession,
      ...prev,
    ]);
  };

  // ------------------------------------------------
  // OPEN STAT MODAL
  // ------------------------------------------------

  const openStatDetail = (
    filter: StatFilter
  ) => {
    setStatFilter(filter);
    setStatModalVisible(true);
  };

  // ------------------------------------------------
  // OPEN BILL
  // ------------------------------------------------

  const openBill = (
    session: GameSession
  ) => {
    setSelectedGame(session);
    setBillModalVisible(true);
  };

  // ------------------------------------------------
  // TOGGLE PLAYER PAYMENT
  // ------------------------------------------------

  const togglePlayerPayment = (
    player: "player1" | "player2"
  ) => {
    if (!selectedGame) return;

    /*
     * Update the main games array.
     */
    setGames((prev) =>
      prev.map((game) => {
        if (
          game.id !== selectedGame.id
        ) {
          return game;
        }

        if (player === "player1") {
          return {
            ...game,
            player1Paid:
              !game.player1Paid,
          };
        }

        return {
          ...game,
          player2Paid:
            !game.player2Paid,
        };
      })
    );

    /*
     * Update the selected game immediately
     * so the modal UI changes without needing
     * to close and reopen it.
     */
    setSelectedGame((prev) => {
      if (!prev) return prev;

      if (player === "player1") {
        return {
          ...prev,
          player1Paid:
            !prev.player1Paid,
        };
      }

      return {
        ...prev,
        player2Paid:
          !prev.player2Paid,
      };
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 60,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-gray-400 text-sm">
              Welcome back 👋
            </Text>

            <Text className="text-black text-2xl font-bold mt-0.5">
              Game Hub
            </Text>
          </View>

          <TouchableOpacity className="w-11 h-11 rounded-full bg-white items-center justify-center border border-gray-100">
            <Ionicons
              name="notifications-outline"
              size={20}
              color="#111827"
            />
          </TouchableOpacity>
        </View>

        {/* STAT CARDS */}
        <View className="flex-row mb-3 -mx-1">
          <StatCard
            label="Games Today"
            value={stats.gamesToday}
            icon="game-controller-outline"
            color="#4F46E5"
            onPress={() =>
              openStatDetail("all")
            }
          />

          <StatCard
            label="Paid Players"
            value={stats.paidPlayers}
            icon="checkmark-circle-outline"
            color="#16A34A"
            onPress={() =>
              openStatDetail("paid")
            }
          />

          <StatCard
            label="Unpaid Players"
            value={stats.unpaidPlayers}
            icon="alert-circle-outline"
            color="#DC2626"
            onPress={() =>
              openStatDetail("unpaid")
            }
          />
        </View>

        {/* REVENUE */}
        <View className="bg-black rounded-2xl p-4 mb-6 flex-row items-center justify-between">
          <View>
            <Text className="text-gray-300 text-xs">
              Revenue Today
            </Text>

            <Text className="text-white text-2xl font-bold mt-1">
              KES {stats.revenueToday}
            </Text>
          </View>

          <Ionicons
            name="trending-up"
            size={28}
            color="#4ADE80"
          />
        </View>

        {/* LOG NEW GAME */}
        <TouchableOpacity
          className="flex-row items-center justify-center bg-indigo-600 rounded-2xl py-4 mb-6"
          activeOpacity={0.85}
          onPress={() =>
            setModalVisible(true)
          }
        >
          <Ionicons
            name="add-circle-outline"
            size={20}
            color="#fff"
          />

          <Text className="text-white font-semibold text-base ml-2">
            Log New Game
          </Text>
        </TouchableOpacity>

        {/* RECENT GAMES HEADER */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-black text-lg font-bold">
            Recent Games
          </Text>

          <TouchableOpacity>
            <Text className="text-indigo-600 text-sm font-medium">
              See all
            </Text>
          </TouchableOpacity>
        </View>

        {/* RECENT GAMES */}
        <FlatList
          data={games}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const bill = getBill(item);

            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  openBill(item)
                }
                className="bg-white rounded-xl p-4 mb-3 border border-gray-100"
              >
                <View className="flex-row items-center">
                  {/* LEFT */}
                  <View className="flex-row items-center flex-1">
                    <View className="w-11 h-11 rounded-full bg-indigo-50 items-center justify-center mr-3">
                      <Ionicons
                        name="game-controller"
                        size={20}
                        color="#4F46E5"
                      />
                    </View>

                    <View className="flex-1">
                      {/* GAME */}
                      <Text className="text-black font-semibold text-base">
                        {item.gameName}
                      </Text>

                      {/* SESSION DETAILS */}
                      <Text className="text-gray-400 text-xs mt-0.5">
                        {item.station} •{" "}
                        {item.detail} •{" "}
                        {item.time}
                      </Text>

                      {/* PLAYER 1 */}
                      <View className="flex-row items-center mt-2">
                        <View className="w-6 h-6 rounded-full bg-gray-100 items-center justify-center mr-2">
                          <Ionicons
                            name="person-outline"
                            size={13}
                            color="#6B7280"
                          />
                        </View>

                        <Text className="text-gray-700 text-sm font-semibold">
                          {item.player1}
                        </Text>

                        <View
                          className={`ml-2 px-2 py-0.5 rounded-full ${
                            item.player1Paid
                              ? "bg-green-50"
                              : "bg-red-50"
                          }`}
                        >
                          <Text
                            className={`text-[10px] font-semibold ${
                              item.player1Paid
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {item.player1Paid
                              ? "Paid"
                              : "Unpaid"}
                          </Text>
                        </View>
                      </View>

                      {/* PLAYER 2 */}
                      <View className="flex-row items-center mt-1 ml-8">
                        <Text className="text-gray-400 text-xs mr-2">
                          vs
                        </Text>

                        <Text className="text-gray-700 text-sm font-semibold">
                          {item.player2}
                        </Text>

                        <View
                          className={`ml-2 px-2 py-0.5 rounded-full ${
                            item.player2Paid
                              ? "bg-green-50"
                              : "bg-red-50"
                          }`}
                        >
                          <Text
                            className={`text-[10px] font-semibold ${
                              item.player2Paid
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {item.player2Paid
                              ? "Paid"
                              : "Unpaid"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* RIGHT */}
                  <View className="items-end ml-2">
                    <Text className="text-black font-semibold">
                      KES {item.amount}
                    </Text>

                    {/* Overall session status */}
                    <View
                      className={`mt-1 px-2 py-0.5 rounded-full ${
                        item.player1Paid &&
                        item.player2Paid
                          ? "bg-green-50"
                          : "bg-red-50"
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          item.player1Paid &&
                          item.player2Paid
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.player1Paid &&
                        item.player2Paid
                          ? "Paid"
                          : "Unpaid"}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* SMALL DEBT SUMMARY */}
                {bill.isPerGame && (
                  <View className="mt-3 pt-3 border-t border-gray-100 flex-row items-center justify-between">
                    <Text className="text-gray-400 text-[11px]">
                      {item.player1}: KES{" "}
                      {bill.p1Owes}
                    </Text>

                    <Text className="text-gray-400 text-[11px]">
                      {item.player2}: KES{" "}
                      {bill.p2Owes}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      </ScrollView>

      {/* NEW GAME */}
      <NewGameModal
        visible={modalVisible}
        onClose={() =>
          setModalVisible(false)
        }
        onSubmit={handleAddGame}
      />

      {/* STATS */}
      <StatDetailModal
        visible={statModalVisible}
        filter={statFilter}
        games={games}
        onClose={() =>
          setStatModalVisible(false)
        }
      />

      {/* BILL */}
      <GameBillModal
        visible={billModalVisible}
        session={selectedGame}
        onClose={() =>
          setBillModalVisible(false)
        }
        onTogglePayment={
          togglePlayerPayment
        }
      />
    </View>
  );
}