import { useCallback, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useUIStore } from "@/stores/useUIStore";
import { useFileStore } from "@/stores/useFileStore";
import { useLocaleStore } from "@/stores/useLocaleStore";
import {
  AlertCircle,
  FileText,
  Search,
  Settings,
  Sun,
  Moon,
  Bot,
  Download,
  Loader2,
  RefreshCw,
  RotateCcw,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { exists, isTauriAvailable } from "@/lib/tauri";
import { SettingsModal } from "./SettingsModal";
import { UpdateModal } from "./UpdateModal";
import { useUpdateStore } from "@/stores/useUpdateStore";
import { getRibbonUpdateState } from "./ribbonUpdateState";

interface RibbonProps {
  showMacTrafficLightSafeArea?: boolean;
  flushTopSpacing?: boolean;
}

export function Ribbon({ showMacTrafficLightSafeArea = false, flushTopSpacing = false }: RibbonProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const closeSettings = useCallback(() => setShowSettings(false), []);
  const closeUpdateModal = useCallback(() => setShowUpdateModal(false), []);
  const { t } = useLocaleStore();
  const { isDarkMode, toggleTheme, setRightPanelTab, setChatMode, setRightSidebarOpen } = useUIStore();
  const {
    tabs,
    activeTabIndex,
    switchTab,
    recentFiles,
    openFile,
    fileTree,
    openAIMainTab,
    currentFile,
  } = useFileStore();
  const { availableUpdate, hasUnreadUpdate, installTelemetry, currentVersion, isChecking } = useUpdateStore(
    useShallow((state) => ({
      availableUpdate: state.availableUpdate,
      hasUnreadUpdate: state.hasUnreadUpdate,
      installTelemetry: state.installTelemetry,
      currentVersion: state.currentVersion,
      isChecking: state.isChecking,
    })),
  );
  // 当前激活的标签
  const activeTab = activeTabIndex >= 0 ? tabs[activeTabIndex] : null;

  // 归一化当前主视图所属的功能区，方便扩展
  type RibbonSection = "ai" | "file" | "none";

  let activeSection: RibbonSection = "none";
  if (activeTab?.type === "ai-chat") {
    activeSection = "ai";
  } else if (activeTab?.type === "file" || currentFile) {
    // 没有特殊类型时，只要在编辑文件，就认为是文件编辑区
    activeSection = "file";
  }

  // Find first file tab to switch to
  const handleSwitchToFiles = async () => {
    setRightSidebarOpen(true);
    const isSupportedPrimaryFile = (path: string) => {
      const normalized = path.toLowerCase();
      return !normalized.endsWith(".pdf");
    };

    const fileTabIndex = tabs.findIndex(tab => tab.type === "file");
    if (fileTabIndex !== -1) {
      switchTab(fileTabIndex);
      return;
    }

    // If no files open, try to open recent file
    if (recentFiles && recentFiles.length > 0) {
      for (let i = recentFiles.length - 1; i >= 0; i--) {
        const path = recentFiles[i];
        try {
          if (isSupportedPrimaryFile(path) && await exists(path)) {
            await openFile(path);
            return;
          }
        } catch (e) {
          console.warn(`Failed to check existence of ${path}:`, e);
        }
      }
    }

    // Fallback: Open the first file in the file tree
    const findFirstFile = (entries: typeof fileTree): string | null => {
      for (const entry of entries) {
        if (!entry.is_dir && isSupportedPrimaryFile(entry.path)) return entry.path;
        if (entry.children) {
          const found = findFirstFile(entry.children);
          if (found) return found;
        }
      }
      return null;
    };

    const firstFile = findFirstFile(fileTree);
    if (firstFile) {
      openFile(firstFile);
    }
  };

  const handleOpenSettings = useCallback(() => setShowSettings(true), []);
  const handleOpenUpdateModal = useCallback(() => setShowUpdateModal(true), []);
  const handleOpenUpdateFromSettings = useCallback(() => {
    setShowSettings(false);
    setShowUpdateModal(true);
  }, []);

  const updateRibbonState = getRibbonUpdateState({
    availableUpdate,
    hasUnreadUpdate,
    installPhase: installTelemetry.phase,
    installVersion: installTelemetry.version,
    currentVersion,
    isChecking,
  });
  const updatesSupported = isTauriAvailable();
  const updateTitleDetail =
    updateRibbonState === "ready"
      ? t.updateChecker.descReady
      : updateRibbonState === "in-progress"
        ? installTelemetry.phase === "verifying"
          ? t.updateChecker.descVerifying
          : installTelemetry.phase === "installing"
            ? t.updateChecker.descInstalling
            : t.updateChecker.descDownloading
        : updateRibbonState === "available"
          ? availableUpdate
            ? t.updateChecker.descAvailable.replace("{version}", availableUpdate.version)
            : t.updateChecker.descIdle
          : updateRibbonState === "cancelled"
            ? t.updateChecker.descCancelled
          : updateRibbonState === "error"
            ? t.updateChecker.descError
            : updateRibbonState === "checking"
              ? t.ribbon.softwareUpdateChecking
              : updatesSupported
                ? t.updateChecker.descIdle
                : t.updateChecker.descUnsupported;
  const updateTitle = `${t.updateChecker.title} · ${updateTitleDetail}`;
  const updateButtonClassName = cn(
    "relative w-8 h-8 ui-icon-btn",
    updateRibbonState === "available" && "text-primary border border-primary/25 bg-primary/10 hover:bg-primary/15",
    updateRibbonState === "in-progress" && "text-primary border border-primary/30 bg-primary/10 hover:bg-primary/15",
    updateRibbonState === "ready" && "text-success border border-success/35 bg-success/10 hover:bg-success/15 hover:text-success",
    updateRibbonState === "cancelled" && "text-warning border border-warning/30 bg-warning/10 hover:bg-warning/15",
    updateRibbonState === "error" && "text-warning border border-warning/30 bg-warning/10 hover:bg-warning/15",
  );
  const showUpdateDot = updateRibbonState === "available" || updateRibbonState === "ready";
  const updateDotClassName = updateRibbonState === "ready" ? "bg-success" : "bg-primary";

  const renderUpdateIcon = () => {
    if (updateRibbonState === "available") return <Download size={18} />;
    if (updateRibbonState === "in-progress") return <Loader2 size={18} className="animate-spin" />;
    if (updateRibbonState === "ready") return <RotateCcw size={18} />;
    if (updateRibbonState === "cancelled") return <AlertCircle size={18} />;
    if (updateRibbonState === "error") return <AlertCircle size={18} />;
    return <RefreshCw size={18} className={updateRibbonState === "checking" ? "animate-spin" : ""} />;
  };

  return (
    <div
      className={cn(
        "w-11 h-full bg-background/55 backdrop-blur-md flex flex-col items-center",
      )}
    >
      {showMacTrafficLightSafeArea ? (
        <div
          className="h-11 w-full shrink-0 border-b border-border/60 shadow-[0_1px_0_hsl(var(--border)/0.5)]"
          data-tauri-drag-region
          data-testid="mac-ribbon-traffic-lights-safe-area"
        />
      ) : null}
      <div
        data-testid="ribbon-content"
        className={cn(
          "w-full min-h-0 flex-1 border-r border-border/60 flex flex-col items-center pb-2 gap-0.5",
          showMacTrafficLightSafeArea || flushTopSpacing ? "pt-0" : "pt-2",
        )}
      >
        {/* Top icons */}
        <div className="flex flex-col items-center gap-0.5">
          {/* Search */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-global-search"))}
            className="w-8 h-8 ui-icon-btn"
            title={t.ribbon.globalSearch}
          >
            <Search size={18} />
          </button>

          {/* AI Chat - Main View */}
          <button
            onClick={() => {
              setChatMode("agent");
              setRightSidebarOpen(true);
              openAIMainTab();
              setRightPanelTab("chat");
            }}
            className={cn(
              "w-8 h-8 ui-icon-btn",
              activeSection === "ai"
                ? "bg-primary/15 text-primary border border-primary/30 hover:bg-primary/20"
                : ""
            )}
            title={t.ribbon.aiChatMain}
          >
            <Bot size={18} />
          </button>

          {/* Files/Editor */}
          <button
            onClick={handleSwitchToFiles}
            className={cn(
              "w-8 h-8 ui-icon-btn",
              activeSection === "file"
                ? "bg-primary/15 text-primary border border-primary/30 hover:bg-primary/20"
                : ""
            )}
            title={t.ribbon.fileEditor}
          >
            <FileText size={18} />
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom icons */}
        <div className="flex flex-col items-center gap-0.5">
          <button
            onClick={handleOpenUpdateModal}
            className={updateButtonClassName}
            title={updateTitle}
            aria-label={updateTitle}
          >
            {renderUpdateIcon()}
            {showUpdateDot && (
              <span
                aria-hidden="true"
                className={cn("absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full", updateDotClassName)}
              />
            )}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 ui-icon-btn"
            title={isDarkMode ? t.ribbon.switchToLight : t.ribbon.switchToDark}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Settings */}
          <button
            onClick={handleOpenSettings}
            className="w-8 h-8 ui-icon-btn"
            title={t.ribbon.settings}
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={closeSettings}
        onOpenUpdateModal={handleOpenUpdateFromSettings}
      />
      <UpdateModal isOpen={showUpdateModal} onClose={closeUpdateModal} />
    </div>
  );
}
