"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import { useUiStore } from "@/store/useUiStore";
import { buildTheme } from "./theme";

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    const apply = () => {
      useUiStore.setState({ hasHydrated: true });
      setMode(useUiStore.getState().mode);
    };
    const unsubscribeHydration = useUiStore.persist.onFinishHydration(apply);
    const unsubscribeStore = useUiStore.subscribe((state) => {
      if (state.hasHydrated) setMode(state.mode);
    });
    void useUiStore.persist.rehydrate();
    return () => {
      unsubscribeHydration();
      unsubscribeStore();
    };
  }, []);

  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
