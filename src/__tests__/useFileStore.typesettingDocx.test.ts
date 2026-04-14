import { beforeEach, describe, expect, it } from "vitest";
import { useFileStore } from "@/stores/useFileStore";

const resetFileStore = () => {
  useFileStore.setState({
    tabs: [],
    activeTabIndex: -1,
    currentFile: null,
    currentContent: "",
    isDirty: false,
    undoStack: [],
    redoStack: [],
    lastSavedContent: "",
    navigationHistory: [],
    navigationIndex: -1,
  });
};

describe("useFileStore docx tabs", () => {
  beforeEach(() => {
    useFileStore.persist?.clearStorage?.();
    resetFileStore();
  });

  it("opens docx files as regular file tabs", async () => {
    const docPath = "C:/vault/report.docx";
    await useFileStore.getState().openFile(docPath);

    const { tabs, activeTabIndex, currentFile, currentContent } = useFileStore.getState();
    expect(tabs).toHaveLength(1);
    expect(tabs[0]?.type).toBe("file");
    expect(tabs[0]?.path).toBe(docPath);
    expect(activeTabIndex).toBe(0);
    expect(currentFile).toBe(docPath);
    expect(currentContent).toContain("Mock Content");
  });
});
