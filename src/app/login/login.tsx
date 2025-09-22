"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@mantine/form";
import {
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Group,
} from "@mantine/core";

export default function LoginPage() {
  const router = useRouter();

  const form = useForm({
    initialValues: { email: "", password: "" },
    validate: {
      email: (v) => (/^\S+@\S+$/.test(v) ? null : "Invalid email"),
      password: (v) => (v.length < 6 ? "Min 6 characters" : null),
    },
  });

  const handleSubmit = (vals: { email: string; password: string }) => {
    if (vals.email === "test@test.com" && vals.password === "123456") {
      router.push("/");
    } else {
      alert("Invalid login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#8F140A] to-[#0B096B] p-4">
      <Paper p="lg" shadow="md" radius="md" className="w-[360px]">
        <Title order={2} mb="lg" ta="center">
          Login
        </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps("email")}
            mb="sm"
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            {...form.getInputProps("password")}
            mb="md"
          />
          <Group justify="center">
            <Button type="submit">Sign In</Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
}
