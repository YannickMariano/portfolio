import { useEffect, useState } from "react";

export const useTheme = () => {
  // Initialisation du thème
  const getInitialTheme = () => {
    const saved = localStorage.getItem("theme");

    if (saved) {
      return saved === "dark";
    }

    // fallback → thème système
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const [dark, setDark] = useState(getInitialTheme);

  // Appliquer le thème + sauvegarder
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // Toggle
  const toggleDark = () => {
    setDark(prev => !prev);
  };

  return { dark, toggleDark };
};