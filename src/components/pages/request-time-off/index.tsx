"use client";

import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import {
  Button,
  Grid,
  Group,
  Input,
  Paper,
  Radio,
  Select,
  Text,
  Textarea,
  Title,
  ActionIcon,
  Checkbox,
} from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";
import { IconPhoto, IconX, IconClock } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import "@mantine/dates/styles.css";

interface TimeOffValues {
  user_id: string;
  type: "Leave" | "Time Off";
  leave_policy: string;
  day_start: Date | null;
  day_end: Date | null;
  reason: string;
  supp_document: string;
  time_start: string | null;
  time_end: string | null;
  half_day: boolean;
  half_type?: "first_half" | "second_half";
}

export default function LeaveTimeOffRequest() {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  const form = useForm<TimeOffValues>({
    initialValues: {
      user_id: "",
      type: "Leave",
      leave_policy: "",
      day_start: null,
      day_end: null,
      reason: "",
      supp_document: "",
      time_start: null,
      time_end: null,
      half_day: false,
      half_type: undefined,
    },
    validate: {
      reason: (v) => (v.trim().length === 0 ? "Reason is required" : null),
      time_start: (value, values) => {
        if (values.type === "Time Off" && !value)
          return "Start time is required";
        return null;
      },

      time_end: (value, values) => {
        console.log("error triger");
        if (values.type === "Time Off") {
          if (!value) return "End time is required";
          const start = dayjs(values.time_start, "HH:mm");
          const end = dayjs(value, "HH:mm");
          if (!start.isValid() || !end.isValid()) return "Invalid time format";
          const diff = end.diff(start, "minute");
          if (diff < 0 || diff > 120)
            return "End time must be within 2 hours after start time";
        }
        return null;
      },
    },
  });

  // Reset form when type changes
  useEffect(() => {
    form.setValues({
      user_id: form.values.user_id,
      type: form.values.type,
      leave_policy: "",
      day_start: null,
      day_end: null,
      reason: "",
      supp_document: "",
      time_start: null,
      time_end: null,
      half_day: false,
      half_type: undefined,
    });
    setFiles([]);
  }, [form.values.type]);

  useEffect(() => {
    if (form.values.half_day && form.values.day_start) {
      form.setFieldValue("day_end", form.values.day_start);
    }
  }, [form.values.half_day, form.values.day_start]);

  const [user, setUser] = useState<{
    id: number;
    name: string;
    email: string;
    profile?: string;
  } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        form.setFieldValue("user_id", parsedUser.id.toString());
      } catch (err) {
        console.error("Invalid user in localStorage", err);
      }
    }
  }, []);

  const combineDateTime = (date: Date | null, time: string | null) => {
    if (!date || !time) return null;
    const [h, m] = time.split(":").map(Number);
    return dayjs(date)
      .hour(h)
      .minute(m)
      .second(0)
      .millisecond(0)
      .format("YYYY-MM-DDTHH:mm:ss");
  };

  const handleSubmit = async (values: TimeOffValues) => {
    console.log("Submit triggered");
    try {
      let startDate: string | null = null;
      let endDate: string | null = null;

      if (values.type === "Leave") {
        if (values.half_day && values.half_type === "first_half") {
          startDate = combineDateTime(values.day_start, "08:00");
          endDate = combineDateTime(values.day_start, "12:00");
        } else if (values.half_day && values.half_type === "second_half") {
          startDate = combineDateTime(values.day_start, "14:00");
          endDate = combineDateTime(values.day_start, "17:00");
        } else {
          // Full day
          startDate = combineDateTime(values.day_start, "08:00");
          endDate = combineDateTime(
            values.day_end ?? values.day_start,
            "17:00",
          );
        }
      } else if (values.type === "Time Off") {
        startDate = combineDateTime(values.day_start, values.time_start);
        endDate = combineDateTime(values.day_start, values.time_end);
      }

      let api = "";
      let payload: any;
      if (values.type === "Leave") {
        api = "http://10.0.2.8:4000/leave-request";
        payload = {
          leave_policy: values.leave_policy,
          isHalf_Day: values.half_day ? 1 : 0,
          date_start: startDate,
          date_end: endDate,
          reason: values.reason,
          attachment: files.length ? files[0].name : null,
          created_by: form.values.user_id,
        };
      } else if (values.type === "Time Off") {
        api = "http://10.0.2.8:4000/time-off-request";
        payload = {
          date_start: startDate,
          date_end: endDate,
          reason: values.reason,
          created_by: form.values.user_id,
        };
      }

      console.log("Sending payload:", payload);

      const res = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("API request failed");

      const data = await res.json();
      console.log("Response:", data);

      notifications.show({
        title: "Success",
        message: "Request submitted successfully!",
        color: "green",
      });

      form.reset();
      setFiles([]);
    } catch (error: any) {
      console.error(error.message);
      notifications.show({
        title: "Error",
        message: "Failed to submit request.",
        color: "red",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-[#C5D8F1] rounded-2xl shadow-xl flex flex-col">
        <form
          id="leaveForm"
          onSubmit={form.onSubmit(
            (values) => handleSubmit(values),
            (errors) => {
              console.log("Validation failed:", errors);
            },
          )}
          className="flex flex-col h-full"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="text-center">
              <Title order={2}>Leave / Time Off Request</Title>
              <Text size="sm" c="dimmed">
                Fill in the form below to request leave or time off.
              </Text>
            </div>

            {/* Leave or Time Off */}
            <Radio.Group withAsterisk {...form.getInputProps("type")}>
              <Group mt="xs" justify="center" gap="lg">
                <Radio value="Leave" label="Leave" />
                <Radio value="Time Off" label="Time Off" />
              </Group>
            </Radio.Group>

            {/* If Leave */}
            {form.values.type === "Leave" && (
              <>
                <Select
                  label="Leave Policy"
                  placeholder="Select leave type"
                  data={[
                    { value: "annual_leave", label: "Annual Leave" },
                    { value: "emergency_leave", label: "Emergency Leave" },
                    { value: "unpaid_leave", label: "Unpaid Leave" },
                    { value: "sick_leave", label: "Sick Leave" },
                  ]}
                  withAsterisk
                  {...form.getInputProps("leave_policy")}
                />

                {form.values.leave_policy === "annual_leave" && (
                  <>
                    <Checkbox
                      label="Apply as Half Day"
                      checked={form.values.half_day}
                      onChange={(e) =>
                        form.setFieldValue("half_day", e.currentTarget.checked)
                      }
                    />

                    {form.values.half_day && (
                      <>
                        <Select
                          label="Select Half Day"
                          placeholder="Pick one"
                          data={[
                            {
                              value: "first_half",
                              label: "First Half (8AM - 12PM)",
                            },
                            {
                              value: "second_half",
                              label: "Second Half (2PM - 5PM)",
                            },
                          ]}
                          value={form.values.half_type}
                          onChange={(val) => {
                            form.setFieldValue(
                              "half_type",
                              val as "first_half" | "second_half" | undefined,
                            );
                            if (val === "first_half") {
                              form.setFieldValue("time_start", "08:00");
                              form.setFieldValue("time_end", "12:00");
                            } else if (val === "second_half") {
                              form.setFieldValue("time_start", "14:00");
                              form.setFieldValue("time_end", "17:00");
                            } else {
                              form.setFieldValue("time_start", null);
                              form.setFieldValue("time_end", null);
                            }
                          }}
                        />

                        <TimeInput
                          label="Start Time"
                          value={form.values.time_start || ""}
                          readOnly
                        />
                        <TimeInput
                          label="End Time"
                          value={form.values.time_end || ""}
                          readOnly
                        />
                      </>
                    )}
                  </>
                )}

                {/* Dates */}
                <Grid>
                  <Grid.Col span={6}>
                    <DateInput
                      label="Start Date"
                      placeholder="DD/MM/YYYY"
                      valueFormat="DD/MM/YYYY"
                      withAsterisk
                      {...form.getInputProps("day_start")}
                      popoverProps={{ position: "bottom-start" }}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <DateInput
                      label="End Date"
                      placeholder="DD/MM/YYYY"
                      valueFormat="DD/MM/YYYY"
                      withAsterisk
                      {...form.getInputProps("day_end")}
                      readOnly={form.values.half_day}
                      value={form.values.day_end}
                      popoverProps={{ position: "bottom-start" }}
                    />
                  </Grid.Col>
                </Grid>

                <Textarea
                  label="Reason"
                  placeholder="Enter your reason"
                  autosize
                  minRows={3}
                  withAsterisk
                  {...form.getInputProps("reason")}
                />

                <Input.Wrapper label="Attachment">
                  <Dropzone
                    onDrop={(accepted) => setFiles([...files, ...accepted])}
                    maxSize={5 * 1024 ** 2}
                    accept={IMAGE_MIME_TYPE}
                  >
                    <Group justify="center" gap="xl">
                      <IconPhoto
                        size={52}
                        stroke={1.5}
                        className="text-gray-400"
                      />
                      <Text size="sm" c="dimmed">
                        Drag or click to select files (≤5 MB)
                      </Text>
                    </Group>
                  </Dropzone>
                </Input.Wrapper>

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
              </>
            )}

            {/* If Time Off */}
            {form.values.type === "Time Off" && (
              <>
                <DateInput
                  label="Date"
                  placeholder="DD/MM/YYYY"
                  valueFormat="DD/MM/YYYY"
                  withAsterisk
                  {...form.getInputProps("day_start")}
                />

                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TimeInput
                      label="Start Time"
                      withAsterisk
                      value={form.values.time_start ?? ""}
                      onChange={(e) =>
                        form.setFieldValue(
                          "time_start",
                          e.currentTarget.value || null,
                        )
                      }
                      ref={startRef}
                      rightSection={
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          onClick={() => startRef.current?.showPicker()}
                        >
                          <IconClock size={16} stroke={1.5} />
                        </ActionIcon>
                      }
                    />
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TimeInput
                      label="End Time (max 2 hours)"
                      withAsterisk
                      value={form.values.time_end ?? ""}
                      onChange={(e) =>
                        form.setFieldValue(
                          "time_end",
                          e.currentTarget.value || null,
                        )
                      }
                      ref={endRef}
                      rightSection={
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          onClick={() => endRef.current?.showPicker()}
                        >
                          <IconClock size={16} stroke={1.5} />
                        </ActionIcon>
                      }
                    />
                  </Grid.Col>
                </Grid>

                <Textarea
                  label="Reason"
                  placeholder="Enter your reason"
                  autosize
                  minRows={3}
                  withAsterisk
                  {...form.getInputProps("reason")}
                />
              </>
            )}
          </div>

          {/* Sticky Buttons */}
          <div className="sticky bottom-0 bg-[#C5D8F1] border-t border-gray-300 flex justify-end gap-3 p-4 rounded-b-2xl">
            <Button
              type="button"
              variant="default"
              onClick={() => {
                form.reset();
                setFiles([]);
              }}
            >
              Reset
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
