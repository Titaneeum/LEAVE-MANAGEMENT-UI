"use client";

import { Text, Paper } from "@mantine/core";
import AdminTeamReq from "@/components/pages/dashboard/AdminTeamReq";

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <Paper shadow="xs" radius="md" className="p-4">
        <Text className="text-2xl font-semibold mb-2">Admin Dashboard</Text>
        <Text c="dimmed" size="sm">
          Overview of team activities and leave requests
        </Text>
      </Paper>

      {/* Section for Team Requests */}
      <AdminTeamReq />
    </div>
  );
}
