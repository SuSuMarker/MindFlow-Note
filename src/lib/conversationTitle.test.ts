import { describe, expect, it } from "vitest";

import { extractConversationTitleFromText } from "./conversationTitle";

describe("extractConversationTitleFromText", () => {
  it("strips common request prefixes and keeps the topic", () => {
    expect(
      extractConversationTitleFromText(
        "请帮我总结一下 React 状态管理最佳实践",
        "新对话",
      ),
    ).toBe("React 状态管理最佳实践");
  });

  it("falls back when the message is empty", () => {
    expect(extractConversationTitleFromText("   ", "新对话")).toBe("新对话");
  });
});
