import { CssBaseline, PaletteMode } from "@mui/material";
import { amber, deepOrange, grey } from "@mui/material/colors";
import {
  createTheme,
  ThemeOptions,
  ThemeProvider as ThemeProviders,
} from "@mui/material/styles";
import { ReactElement, createContext, useMemo, useState } from "react";

const theme = createTheme({
  palette: {
    mode: "dark",
    // primary: lime,
    // secondary: purple,
  },
});

const getDesignTokens: (mode: PaletteMode) => ThemeOptions = (
  mode: PaletteMode
) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
          primary: {
            main: "#005258",
            light: "#016d75",
            dark: "#003f44",
            contrast: "#ffffff",
          },
          divider: "#D4FADE",
          background: {
            default: "#f1f1f1",
            paper: "#ffffff",
          },
          text: {
            primary: grey[900],
            secondary: grey[800],
          },
        }
      : {
          // palette values for dark mode
          primary: grey,
          divider: grey[700],
          background: {
            default: "#232323",
            paper: "#232323",
          },
          text: {
            primary: "#fff",
            secondary: grey[500],
          },
        }),
  },
});

export const ColorModeContext = createContext(
  {} as {
    toggleColorMode: () => void;
    currentMode: () => void;
  }
);

export default function ThemeProvider({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  const [mode, setMode] = useState<PaletteMode>("light");
  const colorMode = useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === "light" ? "dark" : "light"
        );
      },
      currentMode: () => {
        return mode;
      },
    }),
    []
  );

  // Update the theme only if the mode changes
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProviders theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProviders>
    </ColorModeContext.Provider>
  );
}
