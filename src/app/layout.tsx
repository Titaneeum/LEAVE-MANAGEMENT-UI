"use client";

// ❌ Jangan import core/notifications CSS
// ✅ Import hanya calendar styles
import "@mantine/dates/styles.css";

import { ReactProvider } from "@/lib/reactProvider";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactProvider>{children}</ReactProvider>
      </body>
    </html>
  );
}
