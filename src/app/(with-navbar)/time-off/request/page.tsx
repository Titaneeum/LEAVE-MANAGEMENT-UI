"use client";

import { useEffect, useState } from "react";
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
  Checkbox,
  Divider,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import NavbarPage from "@/components/pages/request-time-off/NavbarPage";

export default function RequestPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [requestType, setRequestType] = useState("Leave");
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      user_id: "",
      type: "Leave",
      leave_policy: "",
      day_start: null,
      day_end: null,
      reason: "",
      supp_document: "",
      time_start: "2025-09-18T00:00:00.000Z",
      time_end: "2025-09-18T00:00:00.000Z",
      half_day: false,
      half_type: undefined as "first_half" | "second_half" | undefined,
    },
  });

  // Auto time for half day
  useEffect(() => {
    if (form.values.half_day && form.values.half_type === "first_half") {
      form.setFieldValue("time_start", "08:00 AM");
      form.setFieldValue("time_end", "01:00 PM");
    } else if (
      form.values.half_day &&
      form.values.half_type === "second_half"
    ) {
      form.setFieldValue("time_start", "02:00 PM");
      form.setFieldValue("time_end", "05:00 PM");
    } else if (!form.values.half_day) {
      form.setFieldValue("time_start", "08:00 AM");
      form.setFieldValue("time_end", "05:00 PM");
    }
  }, [form.values.half_day, form.values.half_type]);

  // Reset bila request type tukar
  useEffect(() => {
    form.setValues({
      user_id: "",
      type: "Leave",
      leave_policy: "",
      day_start: null,
      day_end: null,
      reason: "",
      supp_document: "",
      time_start: "2025-09-18T00:00:00.000Z",
      time_end: "2025-09-18T00:00:00.000Z",
      half_day: false,
      half_type: undefined as "first_half" | "second_half" | undefined,
    });
    setFiles([]);
    setSelectedPolicy(null);
  }, [requestType]);

  const handleSubmit = () => {
    if (requestType === "Time Off") {
      const start = form.values.time_start;
      const end = form.values.time_end;

      if (!start || !end) {
        notifications.show({
          title: "Error",
          message: "Please fill in both start and end time.",
          color: "red",
        });
        return;
      }

      const startTime = dayjs(start, "HH:mm");
      const endTime = dayjs(end, "HH:mm");
      const diff = endTime.diff(startTime, "hour", true);

      if (diff <= 0) {
        notifications.show({
          title: "Error",
          message: "End time must be after start time.",
          color: "red",
        });
        return;
      }

      if (diff > 2) {
        notifications.show({
          title: "Invalid Time Duration",
          message: "Time Off cannot exceed 2 hours.",
          color: "red",
        });
        return;
      }
    }

    notifications.show({
      title: "Submitted",
      message: "Form submitted successfully",
      color: "green",
    });
  };

  return (
    <NavbarPage>
      <div className="min-h-screen w-full p-6 text-gray-100 overflow-y-auto">
        <div className="max-w-3xl mx-auto pb-20">
          <div className="mb-6 text-center">
            <Title order={2} className="font-semibold text-blue-100">
              Leave / Time Off Request
            </Title>
            <Text size="sm" className="text-gray-400 mt-1">
              Fill in the form below to request leave or time off.
            </Text>
          </div>

          <Paper
            shadow="xl"
            radius="lg"
            p="lg"
            className="bg-slate-800/70 border border-slate-700/60 backdrop-blur-md"
          >
            {/* Request Type */}
            <div className="mb-4">
              <Text size="sm" fw={500} className="mb-2 text-gray-300">
                Request Type <span className="text-red-500">*</span>
              </Text>
              <Radio.Group value={requestType} onChange={setRequestType}>
                <Group gap="md">
                  <Radio value="Leave" label="Leave" />
                  <Radio value="Time Off" label="Time Off" />
                </Group>
              </Radio.Group>
            </div>

            <Divider my="md" label="Leave Details" labelPosition="left" />

            {/* Leave Policy (Leave only) */}
            {requestType === "Leave" && (
              <div className="mb-4">
                <Text size="sm" fw={500} className="mb-2 text-gray-300">
                  Leave Policy <span className="text-red-500">*</span>
                </Text>
                <Select
                  placeholder="Select leave type"
                  data={["Annual Leave", "Medical Leave", "Emergency Leave"]}
                  radius="md"
                  size="md"
                  value={selectedPolicy}
                  onChange={(value) => {
                    setSelectedPolicy(value);
                    form.setFieldValue("leave_policy", value || "");
                    form.setFieldValue("half_day", false);
                    form.setFieldValue("half_type", undefined);
                  }}
                  className="bg-slate-700/60 text-gray-100"
                />

                {selectedPolicy === "Annual Leave" && (
                  <>
                    <Checkbox
                      label="Apply as Half Day"
                      className="mt-3 text-sm text-gray-200"
                      checked={form.values.half_day}
                      onChange={(e) => {
                        const checked = e.currentTarget.checked;
                        form.setFieldValue("half_day", checked);
                        form.setFieldValue("half_type", undefined);
                      }}
                    />

                    {form.values.half_day && (
                      <Radio.Group
                        value={form.values.half_type}
                        onChange={(val) =>
                          form.setFieldValue(
                            "half_type",
                            val as "first_half" | "second_half",
                          )
                        }
                        className="mt-3"
                      >
                        <Group gap="md">
                          <Radio
                            value="first_half"
                            label="First Half (8:00 AM – 1:00 PM)"
                            className="text-gray-200"
                          />
                          <Radio
                            value="second_half"
                            label="Second Half (2:00 PM – 5:00 PM)"
                            className="text-gray-200"
                          />
                        </Group>
                      </Radio.Group>
                    )}
                  </>
                )}

                {selectedPolicy && (
                  <Group mt="md" grow>
                    <Input.Wrapper label="Start Time" className="text-gray-300">
                      <Input
                        value={form.values.time_start || "08:00 AM"}
                        readOnly
                        className="bg-slate-700/69 text-gray-100 border-slate-600"
                      />
                    </Input.Wrapper>
                    <Input.Wrapper label="End Time" className="text-gray-300">
                      <Input
                        value={form.values.time_end || "05:00 PM"}
                        readOnly
                        className="bg-slate-700/60 text-gray-100 border-slate-600"
                      />
                    </Input.Wrapper>
                  </Group>
                )}
              </div>
            )}

            {requestType === "Time Off" && (
              <div className="mb-4">
                <Text size="sm" fw={500} className="mb-2 text-gray-300">
                  Time Duration <span className="text-red-500">*</span>
                </Text>
                <Group grow>
                  <Input.Wrapper label="Start Time" className="text-gray-300">
                    <Input
                      type="time"
                      value={form.values.time_start || ""}
                      onChange={(e) =>
                        form.setFieldValue("time_start", e.currentTarget.value)
                      }
                      className="bg-slate-700/60 text-gray-100 border-slate-600"
                    />
                  </Input.Wrapper>
                  <Input.Wrapper label="End Time">
                    <Input
                      type="time"
                      value={form.values.time_end || ""}
                      onChange={(e) =>
                        form.setFieldValue("time_end", e.currentTarget.value)
                      }
                      className="bg-slate-700/60 text-gray-100 border-slate-600"
                    />
                  </Input.Wrapper>
                </Group>
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Text size="sm" fw={500} className="mb-2 text-gray-300">
                  Start Date <span className="text-red-500">*</span>
                </Text>
                <DateInput
                  placeholder="DD/MM/YYYY"
                  className="w-full bg-slate-700/60 text-gray-100 border-slate-600"
                />
              </div>
              <div>
                <Text size="sm" fw={500} className="mb-2 text-gray-300">
                  End Date <span className="text-red-500">*</span>
                </Text>
                <DateInput
                  placeholder="DD/MM/YYYY"
                  className="w-full bg-slate-700/60 text-gray-100 border-slate-600"
                />
              </div>
            </div>

            {/* Reason */}
            <div className="mb-4">
              <Text size="sm" fw={500} className="mb-2 text-gray-300">
                Reason <span className="text-red-500">*</span>
              </Text>
              <Textarea
                placeholder="Enter your reason"
                minRows={3}
                {...form.getInputProps("reason")}
                className="bg-slate-700/60 text-gray-100 border-slate-600"
              />
            </div>

            {/* Upload */}
            <div className="mb-6">
              <Text size="sm" fw={500} className="mb-2 text-gray-300">
                Supporting Document
              </Text>
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files) setFiles(Array.from(e.target.files));
                }}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Submit */}
            <Group justify="flex-end">
              <Button
                color="blue"
                className="rounded-md px-6"
                onClick={handleSubmit}
              >
                Submit Request
              </Button>
            </Group>
          </Paper>
        </div>
      </div>
    </NavbarPage>
  );
}
