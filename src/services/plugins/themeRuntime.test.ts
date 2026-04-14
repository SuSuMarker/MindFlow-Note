import { beforeEach, describe, expect, it } from "vitest";
import { pluginThemeRuntime } from "@/services/plugins/themeRuntime";

describe("plugin theme runtime", () => {
  beforeEach(() => {
    pluginThemeRuntime.clearPlugin("test-plugin");
  });

  it("applies and resets token overrides", () => {
    const root = document.documentElement;
    root.style.removeProperty("--mindflow-test");

    const cleanup = pluginThemeRuntime.setToken("test-plugin", "--mindflow-test", "100 10% 10%", "light");
    const lightStyle = document.head.querySelector<HTMLStyleElement>(
      'style[data-mindflow-plugin-theme-light="true"]',
    );
    expect(lightStyle?.textContent || "").toContain("--mindflow-test: 100 10% 10%;");
    expect(root.style.getPropertyValue("--mindflow-test").trim()).toBe("");

    cleanup();
    const nextLightStyle = document.head.querySelector<HTMLStyleElement>(
      'style[data-mindflow-plugin-theme-light="true"]',
    );
    expect(nextLightStyle?.textContent || "").not.toContain("--mindflow-test");
  });

  it("registers and applies preset", () => {
    const dispose = pluginThemeRuntime.registerPreset("test-plugin", {
      id: "preset-a",
      light: { "--mindflow-preset": "210 20% 30%" },
      dark: { "--mindflow-preset": "10 10% 10%" },
    });
    pluginThemeRuntime.applyPreset("test-plugin", "preset-a");

    const lightStyle = document.head.querySelector<HTMLStyleElement>(
      'style[data-mindflow-plugin-theme-light="true"]',
    );
    const darkStyle = document.head.querySelector<HTMLStyleElement>(
      'style[data-mindflow-plugin-theme-dark="true"]',
    );
    expect(lightStyle?.textContent || "").toContain("--mindflow-preset: 210 20% 30%;");
    expect(darkStyle?.textContent || "").toContain("--mindflow-preset: 10 10% 10%;");

    pluginThemeRuntime.clearPlugin("test-plugin");
    dispose();
  });

  it("reapplies overrides after plugin theme styles are removed", () => {
    const cleanup = pluginThemeRuntime.setToken(
      "test-plugin",
      "--mindflow-reapply",
      "111 11% 11%",
      "light",
    );
    const lightStyle = document.head.querySelector<HTMLStyleElement>(
      'style[data-mindflow-plugin-theme-light="true"]',
    );
    expect(lightStyle).not.toBeNull();
    lightStyle?.remove();

    pluginThemeRuntime.reapply();
    const reapplied = document.head.querySelector<HTMLStyleElement>(
      'style[data-mindflow-plugin-theme-light="true"]',
    );
    expect(reapplied?.textContent || "").toContain("--mindflow-reapply: 111 11% 11%;");

    cleanup();
  });
});
