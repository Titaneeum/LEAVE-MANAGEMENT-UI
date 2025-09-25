"use client";

import { AppShell, Box, Burger, Group, NavLink, Text } from "@mantine/core";
import { IconGauge, IconHome, IconLogout } from "@tabler/icons-react";
import * as React from "react";

export default function RequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, setOpened] = React.useState(false);
  const [active, setActive] = React.useState(0);

  const navItems = [
    { icon: IconHome, label: "Home", link: "/time-off/request" },
    {
      icon: IconGauge,
      label: "Dashboard",
      description: "Overview of data",
      link: "/dashboard",
    },
    { icon: IconLogout, label: "Logout" },
  ];
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 260,
        breakpoint: "sm",
        collapsed: { mobile: !opened, desktop: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
          />
          <Text fw={700}>Leave Management</Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Box>
          {navItems.map((item, i) => (
            <NavLink
              href={item?.link}
              key={item.label}
              label={item.label}
              description={item.description}
              active={i === active}
              leftSection={<item.icon size={16} stroke={1.5} />}
              onClick={() => setActive(i)}
            />
          ))}
        </Box>
      </AppShell.Navbar>

      {/* <AppShell.Main>
        <div>{children}</div>
      </AppShell.Main> */}
      <div className="w-[100dvw]">{children}</div>
    </AppShell>
  );
}
