import "./globals.css";

import Navbar from "@/components/Navbar";
import AppProvider from "@/providers/AppProvider";
import "../styles/calendar.css";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased">
        <AppProvider>
          <Navbar />
          <main className="p-6 max-w-screen-2xl mx-auto">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
