"use client";

import React, { useState, useEffect } from "react";
import {
  AppShell,
  Avatar,
  Box,
  Burger,
  Group,
  NavLink,
  Text,
} from "@mantine/core";
import { IconGauge, IconHome, IconLogout } from "@tabler/icons-react";

export default function RequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const storedName = localStorage.getItem("user_name");
    if (storedName) setUsername(storedName);
  }, []);

  const handleSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      console.error("user_id not found in localStorage");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("prof_id", userId);

    const res = await fetch("/api/profile/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    console.log("File saved at:", data.url);
  };

  const navItems = [
    { icon: IconHome, label: "Home", link: "/time-off/request" },
    { icon: IconGauge, label: "Dashboard", link: "/dashboard" },
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
        <Group h="100%" px="md" className="bg-black text-white" justify="apart">
          <Group>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color="white"
            />
            <Text fw={700}>Leave Management</Text>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" className="bg-white">
        <Box
          mb="lg"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <label htmlFor="profile-input" style={{ cursor: "pointer" }}>
            <Avatar
              radius="xl"
              size={80}
              src={preview || "/images/default-avatar.png"}
            />
          </label>
          <input
            id="profile-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleSelectFile}
          />

          {/* username bawah avatar */}
          <Text mt="sm" c="black" fw={500}>
            {username || "USERNAME"}
          </Text>
        </Box>

        <Box>
          {navItems.map((item, i) => (
            <NavLink
              key={item.label}
              href={item.link}
              label={item.label}
              active={i === active}
              leftSection={<item.icon size={16} stroke={1.5} />}
              onClick={() => setActive(i)}
              styles={{
                label: { color: "black" },
              }}
            />
          ))}
        </Box>
      </AppShell.Navbar>

      <AppShell.Main className="w-[100dvw]">{children}</AppShell.Main>
    </AppShell>
  );
}
