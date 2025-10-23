"use client";

import {
  Text,
  Paper,
  Group,
  Grid,
  Table,
  ScrollArea,
  Badge,
  Divider,
} from "@mantine/core";
import { IconCalendar, IconCheck, IconClock, IconX } from "@tabler/icons-react";
import NavbarPage from "@/components/pages/request-time-off/NavbarPage";
import { useEffect, useState } from "react";

export default function StaffDashboard() {
  const stats = [
    { label: "Total Leave Requests", value: 12, icon: IconCalendar },
    { label: "Approved Leaves", value: 8, icon: IconCheck },
    { label: "Pending Requests", value: 3, icon: IconClock },
    { label: "Rejected Requests", value: 1, icon: IconX },
  ];

  const recentRequests = [
    {
      id: "1",
      date: "2025-10-10",
      status: "Approved",
      duration: "2 days",
    },
    {
      id: "2",
      date: "2025-10-12",
      status: "Pending",
      duration: "1 day",
    },
    {
      id: "3",
      date: "2025-10-18",
      status: "Rejected",
      duration: "3 days",
    },
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

  return (
    <NavbarPage>
      <div className="min-h-screen ">
        <div className="max-w-6xl mx-auto space-y-8 px-4">
          {/* Header */}
          <div>
            <Text className="text-2xl font-semibold text-white mb-1">
              Welcome , {username || "Staff"}!
            </Text>
            <Text color="dimmed" size="sm">
              Overview of your leave and time-off requests
            </Text>
          </div>

          {/* Stats Section */}
          <Grid>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Grid.Col key={index} span={{ base: 6, sm: 3 }}>
                  <Paper
                    radius="lg"
                    className="p-4 bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 transition-all duration-200"
                    shadow="sm"
                  >
                    <Group justify="space-between" align="flex-start">
                      <div>
                        <Text size="xs" color="dimmed">
                          {stat.label}
                        </Text>
                        <Text fw={700} size="xl" className="text-white mt-1">
                          {stat.value}
                        </Text>
                      </div>
                      <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <Icon className="text-indigo-400" size={20} />
                      </div>
                    </Group>
                  </Paper>
                </Grid.Col>
              );
            })}
          </Grid>

          <Divider my="sm" color="dimmed" />

          {/* Recent Requests */}
          <Paper
            shadow="sm"
            radius="lg"
            className="p-6 bg-slate-900/60 border border-slate-800"
          >
            <Text className="text-lg font-semibold text-white mb-4">
              Recent Leave Requests
            </Text>

            <ScrollArea>
              <Table
                highlightOnHover
                verticalSpacing="md"
                className="text-gray-300"
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Duration</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {recentRequests.map((req, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>{req.id}</Table.Td>
                      <Table.Td>{req.date}</Table.Td>
                      <Table.Td>{req.duration}</Table.Td>
                      <Table.Td>{getStatusBadge(req.status)}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Paper>
        </div>
      </div>
    </NavbarPage>
  );
}
