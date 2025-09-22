"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";

import {
  AppShell,
  Burger,
  Box,
  Button,
  Grid,
  Group,
  Input,
  NavLink,
  Paper,
  Radio,
  Select,
  Text,
  Textarea,
  Title,
  ActionIcon,
  Alert,
} from "@mantine/core";
import { TimeInput, DateInput } from "@mantine/dates";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";

import {
  IconUpload,
  IconPhoto,
  IconX,
  IconInfoCircle,
  IconGauge,
  IconLogout,
  IconHome,
  IconArchive,
  IconTrash,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

type Draft = {
  id: string;
  name: string;
  type: string;
  leaveType: string | null;
  timeOffType: string | null;
  halfDaySession: string | null;
  dateStart: string | null;
  dateEnd: string | null;
  timeStart: string;
  timeEnd: string;
  reason: string;
  files: { name: string; size: number; type: string }[];
  savedAt: string;
};

export default function LeaveTimeOffRequest() {
  const [type, setType] = useState("Leave");
  const [leaveType, setLeaveType] = useState<string | null>(null);
  const [timeOffType, setTimeOffType] = useState<string | null>(null);
  const [halfDaySession, setHalfDaySession] = useState<string | null>(null);
  const [dateStart, setDateStart] = useState<string | null>(null);
  const [dateEnd, setDateEnd] = useState<string | null>(null);
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [reason, setReason] = useState("");
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [error, setError] = useState("");
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);

  // Draft control
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");

  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState(0);

  //load drafts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("leaveDrafts");
    if (saved) setDrafts(JSON.parse(saved));
  }, []);

  //save drafts to localStorage
  useEffect(() => {
    localStorage.setItem("leaveDrafts", JSON.stringify(drafts));
  }, [drafts]);

  useEffect(() => {
    if (type === "Leave") {
      setTimeOffType(null);
      setHalfDaySession(null);
      setTimeStart("");
      setTimeEnd("");
    } else {
      setLeaveType(null);
      setDateStart(null);
      setDateEnd(null);
    }
    setReason("");
  }, [type]);

  useEffect(() => {
    if (timeOffType === "Half Day" && halfDaySession) {
      if (halfDaySession === "first_half") {
        setTimeStart("08:00");
        setTimeEnd("12:00");
      } else if (halfDaySession === "second_half") {
        setTimeStart("14:00");
        setTimeEnd("17:00");
      }
    } else if (timeOffType === "By Hours") {
      setTimeStart("");
      setTimeEnd("");
    }
  }, [halfDaySession, timeOffType]);

  const clearForm = () => {
    setLeaveType(null);
    setTimeOffType(null);
    setHalfDaySession(null);
    setDateStart(null);
    setDateEnd(null);
    setTimeStart("");
    setTimeEnd("");
    setReason("");
    setFiles([]);
    setCurrentDraftId(null);
    setDraftName("");
  };

  const deleteDraft = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
    if (currentDraftId === id) {
      setCurrentDraftId(null);
      setDraftName("");
    }
  };

  const saveDraft = () => {
    //update draft
    if (currentDraftId) {
      setDrafts((prev) =>
        prev.map((d) =>
          d.id === currentDraftId
            ? {
                ...d,
                type,
                leaveType,
                timeOffType,
                halfDaySession,
                dateStart,
                dateEnd,
                timeStart,
                timeEnd,
                reason,
                files: files.map((f) => ({
                  name: f.name,
                  size: f.size,
                  type: f.type,
                })),
                savedAt: new Date().toLocaleString(),
              }
            : d,
        ),
      );
      alert(`Draft "${draftName || "untitled"}" updated!`);
      clearForm();
      return;
    }

    const name = prompt("Enter a name for this draft:");
    if (!name?.trim()) {
      alert("Draft name cannot be empty");
      return;
    }

    const newDraft: Draft = {
      id: Date.now().toString(),
      name: name.trim(),
      type,
      leaveType,
      timeOffType,
      halfDaySession,
      dateStart,
      dateEnd,
      timeStart,
      timeEnd,
      reason,
      files: files.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
      })),
      savedAt: new Date().toLocaleString(),
    };

    setDrafts((prev) => [...prev, newDraft]);
    setCurrentDraftId(newDraft.id);
    setDraftName(newDraft.name);
    alert(`Draft "${newDraft.name}" saved!`);
    clearForm();
  };

  const loadDraft = (draft: Draft) => {
    setType(draft.type);
    setLeaveType(draft.leaveType);
    setTimeOffType(draft.timeOffType);
    setHalfDaySession(draft.halfDaySession);
    setDateStart(draft.dateStart);
    setDateEnd(draft.dateEnd);
    setTimeStart(draft.timeStart);
    setTimeEnd(draft.timeEnd);
    setReason(draft.reason);
    setFiles([]);
    setCurrentDraftId(draft.id);
    setDraftName(draft.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFileError("");

    const missing =
      (type === "Leave" && (!leaveType || !dateStart || !dateEnd)) ||
      (type === "Time Off" && (!timeOffType || !timeStart || !timeEnd)) ||
      reason.trim() === "";

    if (missing) return setError("Please fill in all required fields.");
    if (type === "Leave" && leaveType === "Sick Leave" && files.length === 0)
      return setFileError(
        "Please attach a medical certificate/image for Sick Leave.",
      );

    const toISOTimeOn = (baseDate: Date | string, hhmm: string) => {
      const [h, m] = hhmm.split(":").map(Number);
      const d = new Date(baseDate);
      d.setHours(h || 0, m || 0, 0, 0);
      return d.toISOString();
    };

    const fd = new FormData();
    fd.append("user_id", String(3));
    fd.append("type", type);
    if (type === "Leave" && leaveType) fd.append("leave_type", leaveType);
    if (type === "Time Off" && timeOffType)
      fd.append("time_off_type", timeOffType);
    if (reason) fd.append("reason", reason);

    if (timeStart) fd.append("time_start", toISOTimeOn(new Date(), timeStart));
    if (timeEnd) fd.append("time_end", toISOTimeOn(new Date(), timeEnd));
    if (dateStart) fd.append("day_start", toISOTimeOn(dateStart, "08:00"));
    if (dateEnd) fd.append("day_end", toISOTimeOn(dateEnd, "17:00"));

    files.forEach((f) => fd.append("file", files[0], files[0].name));

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/time-off-request", {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || `Submit failed (${res.status})`);
      } else {
        notifications.show({ message: "Form submitted.", color: "green" });
        clearForm();
      }
    } catch (err: any) {
      notifications.show({
        message: err.message || "Submit failed",
        color: "red",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { icon: IconHome, label: "Home" },
    { icon: IconGauge, label: "Dashboard", description: "Overview of data" },
    { icon: IconLogout, label: "Logout" },
  ];

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
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
          />
          <Text fw={700}>Leave Management</Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Box>
          {navItems.map((item, i) => (
            <NavLink
              key={item.label}
              label={item.label}
              description={item.description}
              active={i === active}
              leftSection={<item.icon size={16} stroke={1.5} />}
              onClick={() => setActive(i)}
            />
          ))}
        </Box>

        <Box mt="lg">
          <Text fw={600} size="sm" mb="xs">
            Drafts
          </Text>
          {drafts.length === 0 ? (
            <Text size="xs" c="dimmed">
              No drafts saved
            </Text>
          ) : (
            drafts.map((d) => (
              <NavLink
                key={d.id}
                label={`${d.name} (${d.type})`}
                description={d.reason.slice(0, 20) + "..."}
                leftSection={<IconArchive size={16} />}
                rightSection={
                  <ActionIcon
                    color="red"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDraft(d.id);
                    }}
                  >
                    <IconTrash size={14} />
                  </ActionIcon>
                }
                onClick={() => loadDraft(d)}
              />
            ))
          )}
          {drafts.length > 0 && (
            <Button
              mt="sm"
              variant="light"
              color="red"
              size="xs"
              onClick={() => setDrafts([])}
            >
              Clear All Drafts
            </Button>
          )}
        </Box>
      </AppShell.Navbar>

      <AppShell.Main>
        <div className="h-screen flex items-center justify-center bg-gradient-to-b from-[#8F140A] to-[#0B096B] p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 space-y-6"
          >
            <div className="text-center">
              <Title order={2}>Leave / Time Off Request</Title>
              <Text size="sm" c="dimmed">
                Fill in the form below to request leave or time off.
              </Text>
              {currentDraftId && (
                <Text size="xs" c="dimmed">
                  Editing draft: {draftName}
                </Text>
              )}
            </div>

            {error && (
              <Alert
                icon={<IconInfoCircle />}
                color="red"
                variant="light"
                title="Missing information"
              >
                {error}
              </Alert>
            )}

            <Radio.Group value={type} onChange={setType} withAsterisk>
              <Group mt="xs" justify="center" gap="lg">
                <Radio value="Leave" label="Leave" />
                <Radio value="Time Off" label="Time Off" />
              </Group>
            </Radio.Group>

            {type === "Leave" ? (
              <>
                <Select
                  label="Leave Type"
                  placeholder="Select leave type"
                  data={["Annual Leave", "Sick Leave", "Emergency Leave"].map(
                    (l) => ({
                      value: l,
                      label: l,
                    }),
                  )}
                  value={leaveType}
                  onChange={setLeaveType}
                  withAsterisk
                  required
                />
                <Grid>
                  <Grid.Col span={6}>
                    <DateInput
                      label="Start Date"
                      value={dateStart}
                      onChange={setDateStart}
                      minDate={dayjs().format("YYYY-MM-DD")}
                      withAsterisk
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <DateInput
                      label="End Date"
                      value={dateEnd}
                      onChange={setDateEnd}
                      minDate={dateStart || dayjs().format("YYYY-MM-DD")}
                      withAsterisk
                      required
                    />
                  </Grid.Col>
                </Grid>
              </>
            ) : (
              <>
                <Select
                  label="Time Off Type"
                  placeholder="Select type"
                  data={[
                    { value: "By Hours", label: "By Hours" },
                    { value: "Half Day", label: "Half Day (4 hours)" },
                  ]}
                  value={timeOffType}
                  onChange={setTimeOffType}
                  withAsterisk
                  required
                />

                {timeOffType === "Half Day" && (
                  <Select
                    label="Half Day Session"
                    placeholder="Select session"
                    data={[
                      { value: "first_half", label: "First Half of the Day" },
                      { value: "second_half", label: "Second Half of the Day" },
                    ]}
                    value={halfDaySession}
                    onChange={setHalfDaySession}
                    withAsterisk
                    required
                  />
                )}

                <Grid>
                  <Grid.Col span={6}>
                    <TimeInput
                      label="Time Start"
                      value={timeStart}
                      onChange={(e) =>
                        !(timeOffType === "half" && halfDaySession) &&
                        setTimeStart(e.currentTarget.value)
                      }
                      withAsterisk
                      required
                      readOnly={timeOffType === "half" && !!halfDaySession}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TimeInput
                      label="Time End"
                      value={timeEnd}
                      onChange={(e) =>
                        !(timeOffType === "Half Day" && halfDaySession) &&
                        setTimeEnd(e.currentTarget.value)
                      }
                      withAsterisk
                      required
                      readOnly={timeOffType === "Half Day" && !!halfDaySession}
                    />
                  </Grid.Col>
                </Grid>
              </>
            )}

            <Textarea
              label="Reason"
              placeholder="Enter your reason"
              autosize
              minRows={3}
              value={reason}
              onChange={(e) => setReason(e.currentTarget.value)}
              withAsterisk
              required
            />

            {type === "Leave" && (
              <Input.Wrapper
                label="Attachment"
                withAsterisk={leaveType === "Sick Leave"}
                error={fileError || undefined}
              >
                <Dropzone
                  onDrop={(acceptedFiles) =>
                    setFiles((prev) => [...prev, ...acceptedFiles])
                  }
                  onReject={(files) => console.log("rejected files", files)}
                  maxSize={5 * 1024 ** 2}
                  accept={IMAGE_MIME_TYPE}
                >
                  <Group
                    justify="center"
                    gap="xl"
                    className="pointer-events-none"
                  >
                    <Dropzone.Accept>
                      <IconUpload
                        size={52}
                        className="text-blue-500"
                        stroke={1.5}
                      />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                      <IconX size={52} className="text-red-500" stroke={1.5} />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      <IconPhoto
                        size={52}
                        className="text-gray-400"
                        stroke={1.5}
                      />
                    </Dropzone.Idle>
                    <div className="text-center">
                      <Text size="sm" c="dimmed">
                        Drag or click to select files (≤5 MB)
                      </Text>
                    </div>
                  </Group>
                </Dropzone>
              </Input.Wrapper>
            )}

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file) => (
                  <Paper
                    key={file.name}
                    shadow="xs"
                    p="sm"
                    radius="md"
                    withBorder
                  >
                    <Group justify="space-between">
                      <Text size="sm">{file.name}</Text>
                      <ActionIcon
                        color="red"
                        variant="light"
                        onClick={() =>
                          setFiles((f) => f.filter((x) => x !== file))
                        }
                      >
                        <IconX size={16} />
                      </ActionIcon>
                    </Group>
                  </Paper>
                ))}
              </div>
            )}

            <Group justify="end" mt="md" gap="sm">
              <Button variant="outline" type="button" onClick={saveDraft}>
                Save Draft
              </Button>
              <Button variant="default" type="button" onClick={clearForm}>
                Clear Form
              </Button>
              <Button
                type="submit"
                variant="gradient"
                gradient={{ from: "blue", to: "cyan" }}
                loading={loading}
              >
                Submit
              </Button>
            </Group>
          </form>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
