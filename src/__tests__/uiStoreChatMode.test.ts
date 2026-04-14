import { describe, expect, it } from "vitest";
import { useUIStore } from "@/stores/useUIStore";

describe("useUIStore chatMode", () => {
  it("supports switching to research mode", () => {
    useUIStore.getState().setChatMode("research");
    expect(useUIStore.getState().chatMode).toBe("research");
  });
});
