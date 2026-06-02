import "./globals.css";

import Navbar from "@/components/Navbar";
import AppProvider from "@/providers/AppProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>

        <AppProvider>

          <Navbar />

          <main className="p-6">
            {children}
          </main>

        </AppProvider>

      </body>
    </html>
  );
}