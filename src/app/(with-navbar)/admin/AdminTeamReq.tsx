"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Table,
  Badge,
  Group,
  Text,
  Paper,
  ScrollArea,
  Tooltip,
  Modal,
  Button,
  Input,
  Select,
  Textarea,
  Grid,
  Avatar,
  Divider,
} from "@mantine/core";
import {
  IconEye,
  IconEdit,
  IconPaperclip,
  IconSearch,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useDisclosure } from "@mantine/hooks";
import { data } from "framer-motion/client";

// Centralized color config
const statusColors: Record<string, string> = {
  pending: "yellow",
  approved: "green",
  rejected: "red",
};

// Mock data kept as is
const mockData: any[] = [
  {
    leave_id: 2,
    staff_name: "Aina Yusuf",
    leave_policy: "annual_leave",
    isHalf_Day: 0,
    date_start: "2025-09-18T00:00:00.000Z",
    date_end: "2025-09-19T00:00:00.000Z",
    reason: "Family emergency",
    created_by: 2,
    created_at: "2025-09-29T06:49:32.000Z",
    updated_by: 3,
    updated_at: "2025-09-29T06:54:24.000Z",
    status: "approved",
    rejected_reason: "N/A",
    supp_document: "medical-proof.pdf",
  },
  {
    leave_id: 5,
    staff_name: "Hakim Rahman",
    leave_policy: "annual_leave",
    isHalf_Day: 1,
    date_start: "2025-09-18T00:00:00.000Z",
    date_end: "2025-09-18T00:00:00.000Z",
    reason: "Personal errand",
    created_by: 5,
    created_at: "2025-09-30T01:22:39.000Z",
    updated_by: 3,
    updated_at: "2025-09-30T01:51:48.000Z",
    status: "rejected",
    rejected_reason: "Insufficient justification",
    supp_document: "",
  },
  {
    leave_id: 10,
    staff_name: "Farah Nabila",
    leave_policy: "sick_leave",
    isHalf_Day: 0,
    date_start: "2025-10-02T16:00:00.000Z",
    date_end: "2025-10-04T16:00:00.000Z",
    reason: "Fever and medical rest",
    created_by: 6,
    created_at: "2025-10-02T07:43:28.000Z",
    updated_by: null,
    updated_at: "2025-10-02T07:43:28.000Z",
    status: "pending",
    rejected_reason: null,
    supp_document: "mc_slip.pdf",
  },

  {
    timeOff_id: 9,
    staff_name: "Fahmi Nazri",
    type: "time_off",
    date_start: "2025-09-18T00:00:00.000Z",
    date_end: "2025-09-18T00:00:00.000Z",
    reason: "Personal matter",
    created_by: 2,
    created_at: "2025-09-29T06:59:09.000Z",
    updated_by: 3,
    updated_at: "2025-09-29T07:00:35.000Z",
    status: "rejected",
    rejected_reason: "tak boleh",
  },
];

export default function AdminTeamReq() {
  const [opened, { open, close }] = useDisclosure(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
    } else {
      console.log("⚠️ No username found in localStorage");
    }

    const timer = setTimeout(() => {
      console.log("Timer done");
    }, 2000);
  }, []);

  const [editModal, setEditModal] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  //  Helper to calculate total days
  const getTotalDays = (start: string, end: string, half: number) => {
    const safeHalf = half ?? 0;
    const diff = dayjs(end).diff(dayjs(start), "day") + 1;
    return safeHalf ? "0.5 day" : `${diff} day${diff > 1 ? "s" : ""}`;
  };

  //  Clean filtered logic for clarity
  const filteredData = useMemo(() => {
    return mockData.filter((item) => {
      const matchStatus =
        statusFilter === "all" || item.status === statusFilter;
      const matchSearch =
        item.staff_name.toLowerCase().includes(search.toLowerCase()) ||
        item.leave_policy?.toLowerCase().includes(search.toLowerCase()) ||
        item.type?.toLowerCase().includes(search.toLowerCase());
      const matchType =
        typeFilter === "all"
          ? true
          : typeFilter === "leave"
            ? !!item.leave_policy
            : item.type === "time_off";
      return matchStatus && matchSearch && matchType;
    });
  }, [statusFilter, search, typeFilter]);

  //  View modal data
  const handleView = (item: any) => {
    setSelected(item);
    open();
  };

  //  Table rows
  const rows = filteredData.map((item) => (
    <Table.Tr
      key={item.leave_id || item.timeOff_id}
      className="hover:bg-slate-700/40 transition-all duration-200"
    >
      <Table.Td className="font-medium text-gray-100">
        {item.staff_name}
      </Table.Td>
      <Table.Td className="capitalize text-gray-300">
        {item.type === "time_off"
          ? "Time Off"
          : item.leave_policy?.replace("_", " ") || "N/A"}
      </Table.Td>
      <Table.Td className="text-gray-300">
        {dayjs(item.date_start).format("DD/MM/YYYY")}
      </Table.Td>
      <Table.Td className="text-gray-300">
        {getTotalDays(item.date_start, item.date_end, item.isHalf_Day)}
      </Table.Td>
      <Table.Td className="text-gray-400">{item.reason}</Table.Td>
      <Table.Td>
        <Badge
          color={statusColors[item.status]}
          variant="filled"
          radius="sm"
          className="capitalize"
        >
          {item.status}
        </Badge>
      </Table.Td>

      {/*  Action icons refined with tooltip */}
      <Table.Td>
        <Group gap="xs">
          <Tooltip label="View Request" withArrow position="top">
            <button
              onClick={(e) => {
                const target = e.currentTarget; // simpan element sebelum timeout
                target.classList.add("animate-eye-pop");

                setTimeout(() => {
                  if (target) target.classList.remove("animate-eye-pop"); // check dulu baru remove
                  handleView(item);
                }, 400);
              }}
              className={`group relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 
      ${
        item.status === "approved"
          ? "bg-green-500/10 hover:bg-green-500/20"
          : item.status === "pending"
            ? "bg-yellow-500/10 hover:bg-yellow-500/20"
            : "bg-blue-500/10 hover:bg-blue-500/20"
      } hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20`}
            >
              <IconEye
                size={18}
                stroke={1.8}
                className="text-blue-400 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6"
              />

              {/* glow ring on hover */}
              <span className="absolute inset-0 rounded-full bg-blue-400/0 group-hover:bg-blue-400/10 blur-md transition-all duration-300"></span>

              {/* subtle pulse on click */}
              <span className="absolute inset-0 rounded-full border border-blue-400/50 opacity-0 group-[.animate-eye-pop]:animate-eye-pulse"></span>
            </button>
          </Tooltip>

          <Tooltip label="View Attachment">
            <IconPaperclip
              size={18}
              className={`${
                item.supp_document
                  ? "text-gray-400 hover:text-green-500 cursor-pointer"
                  : "text-gray-500/40 cursor-not-allowed"
              }`}
            />
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-gray-100 p-6">
      {/*  Title Section */}
      <div className="mb-8">
        <Text className="text-3xl font-semibold tracking-tight text-blue-100">
          Welcome, {username || "User"}!
        </Text>

        <Text className="text-gray-400 mt-1 text-sm">
          Here's the latest overview of your team's requests.
        </Text>
      </div>

      {/*  Summary Cards */}
      <Group grow className="mb-8">
        {[
          { label: "Total", color: "text-blue-400", count: mockData.length },
          {
            label: "Approved",
            color: "text-green-400",
            count: mockData.filter((d) => d.status === "approved").length,
          },
          {
            label: "Pending",
            color: "text-yellow-400",
            count: mockData.filter((d) => d.status === "pending").length,
          },
          {
            label: "Rejected",
            color: "text-red-400",
            count: mockData.filter((d) => d.status === "rejected").length,
          },
        ].map((stat) => (
          <Paper
            key={stat.label}
            p="md"
            radius="lg"
            shadow="xl"
            className="bg-slate-800/60 border border-slate-700/60 backdrop-blur-lg hover:shadow-blue-900/20 transition-all duration-300 transform hover:-translate-y-1"
          >
            <Text size="sm" className="text-gray-400">
              {stat.label}
            </Text>
            <Text fw={700} size="xl" className={`${stat.color}`}>
              {stat.count}
            </Text>
          </Paper>
        ))}
      </Group>

      {/*  Filter Section */}
      <Group
        gap="sm"
        className="mb-6 bg-slate-900/50 p-3 rounded-lg border border-slate-800/60"
      >
        {["all", "leave", "time_off"].map((t) => (
          <Button
            key={t}
            variant={typeFilter === t ? "filled" : "light"}
            color="blue"
            onClick={() => setTypeFilter(t)}
          >
            {t === "all" ? "All" : t === "leave" ? "Leave" : "Time Off"}
          </Button>
        ))}
      </Group>

      {/*  Table Section */}
      <Paper
        withBorder
        radius="lg"
        shadow="xl"
        className="p-4 bg-slate-800/70 border border-slate-700 backdrop-blur-md"
      >
        <Group justify="space-between" className="mb-4">
          <Input
            placeholder="Search by Staff or Type..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            className="w-64 text-white"
          />
          <Select
            placeholder="Filter by status"
            data={[
              { label: "All", value: "all" },
              { label: "Pending", value: "pending" },
              { label: "Approved", value: "approved" },
              { label: "Rejected", value: "rejected" },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-48"
          />
        </Group>

        <ScrollArea>
          <Table
            highlightOnHover
            className="min-w-[850px] text-sm [&_tr:hover]:bg-slate-700/30 transition-all"
          >
            <Table.Thead>
              <Table.Tr className="bg-slate-900/80 text-blue-100 uppercase text-xs tracking-wide">
                <Table.Th>Staff</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Date Start</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th>Reason</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>

      {/*  View Details Modal */}
      {/*  Polished View Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={null} // buang default title
        centered
        size="lg"
        overlayProps={{
          backgroundOpacity: 0.65,
          blur: 6,
        }}
        classNames={{
          content:
            "bg-slate-900/95 border border-slate-700/70 rounded-2xl shadow-2xl text-white backdrop-blur-xl",
        }}
      >
        {selected && (
          <div className="p-6 space-y-5">
            {/* HEADER SECTION */}
            <div className="flex items-center gap-4 border-b border-slate-700/60 pb-4">
              <Avatar
                src={selected.user?.profile_pic || "/images/default-avatar.png"}
                size={70}
                radius="xl"
                className="ring-2 ring-blue-500/50 shadow-md"
              />
              <div>
                <Text
                  fw={700}
                  size="xl"
                  className="text-blue-100 tracking-wide"
                >
                  {selected.staff_name || "Unknown Staff"}
                </Text>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    color={selected.type === "time_off" ? "cyan" : "blue"}
                    variant="filled"
                    radius="sm"
                  >
                    {selected.type === "time_off" ? "Time Off" : "Leave"}
                  </Badge>
                  <Badge color={statusColors[selected.status]} variant="light">
                    {selected.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* DETAILS GRID */}
            <Grid gutter="md">
              <Grid.Col span={6}>
                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60 hover:border-blue-500/50 transition-all">
                  <Text fw={500} size="sm" className="text-gray-400">
                    Date Start
                  </Text>
                  <Text fw={600} className="text-blue-100">
                    {selected?.date_start
                      ? dayjs(selected.date_start).format("DD MMM YYYY, h:mm A")
                      : "N/A"}
                  </Text>
                </div>
              </Grid.Col>

              <Grid.Col span={12}>
                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                  <Text fw={500} size="sm" className="text-gray-400 mb-1">
                    Reason
                  </Text>
                  <Text fw={500} className="text-gray-200 leading-relaxed">
                    {selected.reason || "No reason provided"}
                  </Text>
                </div>
              </Grid.Col>

              {selected.rejected_reason &&
                selected.rejected_reason !== "N/A" && (
                  <Grid.Col span={12}>
                    <div className="bg-red-900/30 p-3 rounded-lg border border-red-800/60 shadow-inner">
                      <Text fw={500} size="sm" className="text-red-200 mb-1">
                        Rejection Reason
                      </Text>
                      <Text fw={500} className="text-red-100 leading-relaxed">
                        {selected.rejected_reason}
                      </Text>
                    </div>
                  </Grid.Col>
                )}
            </Grid>

            {/* ATTACHMENT SECTION */}
            {selected.supp_document && (
              <div className="pt-3 border-t border-slate-700/60">
                <Text fw={500} mb={4} size="sm" className="text-gray-400">
                  Supporting Document
                </Text>
                <Button
                  component="a"
                  href={`/uploads/${selected.supp_document}`}
                  target="_blank"
                  leftSection={<IconPaperclip size={16} />}
                  variant="light"
                  color="blue"
                >
                  {selected.supp_document}
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
