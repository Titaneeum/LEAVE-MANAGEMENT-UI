"use client";

import React, { useState, useEffect } from "react";
import {
  AppShell,
  Avatar,
  Box,
  Burger,
  Button,
  Divider,
  Group,
  Modal,
  NavLink,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconAlignBoxLeftTop,
  IconGauge,
  IconLogout,
  IconCalendarStats,
} from "@tabler/icons-react";

export default function NavbarPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [logoutOpen, setLogoutOpen] = useState(false);

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
    if (!userId) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("prof_id", userId);

    try {
      const res = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("File saved at:", data.url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const navItems = [
    { icon: IconGauge, label: "Dashboard", link: "/dashboard" },
    {
      icon: IconAlignBoxLeftTop,
      label: "Request Page",
      link: "/time-off/request",
    },
    {
      icon: IconCalendarStats,
      label: "Leave Balance",
      link: "/time-off/balance",
    },
    { icon: IconLogout, label: "Logout", link: "/login" },
  ];

  const handleNavClick = (item: (typeof navItems)[0]) => {
    if (item.label === "Logout") {
      setLogoutOpen(true);
      return;
    }

    if (item.label === "Dashboard") {
      const role = localStorage.getItem("user_role");
      if (role === "superduperadmin") {
        window.location.href = "/admin/AdminTeamReq";
      } else {
        window.location.href = "/dashboard";
      }
    } else {
      window.location.href = item.link;
    }

    if (window.innerWidth < 768) setOpened(false);
  };

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
      {/* HEADER */}
      <AppShell.Header className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] shadow-md">
        <Group h="100%" px="md" justify="apart">
          <Group>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color="white"
            />
            <Text fw={700} c="white" size="lg" className="tracking-wide">
              Leave Management
            </Text>
          </Group>
        </Group>
      </AppShell.Header>

      {/* NAVBAR */}
      <AppShell.Navbar
        p="md"
        className="bg-[#1e293b] text-gray-100 shadow-lg border-r border-gray-700"
      >
        {/* PROFILE */}
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
              className="ring-2 ring-blue-500 hover:ring-blue-400 transition-all duration-200"
            />
          </label>
          <input
            id="profile-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleSelectFile}
          />
          <Text mt="sm" fw={500} size="md" className="text-white tracking-wide">
            {username || "USERNAME"}
          </Text>
        </Box>

        <Divider my="sm" color="gray.6" />

        {/* NAV LINKS */}
        <Box>
          {navItems.map((item, i) => (
            <Tooltip label={item.label} position="right" key={item.label}>
              <NavLink
                label={item.label}
                active={i === active}
                leftSection={<item.icon size={18} stroke={1.2} />}
                onClick={() => {
                  setActive(i);
                  handleNavClick(item);
                }}
                className={`relative rounded-lg mb-1 transition-all duration-150 ${
                  i === active ? "bg-[#334155]" : "hover:bg-[#334155]"
                }`}
                styles={{
                  label: {
                    color: i === active ? "#60a5fa" : "white",
                    fontWeight: i === active ? 600 : 400,
                  },
                  root: { padding: "10px 12px" },
                }}
              >
                {i === active && (
                  <Box className="absolute left-0 top-0 h-full w-1 bg-blue-400 rounded-r-md" />
                )}
              </NavLink>
            </Tooltip>
          ))}
        </Box>

        {/* FOOTER */}
        <Box mt="auto" pt="md" className="text-xs text-gray-400 text-center">
          © 2025 Leave Management System
        </Box>
      </AppShell.Navbar>

      {/* MAIN CONTENT */}
      <AppShell.Main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-gray-100">
        {children}
      </AppShell.Main>

      {/* LOGOUT MODAL */}
      <Modal
        opened={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title="Confirm Logout"
        centered
      >
        <Text>Are you sure you want to log out?</Text>
        <Group mt="md" justify="flex-end">
          <Button variant="default" onClick={() => setLogoutOpen(false)}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            Logout
          </Button>
        </Group>
      </Modal>
    </AppShell>
  );
}
