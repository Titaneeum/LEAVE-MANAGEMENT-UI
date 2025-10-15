"use client";
import DashboardShell from "./dashboard/DashboardShell";

export default function NavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
