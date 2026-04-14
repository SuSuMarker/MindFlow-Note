export type DragData = {
  wikiLink: string;
  filePath: string;
  fileName: string;
  isFolder: boolean;
  startX: number;
  startY: number;
  isDragging: boolean;
};

type MindFlowWindow = Window & {
  __mindflow_drag_data?: DragData | null;
};

function getMindFlowWindow(): MindFlowWindow | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window as MindFlowWindow;
}

export function getDragData(): DragData | null {
  return getMindFlowWindow()?.__mindflow_drag_data ?? null;
}

export function setDragData(dragData: DragData | null): void {
  const mindflowWindow = getMindFlowWindow();
  if (!mindflowWindow) {
    return;
  }

  mindflowWindow.__mindflow_drag_data = dragData;
}

export function clearDragData(): void {
  setDragData(null);
}
