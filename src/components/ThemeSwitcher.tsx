import { useThemeVersion } from "@/contexts/ThemeVersionContext";
import { Palette } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
  const { version, toggleVersion } = useThemeVersion();

  return (
    <button
      onClick={toggleVersion}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300",
        version === "classic"
          ? "bg-accent/10 text-accent hover:bg-accent/20"
          : "bg-qx-orange/10 text-qx-orange hover:bg-qx-orange/20"
      )}
      title={`Switch to ${version === "classic" ? "Modern" : "Classic"} theme`}
    >
      <Palette className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">
        {version === "classic" ? "Classic" : "Modern"}
      </span>
    </button>
  );
}
