const THEME = {
  DARK: "dark",
  LIGHT: "light",
} as const;

const THEME_TRANSITION_CLASS = "theme-transitioning";
const THEME_TRANSITION_DURATION_MS = 450;

export type Theme = (typeof THEME)[keyof typeof THEME];

export type ThemeToggleState = Theme | undefined;

export function getNextTheme(theme: ThemeToggleState): Theme {
  return theme === THEME.DARK ? THEME.LIGHT : THEME.DARK;
}

export function startThemeTransition() {
  const root = document.documentElement;

  root.classList.add(THEME_TRANSITION_CLASS);

  window.setTimeout(() => {
    root.classList.remove(THEME_TRANSITION_CLASS);
  }, THEME_TRANSITION_DURATION_MS);
}
