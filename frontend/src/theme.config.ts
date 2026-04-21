import type { ITheme } from "@xterm/xterm";

export const colors = {
  accent: "#7c45e9",
  accentSelection: "#ce45e944",

  bgDeepest: "#000000",
  bgDark: "#000000",
  bgMid: "#000000",
  bgLight: "#49284e",

  fgPrimary: "#b285c0",
  fgMuted: "#8899aa",
  fgLabel: "#aabbcc",
  fgWhite: "#fff",
} as const;

export const terminalTheme: ITheme = {
  background: colors.bgDeepest,
  foreground: colors.fgPrimary,
  cursor: colors.accent,
  selectionBackground: colors.accentSelection,
};

export const theme: Record<string, React.CSSProperties> = {
  // Terminal layout
  wrapper: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    background: colors.bgDeepest,
  },
  titleBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: colors.bgDark,
    borderBottom: `1px solid ${colors.accent}`,
    height: "48px",
    padding: "0 2rem",
    flexShrink: 0,
  },
  titleText: {
    color: colors.accent,
  },
  logoutBtn: {
    background: "transparent",
    border: `1px solid ${colors.accent}`,
    lineHeight: "0.9rem",
    borderRadius: 12,
    color: colors.accent,
    cursor: "pointer",
    padding: "0.25rem 0.75rem",
  },
  terminal: {
    flex: 1,
    padding: "0.5rem",
    paddingBottom: "2rem",
    overflow: "hidden",
  },

  // Login layout
  loginWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    background: colors.bgDeepest,
  },
  card: {
    background: colors.bgDark,
    border: `1px solid ${colors.accent}`,
    borderRadius: "18px",
    padding: "12px",
    width: 360,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  cardTitle: {
    fontSize: "1.6rem",
    lineHeight: "1.2rem",
    color: colors.accent,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: "0.85rem",
    color: colors.fgMuted,
  },
  inputLabel: {
    fontSize: "0.8rem",
    color: colors.fgLabel,
    marginBottom: -6,
  },
  input: {
    background: colors.bgMid,
    border: `1px solid ${colors.accent}`,
    borderRadius: 6,
    color: colors.fgPrimary,
    fontSize: "0.95rem",
    padding: "0.6rem 0.8rem",
    outline: "none",
  },
  errorText: {
    color: colors.accent,
    fontSize: "0.85rem",
  },
  submitBtn: {
    background: colors.accent,
    border: "none",
    borderRadius: 6,
    color: colors.fgWhite,
    cursor: "pointer",
    fontSize: "1rem",
    padding: "0.7rem",
  },
};
