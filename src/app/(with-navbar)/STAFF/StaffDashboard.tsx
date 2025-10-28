"use client";

import {
  Text,
  Paper,
  Group,
  Grid,
  Table,
  ScrollArea,
  Badge,
  Stack,
  Button,
  RingProgress,
  Input,
  Select,
} from "@mantine/core";
import {
  IconCalendar,
  IconCheck,
  IconClock,
  IconX,
  IconPlus,
  IconRefresh,
} from "@tabler/icons-react";
import NavbarPage from "@/components/pages/request-time-off/NavbarPage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StaffDashboard() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("All");
  const [typeFilter, setTypeFilter] = useState<string | null>("All");

  const allRequests = [
    {
      id: "1",
      date: "2025-10-10",
      status: "Approved",
      duration: "2 days",
      type: "Annual",
    },
    {
      id: "2",
      date: "2025-10-12",
      status: "Pending",
      duration: "1 day",
      type: "Sick",
    },
    {
      id: "3",
      date: "2025-10-18",
      status: "Rejected",
      duration: "3 days",
      type: "Emergency",
    },
    {
      id: "4",
      date: "2025-10-20",
      status: "Approved",
      duration: "1 day",
      type: "Time Off",
    },
    {
      id: "5",
      date: "2025-10-23",
      status: "Pending",
      duration: "2 days",
      type: "Annual",
    },
  ];

  const filteredRequests = allRequests.filter((req) => {
    const matchSearch =
      req.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.duration.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "All" || req.status === statusFilter;
    const matchType = typeFilter === "All" || req.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const stats = [
    { label: "Total Leave Requests", value: 12, icon: IconCalendar },
    { label: "Approved Leaves", value: 8, icon: IconCheck },
    { label: "Pending Requests", value: 3, icon: IconClock },
    { label: "Rejected Requests", value: 1, icon: IconX },
  ];

  const leaveBalance = [
    { type: "Annual Leave", used: 8, total: 14, color: "indigo" },
    { type: "Sick Leave", used: 3, total: 7, color: "teal" },
    { type: "Emergency Leave", used: 1, total: 5, color: "orange" },
    { type: "Time Off", used: 2, total: 10, color: "cyan" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge color="green">{status}</Badge>;
      case "Pending":
        return <Badge color="yellow">{status}</Badge>;
      case "Rejected":
        return <Badge color="red">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const storedName = localStorage.getItem("user_name");
    if (storedName) setUsername(storedName);
  }, []);

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setTypeFilter("All");
  };

  return (
    <NavbarPage>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
          {/* Header */}
          <div>
            <Text className="text-3xl font-semibold text-white mb-1">
              Welcome, {username || "Staff"}!
            </Text>
            <Text color="dimmed" size="sm">
              Overview of your leave and time-off status
            </Text>
          </div>

          {/* ✅ Stats Section */}
          <Grid gutter="md">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Grid.Col key={index} span={{ base: 6, sm: 3 }}>
                  <Paper
                    radius="lg"
                    className="p-5 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all duration-200"
                    shadow="sm"
                  >
                    <Group justify="space-between" align="center">
                      <div>
                        <Text size="sm" color="dimmed">
                          {stat.label}
                        </Text>
                        <Text fw={700} size="xl" className="text-white mt-1">
                          {stat.value}
                        </Text>
                      </div>
                      <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <Icon className="text-indigo-400" size={22} />
                      </div>
                    </Group>
                  </Paper>
                </Grid.Col>
              );
            })}
          </Grid>

          {/* Lower Section */}
          <Grid gutter="xl">
            {/* Left: Recent Requests */}
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Paper
                shadow="sm"
                radius="lg"
                className="p-6 bg-slate-900 border border-slate-800"
              >
                <Group justify="space-between" align="center" mb="md">
                  <Text className="text-lg font-semibold text-white">
                    Recent Leave Requests
                  </Text>
                  <Button
                    size="xs"
                    radius="md"
                    leftSection={<IconPlus size={14} />}
                    className="bg-indigo-600 hover:bg-indigo-500"
                    onClick={() => router.push("/time-off/request")}
                  >
                    Add Request
                  </Button>
                </Group>

                {/* Search & Filter */}
                <Group mb="md" gap="sm" grow>
                  <Input
                    placeholder="Search by date or duration..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                    radius="md"
                    className="text-white"
                  />
                  <Select
                    placeholder="Filter by status"
                    data={["All", "Approved", "Pending", "Rejected"]}
                    value={statusFilter}
                    onChange={setStatusFilter}
                    radius="md"
                  />
                  <Select
                    placeholder="Filter by leave type"
                    data={["All", "Annual", "Sick", "Emergency", "Time Off"]}
                    value={typeFilter}
                    onChange={setTypeFilter}
                    radius="md"
                  />
                  <Button
                    size="xs"
                    radius="md"
                    variant="light"
                    color="gray"
                    leftSection={<IconRefresh size={14} />}
                    onClick={handleResetFilters}
                  >
                    Reset
                  </Button>
                </Group>

                {/* Scrollable Table */}
                <ScrollArea h={280} type="always">
                  <Table
                    highlightOnHover
                    verticalSpacing="sm"
                    className="text-gray-300"
                  >
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>ID</Table.Th>
                        <Table.Th>Date</Table.Th>
                        <Table.Th>Duration</Table.Th>
                        <Table.Th>Type</Table.Th>
                        <Table.Th>Status</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {filteredRequests.length > 0 ? (
                        filteredRequests.map((req, index) => (
                          <Table.Tr key={index}>
                            <Table.Td>{req.id}</Table.Td>
                            <Table.Td>{req.date}</Table.Td>
                            <Table.Td>{req.duration}</Table.Td>
                            <Table.Td>{req.type}</Table.Td>
                            <Table.Td>{getStatusBadge(req.status)}</Table.Td>
                          </Table.Tr>
                        ))
                      ) : (
                        <Table.Tr>
                          <Table.Td colSpan={5}>
                            <Text ta="center" c="dimmed">
                              No matching requests found
                            </Text>
                          </Table.Td>
                        </Table.Tr>
                      )}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </Paper>
            </Grid.Col>

            {/* Right: Leave Balance */}
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Paper
                shadow="sm"
                radius="lg"
                className="p-6 bg-slate-900 border border-slate-800"
              >
                <Text className="text-lg font-semibold text-white mb-4">
                  Leave Balance Summary
                </Text>

                <Stack>
                  {leaveBalance.map((leave, index) => (
                    <Group
                      key={index}
                      justify="space-between"
                      align="center"
                      className="py-1"
                    >
                      <div>
                        <Text className="text-white font-medium">
                          {leave.type}
                        </Text>
                        <Text size="xs" color="dimmed">
                          {leave.used} of {leave.total} days used
                        </Text>
                      </div>

                      <RingProgress
                        size={60}
                        thickness={6}
                        sections={[
                          {
                            value: (leave.used / leave.total) * 100,
                            color: leave.color,
                          },
                        ]}
                        label={
                          <Text size="xs" color="white" ta="center">
                            {Math.round((leave.used / leave.total) * 100)}%
                          </Text>
                        }
                      />
                    </Group>
                  ))}
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </div>
      </div>
    </NavbarPage>
  );
}
