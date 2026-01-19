"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// We cannot use ComponentProps directly from 'next-themes' if the types mismatch,
// so we define a compatible interface or use 'any'.
// For simplicity and to avoid type errors with recent next-themes versions:
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
