import type { Metadata } from "next";
import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import theme from "./theme";
import "@mantine/dates/styles.css";
import "./globals.css";
import { ReactProvider } from "@/lib/reactProvider";

export const metadata: Metadata = {
  title: "Leave Management System",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className="antialiased">
        <ReactProvider>
          <MantineProvider theme={theme}>{children}</MantineProvider>
        </ReactProvider>
      </body>
    </html>
  );
}
