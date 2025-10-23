"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  Group,
  Text,
  Title,
  Loader,
  Paper,
  Divider,
} from "@mantine/core";
import { motion } from "framer-motion";

export default function BalanceStaff() {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState({
    annual: 10,
    emergency: 3,
    medical: 5,
    replacement: 1,
  });
  const [used, setUsed] = useState({
    annual: 4,
    emergency: 1,
    medical: 2,
    replacement: 0,
  });

  useEffect(() => {
    // simulate fetching staff-specific leave data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader size="lg" color="blue" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 max-w-3xl mx-auto"
    >
      <Title order={2} className="text-center mb-6 text-blue-400">
        My Leave Balance
      </Title>

      <Paper
        shadow="md"
        p="md"
        radius="lg"
        withBorder
        className="bg-slate-900 text-white"
      >
        <Group justify="apart" mb="xs">
          <Text fw={500}>Annual Leave</Text>
          <Text>
            {used.annual}/{balance.annual} days used
          </Text>
        </Group>
        <Divider my="sm" />

        <Group justify="apart" mb="xs">
          <Text fw={500}>Emergency Leave</Text>
          <Text>
            {used.emergency}/{balance.emergency} days used
          </Text>
        </Group>
        <Divider my="sm" />

        <Group justify="apart" mb="xs">
          <Text fw={500}>Medical Leave</Text>
          <Text>
            {used.medical}/{balance.medical} days used
          </Text>
        </Group>
        <Divider my="sm" />

        <Group justify="apart">
          <Text fw={500}>Replacement Leave</Text>
          <Text>
            {used.replacement}/{balance.replacement} days used
          </Text>
        </Group>
      </Paper>
    </motion.div>
  );
}
