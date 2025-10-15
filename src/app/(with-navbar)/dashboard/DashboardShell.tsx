"use client";

import { AppShell, Burger, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 240,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      {/* Navbar atas */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Text fw={700}>Admin Dashboard</Text>
          </Group>
        </Group>
      </AppShell.Header>

      {/* Sidebar kiri */}
      <AppShell.Navbar p="md">
        <Text fw={600}>Menu</Text>
        <div className="flex flex-col gap-2 mt-4">
          <a href="/dashboard"> Home</a>
          <a href="/dashboard/leave-time-off"> Leave Request</a>
          <a href="/dashboard/approval"> Approval</a>
          <a href="/dashboard/settings"> Settings</a>
        </div>
      </AppShell.Navbar>

      {/* Isi kandungan page */}
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
