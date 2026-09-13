import { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";
import { colorScheme } from "nativewind";

export type ThemePreference = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>("system");

  useEffect(() => {
    colorScheme.set(theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;

    const subscription = Appearance.addChangeListener(({ colorScheme: systemTheme }) => {
      colorScheme.set(systemTheme === "dark" ? "dark" : "light");
    });

    return () => subscription.remove();
  }, [theme]);

  const setTheme = (nextTheme: ThemePreference) => {
    setThemeState(nextTheme);
    colorScheme.set(nextTheme);
  };

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}