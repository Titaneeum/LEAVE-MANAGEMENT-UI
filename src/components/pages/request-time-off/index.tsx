/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card, Select, Textarea, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Group } from "@mantine/core";
import { Button } from "@mantine/core";
import CustomNavbar from "@/components/navbar";
import { useForm } from "@mantine/form";

export default function Home() {
  // const [leaveType, setLeaveType] = useState("Annual Leave");
  const [dates, setDates] = useState<Date | null>(null);

  const form = useForm({
    initialValues: {
      about: "",
    },
  });
  console.log("form:", form.values.about);

  const handleSubmit = (values: any) => {
    console.log("values:", values);
  };
  return (
    <>
      <Card className="max-w-4xl mx-auto shadow-sm p-6 rounded-md border">
        <form onSubmit={form.onSubmit(handleSubmit)} className="flex gap-8">
          {/* Left side: Form */}
          <div className="flex-[2]">
            <Text size="lg" fw={600} className="mb-4">
              Leave Request
            </Text>

            <Select
              label="Leave Type"
              placeholder="Pick value"
              data={["Annual Leave", "Emergency Leave", "Medical Leave"]}
            />

            <DatePickerInput
              label="Dates"
              placeholder="Pick date"
              value={dates}
              onChange={() => setDates}
              required
              className="my-4"
            />

            <Textarea
              {...form.getInputProps("about")}
              label="About"
              placeholder="Include comments for your approver"
              minRows={3}
              className="mb-4"
            />

            <Text fw={500} className="mb-2 text-sm">
              Attachments
            </Text>

            <CustomNavbar classNames="border-pink-600 p-4 rounded-full" />

            <Dropzone
              onDrop={(files) => console.log("accepted files", files)}
              onReject={(files) => console.log("rejected files", files)}
              maxSize={5 * 1024 ** 2}
              accept={IMAGE_MIME_TYPE}
              classNames={{ root: "border border-green-500" }}
            >
              <Group
                justify="center"
                gap="xl"
                mih={220}
                style={{ pointerEvents: "none" }}
              >
                <Dropzone.Accept>
                  <IconUpload
                    size={52}
                    color="var(--mantine-color-blue-6)"
                    stroke={1.5}
                  />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX
                    size={52}
                    color="var(--mantine-color-red-6)"
                    stroke={1.5}
                  />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhoto
                    size={52}
                    color="var(--mantine-color-dimmed)"
                    stroke={1.5}
                  />
                </Dropzone.Idle>

                <div>
                  <Text size="sm" inline>
                    Upload a file or drag and drop
                  </Text>
                  <Text size="sm" c="dimmed" inline mt={7}>
                    PNG, JPG, GIF up to 10MB
                  </Text>
                </div>
              </Group>
            </Dropzone>
          </div>
          <Button variant="default" color="rgba(207, 204, 204, 1)">
            Cancel
          </Button>
          <Button type="submit" variant="filled">
            Request now
          </Button>
        </form>
      </Card>
      <div>
        <div className="relative size-32 ...">
          <div className="absolute right-0 bottom-0 size-16 ..."></div>
        </div>
      </div>
    </>
  );
}
