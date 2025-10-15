"use client";

import { useMemo, useState } from "react";
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
  IconTemperature,
} from "@tabler/icons-react";
import dayjs from "dayjs";

import { useDisclosure } from "@mantine/hooks";
import { request } from "http";
// Mock data
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

const statusColors: Record<string, string> = {
  pending: "yellow",
  approved: "green",
  rejected: "red",
};

export default function AdminTeamReq() {
  const [editModal, setEditModal] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [department, setDepartment] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleView = (item: any) => {
    setSelected(item);
    open();
  };

  const handleEdit = (item: any) => {
    setSelected(item);
    setEditModal(true);
    setShowRejectReason(false);
    setRejectReason("");
  };

  //approve action
  const handleApprove = () => {
    console.log("Approved: ", selected.leave_id);
    setEditModal(false);
  };

  //show input
  const handleRejectClick = () => {
    setShowRejectInput(true);
  };

  //confirm reject
  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert("Please provide a rejected reason before confirming.");
      return;
    }
    console.log("Rejected:", {
      leave_id: selected.leave_id,
      reason: rejectReason,
    });
    setEditModal(false);
  };

  // Calculate total days
  const getTotalDays = (start: string, end: string, half: number) => {
    const safeHalf = half ?? 0;
    const diff = dayjs(end).diff(dayjs(start), "day") + 1;
    return safeHalf ? "0.5 day" : `${diff} day${diff > 1 ? "s" : ""}`;
  };

  const filteredData = useMemo(() => {
    return mockData.filter((item) => {
      const matchStatus =
        statusFilter === "all" || item.status === statusFilter;

      const matchSearch =
        item.staff_name.toLowerCase().includes(search.toLowerCase()) ||
        item.leave_policy?.toLowerCase().includes(search.toLowerCase()) ||
        item.type?.toLowerCase().includes(search.toLowerCase());

      const matchDept =
        !department || department === "All Department" || department === "OPS";

      const matchType =
        typeFilter === "all"
          ? true
          : typeFilter === "leave"
            ? !!item.leave_policy
            : item.type === "time_off";

      return matchStatus && matchSearch && matchDept && matchType;
    });
  }, [statusFilter, search, department, typeFilter]);

  const rows = filteredData.map((item) => (
    <Table.Tr key={item.leave_id || item.timeOff_id}>
      <Table.Td className="font-medium">{item.staff_name}</Table.Td>

      <Table.Td className="capitalize">
        {item.type === "time_off"
          ? "Time Off"
          : item.leave_policy?.replace("_", " ") || "N/A"}
      </Table.Td>

      {/* LEAVE layout */}
      {typeFilter === "leave" && (
        <>
          <Table.Td>{dayjs(item.date_start).format("DD/MM/YYYY")}</Table.Td>
          <Table.Td>
            {getTotalDays(item.date_start, item.date_end, item.isHalf_Day)}
          </Table.Td>
        </>
      )}

      {/* TIME OFF layout */}
      {typeFilter === "time_off" && (
        <>
          <Table.Td>
            {dayjs(item.date_start).format("h:mm A")} -{" "}
            {dayjs(item.date_end).format("h:mm A")}
          </Table.Td>
          <Table.Td>{dayjs(item.date_start).format("DD/MM/YYYY")}</Table.Td>
        </>
      )}

      {typeFilter === "all" && (
        <>
          <Table.Td>{dayjs(item.date_start).format("DD/MM/YYYY")}</Table.Td>
          <Table.Td>
            {getTotalDays(item.date_start, item.date_end, item.isHalf_Day)}
          </Table.Td>
        </>
      )}

      <Table.Td>{item.reason}</Table.Td>
      <Table.Td>
        <Badge
          color={statusColors[item.status]}
          variant="filled"
          className="capitalize"
        >
          {item.status}
        </Badge>
      </Table.Td>

      {/* Action buttons */}
      <Table.Td>
        <Group gap="xs">
          {item.status === "pending" ? (
            <>
              <Tooltip label="Edit Request">
                <IconEdit
                  size={18}
                  className="text-gray-500 hover:text-blue-600 cursor-pointer"
                  onClick={() => handleEdit(item)}
                />
              </Tooltip>
              <Tooltip label="View Attachment">
                <IconPaperclip
                  size={18}
                  className={`${
                    item.supp_document
                      ? "text-gray-500 hover:text-green-600 cursor-pointer"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                />
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip label="View Details">
                <IconEye
                  size={18}
                  className="text-gray-500 hover:text-blue-600 cursor-pointer"
                  onClick={() => handleView(item)}
                />
              </Tooltip>
              <Tooltip label="View Attachment">
                <IconPaperclip
                  size={18}
                  className={`${
                    item.supp_document
                      ? "text-gray-500 hover:text-green-600 cursor-pointer"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                />
              </Tooltip>
            </>
          )}
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className="min-h-screen w-full p-0 m-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-gray-100 overflow-x-hidden">
      <div className="mb-8">
        <Text className="text-3xl font-semibold tracking-tight text-blue-100">
          Team Requests
        </Text>
        <Text className="text-gray-400 mt-1 text-sm">
          Mange all leave requests effieciently
        </Text>
      </div>

      {/* Summary Cards */}
      <Group grow className="mb-6">
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
            className="bg-slate-800/60 border border-slate-700/60 backdrop-blur-xl shadpw-lg hover:shadow-blue-900/10 transition-all duration-300"
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

      {/* Filter Section */}
      <Group
        gap="sm"
        className="mb-6 bg-slate-900/50 p-3 rounded-lg border border-slate-800/60"
      >
        <Button
          variant={typeFilter === "all" ? "filled" : "light"}
          color="blue"
          onClick={() => setTypeFilter("all")}
        >
          All
        </Button>
        <Button
          variant={typeFilter === "leave" ? "filled" : "light"}
          color="blue"
          onClick={() => setTypeFilter("leave")}
        >
          Leave
        </Button>
        <Button
          variant={typeFilter === "time_off" ? "filled" : "light"}
          color="blue"
          onClick={() => setTypeFilter("time_off")}
        >
          Time Off
        </Button>
      </Group>

      {/* Table Section */}
      <Paper
        withBorder
        radius="lg"
        shadow="xl"
        className="p-4 bg-slate-800/70 border border-slate-700 backdrop-blur-md"
      >
        <Group justify="space-between" className="mb-3">
          <Input
            placeholder="Search by Staff or Leave Type..."
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
            className="min-w-[800px] text-sm border-none [&_td]:bordernone [&_tr:hover]:bg-slate-700/30 transtition-all"
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

      {/* View Details Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title="Request Details"
        centered
        size="lg"
        classNames={{
          content:
            "bg-slate-900/90 text-white border border-slate-700 backdrop-blur-lg",
          header: "text-gray-200 font-semibold",
        }}
      >
        {selected && (
          <ScrollArea h="70vh" scrollbarSize={6} type="always">
            <Paper
              radius="lg"
              shadow="xl"
              className="p-4 bg-slate-800/70 backdrop-blur-md border-none"
            >
              <Group mb="md" align="center">
                <Avatar
                  src={selected.user?.profile_pic || "/default-avatar.png"}
                  size={70}
                  radius="xl"
                />
                <div>
                  <Text fw={600} fz="lg" className="text-gray-100">
                    {selected.staff_name || "Unknown Staff"}
                  </Text>
                  <Badge color="blue" variant="light" mt={4}>
                    {selected.type === "time_off" ? "Time Off" : "Leave"}
                  </Badge>
                </div>
              </Group>

              <Divider mb="sm" />

              <Grid>
                <Grid.Col span={6}>
                  <Text fw={600} size="sm" className="text-gray-300">
                    Date Start
                  </Text>
                  <Text>
                    {dayjs(selected.date_start).format("DD/MM/YYYY, h:mm A")}
                  </Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text fw={600} size="sm" className="text-gray-300">
                    Date End
                  </Text>
                  <Text>
                    {dayjs(selected.date_end).format("DD/MM/YYYY, h:mm A")}
                  </Text>
                </Grid.Col>

                <Grid.Col span={6}>
                  <Text fw={600} size="sm" className="text-gray-300">
                    Reason
                  </Text>
                  <Text>{selected.reason}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text fw={600} size="sm" className="text-gray-300">
                    Status
                  </Text>
                  <Badge color={statusColors[selected.status]}>
                    {selected.status}
                  </Badge>
                </Grid.Col>
              </Grid>
            </Paper>
          </ScrollArea>
        )}
      </Modal>
    </div>
  );
}
