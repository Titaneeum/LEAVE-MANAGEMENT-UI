/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { useEffect } from "react";

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

import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useData } from "../../../../useData";

export default function LeaveTimeOffRequest() {
  const [leaveType, setLeaveType] = useState<string | null>(null);
  const [timeOffType, setTimeOffType] = useState<string | null>(null);
  const [halfDaySession, setHalfDaySession] = useState<string | null>(null);
  const [dateStart, setDateStart] = useState<string | null>(null);
  const [dateEnd, setDateEnd] = useState<string | null>(null);
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [files, setFiles] = useState<FileWithPath[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mutate: AddTimeOff, isPending: isAddTimeOffPending } =
    useData().set.timeOff.add;

  const { data } = useData().get.all.timeRequest();
  console.log("semua data", data);

  const { mutate: UpdateTimeOff, isPending: isUpdateTimeOffPending } =
    useData().set.timeOff.update;

  const { mutate: DeleteTimeOff, isPending: isDeleteTimeOffPending } =
    useData().set.timeOff.delete;

  const timeOffForm = useForm({
    initialValues: {
      leave_type: "Leave",
      day_start: "",
      day_end: "",
      reason: "",
      supp_document: "",
      time_start: "",
      time_end: "",
    },
  });
  const handleSubmit = (values: any) => {
    console.log("values:", values);
  };

  useEffect(() => {
    if (timeOffType === "Half Day" && halfDaySession) {
      if (halfDaySession === "first_half") {
        timeOffForm.setFieldValue("time_start", "08:00");
        timeOffForm.setFieldValue("time_end", "12:00");
      } else if (halfDaySession === "second_half") {
        timeOffForm.setFieldValue("time_start", "14:00");
        timeOffForm.setFieldValue("time_end", "17:00");
      }
    } else if (timeOffType !== "Half Day") {
      setTimeStart("");
      setTimeEnd("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeOffType, halfDaySession]);
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#8F140A] to-[#0B096B] p-4">
      <form
        onSubmit={timeOffForm.onSubmit(handleSubmit)}
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

        <Radio.Group withAsterisk>
          <Group mt="xs" justify="center" gap="lg">
            {}
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

        {timeOffForm.values.leave_type === "Leave" ? (
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
              withAsterisk
              required
            />
            <Grid>
              <Grid.Col span={6}>
                <DateInput
                  label="Start Date"
                  {...timeOffForm.getInputProps("day_start")}
                  minDate={dayjs().format("YYYY-MM-DD")}
                  withAsterisk
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <DateInput
                  label="End Date"
                  {...timeOffForm.getInputProps("day_end")}
                  minDate={dateStart || dayjs().format("YYYY-MM-DD")}
                  withAsterisk
                  required
                />
              </Grid.Col>
            </Grid>
          </>
        ) : timeOffForm.values.leave_type === "Time Off" ? (
          <>
            <Select
              label="Time Off Type"
              placeholder="Select type"
              data={[
                { value: "By Hours", label: "By Hours" },
                { value: "Half Day", label: "Half Day " },
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
                  {...timeOffForm.getInputProps("time_start")}
                  withAsterisk
                  required
                  disabled={timeOffType === "Half Day"}
                  classNames={{
                    input: "bg-gray-100 text-gray-800 opacity-100",
                    label: "text-gray-900",
                  }}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TimeInput
                  label="Time End"
                  {...timeOffForm.getInputProps("time_end")}
                  withAsterisk
                  required
                  disabled={timeOffType === "Half Day"}
                  classNames={{
                    input: "bg-gray-100 text-gray-800 opacity-100",
                    label: "text-gray-900",
                  }}
                />
              </Grid.Col>
            </Grid>
          </>
        ) : null}

        <Textarea
          label="Reason"
          placeholder="Enter your reason"
          autosize
          minRows={3}
          {...timeOffForm.getInputProps("reason")}
          withAsterisk
          required
        />

        {timeOffForm.values.leave_type === "Leave" && (
          <Input.Wrapper
            label="Attachment"
            {...timeOffForm.getInputProps("supp_document")}
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
              <Group justify="center" gap="xl" className="pointer-events-none">
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
                  <IconPhoto size={52} className="text-gray-400" stroke={1.5} />
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
              <Paper key={file.name} shadow="xs" p="sm" radius="md" withBorder>
                <Group justify="space-between">
                  <Text size="sm">{file.name}</Text>
                  <ActionIcon
                    color="red"
                    variant="light"
                    onClick={() => setFiles((f) => f.filter((x) => x !== file))}
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
    // <div>isi time off</div>
  );
}
