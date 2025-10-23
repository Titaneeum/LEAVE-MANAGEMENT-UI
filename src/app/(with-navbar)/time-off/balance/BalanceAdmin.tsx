"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Text,
  Title,
  Box,
  Group,
  Progress,
  Avatar,
  Input,
  Select,
  Grid,
  Divider,
} from "@mantine/core";
import { motion } from "framer-motion";
import {
  IconCalendarStats,
  IconHeart,
  IconSun,
  IconSearch,
} from "@tabler/icons-react";

export default function BalanceAdmin() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const [staffList, setStaffList] = useState<
    {
      id: string;
      name: string;
      avatar?: string;
      leaves: { type: string; total: number; used: number; color: string }[];
    }[]
  >([]);

  useEffect(() => {
    // Contoh data dummy — nanti boleh fetch dari backend
    setStaffList([
      {
        id: "EMP001",
        name: "Aiman Hakim",
        avatar: "/images/default-avatar.png",
        leaves: [
          { type: "Annual Leave", total: 14, used: 5, color: "blue" },
          { type: "Sick Leave", total: 10, used: 2, color: "green" },
          { type: "Emergency Leave", total: 5, used: 1, color: "red" },
        ],
      },
      {
        id: "EMP002",
        name: "Nabila Farah",
        avatar: "/images/default-avatar.png",
        leaves: [
          { type: "Annual Leave", total: 14, used: 7, color: "blue" },
          { type: "Sick Leave", total: 10, used: 4, color: "green" },
          { type: "Emergency Leave", total: 5, used: 0, color: "red" },
        ],
      },
      {
        id: "EMP003",
        name: "Daniel Rizwan",
        avatar: "/images/default-avatar.png",
        leaves: [
          { type: "Annual Leave", total: 14, used: 2, color: "blue" },
          { type: "Sick Leave", total: 10, used: 1, color: "green" },
          { type: "Emergency Leave", total: 5, used: 1, color: "red" },
        ],
      },
    ]);
  }, []);

  const filteredStaff = staffList.filter((staff) => {
    const matchSearch =
      staff.name.toLowerCase().includes(search.toLowerCase()) ||
      staff.id.toLowerCase().includes(search.toLowerCase());

    const matchFilter = !filter || staff.leaves.some((l) => l.type === filter);

    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-8 text-gray-100">
      {/* HEADER */}
      <Group justify="space-between" mb="lg">
        <Box>
          <Title order={3} className="text-blue-400 tracking-wide">
            Leave Balance (Admin View)
          </Title>
          <Text size="sm" className="text-gray-400">
            View and filter all staff leave balances
          </Text>
        </Box>
      </Group>

      {/* SEARCH & FILTER */}
      <Group mb="lg" justify="space-between" grow>
        <Input
          icon={<IconSearch size={16} />}
          placeholder="Search by staff name or ID"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          radius="md"
          className="bg-[#1e293b] text-white"
        />
        <Select
          placeholder="Filter by leave type"
          data={["Annual Leave", "Sick Leave", "Emergency Leave"]}
          clearable
          value={filter}
          onChange={setFilter}
          radius="md"
          className="bg-[#1e293b]"
        />
      </Group>

      <Divider my="md" color="gray.7" />

      {/* STAFF LIST */}
      <Grid gutter="lg">
        {filteredStaff.map((staff, index) => (
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }} key={staff.id}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                shadow="md"
                radius="xl"
                className="bg-[#1e293b]/90 border border-slate-700 hover:border-blue-500 transition-all duration-200 h-full"
              >
                <Group align="center" mb="sm">
                  <Avatar
                    src={staff.avatar}
                    size={60}
                    radius="xl"
                    className="ring-2 ring-blue-500"
                  />
                  <Box>
                    <Text fw={600} size="md" className="text-white">
                      {staff.name}
                    </Text>
                    <Text size="sm" className="text-gray-400">
                      {staff.id}
                    </Text>
                  </Box>
                </Group>

                <Divider my="sm" color="gray.7" />

                {staff.leaves.map((leave, i) => {
                  const percentage = (leave.used / leave.total) * 100;
                  const Icon =
                    leave.type === "Annual Leave"
                      ? IconCalendarStats
                      : leave.type === "Sick Leave"
                        ? IconHeart
                        : IconSun;

                  return (
                    <Box key={i} mb="sm">
                      <Group justify="space-between" mb={4}>
                        <Group>
                          <Box
                            className={`bg-${leave.color}-500/20 p-2 rounded-full`}
                          >
                            <Icon
                              size={18}
                              className={`text-${leave.color}-400`}
                            />
                          </Box>
                          <Text size="sm">{leave.type}</Text>
                        </Group>
                        <Text size="sm" className="text-gray-300">
                          {leave.total - leave.used} days left
                        </Text>
                      </Group>
                      <Progress
                        value={percentage}
                        color={leave.color}
                        radius="xl"
                        size="sm"
                      />
                    </Box>
                  );
                })}
              </Card>
            </motion.div>
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
}
