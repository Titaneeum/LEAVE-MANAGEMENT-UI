"use client";
import NavbarLayout from "@/app/(with-navbar)/NavbarLayout";

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
import { FileWithPath } from "@mantine/dropzone";
import {
  IconAlignBoxLeftTop,
  IconGauge,
  IconLogout,
} from "@tabler/icons-react";
import { useData } from "../../../useData";

export default function layout({ children }: { children: React.ReactNode }) {
  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [timeOffType, setTimeOffType] = useState<string>("By Hours");
  const [halfDaySession, setHalfDaySession] = useState<string | null>(null);
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [leaveType, setLeaveType] = useState<string>("");

  const { mutate: AddTimeOff, isPending: isAddTimeOffPending } =
    useData().set.timeOff.add;
  const { mutate: UpdateTimeOff, isPending: isUpdateTimeOffPending } =
    useData().set.timeOff.update;
  const { mutate: DeleteTimeOff, isPending: isDeleteTimeOffPending } =
    useData().set.timeOff.delete;

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
    { icon: IconLogout, label: "Logout" },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 260,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding={0}
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

      <AppShell.Navbar
        p="md"
        className="bg-slate-900 text-gray-100 brorder-r border-slate-700"
      >
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
              leftSection={<item.icon size={16} stroke={0.5} />}
              onClick={() => setActive(i)}
              styles={{
                label: { color: "black" },
              }}
            />
          ))}
        </Box>
      </AppShell.Navbar>

      <AppShell.Main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-gray-100">
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
