"use client";
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
