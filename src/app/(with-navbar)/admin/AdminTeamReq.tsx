"use client";

import { useState, useEffect, ChangeEvent } from "react";
import {
  Card,
  Table,
  Group,
  Text,
  Title,
  Select,
  Input,
  Menu,
  ActionIcon,
  Modal,
  Textarea,
  Button,
  Badge,
  Box,
  ScrollArea,
  Checkbox,
} from "@mantine/core";
import {
  IconSearch,
  IconDotsVertical,
  IconCheck,
  IconX,
  IconTrash,
  IconEdit,
  IconEye,
  IconDownload,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

interface LeaveRequest {
  id: number;
  userId: string;
  name: string;
  leaveType: string;
  dateRange: string;
  duration: string;
  status: "Pending" | "Approved" | "Rejected";
  reason?: string;
  attachment?: string;
}

export default function AdminTeamReq() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("username") || "Admin";
    const storedRole = localStorage.getItem("role") || "superduperadmin";
    setUsername(storedName);
    setRole(storedRole);
  }, []);

  const [requests, setRequests] = useState<LeaveRequest[]>([
    {
      id: 1,
      userId: "EMP01",
      name: "Robert Fox",
      leaveType: "Annual Leave",
      dateRange: "Sep 12 - Sep 16, 2024",
      duration: "5",
      status: "Pending",
      reason: "Family vacation",
      attachment: "leave-form-robert.pdf",
    },
    {
      id: 2,
      userId: "EMP02",
      name: "Arlene McCoy",
      leaveType: "Sick Leave",
      dateRange: "Aug 2 - Aug 9, 2024",
      duration: "8",
      status: "Approved",
      attachment: "medical-certificate-arlene.jpg",
    },
    {
      id: 3,
      userId: "EMP03",
      name: "Brooklyn Simmons",
      leaveType: "Annual Leave",
      dateRange: "Apr 18 - Apr 21, 2024",
      duration: "4",
      status: "Rejected",
      reason: "Insufficient balance",
    },
  ]);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [openedReject, setOpenedReject] = useState(false);
  const [openedView, setOpenedView] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedReq, setSelectedReq] = useState<LeaveRequest | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleApprove = (id: number) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "Approved" } : req)),
    );
  };

  const handleReject = (req: LeaveRequest) => {
    setSelectedReq(req);
    setOpenedReject(true);
  };

  const confirmReject = () => {
    if (selectedReq) {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === selectedReq.id
            ? { ...req, status: "Rejected", reason: rejectReason }
            : req,
        ),
      );
    }
    setOpenedReject(false);
    setRejectReason("");
  };

  const handleDelete = (id: number) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const handleBulkDelete = () => {
    setRequests((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
    setSelectedIds([]);
  };

  const handleDownload = () => {
    alert("Downloading selected leave requests (simulate export to CSV)");
  };

  const filteredRequests = requests.filter((req) => {
    return (
      req.userId.toLowerCase().includes(search.toLowerCase()) &&
      (filterType ? req.leaveType === filterType : true) &&
      (filterStatus ? req.status === filterStatus : true)
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "green";
      case "Pending":
        return "yellow";
      case "Rejected":
        return "red";
      default:
        return "gray";
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <Box p="md">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title order={2} fw={700}>
          Welcome, {username}
        </Title>
        <Text c="dimmed" fz="sm" mb="md">
          Manage and review your team’s leave requests efficiently.
        </Text>

        {/* Summary Cards */}
        <Group mb="lg" gap="md" wrap="wrap">
          {["Pending", "Approved", "Rejected", "Total Leave Days"].map(
            (title, idx) => (
              <Card
                key={idx}
                shadow="md"
                radius="md"
                p="md"
                style={{
                  flex: 1,
                  minWidth: 160,
                  backgroundColor: "#1f2235",
                  color: "#ffffff",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0px 6px 16px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Text fz="sm" c="gray">
                  {title}
                </Text>
                <Text fz="xl" fw={700} c="white">
                  {title === "Pending"
                    ? requests.filter((r) => r.status === "Pending").length
                    : title === "Approved"
                      ? requests.filter((r) => r.status === "Approved").length
                      : title === "Rejected"
                        ? requests.filter((r) => r.status === "Rejected").length
                        : requests.reduce(
                            (sum, r) => sum + parseInt(r.duration),
                            0,
                          )}
                </Text>
              </Card>
            ),
          )}
        </Group>

        {/* Filters */}
        <Group mb="md" gap="md" wrap="wrap">
          <Input
            leftSection={<IconSearch size={16} />}
            placeholder="Search by User ID..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            styles={{
              input: {
                backgroundColor: "#1f2235",
                color: "white",
                borderColor: "#2a2d43",
              },
            }}
          />
          <Select
            placeholder="Filter by Type"
            data={["Annual Leave", "Sick Leave", "Maternity Leave"]}
            value={filterType}
            onChange={(value) => setFilterType(value)}
            clearable
            styles={{
              input: {
                backgroundColor: "#1f2235",
                color: "white",
                borderColor: "#2a2d43",
              },
            }}
          />
          <Select
            placeholder="Filter by Status"
            data={["Pending", "Approved", "Rejected"]}
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            clearable
            styles={{
              input: {
                backgroundColor: "#1f2235",
                color: "white",
                borderColor: "#2a2d43",
              },
            }}
          />
          {selectedIds.length > 0 && (
            <Group gap="xs">
              <Button color="red" onClick={handleBulkDelete}>
                Delete Selected ({selectedIds.length})
              </Button>
              <Button
                leftSection={<IconDownload size={16} />}
                variant="light"
                onClick={handleDownload}
              >
                Download
              </Button>
            </Group>
          )}
        </Group>

        {/* Table */}
        <ScrollArea>
          <Table
            highlightOnHover
            striped
            withTableBorder
            withColumnBorders
            horizontalSpacing="md"
            verticalSpacing="sm"
            style={{
              borderColor: "#2a2d43",
              color: "white",
              borderCollapse: "collapse",
            }}
          >
            <thead
              style={{
                backgroundColor: "#1a1b2d",
                borderBottom: "2px solid #2a2d43",
              }}
            >
              <tr>
                <th
                  style={{
                    borderRight: "1px solid #2a2d43",
                    borderBottom: "1px solid #2a2d43",
                  }}
                >
                  <Checkbox
                    checked={
                      selectedIds.length === filteredRequests.length &&
                      filteredRequests.length > 0
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.currentTarget.checked
                          ? filteredRequests.map((r) => r.id)
                          : [],
                      )
                    }
                  />
                </th>
                <th style={{ borderRight: "1px solid #2a2d43" }}>User ID</th>
                <th style={{ borderRight: "1px solid #2a2d43" }}>Employee</th>
                <th style={{ borderRight: "1px solid #2a2d43" }}>Leave Type</th>
                <th style={{ borderRight: "1px solid #2a2d43" }}>Date Range</th>
                <th style={{ borderRight: "1px solid #2a2d43" }}>Duration</th>
                <th style={{ borderRight: "1px solid #2a2d43" }}>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      textAlign: "center",
                      borderTop: "1px solid #2a2d43",
                    }}
                  >
                    <Text c="dimmed">No leave requests found.</Text>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    style={{
                      borderBottom: "1px solid #2a2d43",
                    }}
                  >
                    <td style={{ borderRight: "1px solid #2a2d43" }}>
                      <Checkbox
                        checked={selectedIds.includes(req.id)}
                        onChange={() => toggleSelect(req.id)}
                      />
                    </td>
                    <td style={{ borderRight: "1px solid #2a2d43" }}>
                      {req.userId}
                    </td>
                    <td style={{ borderRight: "1px solid #2a2d43" }}>
                      {req.name}
                    </td>
                    <td style={{ borderRight: "1px solid #2a2d43" }}>
                      {req.leaveType}
                    </td>
                    <td style={{ borderRight: "1px solid #2a2d43" }}>
                      {req.dateRange}
                    </td>
                    <td style={{ borderRight: "1px solid #2a2d43" }}>
                      {req.duration} days
                    </td>
                    <td style={{ borderRight: "1px solid #2a2d43" }}>
                      <Badge color={getStatusColor(req.status)}>
                        {req.status}
                      </Badge>
                    </td>
                    <td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="subtle"
                          onClick={() => {
                            setSelectedReq(req);
                            setOpenedView(true);
                          }}
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                        <Menu shadow="md" width={180}>
                          <Menu.Target>
                            <ActionIcon variant="subtle">
                              <IconDotsVertical size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            {req.status === "Pending" ? (
                              <>
                                <Menu.Item
                                  leftSection={
                                    <IconCheck size={16} color="green" />
                                  }
                                  onClick={() => handleApprove(req.id)}
                                >
                                  Approve
                                </Menu.Item>
                                <Menu.Item
                                  leftSection={<IconX size={16} color="red" />}
                                  onClick={() => handleReject(req)}
                                >
                                  Reject
                                </Menu.Item>
                              </>
                            ) : (
                              <>
                                <Menu.Item
                                  leftSection={<IconEdit size={16} />}
                                  onClick={() =>
                                    alert("Update function placeholder")
                                  }
                                >
                                  Update Details
                                </Menu.Item>
                                <Menu.Item
                                  leftSection={<IconTrash size={16} />}
                                  color="red"
                                  onClick={() => handleDelete(req.id)}
                                >
                                  Delete
                                </Menu.Item>
                              </>
                            )}
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </ScrollArea>
      </motion.div>

      {/* Reject Modal */}
      <Modal
        opened={openedReject}
        onClose={() => setOpenedReject(false)}
        title="Reject Leave Request"
        centered
      >
        <Textarea
          label="Reason for Rejection"
          placeholder="Enter reason..."
          value={rejectReason}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setRejectReason(e.target.value)
          }
        />
        <Group mt="md" justify="flex-end" gap="sm">
          <Button variant="default" onClick={() => setOpenedReject(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={confirmReject}>
            Confirm Reject
          </Button>
        </Group>
      </Modal>

      {/* View Details Modal */}
      <Modal
        opened={openedView}
        onClose={() => setOpenedView(false)}
        title="Leave Request Details"
        centered
      >
        {selectedReq && (
          <Box>
            <Text>
              <strong>User ID:</strong> {selectedReq.userId}
            </Text>
            <Text>
              <strong>Name:</strong> {selectedReq.name}
            </Text>
            <Text>
              <strong>Type:</strong> {selectedReq.leaveType}
            </Text>
            <Text>
              <strong>Date Range:</strong> {selectedReq.dateRange}
            </Text>
            <Text>
              <strong>Duration:</strong> {selectedReq.duration} days
            </Text>
            <Text>
              <strong>Status:</strong> {selectedReq.status}
            </Text>
            {selectedReq.reason && (
              <Text>
                <strong>Reason:</strong> {selectedReq.reason}
              </Text>
            )}
            {selectedReq.attachment && (
              <Text>
                <strong>Attachment:</strong>{" "}
                <a href="#" style={{ color: "#4dabf7" }}>
                  {selectedReq.attachment}
                </a>
              </Text>
            )}
          </Box>
        )}
      </Modal>
    </Box>
  );
}
