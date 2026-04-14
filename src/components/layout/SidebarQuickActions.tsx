import { Calendar } from "lucide-react";
import { useLocaleStore } from "@/stores/useLocaleStore";

interface SidebarQuickActionsProps {
  vaultPath: string | null;
  onQuickNote: () => void;
}

export function SidebarQuickActions({ vaultPath, onQuickNote }: SidebarQuickActionsProps) {
  const { t } = useLocaleStore();

  return (
    <div className="px-2">
      <button
        onClick={onQuickNote}
        disabled={!vaultPath}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground rounded-ui-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-w-0"
        title={t.file.quickNote}
      >
        <Calendar size={14} />
        <span className="ui-compact-text ui-sidebar-hide">{t.file.quickNote}</span>
      </button>
    </div>
  );
}
