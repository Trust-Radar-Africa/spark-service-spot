import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ThemeVersion = "classic" | "modern";

interface ThemeVersionContextType {
  version: ThemeVersion;
  setVersion: (version: ThemeVersion) => void;
  toggleVersion: () => void;
}

const ThemeVersionContext = createContext<ThemeVersionContextType | undefined>(undefined);

export function ThemeVersionProvider({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState<ThemeVersion>(() => {
    const saved = localStorage.getItem("theme-version");
    return (saved as ThemeVersion) || "classic";
  });

  useEffect(() => {
    localStorage.setItem("theme-version", version);
    
    // Toggle data attribute on document for CSS-based theming
    if (version === "modern") {
      document.documentElement.setAttribute("data-theme-version", "modern");
    } else {
      document.documentElement.removeAttribute("data-theme-version");
    }
  }, [version]);

  const toggleVersion = () => {
    setVersion((prev) => (prev === "classic" ? "modern" : "classic"));
  };

  return (
    <ThemeVersionContext.Provider value={{ version, setVersion, toggleVersion }}>
      {children}
    </ThemeVersionContext.Provider>
  );
}

export function useThemeVersion() {
  const context = useContext(ThemeVersionContext);
  if (!context) {
    throw new Error("useThemeVersion must be used within ThemeVersionProvider");
  }
  return context;
}
