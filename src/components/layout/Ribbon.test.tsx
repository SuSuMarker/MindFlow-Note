import { StrictMode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Ribbon } from "./Ribbon";

const fileStoreState = vi.hoisted(() => ({
  tabs: [] as Array<{ id: string; name: string; type: string }>,
  activeTabIndex: -1,
  currentFile: null as string | null,
  openAIMainTab: vi.fn(),
}));

const setRightPanelTabMock = vi.hoisted(() => vi.fn());
const setChatModeMock = vi.hoisted(() => vi.fn());
const setRightSidebarOpenMock = vi.hoisted(() => vi.fn());

const updateStoreState = {
  availableUpdate: null,
  hasUnreadUpdate: false,
  installTelemetry: {
    phase: "idle",
    version: null,
  },
  currentVersion: "1.0.0",
  isChecking: false,
};

vi.mock("@/stores/useUIStore", () => ({
  useUIStore: () => ({
    isDarkMode: false,
    toggleTheme: () => undefined,
    setRightPanelTab: setRightPanelTabMock,
    setChatMode: setChatModeMock,
    setRightSidebarOpen: setRightSidebarOpenMock,
  }),
}));

vi.mock("@/stores/useFileStore", () => ({
  useFileStore: () => ({
    tabs: fileStoreState.tabs,
    activeTabIndex: fileStoreState.activeTabIndex,
    openGraphTab: () => undefined,
    switchTab: () => undefined,
    recentFiles: [],
    openFile: () => undefined,
    fileTree: [],
    openAIMainTab: fileStoreState.openAIMainTab,
    currentFile: fileStoreState.currentFile,
    openFlashcardTab: () => undefined,
    openCardFlowTab: () => undefined,
    openImageManagerTab: () => undefined,
  }),
}));

vi.mock("@/stores/useLocaleStore", () => ({
  useLocaleStore: () => ({
    t: {
      graph: {
        title: "Graph",
      },
      ribbon: {
        globalSearch: "Global Search",
        aiChatMain: "AI Chat",
        fileEditor: "Files",
        cardView: "Card View",
        imageManager: "Image Manager",
        database: "Database",
        flashcardReview: "Flashcards",
        plugins: "Plugins",
        softwareUpdateChecking: "Checking for updates",
        starProject: "Star project",
        switchToLight: "Switch to light mode",
        switchToDark: "Switch to dark mode",
        settings: "Settings",
      },
      auth: {
        signIn: "Sign In",
      },
      updateChecker: {
        title: "Software Update",
        descReady: "Update is ready",
        descVerifying: "Verifying package...",
        descInstalling: "Installing...",
        descDownloading: "Downloading update...",
        descAvailable: "New version found v{version}",
        descIdle: "Check for updates",
        descError: "Update failed",
        descCancelled: "Update cancelled",
        descUnsupported: "Updates are not supported in the current environment",
      },
    },
  }),
}));

vi.mock("@/stores/usePluginStore", () => ({
  usePluginStore: (selector: (state: { isRibbonItemEnabled: () => boolean }) => unknown) =>
    selector({
      isRibbonItemEnabled: () => true,
    }),
}));

vi.mock("@/stores/usePluginUiStore", () => ({
  usePluginUiStore: (selector: (state: { ribbonItems: never[] }) => unknown) =>
    selector({
      ribbonItems: [],
    }),
}));

vi.mock("@/stores/useUpdateStore", () => ({
  useUpdateStore: (selector: (state: typeof updateStoreState) => unknown) => selector(updateStoreState),
  hasActionableTerminalInstallPhase: () => false,
}));

vi.mock("@tauri-apps/plugin-shell", () => ({
  open: async () => undefined,
}));

vi.mock("@/lib/tauri", () => ({
  exists: async () => false,
  isTauriAvailable: () => true,
}));

vi.mock("./SettingsModal", () => ({
  SettingsModal: ({
    isOpen,
    onClose,
    onOpenUpdateModal,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onOpenUpdateModal: () => void;
  }) =>
    isOpen ? (
      <div>
        <div>Settings Modal</div>
        <button onClick={onOpenUpdateModal}>Open Update From Settings</button>
        <button onClick={onClose}>Close Settings</button>
      </div>
    ) : null,
}));

vi.mock("./UpdateModal", () => ({
  UpdateModal: ({ isOpen }: { isOpen: boolean }) => (isOpen ? <div>Update Modal</div> : null),
}));

describe("Ribbon", () => {
  beforeEach(() => {
    fileStoreState.tabs = [];
    fileStoreState.activeTabIndex = -1;
    fileStoreState.currentFile = null;
    fileStoreState.openAIMainTab.mockReset();
    setRightPanelTabMock.mockReset();
    setChatModeMock.mockReset();
    setRightSidebarOpenMock.mockReset();
  });

  it("does not render a macOS traffic-light safe area by default", () => {
    render(<Ribbon />);

    expect(screen.queryByTestId("mac-ribbon-traffic-lights-safe-area")).not.toBeInTheDocument();
  });

  it("renders a dedicated macOS traffic-light safe area when requested", () => {
    const { container } = render(<Ribbon showMacTrafficLightSafeArea />);

    expect(screen.getByTestId("mac-ribbon-traffic-lights-safe-area")).toHaveAttribute("data-tauri-drag-region", "true");
    expect(screen.getByTestId("mac-ribbon-traffic-lights-safe-area")).toHaveClass("border-b");
    expect(container.firstElementChild).not.toHaveClass("border-r");
    expect(screen.getByTestId("ribbon-content")).toHaveClass("border-r");
    expect(screen.getByRole("button", { name: "Global Search" })).toBeInTheDocument();
  });

  it("removes extra top padding when left macOS top chrome already owns the top row", () => {
    render(<Ribbon flushTopSpacing />);

    expect(screen.getByTestId("ribbon-content")).toHaveClass("pt-0");
    expect(screen.getByTestId("ribbon-content")).not.toHaveClass("pt-2");
  });

  it("keeps the macOS safe area free of the vertical divider when collapsed", () => {
    render(<Ribbon showMacTrafficLightSafeArea />);

    expect(screen.getByTestId("mac-ribbon-traffic-lights-safe-area")).not.toHaveClass("border-r");
    expect(screen.getByTestId("mac-ribbon-traffic-lights-safe-area")).toHaveClass("shadow-[0_1px_0_hsl(var(--border)/0.5)]");
    expect(screen.getByTestId("ribbon-content")).not.toHaveClass("shadow-[inset_-1px_0_0_hsl(var(--border)/0.6)]");
  });

  it("renders in StrictMode without triggering a zustand selector loop", () => {

    render(
      <StrictMode>
        <Ribbon />
      </StrictMode>,
    );

    expect(screen.getByRole("button", { name: /Software Update/ })).toBeInTheDocument();
  });

  it("opens the dedicated update modal directly from the ribbon button", () => {
    render(<Ribbon />);

    fireEvent.click(screen.getByRole("button", { name: /Software Update/ }));

    expect(screen.getByText("Update Modal")).toBeInTheDocument();
    expect(screen.queryByText("Settings Modal")).not.toBeInTheDocument();
  });

  it("closes settings before opening the update modal from the settings entry", () => {
    render(<Ribbon />);

    fireEvent.click(screen.getByTitle("Settings"));
    expect(screen.getByText("Settings Modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Open Update From Settings"));

    expect(screen.getByText("Update Modal")).toBeInTheDocument();
    expect(screen.queryByText("Settings Modal")).not.toBeInTheDocument();
  });

  it("does not render removed non-AI ribbon entries", () => {
    render(<Ribbon />);

    expect(screen.queryByRole("button", { name: "Image Manager" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Flashcards" })).not.toBeInTheDocument();
  });

  it("uses the stronger active-state emphasis for the current section", () => {
    fileStoreState.tabs = [{ id: "tab-1", name: "Daily Note.md", type: "file" }];
    fileStoreState.activeTabIndex = 0;
    fileStoreState.currentFile = "/vault/Daily Note.md";

    render(<Ribbon />);

    expect(screen.getByRole("button", { name: "Files" })).toHaveClass(
      "bg-primary/15",
      "text-primary",
      "border",
      "border-primary/30",
      "hover:bg-primary/20",
    );
  });

  it("opens the AI main tab in agent mode from the ribbon", () => {
    render(<Ribbon />);

    fireEvent.click(screen.getByRole("button", { name: "AI Chat" }));

    expect(setChatModeMock).toHaveBeenCalledWith("agent");
    expect(setRightSidebarOpenMock).toHaveBeenCalledWith(true);
    expect(fileStoreState.openAIMainTab).toHaveBeenCalled();
    expect(setRightPanelTabMock).toHaveBeenCalledWith("chat");
  });
});
