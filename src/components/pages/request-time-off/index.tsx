/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
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
} from "@mantine/core";
import { TimeInput, DateInput } from "@mantine/dates";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";

import {
  IconUpload,
  IconPhoto,
  IconX,
  IconGauge,
  IconLogout,
  IconHome,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useData } from "../../../../useData";

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

  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mutate: AddTimeOff, isPending: isAddTimeOffPending } =
    useData().set.timeOff.add;

  const timeOffForm = useForm({
    initialValues: {
      leave_type: "",
      rating: "",
      reasons: "",
    },
  });
  const handleSubmit = (values: any) => {
    console.log("values:", values);
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
            </div>
            {/* 
            {error && (
              <Alert
                icon={<IconInfoCircle />}
                color="red"
                variant="light"
                title="Missing information"
              >
                {error}
              </Alert>
            )} */}

            <Radio.Group value={type} onChange={setType} withAsterisk>
              <Group mt="xs" justify="center" gap="lg">
                <Radio
                  {...timeOffForm.getInputProps("leave_type")}
                  value="Leave"
                  label="Leave"
                />
                <Radio
                  {...timeOffForm.getInputProps("leave_type")}
                  value="Time Off"
                  label="Time Off"
                />
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
                // error={fileError || undefined}
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
            <Group>
              <Button type="button" onClick={() => timeOffForm.reset()}>
                reset
              </Button>
              <Button type="submit">Submit</Button>
            </Group>
          </form>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
