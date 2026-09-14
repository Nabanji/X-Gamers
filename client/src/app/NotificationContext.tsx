import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { type ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";

type NotificationIcon = ComponentProps<typeof Ionicons>["name"];

export type NotificationItem = {
  id: string;
  icon: NotificationIcon;
  iconBackground: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
};

type NotificationContextValue = {
  notifications: NotificationItem[];
  setNotifications: Dispatch<SetStateAction<NotificationItem[]>>;
  unreadCount: number;
  addNotification: (notification: Omit<NotificationItem, "id" | "unread">) => void;
  markAllRead: () => void;
};

const initialNotifications: NotificationItem[] = [
  {
    id: "unpaid-kevin",
    icon: "alert-circle-outline",
    iconBackground: "bg-red-50 dark:bg-red-950",
    title: "Unpaid game balance",
    message: "Kevin and Mike still have KES 600 outstanding.",
    time: "50 min ago",
    unread: true,
  },
  {
    id: "game-logged",
    icon: "checkmark-circle-outline",
    iconBackground: "bg-green-50 dark:bg-green-950",
    title: "Game session logged",
    message: "FC26 at Station 1 was recorded successfully.",
    time: "15 min ago",
    unread: true,
  },
  {
    id: "weekly-summary",
    icon: "bar-chart-outline",
    iconBackground: "bg-indigo-50 dark:bg-indigo-950",
    title: "Weekly summary ready",
    message: "Your revenue and payment summary is ready to review.",
    time: "Yesterday",
    unread: false,
  },
];

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((notification) => notification.unread).length;

  const addNotification = (notification: Omit<NotificationItem, "id" | "unread">) => {
    setNotifications((current) => [
      { ...notification, id: Date.now().toString(), unread: true },
      ...current,
    ]);
  };

  const markAllRead = () => {
    setNotifications((current) => current.map((notification) => ({ ...notification, unread: false })));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, unreadCount, addNotification, markAllRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within NotificationProvider");
  return context;
}
