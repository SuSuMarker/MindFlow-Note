export type MindFlowThemeMode = "all" | "light" | "dark";

export interface MindFlowThemePreset {
  id: string;
  name?: string;
  tokens?: Record<string, string>;
  light?: Record<string, string>;
  dark?: Record<string, string>;
}

export interface MindFlowStyleInput {
  css: string;
  scopeId?: string;
  global?: boolean;
  layer?: "base" | "theme" | "component" | "override";
}

export const defaultThemeTokens: {
  color: readonly [
    "--background",
    "--foreground",
    "--muted",
    "--muted-foreground",
    "--accent",
    "--accent-foreground",
    "--primary",
    "--primary-foreground",
    "--border"
  ];
  radius: readonly ["--ui-radius-sm", "--ui-radius-md", "--ui-radius-lg"];
  typography: readonly ["--font-sans", "--font-mono"];
  motion: readonly ["--mindflow-motion-fast", "--mindflow-motion-base", "--mindflow-motion-slow"];
};

export declare function createThemePreset(input: MindFlowThemePreset): MindFlowThemePreset;

export declare function withCssVars(selector: string, tokens: Record<string, string>): string;
