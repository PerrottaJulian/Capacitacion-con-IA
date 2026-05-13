import React, { createContext, useContext, useEffect, useState } from "react";

export type ColorScheme = "indigo" | "blue" | "green" | "orange" | "violet";
export type ThemeMode = "light" | "dark";

interface ThemeContextValue {
  mode: ThemeMode;
  color: ColorScheme;
  setMode: (mode: ThemeMode) => void;
  setColor: (color: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "light",
  color: "indigo",
  setMode: () => {},
  setColor: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem("capacitaya-mode") as ThemeMode) ?? "light";
  });

  const [color, setColorState] = useState<ColorScheme>(() => {
    return (localStorage.getItem("capacitaya-color") as ColorScheme) ?? "indigo";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("capacitaya-mode", mode);
  }, [mode]);

  useEffect(() => {
    document.documentElement.setAttribute("data-color", color);
    localStorage.setItem("capacitaya-color", color);
  }, [color]);

  useEffect(() => {
    document.documentElement.setAttribute("data-color", color);
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const setMode = (m: ThemeMode) => setModeState(m);
  const setColor = (c: ColorScheme) => setColorState(c);

  return (
    <ThemeContext.Provider value={{ mode, color, setMode, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export const COLOR_SCHEMES: { id: ColorScheme; label: string; hex: string }[] = [
  { id: "indigo", label: "Índigo",  hex: "#4F46E5" },
  { id: "blue",   label: "Azul",    hex: "#2563EB" },
  { id: "green",  label: "Verde",   hex: "#059669" },
  { id: "orange", label: "Naranja", hex: "#EA580C" },
  { id: "violet", label: "Violeta", hex: "#7C3AED" },
];
