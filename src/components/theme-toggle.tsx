"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    if (theme) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted(true);
    }
  }, [theme]);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
        <div className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-full border border-border"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 transition-all" />
      ) : (
        <Moon className="h-4 w-4 transition-all" />
      )}
    </Button>
  );
}
