import type { Metadata } from "next";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import "./globals.css";
// import '@mantine/core/styles.css';
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import { ReactProvider } from "@/lib/reactProvider";

export const metadata: Metadata = {
  title: "SAFWA Lab Report",
  description: "WebApp for lab report submission",
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
          <div className="flex w-screen h-screen overflow-hidden bg-gray-100">
            {children}
          </div>
        </ReactProvider>
      </body>
    </html>
  );
}
