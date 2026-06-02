"use client";

import QueryProvider from "./QueryProvider";
import ThemeProvider from "./ThemeProvider";
import { Toaster } from "react-hot-toast";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <QueryProvider>

        {children}

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />

      </QueryProvider>
    </ThemeProvider>
  );
}